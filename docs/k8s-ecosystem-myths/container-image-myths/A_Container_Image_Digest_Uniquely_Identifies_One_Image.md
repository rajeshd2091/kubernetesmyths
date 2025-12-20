---
sidebar_position: 3
---
# Myth: A Container Image Digest Uniquely Identifies One Image

When discussing container images, the term digest is often used without qualification:

*“This image is pinned by digest, so every node will run the same image.”*

The statement sounds correct and is commonly accepted during design reviews and security discussions.

The subtle assumption is that a digest uniquely identifies the image, regardless of platform.

What usually goes unspoken is that container images can be resolved at different levels, each with its own digest.

### Why This Myth Exists?

This myth exists because:

1. CLI commands typically show only one digest

2. People rarely inspect multi-arch images explicitly

3. Most examples use digests without mentioning platform resolution

4. Tooling hides the difference between index and image manifests

5. The term “image digest” is used loosely across documentation

As a result, different digests are mentally collapsed into one.

### The Reality

In a multi-architecture container image, there are at least two important digests involved.

1. Manifest list (OCI image index) digest

    - Represents all supported platforms

    - Acts as a top-level entry point

    - Used when referencing a multi-arch image generically

2. Image manifest digest (platform-specific)

    - Represents a single OS/architecture combination

    - Selected at pull time based on the node platform

    - Refers to the actual image that will run on the node

Both are valid digests — but they identify different things.

When Kubernetes pulls an image:

    - The tag or index digest is resolved first

    - A platform-specific manifest is selected

    - The node ultimately runs the image identified by the platform-specific digest

Two nodes using the same reference may therefore run images with different digests.


### Experiment & Validate



**Step 1: Open Nginx official Image on Dockerhub Console**

You will see two digest for a single tag on below screen shot

![Image Digests](/img/k8s-ecosystem-myths/image_digest.jpg)

**Step 2: Pull image using Index Digest**

```sh
docker image pull nginx@sha256:8491795299c8e739b7fcc6285d531d9812ce2666e07bd3dd8db00020ad132295
```

An index digest represents a list of images built for different architectures, and at pull time the container runtime resolves it to the image matching the host architecture

```sh
docker.io/library/nginx@sha256:8491795299c8e739b7fcc6285d531d9812ce2666e07bd3dd8db00020ad132295: Pulling from library/nginx
1074353eec0d: Pull complete 
25f453064fd3: Pull complete 
567f84da6fbd: Pull complete 
da7c973d8b92: Pull complete 
33f95a0f3229: Pull complete 
085c5e5aaa8e: Pull complete 
0abf9e567266: Pull complete 
de54cb821236: Pull complete 
Digest: sha256:8491795299c8e739b7fcc6285d531d9812ce2666e07bd3dd8db00020ad132295
Status: Downloaded newer image for nginx@sha256:8491795299c8e739b7fcc6285d531d9812ce2666e07bd3dd8db00020ad132295
docker.io/library/nginx@sha256:8491795299c8e739b7fcc6285d531d9812ce2666e07bd3dd8db00020ad132295
```

**Step 3: Pull image using Manifest Digest**

```sh
docker image pull nginx@sha256:cd43d3ef69d1a01d2d4b4408e8339379851f44d7d51917b59a295a13f80d54b5
```

A manifest digest represents one architecture-specific image, so the container runtime pulls only that image, regardless of the host architecture.

```sh
docker.io/library/nginx@sha256:cd43d3ef69d1a01d2d4b4408e8339379851f44d7d51917b59a295a13f80d54b5: Pulling from library/nginx
c21df6a7383d: Pull complete 
30f3b9423019: Pull complete 
5479f44a40d9: Pull complete 
6e9406abd83b: Pull complete 
502579c506c5: Pull complete 
700eb6e94388: Pull complete 
5d474d442767: Pull complete 
c2a512aa2aa2: Pull complete 
Digest: sha256:cd43d3ef69d1a01d2d4b4408e8339379851f44d7d51917b59a295a13f80d54b5
Status: Downloaded newer image for nginx@sha256:cd43d3ef69d1a01d2d4b4408e8339379851f44d7d51917b59a295a13f80d54b5
docker.io/library/nginx@sha256:cd43d3ef69d1a01d2d4b4408e8339379851f44d7d51917b59a295a13f80d54b5
```


### Key Takeaways
- Not all digests identify the same object

- A multi-arch image has an index digest and image manifest digests

- The index digest represents all platforms

- The image manifest digest represents one platform

- Kubernetes nodes ultimately run platform-specific images

- Pinning the wrong digest can lead to false assumptions about uniformity