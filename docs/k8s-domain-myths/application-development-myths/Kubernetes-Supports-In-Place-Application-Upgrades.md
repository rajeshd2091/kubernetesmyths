---
sidebar_position: 3
---
# Myth: Kubernetes Supports In-Place Application Upgrades

In traditional server- or VM-based environments, upgrading an application usually meant updating binaries or packages on the same machine and restarting the process. The application instance remained the same; only its version changed.

When engineers first encounter Kubernetes rollouts, they often assume a similar mechanism exists—that Kubernetes “upgrades” the application while it continues running on the same instance.

### Why This Myth Exists?

This myth persists because:

- Rolling updates look visually similar to in-place upgrades

- The term upgrade is used loosely in documentation and conversations

- Application endpoints remain stable during rollouts

- Traffic continues to flow while versions change

These surface-level behaviors hide what Kubernetes is actually doing underneath

### The Reality

Kubernetes does not support in-place application upgrades.

    - A container image cannot be changed once a container is running
    - A Pod’s specification is immutable after creation
    - Kubernetes never modifies a running Pod

What Kubernetes calls an upgrade is actually:

    - Termination of existing Pods
    - Creation of new Pods with a new specification
    - Gradual traffic shift managed by controllers

Every version change involves replacement, not mutation.

### Experiment & Validate

**Step 1: Deploy an Application**

Create a Deployment with a simple container image.

```shell
kubectl create deployment upgrade-demo --image=nginx:1.25
```

Wait for the Pod to be ready:

```shell
kubectl get pods -l app=upgrade-demo
```

Note the Pod name and UID.

**Step 2: Trigger an “Upgrade”**

Update the container image version:

```shell
kubectl set image deployment/upgrade-demo nginx=nginx:1.26
```

**Step 3: Observe the Rollout**

Watch Pods during the update:

```shell
kubectl get pods -l app=upgrade-demo -w
```


You will see:

- Old Pod terminating
- New Pod being created
- New Pod has a different name and UID

**Step 4: Verify Pod Replacement**

Check the Deployment history:

```shell
kubectl rollout history deployment/upgrade-demo
```

Kubernetes created a new ReplicaSet, not an upgraded Pod.

### Key Takeaways

- Kubernetes never upgrades a running application instance

- Pods and containers are immutable

- Rolling updates are controlled replacements

- Application continuity is achieved through redundancy, not mutation

- Applications must be designed to tolerate replacement at any time