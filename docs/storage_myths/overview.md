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

- [Myth 1: K8s Cluster can have only one default Storage Class](Myth1_Kubernetes_Cluster_Can_Have_Only_One_Default_StorageClass.md)  
- [Myth 2: `ReadWriteOnce` mode allows only a single Pod to access the volume](Myth2_ReadWriteOnce_mode_allows_only_a_single_Pod_to_access_the_volume.md)