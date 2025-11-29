# Kubernetes Workload Myths

Deploying workloads in Kubernetes may seem straightforward—but lurking underneath are subtle behaviors that often surprise even experienced engineers.

This section dives into common misconceptions around Pods, Deployments, StatefulSets, Jobs, and DaemonSets. Misunderstanding how these controllers behave can lead to reliability issues, scaling problems, and unexpected restarts in production.

By exposing these myths, we help you design resilient, predictable workloads that behave as intended under real-world pressure.

## Myths

- [Complete application can be rolled back in Kubernetes](Complete_application_can_be_rolled_back_in_Kubernetes.md)  
- [Rolling Updates Are Only Supported by Deployments](Rolling_Updates_Are_Only_Supported_by_Deployments.md)  
- [DaemonSet always schedule pods on all nodes](DaemonSet_always_schedule_pods_on_all_nodes.md)  
- [Deployment Supports All Pod Restart Policies](Deployment_Supports_All_Pod_Restart_Policies.md)
- [Kubernetes automatically roll back failed Deployment](Kubernetes_automatically_roll_back_failed_deployment.md)
- [Kubernetes always injects information about Services into a Pod](K8s_Injects_Svc_Info_Into_A_Pods_Env_Var.md) 
- All Pods are created through the API server
- Every Kubernetes Pod must have a ServiceAccount assigned
- Init containers can run in any sequence or even in parallel
- Deployments directly create and manage Pods
- Kubernetes automatically deletes older ReplicaSets created by Deployments
