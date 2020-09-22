---
title: "Nodes"
keywords: "kubernetes, kubesphere, taints, nodes, labels, requests, limits"
description: "Kubernetes Nodes Management"

linkTitle: "Nodes"
weight: 200
---

Kubernetes runs your workload by placing containers into Pods to run on Nodes. A node may be a virtual or physical machine, depending on the cluster. Each node contains the services necessary to run Pods, managed by the control plane. 

## Nodes Status

Cluster nodes are only accessible to cluster administrators. Administrators can find cluster nodes page by _Cluster Adminstration_ -> _Nodes_ -> _Cluster Nodes_ . Some node metrics are very important to clusters, its administrators' responsibilities to watch over these numbers to make sure nodes are available.

![Node Status](/images/docs/cluster-administration/node_status.png)

- **Status** : Node current status, indicate node is available or not.  
- **CPU** : Node current cpu usage, these values are real-time numbers.  
- **Memory** : Current memory usage, same with _CPU_ stats, are also real-time numbers.  
- **Allocated CPU** : Calculated from summing up all pods cpu requests on this node, means how much amount of CPU reserved for workloads on this node, even workloads are using less CPU resource. This metric is vital to kubernetes scheduler, kube-scheduler will favor lower _Allocated CPU_ usage nodes when scheduling a pod in most cases. For more details, refer to [manage resources containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).  
- **Allocated Memory** : Calculated from summing up all pods memory requests on this node. Same with _Allocated CPU_.

> **Note:** _CPU_ and _Allocated CPU_ are differ in most of times, so is memory, this is normal. As a cluster administrator, should focus on both kind of metrics instead of just one. It's always a good practice to set resources requests and limits for each pod to match the their real usage. Over allocating can lead to low cluster utilization, otherwise can lead to high pressure on cluster, and even cluster unhealthy.

## Nodes Management


![Node Detail](/images/docs/cluster-administration/node_detail.png)

- **Cordon/Uncordon** : Marking a node as unschedulable are very useful during a node reboot or othere maintenance. The kubernetes scheduler will not schedule new pods to this node if it's been marked unschedulable, but does not affect existing workloads already on this Node. In KubeSphere, you mark a node as unschedulable by click button _Cordon_ in node detail page, node will be schedulable again if click the button again.

- **Labels** : Node labels can be very useful when you want to assign pods to specific nodes. Label the nodes first, for example, label GPU nodes with label `node-role.kubernetes.io/gpu-node`, and then when create workloads with the label `node-role.kubernetes.io/gpu-node` you can assign pos to gpu node explictly.

![Label Node](/images/docs/cluster-administration/label_node.png)

![Assign pods to nodes](/images/docs/cluster-administration/assign_pods_to_nodes.png)

- **Tainits** : Taints allow node to repel a set of pods, [taints and tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/). You can add or remove node taints in node detail page, but be careful, taints can cause unexpected behavior may lead to service unavailable.

- **Add/Remove Nodes** : Currently, you can't add/remove nodes directly in KubeSphere console, but you can do it by using _[KubeKey](https://github.com/kubesphere/kubekey)_ . The following guides will show you how.
    - [Add Nodes](/docs/installing-on-linux/cluster-operation/add-new-nodes/) 
    - [Remove Nodes](/docs/installing-on-linux/cluster-operation/remove-nodes/)