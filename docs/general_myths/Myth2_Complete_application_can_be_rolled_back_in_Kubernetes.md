# Myth 2: Complete application can be rolled back in Kubernetes
A team deployed a new version of their microservices-based application in Kubernetes. Soon after, they noticed critical issues and decided to roll back using:
```
kubectl rollout undo deployment my-app
```
They expected everything to return to normal instantly. Instead, they faced database inconsistencies, mismatched API versions, and persistent storage corruption. Their rollback didn’t restore the full application state—only the container images reverted.

### Why This Myth Exists?
This myth persists because many assume Kubernetes rollbacks work like traditional application restore mechanisms. The key reasons behind this misconception are:

1. **Rollback Command Appears Comprehensive** – The `kubectl rollout undo` command suggests it restores everything, but it only affects Deployments, not databases, ConfigMaps, or storage.

2. **Stateless vs. Stateful Confusion** – Stateless apps can be rolled back easily, but stateful workloads (databases, message queues, persistent volumes) require additional rollback strategies.

3. **Lack of Awareness About External Dependencies** – Applications in Kubernetes often depend on external databases, cloud storage, or third-party services, which are unaffected by a simple rollback.

4. **Expectation from Traditional Monolithic Rollbacks** – In legacy systems, rolling back a single instance often meant restoring the full application state, whereas Kubernetes primarily focuses on container lifecycle management.

5. **Kubernetes Default Behavior is Not Full Recovery** – Kubernetes prioritizes high availability and rolling updates but does not track or revert external dependencies automatically.

This misunderstanding leads teams to believe that a simple Kubernetes rollback will restore the entire application state when, in reality, it only reverts container versions and pod specifications.

### The Reality: 
Rolling back a deployment does not mean your entire application is restored. Kubernetes can revert container images and pod specifications, but:

- **Databases Require Explicit Rollbacks** – Schema migrations must be reversible or manually handled.

- **Persistent Volumes Retain Data** – Rolling back an app doesn’t roll back stored data unless snapshots or backups exist.

- **Configuration Drift Can Occur** – Changes in ConfigMaps or Secrets won’t automatically revert unless managed separately.

- **Interdependent Services Can Break** – A rollback might mismatch versions between microservices, causing API incompatibilities.

### Experiment & Validate
1. Deploy an app and apply a schema migration
```
kubectl create deployment my-app --image=my-app:v1  
kubectl apply -f database-migration.yaml  # Applies a schema change  
```
2. Roll back the deployment
```
kubectl rollout undo deployment my-app  
```
Result: The app’s code is rolled back, but the database remains on the new schema, potentially breaking compatibility.

### Key Takeaways
- Kubernetes rollbacks only revert Deployments, not the entire application state.
- Persistent data, ConfigMaps, and external services are unaffected by a rollback.
- Database schema changes, inter-service dependencies, and persistent storage require separate rollback strategies.
