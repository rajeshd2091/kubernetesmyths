---
sidebar_position: 4
---
# Myth: Pod Security Admission enforces security on running Pods

During a production security review, a team proudly stated:

*“We’ve enabled Pod Security Admission with restricted mode. All insecure Pods are blocked now.”*

Out of curiosity, we listed running Pods across namespaces—and found multiple Pods still running with:

  - privileged: true

  - hostPath mounts

  - hostNetwork: true

When asked why those Pods still existed, the answer was simple and confident:

*“PSA will take care of them.”*

That assumption is far more common than people realize.

### Why This Myth Exists?
1. The word “enforces” is misleading

    Enforcement sounds continuous, but PSA enforcement is event-based, not runtime-based.

2. Confusion with runtime security tools

    Tools like Falco, SELinux, AppArmor, or eBPF-based detectors act at runtime. PSA does not.

3. Pod Security Policy (PSP) legacy expectations
  
    PSP was often misunderstood as a runtime control, and that misconception carried over.

4. Lack of visibility into admission controllers
  
    Admission controllers operate only during API requests, which many users never see directly.


### The Reality:

**Pod Security Admission only evaluates Pod specifications during API server admission events.**

That means:

  - It runs only when a Pod is created or updated

  - It does not monitor, mutate, restart, or kill running Pods

  - Existing Pods are completely ignored unless they are recreated

If a Pod was created before PSA enforcement was enabled, it will:

  - Continue running

  - Keep all its privileges

  - Remain unaffected indefinitely

PSA answers only one question:

*“Should this Pod spec be allowed to enter the cluster right now?”*

It does not answer:

  - “Is this Pod safe at runtime?”

  - “Is this Pod still compliant?”

  - “Should this Pod be stopped?”

### Experiment & Validate

**Step 1: Create an insecure Pod before PSA enforcement**


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: privileged-pod
spec:
  containers:
  - name: app
    image: nginx
    securityContext:
      privileged: true
```

Apply it:

```sh
kubectl apply -f pod.yaml
```

The Pod runs successfully.

**Step 2: Enable Pod Security Admission (restricted)**

```bash
kubectl label namespace default \
  pod-security.kubernetes.io/enforce=restricted
```

The Pod will now successfully pull the image and start, proving that registry authentication depends on imagePullSecrets, not ServiceAccount permissions.

**Step 3: Observe the existing Pod**

```bash
kubectl get pod privileged-pod
```

Result:

- Pod is still Running

- No warning

- No eviction

- No enforcement action

**Step 4: Try creating the same Pod again**

```bash
kubectl delete pod privileged-pod
kubectl apply -f pod.yaml
```

Now it fails:

```sh
Error: violates PodSecurity "restricted": privileged containers are not allowed
```

This confirms:

- PSA blocks new requests

- PSA ignores existing runtime state

### Key Takeaways
- Pod Security Admission  is not a runtime security mechanism

- It does not enforce security on running Pods

- Existing Pods remain untouched until recreated

- PSA is a preventive guardrail, not a corrective system

- Runtime security requires additional tools beyond PSA