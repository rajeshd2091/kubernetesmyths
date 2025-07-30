# Kubernetes Storage Myths Overview

In Kubernetes, compute may steal the spotlight — but persistent storage is what truly powers workloads.

From databases to logs, caches to backups, storage is a foundational layer that often gets abstracted away, leading to confusion, poor design decisions, and long-term operational pain.

Unlike traditional VMs or monolithic servers, Kubernetes operates in a dynamic, ephemeral environment:

- Pods are rescheduled.

- Nodes come and go.

- Volumes need to move with workloads.

This demands storage that’s dynamic, portable, and declarative — but also reliable, consistent, and secure.

Kubernetes addresses this through:

- PersistentVolumes (PV) and PersistentVolumeClaims (PVC)

- StorageClasses

- Dynamic provisioning

- CSI (Container Storage Interface)

But understanding these components is only half the battle. The rest is unlearning the myths.


## Myths

- [Myth 1: K8s Cluster can have only one default Storage Class](Myth1_Kubernetes_Namespaces_Provide_Complete_Isolation.md)  
- [Myth 2: `ReadWriteOnce` mode allow access to only single Pod](Myth2_Complete_application_can_be_rolled_back_in_Kubernetes.md)  
- [Myth 3: Kubernetes automatically roll back failed deployment](Myth3_Kubernetes_automatically_roll_back_failed_deployment.md)