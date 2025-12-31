---
sidebar_position: 3
---
# Myth: EKS Has a Fixed Maximum Pod Count per Node

I’ve seen this misconception repeatedly during ECS → EKS migrations and even in interviews.

A common scenario:

- A team migrates workloads from ECS or Fargate to EKS.

- They notice that Pods stop scheduling even though:

    - CPU is largely unused
    - Memory is still available

The immediate conclusion:

    -  *“EKS has a fixed pod limit per node, just like other managed services.”*

In interviews, this often appears as:

*“What is the maximum number of Pods an EKS node can run?”*

Many answers confidently quote a number, treating it as a **static platform limit**.

### Why This Myth Exists?

This myth exists because people mix managed service thinking with infrastructure-backed Kubernetes behavior.

Reasons it persists:

- Other AWS services expose explicit fixed quotas (ECS tasks, Lambda concurrency, Fargate limits).

- Kubernetes documentation often mentions a default --max-pods value.

- AWS EKS abstracts the control plane, which makes people assume the data plane is also abstracted.

- The pod limit feels fixed when using the same instance type everywhere.

The key mistake:

- Treating EKS pod count as a platform quota instead of an infrastructure-derived limit.

### The Reality

**EKS does not have a fixed maximum pod count per node.**

The maximum number of Pods depends on the EC2 instance type backing the node.

Specifically, pod density is constrained by:

- The number of Elastic Network Interfaces (ENIs) supported by the instance type

- The number of IPv4 addresses per ENI

- The AWS VPC CNI design, where each Pod gets a VPC IP

As a result:

- Change the instance type -  the maximum pod count changes  

- Use a larger instance - more Pods per node

- Use a smaller instance - fewer Pods per node

The limit is deterministic, but not fixed across instance types.

### Experiment & Validate

**Step 1: Observe max pods on an EKS node**

```bash
kubectl describe node <node-name> | grep -i pods
```

You’ll see something like:

```bash
Capacity:
  pods: 29
Allocatable:
  pods: 29
```

**Step 2: Identify the instance type**

```bash
kubectl get node <node-name> -o jsonpath='{.metadata.labels.node\.kubernetes\.io/instance-type}'
```

Example:

```bash
m5.large
```

**Step 3: Change the instance type**

Create a new node group with a different instance type (for example, m5.xlarge)

Observe the new node:

```bash
kubectl describe node <new-node-name> | grep -i pods
```

You’ll now see a higher pod limit, without changing Kubernetes versions or cluster configuration.

This proves:

The pod limit is instance-type dependent, not a fixed EKS rule.



### Key Takeaways

- EKS does not enforce a fixed maximum pod count per node.

- Pod density depends on the EC2 instance type backing the node.

- The AWS VPC CNI model (one IP per Pod) is the real constraint.

- Treating EKS like a fully abstracted managed service leads to wrong assumptions.

- Understanding this distinction is critical for:

    - Capacity planning
    - Autoscaling behavior
    - Cost optimization
    - ECS to EKS migrations