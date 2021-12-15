---
title: "KubeSphere Federation"
keywords: 'Kubernetes, KubeSphere, federation, multicluster, hybrid-cloud'
description: 'Understand the fundamental concept of Kubernetes federation in KubeSphere, including M clusters and H clusters.'
linkTitle: "KubeSphere Federation"
weight: 5120
---

The multi-cluster feature relates to the network connection among multiple clusters. Therefore, it is important to understand the topological relations of clusters.

## How the Multi-cluster Architecture Works

Before you use the central control plane of KubeSphere to management multiple clusters, you need to create a Host Cluster, also known as **H** Cluster. The H Cluster, essentially, is a KubeSphere cluster with the multi-cluster feature enabled. It provides you with the control plane for unified management of Member Clusters, also known as **M** Cluster. M Clusters are common KubeSphere clusters without the central control plane. Namely, tenants with necessary permissions (usually cluster administrators) can access the control plane from the H Cluster to manage all M Clusters, such as viewing and editing resources on M Clusters. Conversely, if you access the web console of any M Cluster separately, you cannot see any resources on other clusters.

![central-control-plane](/images/docs/multicluster-management/introduction/kubesphere-federation/central-control-plane.png)

There can only be one H Cluster while multiple M Clusters can exist at the same time. In a multi-cluster architecture, the network between the H Cluster and M Clusters can be [connected directly](../../enable-multicluster/direct-connection/) or [through an agent](../../enable-multicluster/agent-connection/). The network between M Clusters can be set in a completely isolated environment.

If you are using on-premises Kubernetes clusters built through kubeadm, install KubeSphere on your Kubernetes clusters by referring to [Air-gapped Installation on Kubernetes](../../../installing-on-kubernetes/on-prem-kubernetes/install-ks-on-linux-airgapped/), and then enable KubeSphere multi-cluster management through direct connection or agent connection.

![kubesphere-federation](/images/docs/multicluster-management/introduction/kubesphere-federation/kubesphere-federation.png)

## Vendor Agnostic

KubeSphere features a powerful, inclusive central control plane so that you can manage any KubeSphere clusters in a unified way regardless of deployment environments or cloud providers.

## Resource Requirements

Before you enable multi-cluster management, make sure you have enough resources in your environment.

| Namespace      | kube-federation-system | kubesphere-system |
| -------------- | ---------------------- | ----------------- |
| Sub-component  | 2 x controller-manager  | tower             |
| CPU Request    | 100 m                  | 100 m             |
| CPU Limit      | 500 m                  | 500 m             |
| Memory Request | 64 MiB                 | 128 MiB           |
| Memory Limit   | 512 MiB                | 256 MiB           |
| Installation   | Optional               | Optional          |

{{< notice note >}}

- The request and limit of CPU and memory resources all refer to single replica.
- After the multi-cluster feature is enabled, tower and controller-manager will be installed on the H Cluster. If you use [agent connection](../../../multicluster-management/enable-multicluster/agent-connection/), only tower is needed for M Clusters. If you use [direct connection](../../../multicluster-management/enable-multicluster/direct-connection/), no additional component is needed for M Clusters.

{{</ notice >}}

## Use the App Store in a Multi-cluster Architecture

Different from other components in KubeSphere, the [KubeSphere App Store](../../../pluggable-components/app-store/) serves as a global application pool for all clusters, including H Cluster and M Clusters. You only need to enable the App Store on the H Cluster and you can use functions related to the App Store on M Clusters directly (no matter whether the App Store is enabled on M Clusters or not), such as [app templates](../../../project-user-guide/application/app-template/) and [app repositories](../../../workspace-administration/app-repository/import-helm-repository/).

However, if you only enable the App Store on M Clusters without enabling it on the H Cluster, you will not be able to use the App Store on any cluster in the multi-cluster architecture.