---
sidebar_position: 2
---
# Myth: EKS Control Plane Performance Can’t Be Tuned

During interviews and discussions with cloud engineers, this statement comes up frequently. Many teams running EKS clusters experience throttling on the Kubernetes API server or delays in pod creation and assume there is nothing they can do — after all, AWS fully manages the control plane.

Early EKS users often hit these limits and believed the performance was entirely out of their control.

### Why This Myth Exists?

- **AWS-managed control plane**: AWS handles the control plane, including API server, scheduler, and etcd. Engineers cannot modify these components directly.

- **Lack of early tuning options**: Historically, EKS offered only a single performance tier, so high API usage or large clusters could suffer throttling without any knobs for adjustment.

- **Perception gap**: Teams compare EKS with self-managed Kubernetes, where you can tune etcd, API servers, and scheduler parameters.

### The Reality

Modern EKS offers control plane scaling tiers, which allow you to influence:

    - API server throughput
    - Concurrency limits
    - etcd performance

While you cannot directly tune internal components like etcd or scheduler flags, you can:

    - Choose higher-performance control plane tiers
    - Optimize workloads to reduce API server churn
    - Use client-side caching, informers, and rate limiting
    - Limit unnecessary CRD or status updates

This means the control plane is not entirely uncontrollable — you have both direct (scaling tier) and indirect (workload optimization) levers to improve performance.

### Experiment & Validate

You can validate this myth in a small cluster:

**Step 1: Create EKS Cluster with Custom Configuration**

When you create an EKS cluster, choose a custom configuration to enable control plane scaling tiers.

**Step 2: Enable Control Plane Scaling Tiers**

Use a scaling tier that matches your expected load. For example, if you expect high API server usage, choose the "XL" tier.

![EKS Control Plane Scaling Tiers](/img/k8s-platform-myths/eks_performance_mode.jpg)



### Key Takeaways
- EKS control plane is AWS-managed but not entirely uncontrollable.

- Control plane scaling tiers are your primary lever for direct performance improvements.

- Efficient API usage and workload optimization are crucial for avoiding throttling.

- Understanding these levers separates experienced Kubernetes engineers from casual users.