# Myth 1: Kubernetes Cluster Can Have Only One Default StorageClass

You're defining a new StorageClass and set:
```yaml
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
```
You assume Kubernetes will reject or warn if another default already exists. After all, "default" means only one, right?

So you apply multiple StorageClass resources with the same default annotation — and nothing happens. No error. No warning.

You run:
```yaml
kubectl get sc -o custom-columns=NAME:.metadata.name,DEFAULT:.metadata.annotations.storageclass\.kubernetes\.io/is-default-class
```
And you see two or more default classes marked "true".

### Why This Myth Exists?

- The term “default” creates the impression that only one can exist.
- Most tutorials and cluster setups only define one, reinforcing this assumption.
- The lack of enforcement is not widely documented.
- Engineers expect the system to prevent ambiguous behavior—but Kubernetes allows it.

### The Reality
 You can create multiple default StorageClasses in a Kubernetes cluster.
 The  `"storageclass.kubernetes.io/is-default-class": "true" ` annotation is not enforced by Kubernetes — it's simply a marker.

- When a PVC omits storageClassName, the system looks for a StorageClass with that annotation.
- If more than one exists, the behavior is undefined and provider-specific.
- Kubernetes does not raise any warning or error when multiple defaults exist.
- It's up to cluster admins to ensure only one default exists for consistent PVC provisioning.

### Experiment & Validate
Step1: Create Two Default StorageClasses

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-default
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/no-provisioner
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow-default
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/no-provisioner
```
Step 2: Apply
```sh
kubectl apply -f dual-default-sc.yaml
```
Step 3: List All Defaults
```sh
kubectl get sc -o custom-columns=NAME:.metadata.name,DEFAULT:.metadata.annotations.storageclass\.kubernetes\.io/is-default-class
```
You’ll see both **fast-default** and **slow-default** marked as default. No error. No warning.

### Key Takeaways
- Kubernetes allows multiple default StorageClasses without any warning.
- The “default” is an annotation, not a rule.
- If more than one default exists, PVCs without storageClassName may be handled unpredictably.
- Always ensure only one default StorageClass exists to avoid confusion.