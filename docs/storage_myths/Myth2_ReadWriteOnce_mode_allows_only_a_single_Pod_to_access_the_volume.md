# Myth 2: `ReadWriteOnce` mode allows only a single Pod to access the volume

During one of my interviews, the panel asked me, “Why does Kubernetes restrict RWO volumes to a single Pod?”
I confidently answered, “Because only one Pod can mount it — that’s what RWO means.”
The interviewer smiled and said, “Are you sure? What if those Pods are on the same node?”

That question triggered me to revisit the actual behavior, and I realized how widely this myth is believed.

### Why This Myth Exists?

- **For many years, Kubernetes only had ReadWriteOnce (RWO),** and there was no access mode that enforced single-Pod exclusivity until ReadWriteOncePod (RWOP) was introduced.
- Most developers interpret RWO literally — **“only one Pod can write.”**
- Documentation often states “RWO = mounted by a single node,” which many people convert in their head to “single Pod.”
- In everyday clusters, Pods with the same volume usually get scheduled on different nodes, making it look like Kubernetes enforces a single-Pod restriction.
- Because of this pattern, people assume that RWO inherently blocks multiple Pods.

### The Reality
ReadWriteOnce (RWO) means the volume can be mounted by only a single node at a time, not a single Pod.

If multiple Pods run on the same node, they can simultaneously mount the same RWO PersistentVolumeClaim.

To avoid this confusion, Kubernetes also introduced a more strict access mode:

ReadWriteOncePod (RWOP) – the volume can be mounted as read-write by only a single Pod, even if multiple Pods are on the same node.
This mode enforces the “exactly one Pod only” behavior that many people mistakenly assume RWO provides.

Key points:

- RWO = single node restriction, multiple Pods allowed on that node.
- RWOP = single Pod restriction, even on the same node.
- RWOP is stricter and guarantees true single-writer semantics at Pod level.
- If Pods are scheduled to different nodes, both RWO and RWOP will trigger the same multi-attach error.
- RWOP makes the access rule explicit, solving the long-standing confusion around RWO.

### Experiment & Validate
**Step1: Create a PVC with RWO**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: rwo-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi

```
**Step 2: Create two Pods that both mount the same PVC**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-a
spec:
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: rwo-pvc
  containers:
    - name: app
      image: alpine
      command: ["sh", "-c", "sleep 3600"]
      volumeMounts:
        - mountPath: "/data"
          name: data
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-b
spec:
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: rwo-pvc
  containers:
    - name: app
      image: alpine
      command: ["sh", "-c", "sleep 3600"]
      volumeMounts:
        - mountPath: "/data"
          name: data

```
**Step 3: Force both Pods on the same node**
Add this to both Pod specs if needed:
```yaml
nodeSelector:
  kubernetes.io/hostname: <same-node-name>

```
**Step 4: Observe**

Both Pods will start successfully and mount the same RWO volume.

**Step 5: Now move one Pod to another node**

Change the nodeSelector of pod-b to a different node.

Result:
The second Pod will fail to start with an error similar to:
```sh
You’ll see both **fast-default** and **slow-default** marked as default. No error. No warning.
```

This confirms that the lock is at the node level, not the Pod level.

### Key Takeaways
- ReadWriteOnce restricts a volume to a single node, not a single Pod.
- Multiple Pods on the same node can mount the same RWO PVC simultaneously.
- Multi-Pod failures occur only when Pods land on different nodes, causing a block device multi-attach conflict.
- Understanding this helps design workloads like StatefulSets, Jobs, and shared-process Pods more effectively.
- RWO is a node-level access mode, not a Pod-level limitation.