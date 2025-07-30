# Myth 1: Kubelet is Exclusive to Worker Nodes

You SSH into a control plane node, expecting to see only control plane components like the API server, controller manager, and scheduler running. But wait—why is Kubelet there? Wasn't it supposed to run only on worker nodes?

You double-check your understanding: worker nodes handle workloads, and Kubelet is responsible for managing pods on those nodes. Control plane nodes, on the other hand, orchestrate everything but don’t run regular workloads. So, why does `ps aux | grep kubelet` show Kubelet actively running on a control plane node?

You start to wonder—if control plane nodes aren’t supposed to run application pods, does Kubelet even serve a purpose here?

### Why This Myth Exists?
1. **Worker nodes are responsible for running workloads,** leading many to believe Kubelet is exclusive to them.
2. **Control plane nodes don’t schedule regular workloads,** making Kubelet’s presence less noticeable.
3. **Many tutorials and diagrams oversimplify** by associating Kubelet only with worker nodes.

### The Reality
Kubelet runs on all nodes in a typical Kubernetes cluster, including control plane nodes. However, its role differs:

- **On worker nodes:** Kubelet registers the node and manages pod execution.

- **On control plane nodes (when using static pods):** Kubelet ensures control plane components like the API server, scheduler, and controller manager run correctly.

Exception: Some Kubernetes distributions (e.g., certain air-gapped or enterprise setups) run control plane components as systemd services instead of static pods. In such cases, Kubelet may not be needed on control plane nodes. **However, this is uncommon in most Kubernetes distributions.**

### Experiment & Validate
 
**Step 1: Check Kubelet Running on Control Plane Nodes**
```
ssh <control-plane-node>
ps aux | grep kubelet
```
If Kubelet is running, you’ll see its process listed.

**Step 2: Verify the Kubelet service status (For Most Kubernetes Setups)**
```
ssh <control-plane-node>
systemctl status kubelet --no-pager
```
If active, Kubelet is running on the control plane node.

**Step 3: Confirm Kubelet's Role in Managing Static Pods**
Since Kubelet manages static pods on control plane nodes, you can check for static pod manifests:
```
ls /etc/kubernetes/manifests/
```
If you see files like kube-apiserver.yaml and etcd.yaml, Kubelet is responsible for running control plane components as static pods.


### Key Takeaways
- Kubelet runs on all worker nodes and is commonly present on control plane nodes.
- On worker nodes, Kubelet registers the node and manages workload execution.
- On control plane nodes, Kubelet typically manages static pods for core components unless systemd-based services are used.
- Understanding Kubelet’s role is essential for troubleshooting and maintaining cluster stability.