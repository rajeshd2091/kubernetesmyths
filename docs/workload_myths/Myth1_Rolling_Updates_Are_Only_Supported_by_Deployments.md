# Myth 1: Rolling Updates Are Only Supported by Deployments
Many believe that rolling updates are an exclusive feature of Kubernetes Deployments. This assumption leads to the misconception that StatefulSets and DaemonSets do not support rolling updates, forcing teams to use workarounds. But is this really the case?

### Why This Myth Exists?
1. Deployments are widely documented for rolling updates, making them the most well-known approach.
2. Lack of awareness about update strategies in other controllers like StatefulSets and DaemonSets.
3. Confusion around update behavior—each controller has a different approach to handling updates.

### The Reality: 
Rolling Updates Extend Beyond Deployments. While Deployments use the default RollingUpdate strategy, StatefulSets and DaemonSets also support rolling updates—but with different behaviors.
- Deployments: Roll updates across Pods gradually using RollingUpdate strategy.
- StatefulSets: Follow a rolling update pattern but update one Pod at a time in order.
- DaemonSets: Perform rolling updates but have different scheduling constraints, ensuring Pods are only running on specific nodes.

### Experiment & Validate
Let’s look at a rolling update example for each controller.
#TODO - Need to add proper example

### Key Takeaways
- **Rolling updates are not exclusive to Deployments**—StatefulSets and DaemonSets also support them.
- **Each controller has a different update pattern**—understanding them prevents unexpected behavior.
- **Kubernetes ensures updates happen safely**—but choosing the right approach matters!