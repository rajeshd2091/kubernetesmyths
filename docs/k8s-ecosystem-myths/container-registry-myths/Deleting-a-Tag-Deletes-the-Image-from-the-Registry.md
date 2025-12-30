---
sidebar_position: 2
---
# Myth: Deleting a Tag Deletes the Image from the Registry

During a production vulnerability cleanup, a team deleted the v1.0.1 tag from Docker Hub after a critical CVE was discovered. The assumption was simple:

*“The image is deleted, no one can pull it anymore.”*

A week later, during a rollback incident, an engineer pulled the same image using its digest and redeployed it successfully.

The image was never gone.

### Why This Myth Exists?

1. Tag-centric mental model

Most engineers equate repo:tag with the image itself.

2. Registry UI abstraction

Docker Hub and other registries show tags as “images,” hiding the underlying content-addressable model.

3. Hidden garbage collection

Users rarely understand when (or if) garbage collection runs.

4. Docker CLI behavior

Commands like docker pull nginx:1.25 reinforce the idea that tags are the image.

### The Reality
OCI registries are content-addressable storage systems.

- Tags are references, not the artifact

- Digests identify the actual artifact

- Deleting a tag only removes a pointer

- The underlying blobs and manifest remain until:

    - No references exist and
    - Garbage collection runs

- As long as the digest exists, the artifact exists.

### Experiment & Validate

**Step 1: Verify image exist with single tag**


![Image Tag Exists](/img/k8s-ecosystem-myths/image_tag_exist.jpg)

**Step 2: Delete a tag from Dockerhub**

- Go to Docker Hub
- Navigate to the repository
- Note the image digest
- Delete the v10 tag

At this point, the UI shows the image as deleted.



**Step 3: Pull Image with digest**

![Image Pull Success](/img/k8s-ecosystem-myths/image_pull_after_delete.jpg)

Output:
```bash
docker.io/rajeshd2090/busy@sha256:895ab622e92e18d6b461d671081757af7dbaa3b00e3e28e12505af7817f73649: Pulling from rajeshd2090/busy
ee153a04d683: Pull complete 
Digest: sha256:895ab622e92e18d6b461d671081757af7dbaa3b00e3e28e12505af7817f73649
Status: Downloaded newer image for rajeshd2090/busy@sha256:895ab622e92e18d6b461d671081757af7dbaa3b00e3e28e12505af7817f73649
docker.io/rajeshd2090/busy@sha256:895ab622e92e18d6b461d671081757af7dbaa3b00e3e28e12505af7817f73649

```

### Key Takeaways
- In OCI registries, deleting a tag is not enough. Garbage collection is the only way to completely remove an artifact.
- Tags are mutable references, not artifacts
- Digests are the true identity of OCI artifacts
- Deleting a tag does not guarantee artifact removal
- Vulnerable or deprecated images may still be retrievable
- Registry garbage collection is delayed, vendor-specific, and opaque