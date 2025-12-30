---
sidebar_position: 6
---
# Myth: All Pods Are Created Using the API Server and Scheduler

Early in my Kubernetes journey, I strongly believed that the API server and scheduler were mandatory for every Pod.

This belief was reinforced by diagrams, certification material, and almost every “Kubernetes architecture” blog showing a straight line:

```sh
kubectl → API Server → Scheduler → Kubelet → Pod
```

The illusion broke when I SSH’d into a control-plane node and deleted the kube-apiserver Pod using `kubectl delete pod`.

Within seconds, the Pod came back — without any scheduler event.

That was the moment I realized:

Some Pods don’t play by the standard rules.

### Why This Myth Exists?

This myth exists because:

- Most Pods do follow the API server → scheduler → kubelet flow

- Static Pods are rarely discussed outside kubeadm internals

- Diagrams simplify Kubernetes to make learning easier

- Control-plane components are hidden behind abstractions in managed Kubernetes services


As a result, people assume “**all Pods are the same**”.

They are not.

### The Reality:

Kubernetes supports a special category of Pods called Static Pods.

Static Pods bypass both the API server and the scheduler.

How they actually work:

- The kubelet watches a directory on the node (commonly /etc/kubernetes/manifests)

- Any Pod YAML placed there is directly started by the kubelet

- The Pod is bound to that node permanently

- The scheduler is never involved

These Pods are node-local, not cluster-scheduled.


### Experiment & Validate

**Step 1. Observe Static Pods**

On a kubeadm-based cluster:

```bash
ls /etc/kubernetes/manifests
```
You will typically see:

- kube-apiserver.yaml

- kube-scheduler.yaml

- kube-controller-manager.yaml

- etcd.yaml

These are Static Pods.

**Step 2. Check Their Presence in the API Server**

```bash
kubectl get pods -n kube-system
``` 

You’ll see them listed, but note:

- They appear as Mirror Pods

- The API server reflects them but does not manage their lifecycle


**Step 3. Try Deleting One**

```bash
kubectl delete pod kube-apiserver-<node-name> -n kube-system
```
Result:

- Pod disappears briefly
- Immediately reappears

Why?

Because the kubelet recreates it from the manifest file.

**Step 4: Delete the Actual Source**

```bash
rm /etc/kubernetes/manifests/kube-apiserver.yaml
```

Now the Pod is truly gone.

This confirms:

- Deletion through API server  does nothing
- The kubelet is the real owner

### Key Takeaways
- Not all Pods are created via the API server
- Not all Pods are scheduled by the scheduler
- Static Pods are created and managed directly by the kubelet
- Control-plane components commonly run as Static Pods
- Deleting a Static Pod requires removing its manifest file
- Understanding Static Pods is essential to understanding Kubernetes bootstrapping