# Kubernetes Networking Myths

Networking in Kubernetes often feels like magic—until it breaks.

This section uncovers common misconceptions about how networking works inside a cluster. From Pod-to-Pod communication and Services to DNS, Network Policies, and CNI plugins, these myths reveal gaps that lead to confusing outages, misconfigured policies, and insecure setups.

Whether you're debugging traffic issues or designing multi-tenant clusters, busting these myths will sharpen your understanding of Kubernetes networking internals.

## Myths

- [kube-proxy assign IP address to Pods](kube-proxy_assign_IP_address_to_Pods.md)  
- [ClusterIP Service is Only for Internal Traffic](ClusterIP_Service_is_Only_for_Internal_Traffic.md)  
- [ClusterIP Service Always Use Round-Robin Load Balancing](ClusterIP_Services_Always_Use_Round-Robin_Load_Balancing.md)
- ['kubectl port-forward svc' sends traffic to a service](kubectl_port-forward_svc_sends_traffic_to_a_service.md)
