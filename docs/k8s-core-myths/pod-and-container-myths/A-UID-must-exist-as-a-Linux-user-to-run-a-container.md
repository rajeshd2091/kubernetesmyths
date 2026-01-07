---
sidebar_position: 9
---
# Myth: A UID must exist as a Linux user to run a container

While testing a new pod deployment, I set:

```yaml
securityContext:
  runAsUser: 1998
```

The image did not contain a user with UID 1998, and there was no corresponding username in `/etc/passwd`.

Intuitively, I expected the pod to fail. Surprisingly:

- The pod was created successfully

- The container started without any error

- Commands like `id` inside the container showed UID 1998

- Tools like `whoami` returned unknown uid 1998

The initial confusion was natural: **“If the user doesn’t exist, how is the process even running?”**


### Why This Myth Exists?

- Traditional Linux mental models tie users to processes.

- People assume that missing `/etc/passwd` entries mean the process cannot start.

In reality, the kernel cares only about numeric UIDs. Usernames are merely convenience metadata used by applications or shell tools.

### The Reality:

Kubernetes passes the numeric UID to the container runtime.

The Linux kernel executes the process based purely on the UID number.

The UID does not need a corresponding username inside the container.

Applications or tools that rely on usernames (e.g., whoami) may fail, but the process itself runs normally.

**Linux executes numbers, not names — Kubernetes leverages this fact.**


### Experiment & Validate

**Step 1: Create the Pod**

```yaml
# pod-uid-test.yaml
apiVersion: v1
kind: Pod
metadata:
  name: uid-test-pod
spec:
  containers:
  - name: test-container
    image: docker.io/library/alpine:3.18
    command: ["sleep", "3600"]
    securityContext:
      runAsUser: 1998   # UID that does not exist
```

Apply it:

```bash
kubectl apply -f pod-uid-test.yaml
```


**Step 2: Verify the pod is running**

```bash
kubectl get pods uid-test-pod
```

Expected Output:


```bash
NAME            READY   STATUS    RESTARTS   AGE
uid-test-pod    1/1     Running   0          10s
```

The pod starts successfully despite UID 1998 not existing in `/etc/passwd`.

**Step 3: Inspect the container process**

```bash
ps -ef | grep sleep
```

Expected Output:

```bash
1998      1234     1  0 12:34 ?        00:00:00 sleep 3600
```

**Step 4: Inspect user inside the container**

Inside the container:

```bash
kubectl exec uid-test-pod -- ps aux
```

Expected Output:

```bash
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
1998     1234  0.0  0.0  12345  1234 ?        Ss   12:34   0:00 sleep 3600
```

Inside the container:

```bash
kubectl exec -it uid-test-pod -- sh
```

Execute:

```bash
id
# uid=1998 gid=0 groups=0

whoami
# whoami: unknown uid 1998
```
The process runs with UID 1998

No username exists for UID 1998

Linux executes numeric UIDs directly

### Key Takeaways

- Kubernetes pods accept numeric UIDs even if they don’t exist in the image

- Containers run successfully with arbitrary numeric UIDs

- Usernames are optional; missing users affect tools, not process execution

- This behavior allows distroless images, scratch images, and secure multi-tenant deployments