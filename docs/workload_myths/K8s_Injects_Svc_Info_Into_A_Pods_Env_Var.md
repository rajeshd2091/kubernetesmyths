# Myth: Kubernetes always injects information about Services into a Pod

I was attending a free Kubernetes webinar where the speaker was walking through service discovery patterns.
At one point, he confidently said:

```Don’t worry, we can just read the service IP from the pod’s environment variables — Kubernetes puts it there by default.```

That statement sounded comforting — especially for teams coming from legacy environments where service discovery needs extra tooling.


### Why This Myth Exists?
1. In early Kubernetes versions, service environment variables were one of the primary methods for service discovery.

2. Documentation and tutorials often reference `MY_SERVICE_SERVICE_HOST`, `MY_SERVICE_PORT`, etc. — and developers assumed they always exist.


### The Reality:
Kubernetes only injects environment variables for services that already exist at the time the pod is created.

- If a Service is created after a Pod starts → No env variables are injected.

- If `enableServiceLinks = false`, Service information is not injected into Pod as environment variables

- If a Pod is restarted after the Service exists → Then env vars appear.

- Headless Services (ClusterIP: None) do not get env vars injected.

For dynamic environments, DNS-based service discovery (<service-name>.<namespace>.svc.cluster.local) is the reliable method — not env vars.

###  Experiment & Validate

**Step1: Create a pod before the service**

```kubectl run test-pod --image=busybox -it --restart=Never -- sh```

Inside the pod, try to check the environment

```env | grep MYAPP```

**Step2: Now create the service**

```kubectl expose pod test-pod --port=8080 --name=myapp```

 Back to pod — still no env vars injected

**Step3:  Delete and recreate the pod**

```sh
kubectl delete pod test-pod

kubectl run test-pod --image=busybox -it --restart=Never -- sh
```

Now run:

```env | grep MYAPP``

You’ll now see:

```sh

MYAPP_SERVICE_PORT=8080
MYAPP_SERVICE_HOST=10.97.212.84 #Some random IP
```

Also try with a headless service and observe that no env vars get injected.



### Key Takeaways
- Kubernetes injects service env vars only at pod creation time, not dynamically.

- Pods won’t auto-update their env vars if a Service is created later.

- Headless services do not inject env vars at all.

- Always use Cluster DNS names for robust service discovery.
