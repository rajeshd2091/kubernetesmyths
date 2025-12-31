---
sidebar_position: 7
---
# Myth: CPU Requests Guarantee Reserved CPU for Containers

During a performance investigation, I once saw a pod with `cpu: 500m` requests getting throttled heavily under load.

The immediate reaction from the team was:

*“How can this be throttled? We requested half a core!”*

This misunderstanding comes up frequently in interviews, production incidents, and even architectural reviews.


### Why This Myth Exists?

- Kubernetes does reserve memory strictly based on requests, so people assume CPU works the same way.

- The word `request` sounds like a hard reservation.

- Many blog posts oversimplify CPU scheduling behavior and ignore Linux cgroups and CFS mechanics.


### The Reality:

CPU in Kubernetes is a compressible resource, not a strictly reserved one.

What actually happens:

- CPU requests are used only for scheduling, not reservation.

- The Linux Completely Fair Scheduler (CFS) shares CPU time across all runnable processes.

- Your pod gets priority proportional to its CPU request, but not exclusive access.

If your pod is idle, other pods can use that CPU.

Under contention, the kernel may throttle your pod based on its CPU limit, not its request.

In short:

*CPU requests influence fairness, not exclusivity.*

### Experiment & Validate

**Pod Spec**

```yaml
resources:
  requests:
    cpu: "100m"
  limits:
    cpu: "100m"
```

**Scenario**

- Pod A requests 100m CPU but uses only ~50m.

- Pod B on the same node consumes extra CPU.

- When Pod A suddenly needs the full 100m:

- If the node is busy, Pod A may get throttled.

- There is no “reserved” 50m waiting for it.

**Observe Throttling**

```sh
kubectl top pod <pod-name>
```

**Prometheus metric:**

```sh
container_cpu_cfs_throttled_seconds_total
```

You’ll clearly see throttling even though the request was met.

### Key Takeaways

- CPU requests do not reserve CPU cores.

- Requests affect scheduling priority, not guaranteed CPU availability.

- CPU is shared dynamically using Linux CFS.

- Limits control throttling; requests control placement.

- Overestimating CPU requests can hurt cluster efficiency.

- Underestimating CPU limits can cause latency spikes.

- Understanding this distinction is critical for:

    - Performance tuning

    - Capacity planning

    - Avoiding false assumptions during incidents   