---
title: "多集群管理"
description: "将托管的或本地的 Kubernetes 集群导入 KubeSphere"
layout: "single"

linkTitle: "多集群管理"

weight: 3000

icon: "/images/docs/docs.svg"
---

## 介绍

本章演示如何使用 KubeSphere 的多集群功能导入异构集群以进行统一的管理。

### [概述](../multicluster-management/introduction/overview/)

对多集群管理有个基本的了解，例如多集群管理的常见用例，以及 KubeSphere 可以通过多集群功能带来的好处。

### [KubeSphere 联邦](../multicluster-management/introduction/kubefed-in-kubesphere/)

了解 KubeSphere 中的 Kubernetes 联邦的基本概念，包括 M 集群和 H 集群。

## 启用多集群

### [直接连接](../multicluster-management/enable-multicluster/direct-connection/)

了解通过直接连接导入集群的一般步骤。

### [代理连接](../multicluster-management/enable-multicluster/agent-connection/)

了解通过代理连接导入集群的一般步骤。

### [获取 KubeConfig](../multicluster-management/enable-multicluster/retrieve-kubeconfig/)

获取通过直接连接导入集群所需的 KubeConfig。

## 导入云托管的 Kubernetes 集群

### [导入阿里云 ACK 集群](../multicluster-management/import-cloud-hosted-k8s/import-aliyun-ack/)

了解如何导入阿里云 Kubernetes 集群。

### [导入 AWS EKS 集群](../multicluster-management/import-cloud-hosted-k8s/import-aws-eks/)

了解如何导入 Amazon Elastic Kubernetes 服务集群。

## 导入本地 Kubernetes 集群

### [导入 Kubeadm Kubernetes 集群](../multicluster-management/import-on-prem-k8s/import-kubeadm-k8s/)

了解如何导入通过 kubeadm 创建的 Kubernetes 集群。

## 删除集群

### [从 KubeSphere 删除集群](../multicluster-management/remove-cluster/kubefed-in-kubesphere/)

了解如何从 KubeSphere 的集群池中解除集群的绑定。



