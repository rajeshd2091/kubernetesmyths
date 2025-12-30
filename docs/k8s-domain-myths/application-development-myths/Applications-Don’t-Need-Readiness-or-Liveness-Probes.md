---
sidebar_position: 2
---
# Myth: Applications Don’t Need Readiness or Liveness Probes

A team deployed a microservice without readiness or liveness probes. In production, Pods started receiving traffic before fully initializing, causing immediate 500 errors. One Pod even hung during startup, but Kubernetes didn’t restart it because there was no liveness probe.

The result: a visible outage lasting over an hour. All of it could have been prevented with proper health probes.

### Why This Myth Exists?

- Developers come from VM-era environments where processes were long-lived

- They assume Kubernetes automatically knows if an app is healthy

- Health checks seem “extra work” during development

The underlying idea: “The app either works or it doesn’t. Kubernetes doesn’t need to know.”

### The Reality

**Readiness probes** control whether a Pod receives traffic. Without them:

- New Pods might receive traffic before fully initialized
- Rolling updates may fail silently

**Liveness probes** detect crashed or hung containers. Without them:

- Pods can remain in a broken state indefinitely
- Crash loops may not be detected in time

*Kubernetes does not assume your application is healthy — you must tell it explicitly.*

### Experiment & Validate

**Step 1: Deploy a Pod Without Probes**

```shell
kubectl run probe-demo --image=nginx --port=80 --labels app=probe-demo
```

Simulate slow startup by adding sleep in entrypoint (if possible).

**Step 2: Expose a Service**

```shell
kubectl expose pod probe-demo --port=80 --target-port=80 --name=probe-demo-svc
```

**Step 3: Test Access Immediately**

```shell
curl <service-ip>
```


Observation: Pod receives traffic even if it’s not ready, possibly causing errors if initialization isn’t complete.

**Step 4: Add a Readiness Probe**

```yaml
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 10
``` 

Apply it:

```shell
kubectl apply -f probe-demo.yaml
```     

Observation: Pod only receives traffic after becoming ready. Traffic is blocked during initialization.

**Step 5: Add a Liveness Probe**

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 5
```

Observation: If the Pod hangs, Kubernetes automatically restarts it, preventing long outages.


### Key Takeaways

- Readiness and liveness probes are critical for production reliability

- Never assume Kubernetes can detect application failure automatically

- Readiness controls traffic routing;   liveness controls self-healing

- Missing probes can cause outages, failed rollouts, or silent failures