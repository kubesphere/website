---
title: "KubeSphere Federation"
keywords: 'Kubernetes, KubeSphere, federation, multicluster, hybrid-cloud'
description: 'Overview'
linkTitle: "KubeSphere Federation"
weight: 5120
---

The multi-cluster feature relates to the network connection among multiple clusters. Therefore, it is important to understand the topological relations of clusters.

## How the Multi-Cluster Architecture Works

Before you use the central control plane of KubeSphere to management multiple clusters, you need to create a Host Cluster, also known as **H** Cluster. The H Cluster, essentially, is a KubeSphere cluster with the multi-cluster feature enabled. It provides you with the control plane for unified management of Member Clusters, also known as **M** Cluster. M Clusters are common KubeSphere clusters without the central control plane. Namely, tenants with necessary permissions (usually cluster administrators) can access the control plane from the H Cluster to manage all M Clusters, such as viewing and editing resources on M Clusters. Conversely, if you access the web console of any M Cluster separately, you cannot see any resources on other clusters.

![centrol-control-plane](/images/docs/multicluster-management/introduction/kubesphere-federation/centrol-control-plane.png)

There can only be one H Cluster while multiple M Clusters can exist at the same time. In a multi-cluster architecture, the network between the H Cluster and M Clusters can be connected directly or through an agent. The network between M Clusters can be set in a completely isolated environment.

![kubesphere-federation](/images/docs/multicluster-management/introduction/kubesphere-federation/kubesphere-federation.png)

## Vendor Agnostic

KubeSphere features a powerful, inclusive central control plane so that you can manage any KubeSphere clusters in a unified way regardless of deployment environments or cloud providers.