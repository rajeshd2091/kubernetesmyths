---
sidebar_position: 3
---
# Myth: GKE Clusters Without a Release Channel Are Never Auto-Upgraded

During a production incident review, a platform team noticed their GKE control plane version had changed—even though the cluster was explicitly created with **No Release Channel** and no upgrade job was scheduled.

The immediate assumption was:

*“Someone must have upgraded it manually.”*

Audit logs showed no such action.

This triggered a deeper question:

**Does ‘No Release Channel’ really mean no auto-upgrades?**

### Why This Myth Exists?

This myth exists because:

- GKE documentation states that release channels enable automatic upgrades

- The UI and CLI strongly imply:

    - Channel = auto-upgrade
    - No channel = manual control

- Many blog posts oversimplify this as:

    **“Disable release channel to fully control upgrades”**

What is often **not emphasized** is that **release channels control scheduled upgrades—not Google’s authority over cluster safety**.

### The Reality

Clusters without a release channel can still be auto-upgraded by GKE.

“No Release Channel” disables:

- Predictable
- Scheduled
- Channel-driven upgrades

It does not disable upgrades triggered by platform safety mechanisms.

GKE can force upgrades in the following situations:

- Kubernetes Version End-of-Life (EOL)

    - GKE does not allow clusters to run EOL Kubernetes versions    

    - When a version approaches or crosses EOL:

        - Control plane upgrades are enforced

        - Node pools may be upgraded automatically

This happens regardless of release channel configuration.

- Critical Security Vulnerabilities

    - For high or critical CVEs affecting:

        - API server
        - kubelet
        - etcd

    - Google may apply:

        - Emergency patches
        - Version upgrades

    These are security-mandated upgrades, not optional ones.

- Node Auto-Repair and Recreation

    - Even with no release channel: 

        - Auto-repair may recreate nodes
        - Recreated nodes may run a newer patch version

    - This often appears as an “unexpected upgrade”

    In reality, it is node replacement, not a scheduled upgrade.

- Node Pool Auto-Upgrade Settings

    - Node pools have independent flags:

        - management.autoUpgrade

    - Older clusters may still have this enabled

    - This setting works even without a release channel

### Experiment & Validate

**Step 1: Confirm No Release Channel**

```bash
gcloud container clusters describe CLUSTER_NAME \
  --region REGION \
  --format="value(releaseChannel.channel)"
```

If empty - No release channel.

**Step 2: Check Node Pool Auto-Upgrade**

```bash
gcloud container node-pools describe NODE_POOL \
  --cluster CLUSTER_NAME \
  --region REGION \
  --format="value(management.autoUpgrade)"
```

If true - node upgrades may still occur.


### Key Takeaways
- “No Release Channel” disables scheduled upgrades, not forced upgrades

- GKE retains authority for:

    - Security
    - Stability
    - Version lifecycle enforcement

- Absolute immutability of Kubernetes versions does not exist in managed services

- Platform engineers must plan for forced upgrades, even in manual clusters