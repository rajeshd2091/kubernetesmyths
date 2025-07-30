# Myth 1: kube-proxy assign IP address to Pods
A common belief among Kubernetes users is that kube-proxy is responsible for assigning IP addresses to pods. After all, it manages networking rules and enables communication between services—so it must be the component handling pod IPs, right?

### Why Does This Myth Exist?
1. **Kube-proxy’s prominent role in networking:** Kube-proxy is integral to service-level networking in Kubernetes. Since it manages traffic routing between services and uses iptables, many assume it also handles pod-level networking, including IP assignment.
2. **Confusion with iptables:** Kube-proxy’s involvement with iptables and traffic forwarding may create the impression that it manages all networking tasks, including assigning IPs to pods.
3. **Misunderstanding of Kubernetes components:** Newcomers to Kubernetes often see kube-proxy running in the cluster and mistakenly believe it is responsible for all networking-related operations, including pod IP allocation.

### The Reality
- **Pod IP allocation is the responsibility of the CNI (Container Network Interface) plugin, not kube-proxy.** The CNI is responsible for assigning network interfaces and IP addresses to each pod when they are created.
- **Kube-proxy’s role is service-level networking:** It ensures traffic reaches the right pods by managing network rules for services, but it does not assign IP addresses to the pods themselves.
- **Pods depend on the CNI:** If there’s no CNI plugin installed or running, Kubernetes pods won’t receive an IP address, even if kube-proxy is operational.


### Experiment & Validate
To verify that kube-proxy is not responsible for pod IP allocation, follow these steps:
**Step1: Check the IP of an existing pod before disabling kube-proxy:**
Run the following command to view the pod’s details:
```
kubectl get pods -o wide
```

Example output:
```
NAME          READY STATUS    IP          NODE
nginx-abc123  1/1   Running  10.244.1.2  worker-node-1
```

**Step2: Disable kube-proxy temporarily:**
Scale down the kube-proxy deployment to zero replicas:
```sh
kubectl scale deployment/kube-proxy -n kube-system --replicas=0
```

**Step3: Create a new pod and check if it receives an IP address:**
Launch a new pod and Then, verify the new pod's details::
```sh
kubectl run test-pod --image=nginx --restart=Never
kubectl get pods -o wide
```
You’ll observe that the new pod still receives an IP address, even with kube-proxy disabled, which demonstrates that CNI, not kube-proxy, is responsible for assigning pod IPs.

### Key Takeaways
- **Kube-proxy does not assign pod IPs** – Pod IP allocation is handled by the CNI plugin, not kube-proxy.
- **Kube-proxy’s role is service routing** – It manages the traffic routing for services, but not the network configuration or IP assignment for pods.
- **Without a CNI plugin, pods will fail to receive IP addresses,** regardless of whether kube-proxy is running.
- **Always ensure a CNI plugin is installed** when setting up Kubernetes to guarantee proper networking functionality for pods.