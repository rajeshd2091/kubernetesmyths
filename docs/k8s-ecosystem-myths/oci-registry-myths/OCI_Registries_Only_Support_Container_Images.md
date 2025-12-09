---
sidebar_position: 1
---
# Myth: OCI Registries Only Support Container Images

During an internal platform engineering discussion, a developer challenged me:

“Why are you trying to push Helm charts and SBOMs to a container registry? Those registries are meant only for container images!”

This wasn’t the first time I’d heard this.
In interviews, I’ve repeatedly seen candidates confidently claim:

“Container registries store container images. Nothing else.”

But as teams adopt SBOMs, WASM modules, policy bundles, and more—this myth becomes dangerous because it blocks proper adoption of modern cloud-native practices.

### Why This Myth Exists?

1. **Docker made registries popular—but only for images.**

Early registry usage revolved around Docker images, so people simply assumed that’s all they store.

2. **Terminology confusion: “Container registry.”**

Many providers still call their service a container registry, misleading users.

3. **Lack of awareness about OCI Artifact Specification.**

Developers rarely read the OCI spec, and documentation of artifact support arrived much later.

4. **Old tooling didn’t support custom artifact types.**

Before ORAS and registry referrers, pushing non-image artifacts was clunky.

### The Reality

OCI Registries can store any OCI compliant artifact—not just container images.

This is because an OCI registry is a generic content-addressable storage system defined by the OCI Distribution Specification.

As long as an artifact can be represented as a blob + manifest, the registry can store it.

Here are examples of what OCI registries can store today:

- Container Images

- Helm Charts

- WASM modules

- SBOMs (CycloneDX, SPDX)

- Signatures (Cosign, Notary v2)

- Policy bundles (OPA, Kyverno)

- Scan results etc...

In reality, container images are just one of the many artifact types an OCI registry can hold.

### Experiment & Validate

**Step 1: Prerequisites**

- Install ORAS using https://oras.land/docs/installation 

- Create Dockerhub Repository

- Generate SBOM using syft

```bash
syft docker.io/rajeshd2090/java-spring-api:1.1 -o cyclonedx-json > 1.1-sbom.json

```

**Step 2: Login to Docker Hub**

```bash
docker login docker.io

```
ORAS uses Docker credentials to push artifacts. Use Docker Hub username and Personal Access Token (PAT) for authentication.

**Step 3: Push SBOM using ORAS**

```bash
oras push docker.io/rajeshd2090/java-spring-api:1.1-sbom \
     --artifact-type application/vnd.cyclonedx+json \
     1.1-sbom.json

```

Output:
```bash
✓ Exists    application/vnd.oci.empty.v1+json                                                                                             2/2  B 100.00%     0s
  └─ sha256:44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a                                                                                   
✓ Uploaded  1.1-sbom.json                                                                                                           3.61/3.61 MB 100.00%     3s
  └─ sha256:36c6a0417093bb29145b2f43222e42369b1ff45912a4b17b635f8f367bef5ebf                                                                                   
✓ Uploaded  application/vnd.oci.image.manifest.v1+json                                                                                592/592  B 100.00%     2s
  └─ sha256:6925df59907a7c8aa5e568637efdf3ac56c0f34623d0452953d8afc877343af2                                                                                   
Pushed [registry] docker.io/rajeshd2090/java-spring-api:1.1-sbom
ArtifactType: application/vnd.cyclonedx+json
Digest: sha256:6925df59907a7c8aa5e568637efdf3ac56c0f34623d0452953d8afc877343af2
```

### Key Takeaways
- An **OCI registry is no longer just a container registry**—it is a generic artifact registry.

- It supports **multiple artifact types**, not just images.

- OCI artifacts are standardized through the OCI Image and Distribution specifications.

- Modern tooling (ORAS, Cosign, Notary v2, Helm, Buildkit) fully leverages OCI artifact support.

- Treat your OCI registry as **a single source of truth** for all cloud-native artifacts (images, charts, SBOMs, signatures, policies, scan results, etc.).