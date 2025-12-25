---
sidebar_position: 5
---
# Myth: Pod memory requests are only used for scheduling

During an incident review, a team noticed that several Pods were evicted even though they were well below their configured memory limits.

The immediate conclusion was:

*“The node must have run out of memory, and Kubernetes killed random Pods.”*

In a follow-up discussion, someone confidently said:

*“Memory requests are only used by the scheduler. At runtime, only limits matter.”*

This belief is common in interviews, architecture discussions, and even production design decisions.

Unfortunately, it leads to fragile workloads and hard-to-explain evictions.

### Why This Myth Exists?

This myth exists because of several subtle but reinforcing factors:

1. Scheduler-focused learning

    Most Kubernetes explanations introduce memory requests in the context of scheduling and stop there.

2. CPU behavior confusion

    CPU requests and limits influence throttling, not eviction, which makes engineers assume memory behaves similarly.

3. Limits feel more “real”

    Memory limits cause OOMKills, which are visible and immediate, while eviction logic is less obvious.

4. Eviction logic lives in kubelet internals

    The role of memory requests during node pressure is not emphasized in high-level documentation.

### The Reality

Pod memory requests are not only used for scheduling.

They are also used at runtime by the kubelet during node-level memory pressure to decide which Pods to evict.

When a node experiences memory pressure:

- The kubelet evaluates Pods based on their QoS class

- For Burstable Pods, it considers actual memory usage relative to the requested memory

- Pods that exceed their memory requests are more likely to be evicted

In other words:

**Memory requests act as eviction contracts, not just scheduling inputs.**

Exceeding a memory request does nothing by itself.

But exceeding it during node memory pressure significantly increases eviction risk.

### Experiment & Validate

**Step 1: Create two Burstable Pods with different requests**

Pod A – low request, moderate usage

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-low-request
spec:
  containers:
  - name: stress
    image: polinux/stress
    resources:
      requests:
        memory: "128Mi"
      limits:
        memory: "1Gi"
    args:
    - "--vm"
    - "1"
    - "--vm-bytes"
    - "500M"
    - "--vm-hang"
    - "1"

```

Pod B – high request, higher usage

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-high-request
spec:
  containers:
  - name: stress
    image: polinux/stress
    resources:
      requests:
        memory: "1Gi"
      limits:
        memory: "2Gi"
    args:
    - "--vm"
    - "1"
    - "--vm-bytes"
    - "900M"
    - "--vm-hang"
    - "1"

```

**Step 2: Artificially create node memory pressure**

Now we force node-level memory pressure.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: node-memory-hog
spec:
  containers:
  - name: hog
    image: polinux/stress
    resources:
      requests:
        memory: "2Gi"
      limits:
        memory: "2Gi"
    args:
    - "--vm"
    - "1"
    - "--vm-bytes"
    - "2G"
    - "--vm-hang"
    - "1"

```

**Step 3: Observe node condition**

```sh
kubectl describe node | grep -A5 MemoryPressure
```

You should see:

```sh
MemoryPressure   True
```

This is the trigger condition for eviction logic.

**Step 4: Watch pod eviction**

Run:

```sh
kubectl get pods -w
```

Within seconds:
- pod-low-request gets evicted first
- pod-high-request keeps running

Check details:

```sh
kubectl describe pod pod-low-request
```

You’ll see:

```sh
Reason: Evicted
Message: The node was low on resource: memory.

```

### Key Takeaways

- Memory requests are not just scheduling hints.

- At runtime, memory requests influence eviction priority during node pressure.

- Low memory requests combined with high usage increase eviction risk.

- Memory limits control OOMKills; memory requests influence evictions.

- Stable production workloads require realistic memory requests, not minimal ones.