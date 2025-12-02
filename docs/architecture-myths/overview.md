---
id: overview
title: Overview
sidebar_label: Overview
sidebar: architectureSidebar
sidebar_position: 1
---
# Kubernetes Architecture Myths

Kubernetes architecture is often perceived as a black box—with terms like "control plane," "kubelet," and "scheduler" thrown around without deep clarity. This section tackles myths rooted in these components, where surface-level understanding leads to poor design choices and debugging frustrations.

From misunderstanding how the scheduler works to misattributing responsibilities between components like the kube-apiserver and kubelet, these myths expose critical gaps in architectural knowledge.

By busting these myths, we aim to deepen your mental model of Kubernetes and help you design more reliable, secure, and efficient clusters.

## Myths

- [Kubelet is Exclusive to Worker Nodes](Kubelet_is_Exclusive_to_Worker_Nodes)  
- [Kubernetes Clusters Can't Function Without Kube-Proxy](Kubernetes_Clusters_Can't_Function_Without_Kube-Proxy)  
- [Kubernetes Networking Works Fine Without a CNI Plugin](Kubernetes_Networking_Works_Fine_Without_a_CNI_Plugin)
- [Control Plane Nodes Don’t Need a Container Runtime](Control_Plane_Nodes_Don’t_Need_a_Container_Runtime)
- A Kubernetes Cluster Must Have Three Control Plane Nodes
