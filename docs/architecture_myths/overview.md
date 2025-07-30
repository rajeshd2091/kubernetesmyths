# Kubernetes Architecture Myths Overview

Kubernetes architecture is often perceived as a black box—with terms like "control plane," "kubelet," and "scheduler" thrown around without deep clarity. This section tackles myths rooted in these components, where surface-level understanding leads to poor design choices and debugging frustrations.

From misunderstanding how the scheduler works to misattributing responsibilities between components like the kube-apiserver and kubelet, these myths expose critical gaps in architectural knowledge.

By busting these myths, we aim to deepen your mental model of Kubernetes and help you design more reliable, secure, and efficient clusters.

## Subtopics

- [Myth 1: Kubelet is Exclusive to Worker Nodes](Myth1_Kubelet_is_Exclusive_to_Worker_Nodes.md)  
- [Myth 2: Kubernetes Clusters Can't Function Without Kube-Proxy](Myth2_Kubernetes_Clusters_Can't_Function_Without_Kube-Proxy.md)  
- [Myth 3: Kubernetes Networking Works Fine Without a CNI Plugin](Myth3_Kubernetes_Networking_Works_Fine_Without_a_CNI_Plugin.md)
- [Myth 4: Control Plane Nodes Don’t Need a Container Runtime](Myth4_Control_Plane_Nodes_Don’t_Need_a_Container_Runtime.md)
