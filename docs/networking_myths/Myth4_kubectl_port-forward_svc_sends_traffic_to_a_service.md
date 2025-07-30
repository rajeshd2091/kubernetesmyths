# Myth 4: 'kubectl port-forward svc' sends traffic to a service
Many engineers assume that running:
```
kubectl port-forward svc/my-service 8080:80
```
routes traffic through the Service to its backend Pods—just like a real client request would. But if you analyze the traffic flow, you'll notice something surprising—the Service is completely bypassed!

### Why This Myth Exists?
1. The command uses `svc/my-service`, which makes it seem like traffic will flow through the Service.
2. Since Services load balance traffic, it's natural to assume `port-forward` does the same.
3. The actual forwarding logic is not well-documented, leading to confusion.

### The Reality
Even if you specify a Service in the `kubectl port-forward` command, the traffic never reaches the Service. Instead, **Kubernetes picks a single Pod behind the Service and forwards traffic directly to that Pod—bypassing the Service entirely.**

### Experiment & Validate
Step 1: Create a Service with Multiple Pods
Apply the following YAML:
```
apiVersion: v1
kind: Service
metadata:
  name: productpage
spec:
  selector:
    app: productpage
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080

```
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: productpage
spec:
  replicas: 3
  selector:
    matchLabels:
      app: productpage
  template:
    metadata:
      labels:
        app: productpage
    spec:
      containers:
        - name: app
          image: nginx
          ports:
            - containerPort: 8080

```
Step 2: Run kubectl port-forward and Check Traffic Flow
Forward traffic using:
```
kubectl port-forward svc/productpage 8080:80
```
Then check which Pod is actually receiving traffic:
#TODO - Include Kiali image

You'll notice no traffic hits the Service itself, confirming that requests go directly to a Pod.

###Key Takeaways
- `kubectl port-forward` **does not send traffic through the Service**—it picks one Pod and forwards directly.
- **No load balancing:** Traffic is not distributed among multiple Pods.
- **No failover:** If the chosen Pod crashes, the connection is lost.
- **Not a true service test:** If you want to simulate real client traffic, use Ingress, LoadBalancer, or NodePort.

