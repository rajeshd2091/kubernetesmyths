# Myth 4: Control Plane Nodes Don’t Need a Container Runtime
You set up your control plane node, confident that everything is configured correctly. Next, you run `kubeadm init`, expecting a smooth setup—but it fails instantly!

The error? `no container runtime detected.`

That’s strange. Isn’t the container runtime needed only on worker nodes to run application workloads? You double-check your configuration, thinking you might have missed a step. But the error persists.

What’s going on here? Why is Kubernetes complaining about a missing CRI on the control plane?

### Why Does This Myth Exist?
1. **Over-Simplified Architecture Explanations** – Many Kubernetes learning resources describe the architecture in a rigid way: Control plane runs API Server, etcd, Scheduler, and Controller Manager, while worker nodes run Kubelet, CRI, and Kube-Proxy. This oversimplification leads to misconceptions.
2. **Misinterpretation of Control Plane Responsibilities** – Since control plane components are often seen as "management-only," people assume they don’t rely on container runtimes, networking components, or Kubelet.
3. **Managed Kubernetes Abstraction** – Many managed Kubernetes services abstract away the control plane, making engineers believe that only worker nodes require components like CRI, Kubelet, or CNI.
4. **Historical Understanding of Kubernetes** – Earlier Kubernetes documentation and tutorials emphasized worker nodes as the place where "real workloads" run, reinforcing the belief that key infrastructure components don’t function similarly on control plane nodes.

### The Reality
**CRI is Essential on Control Plane Nodes—But with Exceptions:**

- When control plane components (like API Server, Controller Manager, and etcd) run as **static pods**, a **Container Runtime Interface (CRI) is required because Kubelet manages them as containers.**

- However, in some Kubernetes setups (e.g., certain managed services or custom-built clusters), control plane components run as systemd services instead of static pods. In such cases, the control plane can function without a CRI.

- Despite this exception, **most Kubernetes distributions rely on static pods, making CRI a fundamental requirement for both control plane and worker nodes.**

- Even if the control plane runs without a CRI, worker nodes still require it to manage application workloads.

### Experiment & Validate
**Step 1: Check if the Control Plane Uses CRI**
Run:
```
kubectl get pods -n kube-system
```

Expected Output (If CRI is Present):
```
NAME                               READY   STATUS    RESTARTS   AGE
kube-apiserver-control-plane       1/1     Running   0          5m
etcd-control-plane                 1/1     Running   0          5m
```
If these pods are missing or stuck in `ContainerCreating`, it likely means CRI is missing.

**Step 2: Verify CRI Connectivity**
Run:
```
crictl ps
```
Expected Output (If CRI is Missing):
```
E0205 10:22:34.123456   1234 runtime.go:300] no runtime configured
```
Confirming that the control plane needs a CRI just like worker nodes.

### Key Takeaways
- **CRI is required on all nodes where Kubernetes components run as containers,** including control plane nodes.
- **Control plane components (like API Server, etcd, and Controller Manager) run as static pods** in most Kubernetes setups, requiring a container runtime.
- **Some Kubernetes distributions run control plane components as systemd services,** in which case CRI is not needed on control plane nodes.
- **Without a CRI, kubeadm cannot initialize the cluster,** and critical control plane services won’t start if they rely on containers.
- **Understanding CRI’s role helps in troubleshooting missing services and failed cluster initialization issues.**