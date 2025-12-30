---
sidebar_position: 2
---
# Myth: Helm Tracks the Current State of Kubernetes Resources

In a real production setup, an engineer manually deleted a ServiceAccount created by Helm to test recovery behavior.

A few days later, during a routine deployment, the team ran:

```bash
helm upgrade --install
```

The ServiceAccount appeared again.

This led to a confident conclusion:

*“See? Helm detected that the ServiceAccount was missing and recreated it.”*

In interviews and design discussions, this behavior is often described as:

*“Helm tracks Kubernetes state, so it fixes missing resources during upgrade.”*

The conclusion sounds correct — but the reasoning behind it is not.

### Why This Myth Exists?

This myth exists because:

- Deleted resources sometimes reappear after helm upgrade
- Helm upgrades feel like reconciliation
- Release metadata is stored inside the cluster
- Many engineers assume Helm compares live state with desired state

These observations create the illusion that Helm is “state-aware”.

### The Reality

Helm does not track the current live state of Kubernetes resources.

What actually happens during helm upgrade is:

- Helm renders templates into manifests
- Helm compares:
    - last applied manifest (stored in the release)
    - newly rendered manifest
- If a resource exists in the rendered manifest, Helm applies it using Kubernetes APIs

Helm does NOT:

- Check whether a resource was manually deleted
- Detect configuration drift
- Query live object state for reconciliation
- Act unless an install or upgrade is triggered

The recreation of a deleted resource during upgrade is incidental, not intentional state tracking.

Helm simply reapplies what is in the rendered manifest.

### Experiment & Validate

**Step 1: Create a Sample Helm Chart**

```bash
helm create helm-demo
```

This creates a fully functional chart with:

- Deployment
- Service
- ConfigMap
- ServiceAccount

No template changes are required.

**Step 2: Install the Chart**

```bash
helm install helm-demo-release helm-demo
```

**Step 3: Delete the Service Account Manually**

```bash
kubectl delete serviceaccount helm-demo-release
```

**Step 4: Verify Helm Release State**

```bash
helm get manifest helm-demo-release
```

You will see that the ServiceAccount is still present in the rendered manifest even though it was deleted. This is because Helm does not track the current live state of Kubernetes resources.

**Step 5: Run Upgrade**

```bash
helm upgrade helm-demo-release helm-demo
```

**Step 6: Observe the Output**

You will see that the ServiceAccount is recreated.

### Key Takeaways
- Helm does not monitor live Kubernetes state
- Resource recreation during upgrade is reapplication, not reconciliation
- Helm has no drift detection mechanism
- Helm only acts on:
    - install
    - upgrade
    - rollback
- Helm compares manifests, not live objects