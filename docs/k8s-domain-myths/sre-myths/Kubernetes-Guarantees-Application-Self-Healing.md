---
sidebar_position: 2
---
# Myth: Kubernetes Guarantees Application Self-Healing

During an on-call incident, alerts showed pods continuously restarting, nodes were healthy, and Kubernetes reported everything as “Running.”

Yet users were still seeing errors and timeouts.

The common conclusion during the incident review was:

*“Kubernetes should have self-healed this.”*

It hadn’t.

It simply kept restarting the same broken application.

### Why This Myth Exists?

This myth is reinforced by Kubernetes features that appear intelligent:

- Controllers continuously reconcile desired state
- Pods are automatically restarted on crashes
- Failed nodes trigger pod rescheduling
- Marketing and conference talks overuse the term self-healing

Over time, this creates the belief that Kubernetes understands and heals application failures.

It does not.

### The Reality

Kubernetes does not heal applications, it just restarts them.

It enforces desired state.


Kubernetes has no concept of:

    - Correct business behavior
    - Dependency health
    - Partial failures
    - Performance degradation
    - Data corruption
    - Logical deadlocks

From Kubernetes’ perspective, an application is healthy as long as:

    - The container process is running
    - Probes (if configured) return success

If a pod is alive but wrong, Kubernetes considers the job done.

**What Kubernetes Actually Self-Heals**

Kubernetes can recover from infrastructure-level symptoms:

- Crashed container processes
- Deleted pods
- Node failures
- Drift between desired and actual object state

This is **process recovery**, not application healing.

**What Kubernetes Cannot Self-Heal**

- Misconfigurations
- Memory leaks
- Deadlocks
- Slow or degraded responses
- Broken downstream dependencies
- Partial outages
- Cascading failures
- Incorrect application logic

In many cases, Kubernetes restarts the application repeatedly, masking the real problem and delaying human intervention.

### Experiment & Validate

**Scenario**

The application logs show errors.

Kubernetes restarts the pod.

After restart, the same error appears again.

User impact continues.

Yet Kubernetes reports the system as healthy.

**Step 1: Deploy an Application That Fails Logically**

The application:

- Starts successfully
- Crashes after hitting a configuration error
- Logs the same error every time it starts

Example behavior (what SREs see first — logs):

```shell
ERROR: Failed to connect to database
ERROR: Invalid DB_HOST configuration
Exiting application
```

The process exits, Kubernetes restarts it.

**Step 2: Observe the Logs (Before Restart)**

```shell
kubectl logs -f pod/app-pod
```

Output:

```shell
ERROR: Failed to connect to database
ERROR: Invalid DB_HOST configuration
Exiting application
```

Pod crashes.

**Step 3: Kubernetes “Self-Heals” (Restarts the Pod)**

```shell
kubectl get pods
```

Output:

```shell
NAME         READY   STATUS    RESTARTS   AGE
app-pod      1/1     Running     3          1m
```
From Kubernetes’ perspective:

- Pod restarted 
- Pod running 
- Problem solved

**Step 4: Observe Logs After Restart**

```shell
kubectl logs -f pod/app-pod
```

Output:

```shell
ERROR: Failed to connect to database
ERROR: Invalid DB_HOST configuration
Exiting application
```
**Exact same error.**
**Exact same failure.**
**Exact same user impact.**

Kubernetes did not heal anything.

It simply replayed the failure.

### Key Takeaways

- Kubernetes is self-restarting, not self-healing
- It heals infrastructure symptoms, not system failures
- Application health is the responsibility of SREs and developers
- Without proper probes, SLOs, and observability, self-healing becomes self-hiding
- Reliability emerges from design, not from the platform alone