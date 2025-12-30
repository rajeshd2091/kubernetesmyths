---
sidebar_position: 1
---
# Myth: Helm Charts Deploy Kubernetes Resources in Any Order

During a Helm upgrade, a Deployment failed with a ServiceAccount not found error.
The immediate assumption was that Helm had applied resources in the wrong order.

Further investigation showed the ServiceAccount had been manually deleted earlier, causing cluster drift.
Helm still believed the resource existed based on its release state and proceeded correctly.

Helm did not deploy resources randomly—the failure was due to missing runtime state, not ordering.

### Why This Myth Exists?

This myth exists for a few common reasons:

- People assume file order equals apply order
- YAML files inside a chart appear independent
- Failures are blamed on Helm instead of Kubernetes reconciliation
- Readiness is confused with creation order
- Because Helm is often described as “just a template engine,” its internal logic is underestimated.

### The Reality

Helm does not deploy resources in a random order.

Helm applies Kubernetes manifests in a deterministic, predefined order based on resource kind, not file order and not template order.

This ordering logic is hardcoded inside Helm.

**Simplified Helm Install Order**

Helm applies resources roughly in the following sequence:

1. Namespace
2. NetworkPolicy
3. ResourceQuota
4. LimitRange
5. PodSecurityPolicy
6. PodDisruptionBudget
7. ServiceAccount
8. Secret
9. SecretList
10. ConfigMap
11. StorageClass
12. PersistentVolume
13. PersistentVolumeClaim
14. CustomResourceDefinition
15. ClusterRole
16. ClusterRoleList
17. ClusterRoleBinding
18. ClusterRoleBindingList
19. Role
20. RoleList
21. RoleBinding
22. RoleBindingList
23. Service
24. DaemonSet
25. Pod
26. ReplicationController
27. ReplicaSet
28. Deployment
29. HorizontalPodAutoscaler
30. StatefulSet
31. Job
32. CronJob
33. Ingress
34. APIService
35. MutatingWebhookConfiguration
36. ValidatingWebhookConfiguration

This guarantees that foundational resources exist before dependent ones are created.

However, this ordering only guarantees creation, not readiness.

### Experiment & Validate

You can validate Helm’s ordering behavior with a simple experiment:

**Step 1: Create a chart with**

- ConfigMap
- ServiceAccount
- Deployment

**Step 2: Place templates in random file order**

**Step 3: Run**

```bash
helm install --debug --dry-run
```

**Step 4: Observe the rendered output**

You will see:

- Resources sorted by kind
- Deployment rendered after ConfigMaps and ServiceAccounts
- File order has no effect

This proves Helm ordering is deterministic and intentional.

### Key Takeaways
- Helm does not deploy resources randomly
- Resource order is based on kind, not files
- Ordering guarantees creation, not readiness
- Helm is not a dependency manager
- Runtime coordination belongs to Kubernetes, not Helm