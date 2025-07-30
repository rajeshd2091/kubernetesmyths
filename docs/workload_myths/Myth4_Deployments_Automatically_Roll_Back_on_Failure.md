# Myth 4: Deployments Automatically Roll Back on Failure
Have you ever assumed that a failed Deployment would automatically roll back to the last working version? Many believe that Kubernetes automatically detects a failed rollout and reverts to the previous version. However, this is not entirely true.

### Why This Myth Exists?
1. `kubectl rollout undo` exists, leading people to assume rollbacks are automatic.
2. Some CI/CD tools implement automatic rollback logic, making it seem like Kubernetes does it by default.
3. Kubernetes pauses a failed rollout but does not revert the change automatically.

### The Reality:
By default, Kubernetes does not automatically rollback a failed Deployment. Instead, it:
- Pauses the rollout if a newly updated pod crashes or fails health checks.
- Keeps old running pods unchanged, preventing further failures.
- Requires manual intervention to rollback or fix the issue.
###  Experiment & Validate
#TODO - Create deploy, update with wrong one, check rollout status , manually revert
### Key Takeaways
- Kubernetes does not auto-rollback failed Deployments.
- It pauses rollouts, but you must manually trigger a rollback.
- Use health checks and CI/CD automation to enable safer rollbacks.
