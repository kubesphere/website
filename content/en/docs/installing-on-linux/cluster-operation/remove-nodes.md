---
title: "Remove Nodes"
keywords: 'Kubernetes, KubeSphere, scale, remove-nodes'
description: 'How to remove nodes from an existing cluster.'

weight: 4420
---

## Cordon a Node

Marking a node as unschedulable prevents the scheduler from placing new pods onto that node while not affecting existing Pods on the node. This is useful as a preparatory step before a node reboot or other maintenance.

To mark a node unschedulable, you can choose **Cluster Nodes** under **Nodes** from the left menu, find a node you want to remove from the cluster, and click the **Cordon** button. Alternatively, you can run the command `kubectl cordon $NODENAME` directly. See [Kubernetes Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/) for more details.

![Cordon a Node](https://ap3.qingstor.com/kubesphere-website/docs/20200828232951.png)

{{< notice note >}}
Pods that are part of a DaemonSet tolerate being run on an unschedulable node. DaemonSets typically provide node-local services that should run on the node even if it is being drained of workload applications.
{{</ notice >}}

## Delete a Node

You can delete the node using [KubeKey](https://github.com/kubesphere/kubekey) by the following command. The `config-sample.yaml` file is the one created when you [set up the cluster](../../introduction/multioverview/).

```bash
./kk delete node <nodeName> -f config-sample.yaml
```
