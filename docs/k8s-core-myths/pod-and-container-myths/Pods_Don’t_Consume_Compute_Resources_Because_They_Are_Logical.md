---
sidebar_position: 3
---
# Myth: Pods Don’t Consume Compute Resources Because They Are Logical
This belief feels correct.

We learn early that:

- Pods are logical

- Containers are the real workloads

- Resource requests belong to containers

So it is natural to conclude:

**“If the Pod itself doesn’t run, it shouldn’t consume resources.”**

I believed this too.

### Why This Myth Exists?

- Kubernetes correctly describes Pods as logical constructs

- There is no visible “Pod process” on the node

- The pause container looks insignificant

- Most clusters work fine without explicit Pod Overhead

- All of this reinforces the idea that:

```sh
“Pods are free; containers pay the cost.”
```

### The Reality:
A Pod does not execute code, but **Kubernetes must still create an execution environment for it.**

To make a Pod runnable, Kubernetes creates:
- A sandbox (pause) container

- A network namespace and Pod IP

- CNI routing, filtering, and kernel state

- cgroups and namespace bookkeeping

- Runtime isolation structures

These consume real CPU and memory, even before your application runs.

*The Pod is logical.*
*The environment created for it is not.*

Pod Overhead represents the fixed, per-Pod cost of this environment.

It exists to account for:

- Resources consumed outside container cgroups

- Costs that cannot be charged to any container

- Overhead that exists even when containers are idle

Pod Overhead is:

- Considered by the scheduler and quotas

- Declared via `RuntimeClass`

- Not enforced by `cgroups`

### Experiment & Validate
**Step 1. Create RuntimeClass with Pod Overhead**

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata-fc
handler: kata-fc
overhead:
  podFixed:
    memory: "120Mi"
    cpu: "250m"
```

**Step 2. Create a Pod using runtime class**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox:1.28
    stdin: true
    tty: true
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
  - name: nginx-ctr
    image: nginx
    resources:
      limits:
        cpu: 1500m
        memory: 100Mi
```

**Setp 3. Verify the container requests for the workload:**

```sh
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}' 
```

The total container requests are 2000m CPU and 200MiB of memory:

```sh
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

Check this against what is observed by the node:

```sh
kubectl describe node | grep test-pod -B2
```

The output shows requests for 2250m CPU, and for 320MiB of memory. The requests include Pod overhead:

```sh
Namespace    Name       CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------    ----       ------------  ----------   ---------------  -------------  ---
  default      test-pod   2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

### Key Takeaways
- Logical objects can still cause physical cost

- Pods don’t consume resources — their environment does

- Container limits do not cap Pod infrastructure usage

- Pod Overhead makes hidden costs visible

- High Pod counts amplify this effect