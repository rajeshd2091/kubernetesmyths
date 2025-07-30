# Myth 3: Kubernetes automatically roll back failed deployment
A team deployed a new version of their application, expecting Kubernetes to roll it back automatically if something went wrong. Unfortunately, the deployment failed, but instead of rolling back, Kubernetes left it in a bad state. The team was surprised—wasn't Kubernetes supposed to handle this automatically?

### Why This Myth Exists?
This misunderstanding comes from:

1. **Expectation from Traditional Systems** – Some deployment tools provide automatic rollback mechanisms, leading users to assume Kubernetes does the same.

2. **Confusion with Health Checks** – Kubernetes can stop bad deployments using readiness and liveness probes, but stopping an update is different from rolling back.

3. **Rollback Feature Misinterpretation** – Since `kubectl rollout undo` exists, people assume Kubernetes triggers it automatically.

4. **Expectation from CI/CD Pipelines** – Some CI/CD tools like ArgoCD and Spinnaker offer auto-rollbacks, making users think Kubernetes itself provides this feature.

5. **Misunderstanding** `progressDeadlineSeconds` – Many believe setting `progressDeadlineSeconds` triggers an automatic rollback, but it only marks the deployment as failed.

### The Reality
Kubernetes does not automatically roll back a failed Deployment. While it detects failures, it requires manual intervention to revert to a previous version.Here’s what actually happens:

- If a Deployment update fails, Kubernetes pauses further updates but does not roll back.

- You must manually trigger a rollback using `kubectl rollout undo deployment <name>`.

- Kubernetes tracks revisions, but rollbacks only work for Deployments—they do not revert ConfigMaps, Secrets, or Persistent Volumes.

- `progressDeadlineSeconds` plays a crucial role – If a rollout does not complete within the configured `progressDeadlineSeconds`, the Deployment is marked as failed, but Kubernetes does not roll it back automatically. Instead, the rollout gets paused, requiring manual intervention.

### Experiment & Validate
Step 1: Create a Working Deployment
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
  progressDeadlineSeconds: 30
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

Apply the Deployment:
```
kubectl apply -f nginx-deployment.yaml
kubectl rollout status deployment/nginx-deployment
```
This should show a successful rollout.

Step 2: Trigger a Failed Deployment
Now, let's break the deployment by using an invalid container image.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
  progressDeadlineSeconds: 30
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:doesnotexist  # Invalid image
          ports:
            - containerPort: 80
```
Apply the broken Deployment:
```
kubectl apply -f nginx-deployment.yaml
```

Check the rollout status:
```
kubectl rollout status deployment/nginx-deployment --timeout=60s
kubectl rollout status deployment/nginx-deployment --timeout=60s
```

After `progressDeadlineSeconds` (30 seconds in this case), Kubernetes will mark the Deployment as failed, but it won’t roll back automatically.

Step 3: Verify That Kubernetes Does Not Roll Back
Check the rollout history:
```
kubectl rollout history deployment/nginx-deployment
```
You'll see that Kubernetes has not reverted to the previous working version.

Check the deployment status:
```
kubectl get deployment nginx-deployment -o jsonpath='{.status.conditions}'
```
The output will show a ProgressDeadlineExceeded condition but no rollback.

###Key Takeaways
- Kubernetes does not automatically roll back a failed Deployment.
- You must manually trigger a rollback if needed.
- progressDeadlineSeconds only marks a deployment as failed but does not roll it back.
- CI/CD tools can be configured to handle rollback logic.
