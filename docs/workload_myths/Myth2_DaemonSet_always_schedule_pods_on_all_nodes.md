# Myth 2: DaemonSet always schedule pods on all nodes.
Expect DaemonSet to Run on Every Node? Not So Fast! Many assume that a DaemonSet automatically schedules a Pod on every node in the cluster. While this is generally true, there are several cases where DaemonSet does not schedule Pods on all nodes.

### Why This Myth Exists?
1. The default behavior of a DaemonSet is to run a Pod on each node, leading to the assumption that it applies universally.
2. Many Kubernetes tutorials demonstrate cluster-wide scheduling without mentioning constraints.
3. The impact of node taints, selectors, and affinity rules is often overlooked.

### The Reality: 
**DaemonSet Scheduling Is Conditional.** It does not always schedule Pods on every node. Various factors can prevent or control where Pods are scheduled:
- **Taints and Tolerations** – Nodes with taints will reject DaemonSet Pods unless explicitly tolerated.
- **Node Selectors** – DaemonSet Pods are only scheduled on nodes matching the specified labels.
- **Affinity and Anti-Affinity Rules** – Custom scheduling rules can limit DaemonSet Pod placement.

### Experiment & Validate
Let’s see a example where DaemonSet does NOT schedule Pods on all nodes:
Node Selector: DaemonSet Pods Only on Labeled Node
```
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: my-daemonset
spec:
  template:
    spec:
      nodeSelector:
        custom-role: worker-node
      containers:
      - name: my-daemon
        image: my-app:v2
```
Here, Pods will only run on nodes labeled `custom-role=worker-node`, skipping all others.

### Key Takeaways
- **DaemonSets do not always schedule on all nodes**—constraints like taints, selectors, and affinity rules affect placement.
- **By default, they schedule on worker nodes** but require tolerations for control-plane nodes.
- **Understanding scheduling logic is crucial** to ensure Pods run where they are needed.