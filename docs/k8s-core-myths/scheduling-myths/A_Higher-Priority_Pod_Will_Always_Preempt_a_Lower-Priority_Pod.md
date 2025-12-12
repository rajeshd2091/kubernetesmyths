---
sidebar_position: 3
---
# Myth: A Higher-Priority Pod Will Always Preempt a Lower-Priority Pod

I once reviewed an incident where a team created a high-priority pod expecting it to preempt other pods on the node. When the cluster stayed fully packed and the new pod remained unscheduled, they concluded “preemption is broken.”

### Why This Myth Exists?

Because most examples in documentation and blogs refer to the default behavior of PriorityClass where preemption is allowed. This makes people think:

**“Higher priority = automatic preemption.”**

They never notice there is a separate field:

````makefile
preemptionPolicy: Never
````

This silently disables preemption but still keeps the high priority value — causing confusion.

### The Reality
A higher-priority pod **does not automatically preempt lower-priority pods**.

It depends entirely on the PriorityClass preemption policy.

If preemptionPolicy is omitted or set to default:

````makefile
preemptionPolicy: PreemptLowerPriority
````

Higher-priority pods can preempt lower-priority pods.
````makefile
preemptionPolicy: Never
````

Higher-priority pods cannot preempt anything — even if the node is full.

They simply remain unschedulable.

The scheduler will not:

- evict lower-priority pods

- move pods

- reshuffle nodes

It behaves like a normal pod with a very high priority number but without the power to preempt.

### Experiment & Validate

**Cluster setup used for this experiment:**
- Cluster hase only one node.
- Node has ~700m CPU available (very little free CPU).
- Scheduler is default.

**Step 1: Create Low-Priority Class**

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: low
value: 1000
globalDefault: false
```

Apply:

```sh
kubectl apply -f low.yaml
```


**Step 2: Create A Low-Priority Pods to Fill CPU**

Pod requests 600m CPU so the node becomes fully packed (700m total).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: low-1
spec:
  priorityClassName: low
  containers:
  - name: c
    image: nginx
    resources:
      requests:
        cpu: "600m"
```
Apply:

```sh
kubectl apply -f low-pods.yaml
```

Verify:

```sh
kubectl get pod -o wide

```
Pod get scheduled and Running

**Step 3: Create a High Priority But NON-PREEMPTING PriorityClass**

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-nonpreempt
value: 100000
preemptionPolicy: Never
globalDefault: false
```

Apply:

```sh
kubectl apply -f high-nonpreempt.yaml
```


**Step 4: Create High Priority Pod That Needs CPU**

This pod requires 500m CPU, but there is ~100 CPU available.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-nonpreempting-pod
spec:
  priorityClassName: high-nonpreempt
  containers:
  - name: c
    image: nginx
    resources:
      requests:
        cpu: "500m"
```

Apply:

```sh
kubectl apply -f nonpreempting-pod.yaml
```

**Step 5: Observe Its State**

```sh
kubectl describe pod high-nonpreempting-pod

```
You will see:
```kotlin
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  18s   default-scheduler  0/1 nodes are available: 1 Insufficient cpu. preemption: not eligible due to preemptionPolicy=Never.

```
**No lower-priority pods are evicted.**

**No scheduling happens.**

**Pod stays Pending forever.**

### Source of Truth

Kubernetes source code:

```go
// PodEligibleToPreemptOthers returns one bool and one string. The bool
// indicates whether this pod should be considered for preempting other pods or
// not. The string includes the reason if this pod isn't eligible.
// There're several reasons:
//  1. The pod has a preemptionPolicy of Never.
//  2. The pod has already preempted other pods and the victims are in their graceful termination period.
//     Currently we check the node that is nominated for this pod, and as long as there are
//     terminating pods on this node, we don't attempt to preempt more pods.
func (pl *DefaultPreemption) PodEligibleToPreemptOthers(_ context.Context, pod *v1.Pod, nominatedNodeStatus *fwk.Status) (bool, string) {
	if pod.Spec.PreemptionPolicy != nil && *pod.Spec.PreemptionPolicy == v1.PreemptNever {
		return false, "not eligible due to preemptionPolicy=Never."
	}

	nodeInfos := pl.fh.SnapshotSharedLister().NodeInfos()
	nomNodeName := pod.Status.NominatedNodeName
	if len(nomNodeName) > 0 {
		// If the pod's nominated node is considered as UnschedulableAndUnresolvable by the filters,
		// then the pod should be considered for preempting again.
		if nominatedNodeStatus.Code() == fwk.UnschedulableAndUnresolvable {
			return true, ""
		}

		if nodeInfo, _ := nodeInfos.Get(nomNodeName); nodeInfo != nil {
			for _, p := range nodeInfo.GetPods() {
				if pl.isPreemptionAllowed(nodeInfo, p, pod) && podTerminatingByPreemption(p.GetPod()) {
					// There is a terminating pod on the nominated node.
					return false, "not eligible due to a terminating pod on the nominated node."
				}
			}
		}
	}
	return true, ""
}

```

[View Kubernetes Source Code](https://github.com/kubernetes/kubernetes/blob/master/pkg/scheduler/framework/plugins/defaultpreemption/default_preemption.go#L309C1-L342C1)

```sh
https://github.com/kubernetes/kubernetes/blob/master/pkg/scheduler/framework/plugins/defaultpreemption/default_preemption.go#L309C1-L342C1
```


### Key Takeaways
- Higher priority does not guarantee preemption.

- Preemption works only when preemptionPolicy allows it.

- NonPreempting pods behave like normal pods even with very high priority.

- Misconfigured PriorityClass often leads to “scheduler is broken” confusion.

- Always verify if a PriorityClass is preempting or non-preempting.