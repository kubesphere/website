---
title: "在 Linux 上安装"
description: "Demonstrate how to install KubeSphere on Linux on cloud and in on-premises environments."
layout: "single"

linkTitle: "在 Linux 上安装"
weight: 2000

icon: "/images/docs/docs.svg"
---

本章演示如何使用 KubeKey 在不同环境的 Linux 上预配置生产就绪的 Kubernetes 和 KubeSphere 集群。 您还可以使用 KubeKey 轻松扩展和缩小集群，并根据需要设置各种存储类。

## 介绍

### [概述](../installing-on-linux/introduction/intro/)

浏览本章的概述，包括安装准备，安装工具和方法以及存储设置。

### [多节点安装](../installing-on-linux/introduction/multioverview/)

了解在多节点集群上安装 KubeSphere 和 Kubernetes 的一般步骤。

### [端口要求](../installing-on-linux/introduction/port-firewall/)

了解 KubeSphere 中不同服务的特定端口要求。

### [Kubernetes集群配置](../installing-on-linux/introduction/vars/)

在群集的配置文件中自定义设置。

### [持久卷配置](../installing-on-linux/introduction/storage-configuration/)

使用 KubeKey 将不同的存储类添加到集群中，例如 Ceph RBD 和 Glusterfs。

## 在本地环境中安装

### [在VMware vSphere上部署KubeSphere](../installing-on-linux/on-premises/install-kubesphere-on-vmware-vsphere/)

了解如何在 VMware vSphere 上创建高可用性群集。

## 在公共云上安装

### [在 Azure VM 实例上部署 KubeSphere ](../installing-on-linux/public-cloud/install-ks-on-azure-vms/)

了解如何在Azure虚拟机上创建高可用性群集。

### [在 QingCloud 实例上部署 KubeSphere ](../installing-on-linux/public-cloud/kubesphere-on-qingcloud-instance/)

了解如何在QingCloud平台上创建高可用性集群。

## 集群运维

### [添加新节点](../installing-on-linux/cluster-operation/add-new-nodes/)

添加更多节点以扩展集群。

### [删除节点](../installing-on-linux/cluster-operation/remove-nodes/)

停止调度节点，并删除节点以缩小集群规模。

## 卸载

### [卸载 KubeSphere 和 Kubernetes](../installing-on-linux/uninstalling/uninstalling-kubesphere-and-kubernetes/)

从您的机器上删除KubeSphere和Kubernetes。

## 常见问题

### [为安装配置加速器](../installing-on-linux/faq/configure-booster/)

设置仓库镜像以加速安装时的下载速度。

## 最受欢迎的页面

在下面的章节中，您将找到一些最受欢迎的页面。 强烈建议您先参考它们。

{{< popularPage icon="/images/docs/qingcloud-2.svg" title="Deploy KubeSphere on QingCloud" description="Provision an HA KubeSphere cluster on QingCloud." link="../installing-on-linux/public-cloud/kubesphere-on-qingcloud-instance/" >}}
