---
title: "Multi-cluster Management"
description: "Import a hosted or on-premises Kubernetes cluster into KubeSphere"
layout: "single"

linkTitle: "Multi-cluster Management"

weight: 5000

icon: "/images/docs/docs.svg"
---

## Introduction

This chapter demonstrates how to use the multi-cluster feature of KubeSphere to import heterogeneous clusters for unified management.

### [Overview](../multicluster-management/introduction/overview/)

Gain a basic understanding of multi-cluster management, such as its common use cases, and the benefits that KubeSphere can bring with its multi-cluster feature.

### [KubeSphere Federation](../multicluster-management/introduction/kubefed-in-kubesphere/)

Understand the fundamental concept of Kubernetes federation in KubeSphere, including M clusters and H clusters.

## Enable Multi-cluster in KubeSphere

### [Direct Connection](../multicluster-management/enable-multicluster/direct-connection/)

Understand the general steps of importing clusters through direct connection.

### [Agent Connection](../multicluster-management/enable-multicluster/agent-connection/)

Understand the general steps of importing clusters through agent connection.

### [Retrieve KubeConfig](../multicluster-management/enable-multicluster/retrieve-kubeconfig/)

Retrieve the KubeConfig which is needed for cluster importing through direct connection.

## Import Cloud-hosted Kubernetes Cluster

### [Import Aliyun ACK Cluster](../multicluster-management/import-cloud-hosted-k8s/import-aliyun-ack/)

Learn how to import an Alibaba Cloud Kubernetes cluster.

### [Import AWS EKS Cluster](../multicluster-management/import-cloud-hosted-k8s/import-aws-eks/)

Learn how to import an Amazon Elastic Kubernetes Service cluster.

### [Import a Google GKE Cluster](../multicluster-management/import-cloud-hosted-k8s/import-gke/)

Learn how to import a Google Kubernetes Engine cluster.

## Import On-prem Kubernetes Cluster

### [Import Kubeadm Kubernetes Cluster](../multicluster-management/import-on-prem-k8s/import-kubeadm-k8s/)

Learn how to import a Kubernetes cluster created with kubeadm.

## [Unbind a Cluster](../multicluster-management/unbind-cluster/)

Learn how to unbind a cluster from your cluster pool in KubeSphere.
