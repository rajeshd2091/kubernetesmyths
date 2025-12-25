---
sidebar_position: 5
---
# Myth: Kubernetes Pods Always Need a Service Account

I’ve seen engineers argue that disabling Service Account tokens is unsafe because “pods need it to run.”

This confusion usually surfaces when teams start hardening clusters and notice that every pod automatically has a Service Account attached, even simple workloads like NGINX or batch jobs that never talk to the Kubernetes API.

The question then becomes:

If the pod doesn’t need API access, why does Kubernetes still attach a Service Account?

### Why This Myth Exists?

This myth exists because of Kubernetes’ secure-by-default behavior:

- Kubernetes automatically assigns a Service Account (default) to every pod.

- A token for that Service Account is mounted into the pod by default.

- From the outside, it looks like the Service Account is required for pod execution.

In reality, the pod is not using the Service Account unless it explicitly talks to the Kubernetes API.


### The Reality:

A Service Account is only required when a pod needs an identity to authenticate with the Kubernetes API server.

Examples include:

- Controllers managing Kubernetes resources

- Jobs fetching Secrets dynamically via the API

- Operators watching or modifying cluster objects

For workloads that do not interact with the API:

- The Service Account is never used

- The token is unnecessary

- Leaving it mounted increases the attack surface

Kubernetes assigns a Service Account to every pod to ensure:

- Consistent identity handling

- RBAC enforcement

- Secure defaults for workloads that might need API access


### Experiment & Validate

**Step 1: Create a Pod With Default Behavior**

This pod does not talk to the Kubernetes API.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: default-sa-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "sleep 3600"]
```
Apply it:

```sh
kubectl apply -f pod-default.yaml
```

Now inspect the Service Account token:

```sh
kubectl exec -it default-sa-pod -- ls /var/run/secrets/kubernetes.io/serviceaccount/
```

Expected Output:

```cpp
ca.crt
namespace
token
```

Kubernetes mounted a token even though the pod does nothing with it.


**Step 2: Prove the Pod Does NOT Use the Token**

Run any normal Linux command:

```sh
kubectl exec -it default-sa-pod -- echo "App is running"
```

Result:

```sh
App is running
```
No API access.
No authentication.
No Service Account usage.

**Step 3: Disable Token Mount at Pod Level**

Now create the same pod, but explicitly disable token mounting.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: no-token-pod
spec:
  automountServiceAccountToken: false
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "sleep 3600"]

```

Apply it:

```sh
kubectl apply -f pod-no-token.yaml
```

Verify token mount:

```sh
kubectl exec -it no-token-pod -- ls /var/run/secrets/kubernetes.io/serviceaccount/
```

Expected result:

```sh
ls: /var/run/secrets/kubernetes.io/serviceaccount/: No such file or directory
```

No token
Pod still runs
Workload is unaffected

### Key Takeaways

- Pods do not need a Service Account unless they access the Kubernetes API.

- Kubernetes assigns one by default to enforce secure-by-default identity handling.

- You cannot remove the Service Account object from a pod.

- You can remove its power by disabling token mounting.

- Disabling unused tokens is a simple and effective security hardening step.

- Always follow the principle of least privilege—even for identities you don’t actively use.