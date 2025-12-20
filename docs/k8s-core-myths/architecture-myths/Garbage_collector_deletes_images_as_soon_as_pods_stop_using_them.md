---
sidebar_position: 5
---

# Myth: Image Garbage collector deletes images as soon as pods stop using them


During a release freeze, a team deleted several large batch workloads that were using 1–2 GB images.
The assumption was simple:

*“Jobs are gone. Images should be gone too. Disk will free up automatically.”*

Two days later, a completely unrelated deployment started failing with:

```sh
Failed to pull image
no space left on device
```

Everyone was confused:

- No pods were running

- Old workloads were already deleted

- Yet the node disk was almost full

When they logged into the node, they found dozens of unused images, some not used for weeks.

### Why This Myth Exists?
1. Other Kubernetes garbage collectors delete orphaned objects immediately

    Resources like Pods, ReplicaSets, and Jobs are cleaned up promptly once they are no longer referenced, creating the expectation that images behave the same way.

2. Confusion between pod lifecycle and image lifecycle

    Pods are API objects managed by controllers, while images are node-local artifacts managed by kubelet, but this distinction is often overlooked.

3. Experience with Docker workflows where images are manually pruned

    Local Docker environments encourage frequent image cleanup using commands like docker image prune, leading users to assume Kubernetes does this automatically.

4. Assumption that Kubernetes “automatically cleans everything”

    Kubernetes is often perceived as a self-managing system, masking the fact that many cleanups are reactive and threshold-driven rather than continuous.

### The Reality

Kubernetes does not delete images when pods stop using them.

Image Garbage Collection is:
    
    - Triggered by disk pressure, not by pod deletion

    - Managed entirely by kubelet, not controllers

The primary trigger is disk usage crossing:

- `imageGCHighThresholdPercent (default: 85%)`

Once triggered, kubelet deletes unused images until usage drops below:

- `imageGCLowThresholdPercent (default: 80%)`

In addition to disk thresholds, kubelet applies age-based guards:

- **Minimum image age (MinAge)**

    Newly pulled images are protected from deletion for a short duration to avoid delete–pull loops during rapid restarts.

- **Maximum image age (MaxAge)**

    Images unused for longer than this duration are considered stronger deletion candidates.



### Source of Truth

Kubernetes source code:

```go
    // If over the max threshold, free enough to place us at the lower threshold.
	usagePercent := 100 - int(available*100/capacity)
	if usagePercent >= im.policy.HighThresholdPercent {
		amountToFree := capacity*int64(100-im.policy.LowThresholdPercent)/100 - available
		logger.Info("Disk usage on image filesystem is over the high threshold, trying to free bytes down to the low threshold", "usage", usagePercent, "highThreshold", im.policy.HighThresholdPercent, "amountToFree", amountToFree, "lowThreshold", im.policy.LowThresholdPercent)
		remainingImages, freed, err := im.freeSpace(ctx, amountToFree, freeTime, images)
		if err != nil {
			// Failed to delete images, eg due to a read-only filesystem.
			return err
		}

		im.runPostGCHooks(ctx, remainingImages, freeTime)

		if freed < amountToFree {
			// This usually means the disk is full for reasons other than container
			// images, such as logs, volumes, or other files. However, it could also
			// be due to an unusually large number or size of in-use container images.
			message := fmt.Sprintf("Insufficient free disk space on the node's image filesystem (%d%% of %s used). "+
				"Failed to free sufficient space by deleting unused images (freed %d bytes). "+
				"Investigate disk usage, as it could be used by active images, logs, volumes, or other data.",
				usagePercent, formatSize(capacity), freed)
			im.recorder.Eventf(im.nodeRef, v1.EventTypeWarning, events.FreeDiskSpaceFailed, "%s", message)
			return fmt.Errorf("%s", message)
		}
	}

```

[View Kubernetes Image GC Manager Source Code](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/images/image_gc_manager.go#L390C1-L414C3)

```sh
https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/images/image_gc_manager.go#L390C1-L414C3
```

### Key Takeaways
- Pod deletion does not trigger image deletion

- Image GC is disk-pressure or Image Age driven

- Unused images can accumulate for a long time
