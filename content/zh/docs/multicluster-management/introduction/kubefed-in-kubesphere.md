---
title: "Kubernetes Federation in KubeSphere"
keywords: 'kubernetes, kubesphere, multicluster, hybrid-cloud'
description: 'Overview'


weight: 2340
---

The multi-cluster feature relates to the network connection among multiple clusters. Therefore, it is important to understand the topological relations of clusters as the workload can be reduced.

Before you use the multi-cluster feature, you need to create a Host Cluster (hereafter referred to as **H** Cluster), which is actually a KubeSphere cluster that has enabled the multi-cluster feature. All the clusters managed by the H Cluster are called Member Cluster (hereafter referred to as **M** Cluster). They are common KubeSphere clusters that do not have the multi-cluster feature enabled. There can only be one H Cluster while multiple M Clusters can exist at the same time. In a multi-cluster architecture, the network between the H Cluster and the M Cluster can be connected directly or through an agent. The network between M Clusters can be set in a completely isolated environment.
