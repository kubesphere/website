---
title: "Remove Nodes"
keywords: 'kubernetes, kubesphere, scale, add-nodes'
description: 'How to add new nodes in an existing cluster'


weight: 2345
---

## Cordon a Node

Similarly, if you need to cordon or suspend nodes in the cluster for some reasons, such as hardware upgrades, hardware maintenance, etc., you can choose **Nodes → Cluster Nodes** from the menu, then find a node you want to remove from the cluster and click the **Cordon** button.

![Cordon a Node](https://ap3.qingstor.com/kubesphere-website/docs/20200828232951.png)

## Delete a Node

You can delete the node by the following command:

```
./kk delete node <nodeName> -f config-sample.yaml
```
