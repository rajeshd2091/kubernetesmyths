---
sidebar_position: 2
---
# Myth: Kubernetes Has Only One Pod Type
I’ve heard this many times in interviews:

*“A Pod is the smallest deployable unit in Kubernetes. There is only one Pod type.”*

The answer usually stops there.

This sounds correct at a conceptual level, but it hides an important internal distinction that becomes critical when debugging control plane issues, static workloads, or bootstrap failures.


### Why This Myth Exists?

- Kubernetes documentation focuses on the Pod abstraction, not its origin

- `kubectl get pods` shows all Pods uniformly

- Most engineers only interact with *API-created Pods*

- Static and mirror Pods are rarely discussed outside cluster internals

From a user perspective, Pods look identical.

Internally, they are not.


### The Reality:

Kubernetes has *multiple Pod types based on creation mechanism and source of truth.*

There are **three real Pod types** in Kubernetes:

**1. Regular Pods**

- Created via the **API Server**

- Stored in **etcd**

- Managed by controllers (Deployment, Job, DaemonSet, etc.)

- **API Server is the source of truth**

**2. Static Pods**

- Created directly by **the kubelet**

- Defined as YAML files on a node

- API Server is **not involved in creation**

- **kubelet is the source of truth**

**3. Mirror Pods**

- Created by **the kubelet**

- Exist only to represent static Pods in the API Server

- Read-only and immutable

- **kubelet remains the source of truth**


### Experiment & Validate

**Step 1. Create a static pod on a node**

Run this command on the node where kubelet is running

```yaml
mkdir -p /etc/kubernetes/manifests/
cat <<EOF >/etc/kubernetes/manifests/static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
  labels:
    role: myrole
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
EOF
```

**Step 2. Verify the Static Pod**

As Static pods are not directly visible to API server, we can not use kubectl commands

Run this command on the node where the kubelet is running

```sh
crictl ps
```

The output might be something like:

```sh
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

**Setp 3. Verify the Mirror Pod**

You can see the mirror Pod on the API server:

```sh
kubectl get pods

```
Output:

```sh
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

Note the Node name add to actual Pod name, it confirm, its not actual Static Pod but a Mirror Pod

### Key Takeaways
- Kubernetes does not have a single Pod type

- Pod behavior depends on who creates it

- API server and ETCD are not always the source of truth

- Static and mirror Pods explain many “undeletable Pod” mysteries

- Understanding Pod types is essential for cluster internals and debugging