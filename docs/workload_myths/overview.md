# Kubernetes Workload Myths Overview

Deploying workloads in Kubernetes may seem straightforward—but lurking underneath are subtle behaviors that often surprise even experienced engineers.

This section dives into common misconceptions around Pods, Deployments, StatefulSets, Jobs, and DaemonSets. Misunderstanding how these controllers behave can lead to reliability issues, scaling problems, and unexpected restarts in production.

By exposing these myths, we help you design resilient, predictable workloads that behave as intended under real-world pressure.

## Subtopics

- [Myth 1: Rolling Updates Are Only Supported by Deployments](Myth1_Rolling_Updates_Are_Only_Supported_by_Deployments.md)  
- [Myth 2: DaemonSet always schedule pods on all nodes](Myth2_DaemonSet_always_schedule_pods_on_all_nodes.md)  
- [Myth 3: Deployment Supports All Pod Restart Policies](Myth3_Deployment_Supports_All_Pod_Restart_Policies.md)
- [Myth 4: Deployment Automatically Roll Back on Failure](Myth4_Deployments_Automatically_Roll_Back_on_Failure.md)
- [Myth 5: Kubernetes always injects information about Services into a Pod](Myth5_K8s_Injects_Svc_Info_Into_A_Pods_Env_Var.md) 
