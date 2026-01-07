---
sidebar_position: 4
---
# Myth: DaemonSet always schedule pods on all nodes.
Expect DaemonSet to Run on Every Node? Not So Fast! Many assume that a DaemonSet automatically schedules a Pod on every node in the cluster. While this is generally true, there are several cases where DaemonSet does not schedule Pods on all nodes.

### Why This Myth Exists?
1. The default behavior of a DaemonSet is to run a Pod on each node, leading to the assumption that it applies universally.
2. Many Kubernetes tutorials demonstrate cluster-wide scheduling without mentioning constraints.
3. The impact of node taints, selectors, and affinity rules is often overlooked.

### The Reality: 
**DaemonSet Scheduling can be Conditional.** It does not always schedule Pods on every node. Various factors can prevent or control where Pods are scheduled:
- **Taints and Tolerations** – Nodes with taints will reject DaemonSet Pods unless explicitly tolerated.
- **Node Selectors** – DaemonSet Pods are only scheduled on nodes matching the specified labels.
- **Affinity and Anti-Affinity Rules** – Custom scheduling rules can limit DaemonSet Pod placement.

### Experiment & Validate
Let’s see a example where DaemonSet does NOT schedule Pods on all nodes:

**Step 1: Verify DaemonSet only runs on nodes with a specific label**

Label one node:

```sh
kubectl label nodes node1 disktype=ssd
```
Create a file with name nodeselector_daemonset.yaml:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: ds-nodeselector
spec:
  selector:
    matchLabels:
      app: nginx-ds
  template:
    metadata:
      labels:
        app: nginx-ds
    spec:
      nodeSelector:
        disktype: ssd
      containers:
      - name: nginx
        image: nginx:stable
```

Create a DaemonSet:

```sh
kubectl apply -f nodeselector_daemonset.yaml
```
Check which nodes have Pods:

```sh
kubectl get pods -o wide
```
The DaemonSet Pod is scheduled only on node1, because it has the label `disktype=ssd` that matches the Pod’s nodeSelector. Nodes without this label are ignored, so no Pods are scheduled on them.

**Step 2: Verify nodes with taints skip DaemonSet Pods without tolerations**

Taint a node:
```sh
kubectl taint nodes node2 key=value:NoSchedule
```
Create a file with name taint_toleration_daemonset.yaml

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: ds-taint
spec:
  selector:
    matchLabels:
      app: nginx-taint
  template:
    metadata:
      labels:
        app: nginx-taint
    spec:
      containers:
      - name: nginx
        image: nginx:stable
```

Create a DaemonSet:

```sh
kubectl apply -f taint_toleration_daemonset.yaml
```
Check which nodes have Pods:

```sh
kubectl get pods -o wide
```
Node2 does not have a DaemonSet Pod because it is tainted with `key=value:NoSchedule`, and the Pod does not have a matching toleration. Without the toleration, the scheduler skips Node2, preventing the Pod from being scheduled there.

**Step 3: Verify DaemonSet skips nodes with Pod Anti-Affinity**

Create a file with name antiaffinity-pod.yaml:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: existing-nginx
  labels:
    app: nginx-existing
spec:
  containers:
  - name: nginx
    image: nginx:stable
```

Create a regular pod with Anti-Affinity:

```sh
kubectl apply -f antiaffinity-pod.yaml
```

Check which node it lands on:
```sh
kubectl get pods -o wide
```
Suppose it lands on Node1.

Now create a file with name ds-anti-affinity.yaml

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: ds-anti-affinity
spec:
  selector:
    matchLabels:
      app: nginx-anti
  template:
    metadata:
      labels:
        app: nginx-anti
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchLabels:
                app: nginx-existing
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: nginx
        image: nginx:stable
```
Create a DaemonSet with Anti-Affinity:

```sh
kubectl apply -f ds-anti-affinity.yaml
```
Verify scheduling

```sh
kubectl get pods -o wide
```
Node1 does not get a DaemonSet Pod because the Pod’s required anti-affinity prevents scheduling on nodes with a Pod labeled `app=nginx-existing`.

### Key Takeaways
- **DaemonSets do not always schedule on all nodes**—constraints like taints, selectors, and affinity rules affect placement.
- **By default, they schedule on worker nodes** but require tolerations for control-plane nodes.
- **Understanding scheduling logic is crucial** to ensure Pods run where they are needed.