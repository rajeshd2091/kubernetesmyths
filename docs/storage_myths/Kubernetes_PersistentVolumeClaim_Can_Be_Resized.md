# Myth: Kubernetes `PersistentVolumeClaim` Can Be Resized

During a design discussion, a team member confidently stated that “PVCs in Kubernetes are fully resizable — you can increase or decrease storage whenever you want.” This assumption influenced their storage planning and automated cleanup strategy.

The misunderstanding became clear only when they attempted to shrink a PVC and discovered that Kubernetes does not support reducing its size, leading to unnecessary downtime and manual recovery work.

### Why This Myth Exists?

This misconception commonly arises because:

- Kubernetes documentation and almost all blogs use the term “resize,” which people assume includes both expansion and shrinking.

- Storage systems outside Kubernetes (such as cloud block storage) often support dynamic resizing, which leads developers to expect the same flexibility at the PVC level.

- Kubernetes allows expansion of PVCs starting from v1.11+, so users incorrectly generalize that resizing must also include shrinking.

Because of these factors, the term “resize” is frequently interpreted incorrectly.

### The Reality

Kubernetes PVCs can be expanded but cannot be shrunk. The resize operation is unidirectional.

- Kubernetes allows increasing PVC size when the StorageClass supports volume expansion.

- Kubernetes does not support reducing a PVC’s requested storage.

- Shrinking storage poses significant data integrity risks (such as truncation), so Kubernetes explicitly disallows it.

- The underlying storage provider might support shrink operations, but Kubernetes does not expose this capability to users.

- If a smaller volume is required, the only safe approach is to create a new, smaller PVC and migrate data manually.

In summary, calling PVCs “resizable” is misleading because Kubernetes supports only expansion — not shrinkage.

### Experiment & Validate

**Step 1: Create a PVC**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-demo
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 5Gi

```
Apply it:

```sh
kubectl apply -f pvc.yaml
```
Verify:

```sh
kubectl get pvc pvc-demo
```

**Step 2: Expand the PVC**

Edit the PVC:

```sh
kubectl edit pvc pvc-demo

```

Change:

```yaml
resources:
  requests:
    storage: 10Gi
```

Kubernetes will allow this change

```sh
kubectl get pvc pvc-demo
```

Status shows:
```sh
pvc-demo   Bound   10Gi   ...
```


**Step 3: Attempt to Shrink the PVC**

Edit the PVC again:

```sh
kubectl edit pvc pvc-demo

```

Change:
```yaml
resources:
  requests:
    storage: 2Gi
```

Kubernetes rejects the change with an error similar to:

```sh
persistentvolumeclaims "pvc-demo" is invalid: 
spec.resources.requests.storage: Forbidden: field can not be less than status.capacity

```
The PVC remains at 10Gi, confirming that shrink operations are blocked.


### Key Takeaways
- A PVC in Kubernetes **can only be expanded, never shrunk.**

- The StorageClass must have `allowVolumeExpansion=true` to support expansion.

- Kubernetes explicitly prevents shrink operations to protect data from corruption.

- Shrinking a PVC requires creating a new, smaller PVC and migrating data manually.

- The term **“resize”** is misleading; technically, Kubernetes supports only volume expansion.