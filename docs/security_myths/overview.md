# Kubernetes Security Myths

Kubernetes security is often misunderstood, not because the platform is insecure, but because its design principles differ from traditional infrastructure and application security models. Many teams assume Kubernetes automatically provides strong isolation, network safety, secure defaults, or hardened workloads. In reality, Kubernetes only offers building blocks—misinterpreting these building blocks leads to configuration gaps, risky deployments, and a false sense of security.

This section examines the most common security-related misconceptions that lead to real-world vulnerabilities. Each myth is broken down using practical examples, technical explanations, and reproducible experiments. The goal is to clarify how Kubernetes security actually works, where responsibilities lie, and what assumptions commonly break secure-by-default thinking.

By understanding and correcting these myths, engineers can avoid design flaws, reduce attack surfaces, and build security controls aligned with how Kubernetes truly operates.

## Myths

- Kubernetes Service Accounts Pull Container Images
- Kubernetes Always Injects the Default Service Account Into Every Pod
