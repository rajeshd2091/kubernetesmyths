---
sidebar_position: 3
---
# Myth: The order of Kubernetes resource deployment does not matter

I once worked with a team deploying a complex application via `kubectl apply -f .` with all resources in one folder. They assumed Kubernetes would automatically handle dependencies. 

During deployment, the app failed because the Deployment referenced a ConfigMap that wasn’t created yet.

Some manifests applied successfully, but the Deployment pods failed repeatedly, showing ConfigMap not found errors.

### Why This Myth Exists?

Kubernetes applies resources declaratively, and `kubectl apply -f` can process multiple manifests at once.

People assume Kubernetes intelligently figures out dependencies like Services, ConfigMaps, Secrets, and CRDs. While it sometimes works, there’s no guaranteed ordering unless you explicitly manage it.


### The Reality: 
- Kubernetes does not guarantee resource creation order.

- `kubectl apply` applies manifests in the order they are read from the filesystem, which may not respect dependencies.

- Missing dependencies (ConfigMaps, Secrets, CRDs) can cause pods, controllers, or Jobs to fail.

- Tools like Helm or Kustomize can manage order better, but even Helm relies on hooks and chart structure for proper sequencing.

- You must follow a specific order when deploying resources. Here is the general order:

1. Namespace
2. NetworkPolicy
3. ResourceQuota
4. LimitRange
5. PodSecurityPolicy
6. PodDisruptionBudget
7. ServiceAccount
8. Secret
9. SecretList
10. ConfigMap
11. StorageClass
12. PersistentVolume
13. PersistentVolumeClaim
14. CustomResourceDefinition
15. ClusterRole
16. ClusterRoleList
17. ClusterRoleBinding
18. ClusterRoleBindingList
19. Role
20. RoleList
21. RoleBinding
22. RoleBindingList
23. Service
24. DaemonSet
25. Pod
26. ReplicationController
27. ReplicaSet
28. Deployment
29. HorizontalPodAutoscaler
30. StatefulSet
31. Job
32. CronJob
33. Ingress
34. APIService
35. MutatingWebhookConfiguration
36. ValidatingWebhookConfiguration

### Experiment & Validate

**Step 1: Prepare resources**

```yaml
# 01-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: nginx
        image: nginx
        envFrom:
        - configMapRef:
            name: app-config

# 02-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"

```

**Step 2: Deploy resources at once**

Apply all manifests at once using `kubectl apply -f .`

```bash
kubectl apply -f .
```

**Step 3: Observe the result**

- Depending on how the filesystem orders the files, Deployment may apply before ConfigMap.
- Pods may enter CrashLoopBackOff because the ConfigMap doesn’t exist yet.
- Check logs:

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```
You will see errors like:

```bash
env: error: configmap "app-config" not found
```

**Step 4: Fix the issue**

Ensure ConfigMap is created before Deployment.

```bash
kubectl apply -f 02-configmap.yaml
kubectl apply -f 01-deployment.yaml
```

Pods start successfully because dependencies exist first.

### Key Takeaways
- Always be aware of dependencies between resources.
- Use explicit ordering in scripts, CI/CD pipelines, or Helm charts.
- For complex applications, consider pre-flight validation or dependency-aware tools to avoid runtime failures.
