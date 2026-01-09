---
sidebar_position: 4
---
# Myth: Dockerfile COPY preserves file ownership and permissions from the host

While running containers as a non-root user, I noticed something odd.

The Dockerfile explicitly set a non-root user:

```dockerfile
FROM alpine
USER 1998
COPY startup.sh startup.sh
CMD ["sh", "./startup.sh"]
```

Inside the running container:

```bash
$ ls -l startup.sh
-rwxrwxrwx 1 root root startup.sh

$ ps -ef
PID USER  COMMAND
1   1998  sh ./startup.sh
```
This raised multiple questions:

    - Why is the file owned by `root:root`?
    - How is a non-root user executing a root-owned file?
    - Does Docker ignore ownership from the host?
    - Does Kubernetes understand usernames from the image?

This confusion is extremely common in container security discussions.

### Why This Myth Exists?

This myth exists due to three assumptions:

    - Linux filesystems preserve UID/GID across copies
    - Docker images behave like VM disks
    - Usernames matter more than numeric IDs

In traditional Linux systems, copying files between directories preserves ownership (if permissions allow). Developers expect the same behavior inside Docker images.

Containers break this mental model.

### The Reality

Dockerfile COPY behaves as follows:

**Ownership**

    - File ownership is NOT preserved
    - Files copied using COPY are owned by `root:root`
    - This is intentional and by design

**Permissions**

    - Basic permission bits (rwx) are preserved
    - Permissions may be affected by:
        - Git checkout permissions
        - Host umask
        - Build context
        - Base image filesystem

**Summary**

```yaml
Attribute	Preserved	Default Result
UID	            No	        root (0)
GID	            No	        root (0)
rwx             bits	    Yes,Same as host
```

### Experiment & Validate



**Step 1: Create a file on host**

```bash
$ ls -l startup.sh
-rwxrwxrwx startup.sh

```


**Step 2: Create a Dockerfile**


```bash
FROM alpine
USER 1998
COPY startup.sh /startup.sh
CMD ["sh", "/startup.sh"]
```


**Step 3: Build Container Image**

```bash
docker build -t test-image .
```

**Step 4: Run Container Image On Kubernetes**

```bash
kubectl run test-pod --image=test-image
```

**Step 5: Check Inside running container**

```bash
kubectl exec -it test-pod -- ls -l /startup.sh
```

Verify File System and Process:

```bash
$ ls -l /startup.sh
-rwxrwxrwx 1 root root /startup.sh

$ id
uid=1998 gid=1998

$ ps -ef
PID USER  COMMAND
1   1998  sh /startup.sh
```

So the file is owned by root:root, but the process is running as user 1998. This is because the COPY instruction does not preserve ownership.

### Key Takeaways
- Dockerfile `COPY` does not preserve ownership
- Permission bits are preserved, ownership is reset
- Execution depends on permission bits, not ownership
- Non-root containers often fail due to missing `chown`
- Always control UID/GID explicitly in images meant for Kubernetes