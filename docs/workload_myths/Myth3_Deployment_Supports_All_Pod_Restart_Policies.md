# Myth 3: Deployment Supports All Pod Restart Policies
Can You Use Any Restart Policy in a Deployment? 
Many believe that Deployments can be used with any Kubernetes Pod restart policy. The assumption is that you can define `Always`, `OnFailure`, or `Never` as the restartPolicy within a Deployment’s Pod spec.But that's not true.

### Why This Myth Exists?
1. Pods support all three restart policies (`Always`, `OnFailure`, `Never`), leading to the assumption that Deployments do as well.
2. Users often assume Pod behavior is the same inside different controllers like Deployments, DaemonSets, or Jobs.
3. The Kubernetes API allows specifying other restart policies in Pod definitions, but Deployments override them!

### The Reality: 
Deployment = `restartPolicy: Always` Only!
In Kubernetes, Deployments are designed to manage long-running applications. That means:
- If a Pod fails, Kubernetes restarts it.
- If a node crashes, a new Pod is scheduled on another node.
- Any restart policy other than Always is rejected!

### Experiment & Validate
Let’s try using `restartPolicy: OnFailure` inside a Deployment and see what happens:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
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
      restartPolicy: OnFailure
      containers:
      - name: test-container
        image: busybox
        command: ["sh", "-c", "echo Hello && exit 1"]
```
What Happens?
Deployment rejects `OnFailure` and throw an error!
```
The Deployment "my-deployment" is invalid: spec.template.spec.restartPolicy: Unsupported value: "OnFailure": supported values: "Always"
```
Kubernetes rejects the Deployment, as it does not allow restart policies other than `Always`.

### Key Takeaways
- **Deployments only support** `restartPolicy: Always`—other policies are rejected.
- **Use Jobs or CronJobs for** `OnFailure` or `Never` **restart behavior.**
- **Understanding controller-specific behavior prevents misconfigurations.**