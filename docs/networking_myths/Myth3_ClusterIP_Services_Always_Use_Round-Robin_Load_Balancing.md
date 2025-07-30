# Myth 3: ClusterIP Services Always Use Round-Robin Load Balancing
**Have you ever assumed that your pods are getting equal traffic?** Many engineers believe Kubernetes distributes traffic evenly across pods in a strict round-robin manner. But if you actually monitor request distribution, you’ll notice something surprising—some pods receive more traffic than others. Is Kubernetes failing at load balancing? Not really. It turns out that the default behavior isn't what most people expect.

### Why This Myth Exists?
1. People assume Kubernetes works like traditional load balancers, which often default to round-robin.
2. The presence of multiple backend pods creates an expectation of even traffic distribution.
3. The internal working of kube-proxy is often overlooked

### The Reality
The default iptables-based kube-proxy does not use round-robin. Instead, it relies on random probability-based selection when forwarding traffic to backend pods.

### Experiment & Validate

Step 1: Create a ClusterIP Service with Multiple Pods
Apply the following YAML:
```
apiVersion: v1
kind: Service
metadata:
  name: test-clusterip
spec:
  selector:
    app: test-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: test-app
  template:
    metadata:
      labels:
        app: test-app
    spec:
      containers:
        - name: app
          image: nginx
          ports:
            - containerPort: 8080

```

Step 1: Send Requests and Observe the Pattern
Run multiple requests from a test pod:
```
kubectl run test --rm -it --image=busybox -- /bin/sh
```

Inside the pod, execute:
```
while true; do wget -qO- http://test-clusterip.default.svc.cluster.local; sleep 1; done
```
#TODO - Include Kiali image
You'll notice that some pods receive more traffic than others—proving that the selection is random and not round-robin.

### Key Takeaways
- **ClusterIP does not guarantee round-robin load balancing**—default iptables mode uses random selection.
- **IPVS mode can enable true round-robin scheduling** in Kubernetes.
- **External load balancers** provide more fine-grained control if round-robin is essential.
