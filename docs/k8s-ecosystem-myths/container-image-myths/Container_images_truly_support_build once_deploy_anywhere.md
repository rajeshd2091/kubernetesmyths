---
sidebar_position: 2
---
# Myth: Container images truly support “build once, deploy anywhere"

This statement is frequently repeated in container and DevOps communities. Many engineers confidently claim that once a container image is built, it can run on any machine or Kubernetes cluster, regardless of the underlying hardware.During discussions with developers and SREs, this belief appears almost universally accepted. 

I once encountered a situation where an ARM-based edge device cluster was unable to run a standard amd64 image, leading to confusion because the team believed containers were inherently portable.

The failure puzzled them because they assumed the “build once, deploy anywhere” promise applied universally.

### Why This Myth Exists?

There are several reasons that keeps this misconception alive:

1. Early Docker marketing heavily pushed the narrative that containers work like Java’s “write once, run anywhere.”

2. Registries automatically return the correct architecture-specific image variant, hiding the underlying complexity.

3. Most users work on clusters with a single architecture, so they never notice the limitations.

4. The difference between a single image and a multi-architecture manifest list is not widely understood.

5. Tooling has improved so much (QEMU, Buildx, manifest lists) that people assume portability is native, not orchestrated.


### The Reality

Container images are not inherently portable across architectures or operating systems.

A standard container image is tightly coupled to:

- CPU architecture (amd64, arm64, ppc64le, s390x…)

- OS and libc differences (glibc vs musl)

- ABI compatibility

“Deploy anywhere” is only possible when you create a multi-architecture image that bundles multiple architecture-specific images under a single manifest list. The registry then serves the correct image variant based on the client platform.

So the truth is:

**You don’t build once.**
**You build multiple images (one per architecture) and package them as one reference.**

### Experiment & Validate

You can verify this using Docker or any OCI-compliant client.

**Step 1: Get your host machine architecture**

Use both OS-level and Docker-level checks:
```bash
uname -m
docker info --format '{{.Architecture}}'

```
Example Output:

```bash
x86_64
x86_64
```
So, `x86_64` means host is using `amd64`

This tells you what architecture your containers are expected to run on natively.

**Step 2: Pull an image for a different architecture**

Let’s say your host is `amd64`.

Then pull `arm64` BusyBox:

```bash
docker pull --platform linux/arm64/v8 busybox:latest

```

Or vice-versa if your host is `arm64`, then pull `amd64`:

```bash
docker pull --platform linux/amd64 busybox:latest

```

**Step 3: Try to run it**

```bash
docker run --rm busybox:latest

```
This will fail with a classic platform-mismatch error.

Typical Failure Output:

```bash
WARNING: The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /bin/echo: exec format error
```
This experiment validates that container images are architecture-specific, and they cannot be deployed universally across heterogeneous environments

### Key Takeaways
- Container images are architecture-specific.

- Images built for one architecture cannot run on a different architecture.

- True portability requires multi-architecture images (manifest lists).