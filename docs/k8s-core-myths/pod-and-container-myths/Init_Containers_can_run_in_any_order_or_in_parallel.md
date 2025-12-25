---
sidebar_position: 4
---

# Myth: Init Containers can run in any order or in parallel

This myth often surfaces during interviews or design discussions:

*“We’ll use multiple init containers to speed things up. They can run in parallel anyway.”*

In real clusters, this assumption leads to confusion:

- Pods stuck in Init:0/2

- Long startup times

- Engineers debugging “slow Kubernetes” instead of incorrect expectations

The issue isn’t Kubernetes performance — it’s misunderstanding how init containers actually work.

### Why This Myth Exists?

1. Confusion with regular containers

  Application containers within a Pod can run in parallel, so people assume init containers behave the same way.

2. The word ‘container’ hides the lifecycle difference

  Init containers look like normal containers in YAML, but they have a very different execution model.

3. Lack of visibility into Pod startup phases
  
  Most users notice init containers only when a Pod is stuck, not when it works correctly.


### The Reality:

Init containers always run sequentially, in the exact order defined in:

```yaml
spec.initContainers[]
```

Kubernetes enforces this order strictly.

That means:

  - Init containers never run in parallel

  - Kubernetes starts the next init container only after the previous one completes successfully

  - The main application containers do not start at all until every init container has finished

This behavior is guaranteed and not configurable.

### Experiment & Validate

**Step 1: Create a Pod with 3 container**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-order-demo
spec:
  restartPolicy: Never
  initContainers:
    - name: init-1
      image: busybox
      command: ["sh", "-c", "echo Init Container 1; sleep 3"]

    - name: init-2
      image: busybox
      command: ["sh", "-c", "echo Init Container 2; sleep 3"]

    - name: init-3
      image: busybox
      command: ["sh", "-c", "echo Init Container 3; sleep 3"]

  containers:
    - name: app
      image: busybox
      command: ["sh", "-c", "echo Main Application Container; sleep 3600"]

```

Apply it:

```sh
kubectl apply -f init-order-demo.yaml
```

**Step 2: Check the Pod logs**

```sh
kubectl logs init-order-demo
```

You will see output

```sh
Init Container 1
Init Container 2
Init Container 3
```

### Key Takeaways
- Init containers never run in parallel

- They always execute one after another, in order

- A failing init container restarts the Pod from the beginning

- Application containers start only after all init containers complete

- Init containers are dependency enforcers, not performance optimizers