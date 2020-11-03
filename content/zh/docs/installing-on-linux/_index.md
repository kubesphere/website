---
title: "在 Linux 上安装 KubeSphere"
description: "演示如何在云上和本地 Linux 环境中安装 KubeSphere。"
layout: "single"

linkTitle: "在 Linux 上安装 KubeSphere"
weight: 2000

icon: "/images/docs/docs.svg"
---

本章演示如何使用 KubeKey 在 Linux 上配置生产可用的 Kubernetes 和 KubeSphere 集群。您还可以使用 KubeKey 轻松对集群扩缩容，并根据需要设置各种存储类。

## 介绍

### [概述](../installing-on-linux/introduction/intro/)

浏览本章的概述，包括安装准备、安装工具和方法以及存储设置。

### [多节点安装](../installing-on-linux/introduction/multioverview/)

了解在多节点集群上安装 KubeSphere 和 Kubernetes 的一般步骤。

### [端口要求](../installing-on-linux/introduction/port-firewall/)

了解 KubeSphere 中不同服务的特定端口要求。
### [Kubernetes 集群配置](../installing-on-linux/introduction/vars/)

在集群的配置文件中添加自定义设置。

### [持久化存储配置](../installing-on-linux/introduction/storage-configuration/)

使用 KubeKey 将不同的存储类添加到集群，例如 Ceph RBD 和 Glusterfs。

## 在本地环境中安装 KubeSphere

### [在 VMware vSphere 上部署](../installing-on-linux/on-premises/install-kubesphere-on-vmware-vsphere/)

了解如何在 VMware vSphere 上创建高可用 KubeSphere 群集。

## 在公有云上安装 KubeSphere

### [在 Azure 虚拟机上部署 KubeSphere](../installing-on-linux/public-cloud/install-ks-on-azure-vms/)

了解如何在 Azure 虚拟机上创建高可用 KubeSphere 群集。

### [在青云QingCloud 虚拟机上部署 KubeSphere](../installing-on-linux/public-cloud/kubesphere-on-qingcloud-instance/)

了解如何在青云QingCloud 平台上创建高可用 KubeSphere 集群。

## 添加或删除节点

### [添加新节点](../installing-on-linux/cluster-operation/add-new-nodes/)

添加更多节点以扩展集群。

### [移除节点](../installing-on-linux/cluster-operation/remove-nodes/)

停止调度节点，或者删除节点以缩小集群规模。

## 卸载

### [卸载 KubeSphere 和 Kubernetes](../installing-on-linux/uninstalling/uninstalling-kubesphere-and-kubernetes/)

从机器上删除 KubeSphere 和 Kubernetes。

## FAQ

### [为安装配置加速器](../installing-on-linux/faq/configure-booster/)

配置镜像仓库以加快安装速度。

## 常用指南

以下是本章节中的常用指南，建议您优先参考。

{{< popularPage icon="/images/docs/qingcloud-2.svg" title="Deploy KubeSphere on QingCloud" description="Provision an HA KubeSphere cluster on QingCloud." link="../installing-on-linux/public-cloud/kubesphere-on-qingcloud-instance/" >}}
