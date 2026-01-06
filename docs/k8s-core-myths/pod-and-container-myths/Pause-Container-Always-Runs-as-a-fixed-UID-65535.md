---
sidebar_position: 8
---
# Myth: Pause Container Always Runs as a fixed UID(65535)

While inspecting host-level processes for a Pod with two containers, the following output was observed:

```bash
65535  19393  19368  /pause
root   19417  19368  sleep 3600
root   19450  19368  sleep 7200
```

At first glance, this reinforced a commonly held belief:

- Pause container runs as UID 65535 (nobody)



### Why This Myth Exists?

This myth exists due to a combination of factors:

1. Modern pause images default to non-root

    - Recent Kubernetes pause images specify USER 65535

    - This creates the impression of a hard guarantee

2. Pause container is treated as “special”

    - Engineers assume pause ignores Pod-level security settings

    - Its infrastructure role leads to false assumptions

3. Lack of API guarantees

    - Kubernetes documentation does not explicitly describe pause container UID behavior

    - Observed behavior is mistaken for specification


### The Reality:

The pause container **does not have a fixed UID.**

More precisely:

- The pause container is a normal container created as part of the Pod sandbox

- Pod-level securityContext applies to all containers in the Pod

- If runAsUser is defined at the Pod level, the pause container inherits it

The pause container UID is therefore:

Often 65535 by default

But can change when Pod security context is configured

This behavior is by design, not a bug.

Kubernetes guarantees uniform application of Pod-level security context, not a fixed pause container identity.


### Experiment & Validate

**Step 1: Pod without `runAsUser`**

```yaml
spec:
  containers:
  - name: app
    image: busybox
    command: ["sleep", "3600"]
```

Host view:

```bash
65535  /pause
0      sleep 3600
```


**Step 2: Pod with Pod-level `runAsUser`**

```yaml
spec:
  securityContext:
    runAsUser: 1000
  containers:
  - name: app
    image: busybox
    command: ["sleep", "3600"]
```

Host view:

```bash
1000  /pause
1000  sleep 3600

```

The pause container UID changes along with the Pod security context.

### Key Takeaways

- Kubernetes does not guarantee the UID of the pause container

- UID 65535 is a default implementation choice, not a contract

- Pause container inherits Pod-level securityContext

- Security assumptions must never rely on pause container UID 

- Pause container behavior may change across:

  - Kubernetes versions

  - runtimes

  - distributions