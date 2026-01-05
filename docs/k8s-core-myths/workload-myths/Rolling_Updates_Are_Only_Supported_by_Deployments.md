---
sidebar_position: 3
---
# Myth: Rolling Updates Are Only Supported by Deployments
Many believe that rolling updates are an exclusive feature of Kubernetes Deployments. This assumption leads to the misconception that StatefulSets and DaemonSets do not support rolling updates, forcing teams to use workarounds. But is this really the case?

### Why This Myth Exists?
1. Deployments are widely documented for rolling updates, making them the most well-known approach.
2. Lack of awareness about update strategies in other controllers like StatefulSets and DaemonSets.
3. Confusion around update behavior—each controller has a different approach to handling updates.

### The Reality: 
Rolling Updates Extend Beyond Deployments. While Deployments use the default RollingUpdate strategy, StatefulSets and DaemonSets also support rolling updates—but with different behaviors.
- Deployments: Roll updates across Pods gradually using RollingUpdate strategy.
- StatefulSets: Follow a rolling update pattern but update one Pod at a time in order.
- DaemonSets: Perform rolling updates but have different scheduling constraints, ensuring Pods are only running on specific nodes.

### Experiment & Validate
**Step 1: Create a Deployment with Rolling Update**

Create a file deployment.yaml:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
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
        image: nginx:1.21
```

Create a Deployment:

```sh
kubectl apply -f deployment.yaml
```

Verify Pods:

```sh
kubectl get pods -w
```

Trigger Rolling Update:

```sh
kubectl set image deployment/nginx-deploy nginx=nginx:1.23
```

Observe Rolling Update:

```sh
kubectl rollout status deployment/nginx-deploy
```
Expected output:

```sh
Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deploy" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "nginx-deploy" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "nginx-deploy" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "nginx-deploy" rollout to finish: 1 old replicas are pending termination...
deployment "nginx-deploy" successfully rolled out
```

**Step 2: Create a Statefulset with Rolling Update**

Create a file statefulset.yaml:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: nginx-sts
spec:
  serviceName: nginx
  replicas: 3
  updateStrategy:
    type: RollingUpdate
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
        image: nginx:1.21
```

Create a Statefulset:

```sh
kubectl apply -f statefulset.yaml

```

Verify Ordered Pods:

```sh
kubectl get pods -w
```
Trigger Rolling Update:

```sh
kubectl set image statefulset/nginx-sts nginx=nginx:1.23

```

Observe Ordered Rolling Update

```sh
 kubectl rollout status statefulset/nginx-sts
```

Expected output:

```sh
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
waiting for statefulset rolling update to complete 2 pods at revision nginx-sts-6d96f685f9...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
statefulset rolling update complete 3 pods at revision nginx-sts-6d96f685f9...
```

**Step 3: Create a DaemonSet with Rolling Update**

Create a file daemonset.yaml:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nginx-ds
spec:
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
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
        image: nginx:1.21
```

Create a DaemonSet:

```sh
kubectl apply -f daemonset.yaml

```

Verify Pods on Nodes:

```sh
kubectl get pods -o wide
```

Trigger Rolling Update:

```sh
kubectl set image daemonset/nginx-ds nginx=nginx:1.23

```

Observe Rolling Update:

```sh
kubectl rollout status daemonset/nginx-ds

```
Similar to Deployments and StatefulSets, DaemonSets perform updates in a rolling fashion.


### Key Takeaways
- **Rolling updates are not exclusive to Deployments**—StatefulSets and DaemonSets also support them.
- **Each controller has a different update pattern**—understanding them prevents unexpected behavior.
- **Kubernetes ensures updates happen safely**—but choosing the right approach matters!