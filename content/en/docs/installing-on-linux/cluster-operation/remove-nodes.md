---
title: "Remove Nodes"
keywords: 'kubernetes, kubesphere, scale, add-nodes'
description: 'How to add new nodes in an existing cluster'


weight: 2345
---

## Cordon a Node

Marking a node as unschedulable prevents the scheduler from placing new pods onto that Node, but does not affect existing Pods on the Node. This is useful as a preparatory step before a node reboot or other maintenance.

To mark a Node unschedulable, you can choose **Nodes → Cluster Nodes** from the menu, then find a node you want to remove from the cluster and click the **Cordon** button. It takes the same effect with the command `kubectl cordon $NODENAME`, you can see the [Kubernetes Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/) for more details.

![Cordon a Node](https://ap3.qingstor.com/kubesphere-website/docs/20200828232951.png)

{{< notice note >}}
Note: Pods that are part of a DaemonSet tolerate being run on an unschedulable Node. DaemonSets typically provide node-local services that should run on the Node even if it is being drained of workload applications.
{{</ notice >}}

## Delete a Node

You can delete the node by the following command:

```
./kk delete node <nodeName> -f config-sample.yaml
```
