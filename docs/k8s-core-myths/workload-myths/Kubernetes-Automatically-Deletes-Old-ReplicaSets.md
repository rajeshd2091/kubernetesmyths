---
sidebar_position: 6
---
# Myth: Kubernetes Automatically Deletes Old ReplicaSets

A few years ago, while troubleshooting a production issue, I ran `kubectl get rs` and noticed a long list of ReplicaSets—some created months ago.

When I asked about it, a teammate confidently said:

*“Don’t worry, Kubernetes cleans them up automatically.”*

It sounded logical. Deployments move forward, so why would old ReplicaSets still exist?

But the cluster told a different story. Those ReplicaSets weren’t leftovers—they were intentionally kept.

### Why This Myth Exists?

This myth exists because people confuse “scaled down” with “deleted.”

- During a Deployment update, old ReplicaSets are scaled down to zero replicas.

- Since they are no longer running Pods, they appear harmless.

- Many assume Kubernetes performs garbage collection automatically.

In reality, Kubernetes is being conservative on purpose.

### The Reality: 

Kubernetes does not automatically delete older ReplicaSets.

When a Deployment is updated:

- A new ReplicaSet is created.

- The previous ReplicaSet is scaled down, not deleted.

- Older ReplicaSets are retained to support rollbacks.

By default:

- `revisionHistoryLimit` is 10

- Kubernetes keeps the latest 10 ReplicaSets

- Anything beyond that limit is eligible for deletion

If you explicitly set:

```sh
revisionHistoryLimit: 0
```
Kubernetes will delete old ReplicaSets immediately after they are scaled down.

### Experiment & Validate

**Step 1: Create a Deployment (No revisionHistoryLimit Set)**

Create a file rs-history-demo.yaml:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rs-history-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rs-demo
  template:
    metadata:
      labels:
        app: rs-demo
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
```

Apply it:

```sh
kubectl apply -f rs-history-demo.yaml
```

Check ReplicaSets:

```sh
kubectl get rs
```

Expected output (example):

```sh
rs-history-demo-7c6c9f8d9d   1   1   1   10s
```

**Step 2: Update the Deployment Multiple Times**

Update the image:

```sh
kubectl set image deployment/rs-history-demo nginx=nginx:1.26
```


Update again:

```sh
kubectl set image deployment/rs-history-demo nginx=nginx:1.27
```

Now list ReplicaSets:

```sh
kubectl get rs
```

Expected output:

```sh
rs-history-demo-7c6c9f8d9d   0   0   0   5m
rs-history-demo-6b8f7d4c9a   0   0   0   2m
rs-history-demo-5d9f6b8c7e   1   1   1   30s
```

**Observation**

- Older ReplicaSets still exist
- They are scaled to zero, not deleted
- Kubernetes did not clean them up automatically

**Step 3: Confirm Default Retention Behavior**

Check Deployment details:

```sh
kubectl get deployment rs-history-demo -o yaml | grep revisionHistoryLimit
```

Output:

```sh
revisionHistoryLimit: 10
```

This confirms:

- Kubernetes keeps up to 10 old ReplicaSets by default
- Deletion only happens when the limit is exceeded

**Step 4: Enable Automatic Cleanup Using revisionHistoryLimit**

Edit the Deployment:

```sh
kubectl edit deployment rs-history-demo
```

Update the spec:

```yaml
spec:
  revisionHistoryLimit: 2
```

Save and exit.

Now update the image multiple times again:

```sh
kubectl set image deployment/rs-history-demo nginx=nginx:1.28
kubectl set image deployment/rs-history-demo nginx=nginx:1.29
kubectl set image deployment/rs-history-demo nginx=nginx:1.30
```

List ReplicaSets:

```sh
kubectl get rs
```

Expected output:

```sh
rs-history-demo-8f9c7d6b5a   0   0   0   1m
rs-history-demo-9a8b7c6d5e   1   1   1   20s
```

**Observation**

- Only 2 ReplicaSets exist
- Older ones were deleted automatically
- Cleanup happened only because revisionHistoryLimit was configured

### Key Takeaways

- Kubernetes retains ReplicaSets intentionally to support safe rollbacks

- Old ReplicaSets are scaled down, not deleted

- Cleanup behavior is controlled using `revisionHistoryLimit`

- Choose the limit based on real rollback requirements, not defaults