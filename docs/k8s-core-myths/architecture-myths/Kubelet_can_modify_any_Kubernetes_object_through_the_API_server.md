---
sidebar_position: 7
---

# Myth: Kubelet can modify any Kubernetes object through the API server

I’ve heard this statement multiple times in security reviews:

```sh
“If a node is compromised, the kubelet can just modify any object via the API server.”
```

This assumption usually leads to panic-driven designs, excessive isolation, or incorrect threat models.

So I went back to the Kubernetes source code and request flow to validate this claim.

### Why This Myth Exists?

1. Kubelet runs with high OS-level privileges

	- People assume OS power = API power

2. Old blog posts from pre–Node Authorizer era

3. Confusion between kubelet and kube-apiserver responsibilities

4. RBAC misconfigurations in some clusters

5. Lack of understanding of authn → authz → admission flow


### The Reality

Kubelet cannot modify arbitrary Kubernetes objects through the API server.

Its API access is intentionally narrow, scoped, and defensive.

Every kubelet request passes through:

1. **Authentication**

	- Kubelet authenticates using an x509 client certificate

	- Identity:

```sh
system:node:<node-name>
group: system:nodes
```

2. **Authorization (Node Authorizer)**

	- Enforces node-scoped and pod-scoped permissions

	- Kubelet can only access:

		- Its own Node object

		- Pods scheduled on itself

		- Secrets & ConfigMaps referenced by those pods

3. **Admission (Node Restriction Admission Controller)**

	- Prevents kubelet from:

		- Modifying pod spec fields

		- Creating arbitrary pods

		- Escalating labels, taints, or selectors

		- Acting outside its node boundary

### Experiment & Validate

**Step 1: Login to any worker node of your cluster**

```sh
ssh node1
```
**Step 2: List all scretes using kubelet config file**

```sh
kubectl --kubeconfig=/etc/kubernetes/kubelet.conf get secrets -A
```

Observe:

You will get below error:

```sh
Error from server (Forbidden): secrets is forbidden: User "system:node:demo-cluster-worker" cannot list resource "secrets" in API group "" at the cluster scope: can only read namespaced object of this type
```


### Key Takeaways
- Kubelet is powerful at the node level, not at the API level

- Kubernetes assumes node compromise is possible

- API-level blast radius is intentionally minimized

- Node Authorizer + Node Restriction are core Zero Trust controls
