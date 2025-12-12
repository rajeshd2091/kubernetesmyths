---
sidebar_position: 2
---
# Myth: Kubernetes Scheduler Considers Resource Limits for Scheduling

During a design review in a large-scale cluster, I once noticed a deployment configured with extremely low `requests` but very high `limits`. Engineers expected the scheduler to recognize the pod's potential to burst and avoid scheduling it on already constrained nodes. However, the pod was consistently placed on small nodes, causing CPU throttling and memory contention. This led to a debate where several team members argued that the scheduler must be considering limits, actual usage, or both. The issue highlighted a widespread misunderstanding about how Kubernetes decides resource placement.

This same misconception frequently appears in technical interviews. Candidates claim the scheduler uses both requests and limits, or that it dynamically reacts to actual node usage. These answers sound reasonable but are technically incorrect.

### Why This Myth Exists?

- The Kubernetes API exposes both requests and limits in a single block, which gives the impression that both influence scheduling.

- Many monitoring dashboards display pod usage, requests, and limits together, creating the illusion that all three are part of scheduling decisions.

- Engineers often observe throttling or OOM kills caused by limits and assume those behaviors originate from the scheduler.

- Documentation historically emphasized the relationship between requests and limits without clearly separating their roles in scheduling versus runtime enforcement.

- The scheduler and kubelet behaviors are often conflated because both operate around resources.

### The Reality
The Kubernetes Scheduler uses only resource requests during scheduling.

Limits and actual usage play no role in determining pod placement.

When evaluating whether a node can host a pod, the scheduler performs a simple check:

`Current Pod Request > (Node Allocatable – Sum of Exisiting Pods Requests)`

Only after a pod starts running does the kubelet and container runtime enforce resource limits using cgroups. Throttling, OOM kills, and quota enforcement are entirely runtime operations—not scheduling decisions.

If a pod requests 100m CPU and has a limit of 2 cores, the scheduler still treats the pod as a 100m CPU consumer. Regardless of the limit, the scheduler does not infer burst capacity or future peak usage.

### Experiment & Validate
**Step 1: Pod With Very Low Requests and Very High Limits (Gets Scheduled)**

Apply the following pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-low-request
spec:
  containers:
  - name: demo
    image: nginx
    resources:
      requests:
        cpu: "10m"
        memory: "50Mi"
      limits:
        cpu: "16"
        memory: "16Gi"
```

Observation:

Run:

```sh
kubectl get pod test-low-request -o wide
```

You will notice:

- The pod gets scheduled immediately, often on the smallest node.

- It does not matter that the pod “could” use 4 CPU and 4Gi RAM.

- The scheduler only checks the 10m CPU and 50Mi memory request.

This proves:

- High limits do not block scheduling.

- The scheduler ignores limit values entirely.

**Step 2: Increase Requests (Pod Fails to Schedule)**

Now apply a second pod with high requests, without touching limits:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-high-request
spec:
  containers:
  - name: demo
    image: nginx
    resources:
      requests:
        cpu: "16"
        memory: "16Gi"
      limits:
        cpu: "16"
        memory: "16Gi"

```

Observation:

Run:

```sh
kubectl get pod test-high-request
```
Result:

- The pod may stays in Pending state.

- It will not get placed on any node unless a node has ≥16 CPU and ≥16Gi memory available.

### Source of Truth

Kubernetes source code:

```go
if podRequest.MilliCPU > 0 && podRequest.MilliCPU > (nodeInfo.GetAllocatable().GetMilliCPU()-nodeInfo.GetRequested().GetMilliCPU()) {
		insufficientResources = append(insufficientResources, InsufficientResource{
			ResourceName: v1.ResourceCPU,
			Reason:       "Insufficient cpu",
			Requested:    podRequest.MilliCPU,
			Used:         nodeInfo.GetRequested().GetMilliCPU(),
			Capacity:     nodeInfo.GetAllocatable().GetMilliCPU(),
			Unresolvable: podRequest.MilliCPU > nodeInfo.GetAllocatable().GetMilliCPU(),
		})
	}
	if podRequest.Memory > 0 && podRequest.Memory > (nodeInfo.GetAllocatable().GetMemory()-nodeInfo.GetRequested().GetMemory()) {
		insufficientResources = append(insufficientResources, InsufficientResource{
			ResourceName: v1.ResourceMemory,
			Reason:       "Insufficient memory",
			Requested:    podRequest.Memory,
			Used:         nodeInfo.GetRequested().GetMemory(),
			Capacity:     nodeInfo.GetAllocatable().GetMemory(),
			Unresolvable: podRequest.Memory > nodeInfo.GetAllocatable().GetMemory(),
		})
	}

```

[View Kubernetes Scheduler Source Code](https://github.com/kubernetes/kubernetes/blob/master/pkg/scheduler/core/generic_scheduler.go#L189-L220)

```sh
https://github.com/kubernetes/kubernetes/blob/master/pkg/scheduler/framework/plugins/noderesources/fit.go#L670
```


### Key Takeaways
- Kubernetes Scheduler evaluates only resource requests during pod placement.

- Limits influence runtime behavior (throttling, OOM) but not scheduling.

- Misconfigured requests lead to overcommitment, throttling, and noisy-neighbor issues.

- Balanced scheduling requires setting requests equal to realistic baseline usage.

- High limits with low requests give zero scheduling protection and can overload nodes.

- To influence scheduling, adjust requests—not limits.

- Understanding scheduler internals is essential for capacity planning, autoscaling, and stable cluster performance.