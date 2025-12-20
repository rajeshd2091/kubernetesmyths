---
sidebar_position: 6
---

# Myth: Image Garbage collector runs only when disk usage crosses a High-Threshold

During a node disk analysis in a long-running cluster, I noticed unused container images disappearing *even though disk usage was well below the image GC high threshold.*

At first, this looked like a bug or a “black box” behavior.

A quick dive into the kubelet code told a different story.

### Why This Myth Exists?

1. Most documentation emphasizes disk-pressure–based GC.

2. Default kubelet settings **disable age-based image GC**, so it’s rarely observed.

3. Engineers often equate image GC with `imageGCHighThresholdPercent` only.

4. Kubernetes don’t expose all kubelet flags clearly.


### The Reality

Kubernetes image garbage collection is not triggered only by disk pressure.

Kubelet supports two image GC mechanisms:

1. Disk pressure–based GC
	
	- Triggered when disk usage exceeds `imageGCHighThresholdPercent`

	- Stops when usage drops below `imageGCLowThresholdPercent`

2. Age-based GC (when enabled)

	- Removes unused images older than `imageMaximumGCAge`

	- Does not require disk pressure

	- Controlled by the `ImageMaximumGCAge` feature gate

So images can be garbage-collected even when disk usage is healthy.

Note:

```yaml
This feature does not track image usage across kubelet restarts. If the kubelet is restarted, the tracked image age is reset, causing the kubelet to wait the full imageMaximumGCAge duration before qualifying images for garbage collection based on image age
```

### Source of Truth

Kubernetes source code:

```go
func (im *realImageGCManager) freeOldImages(ctx context.Context, images []evictionInfo, freeTime, beganGC time.Time) ([]evictionInfo, error) {
	if im.policy.MaxAge == 0 {
		return images, nil
	}

	// Wait until the MaxAge has passed since the Kubelet has started,
	// or else we risk prematurely garbage collecting images.
	if freeTime.Sub(beganGC) <= im.policy.MaxAge {
		return images, nil
	}
	var deletionErrors []error
	logger := klog.FromContext(ctx)
	remainingImages := make([]evictionInfo, 0)
	for _, image := range images {
		logger.V(5).Info("Evaluating image ID for possible garbage collection based on image age", "imageID", image.id)
		// Evaluate whether image is older than MaxAge.
		if freeTime.Sub(image.lastUsed) > im.policy.MaxAge {
			if err := im.freeImage(ctx, image, ImageGarbageCollectedTotalReasonAge); err != nil {
				deletionErrors = append(deletionErrors, err)
				remainingImages = append(remainingImages, image)
				continue
			}
			continue
		}
		remainingImages = append(remainingImages, image)
	}
	if len(deletionErrors) > 0 {
		return remainingImages, fmt.Errorf("wanted to free images older than %v, encountered errors in image deletion: %v", im.policy.MaxAge, errors.NewAggregate(deletionErrors))
	}
	return remainingImages, nil
}

```

[View Kubernetes Image GC Manager Source Code](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/images/image_gc_manager.go#L425)

```sh
https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/images/image_gc_manager.go#L425
```

### Key Takeaways
- Disk pressure is not the only trigger for image garbage collection

- Age-based GC exists but is disabled by default

- Long-running nodes can lose unused images even with plenty of disk space

- Understanding kubelet internals prevents false assumptions during debugging