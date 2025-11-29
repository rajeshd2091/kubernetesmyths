# Myth: Kubernetes Service Accounts Pull Container Images
During internal security audits and team discussions, several engineers assumed that ServiceAccounts were used to authenticate with container registries. One developer even tried granting additional RBAC permissions to a ServiceAccount in an attempt to fix an image-pull failure from a private registry. The issue persisted, and only later did the team realize that the ServiceAccount had no role in image retrieval at all. The failure was caused by missing imagePullSecrets, not ServiceAccount permissions.

### Why This Myth Exists?
This misconception commonly arises because of two overlapping facts:

- **ServiceAccounts can be linked to imagePullSecrets.** When engineers attach registry credentials to a ServiceAccount, it creates an impression that the ServiceAccount is the entity responsible for authenticating and pulling images.

- **ServiceAccount tokens are automatically mounted into Pods.** Since these tokens provide authentication to the Kubernetes API server, developers assume they might also be used for authenticating with container registries.

Both features involve authentication, but they serve different purposes, leading to widespread confusion.


### The Reality:
A Kubernetes ServiceAccount has absolutely no role in pulling container images.

Image pulling is performed entirely by the container runtime (containerd, CRI-O, or Docker) running on the worker node.

Here is the actual sequence:

1. A Pod is scheduled onto a node.

2. Kubelet verifies whether the required image exists locally.

3. If the image is missing, Kubelet instructs the container runtime to pull it using the Container Runtime Interface (CRI).

4. The container runtime performs registry authentication using the credentials provided in imagePullSecrets.

5. Once authenticated, the runtime downloads, stores, and unpacks the image before starting the container.

The ServiceAccount is not consulted at any point in this workflow. It is solely used for Pod-to-API-server authentication.

### Experiment & Validate
**Step 1. Create a Pod using a private image without imagePullSecrets**

Use a private image and do not specify any imagePullSecrets:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-no-creds
spec:
  containers:
    - name: app
      image: my-private-registry.com/app:v1
```

Observe the Pod state:

```sh
kubectl describe pod test-no-creds
```

You will see events such as:
```sh
Failed to pull image "my-private-registry.com/app:v1": authentication required

```
Notice that RBAC permissions on the ServiceAccount do not affect this result.

**Setp 2. Attach imagePullSecrets directly to the Pod**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-with-creds
spec:
  containers:
    - name: app
      image: my-private-registry.com/app:v1
  imagePullSecrets:
    - name: my-registry-secret

```

The Pod will now successfully pull the image and start, proving that registry authentication depends on imagePullSecrets, not ServiceAccount permissions.

**Setp 3. Attach imagePullSecrets to a ServiceAccount**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-sa
imagePullSecrets:
  - name: my-registry-secret

```
and then:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-using-sa
spec:
  serviceAccountName: my-sa
  containers:
    - name: app
      image: my-private-registry.com/app:v1
```
The Pod succeeds—but the authentication still happens exclusively through the imagePullSecret, not through the ServiceAccount token.

The ServiceAccount merely references the secret; it never interacts with the container registry.

### Key Takeaways
- ServiceAccounts do not pull container images.

- The container runtime on the node is solely responsible for pulling images.

- Kubelet only instructs the runtime; it does not authenticate with registries.

- Private images require imagePullSecrets, not ServiceAccount permissions.

- ServiceAccounts authenticate Pods to the Kubernetes API server, not to container registries.