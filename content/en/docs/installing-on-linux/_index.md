---
title: "Installing on Linux"
description: "Demonstrate how to install KubeSphere on Linux on cloud and in on-premises environments."
layout: "single"

linkTitle: "Installing on Linux"
weight: 2000

icon: "/images/docs/docs.svg"
---

This chapter demonstrates how to use KubeKey to provision a production-ready Kubernetes and KubeSphere cluster on Linux in different environments. You can also use KubeKey to easily scale up and down your cluster and set various storage classes based on your needs.

## Introduction

### [Overview](../installing-on-linux/introduction/intro/)

Explore the general content in this chapter, including installation preparation, installation tool and method, as well as storage setting.

### [Multi-node Installation](../installing-on-linux/introduction/multioverview/)

Learn the general steps of installing KubeSphere and Kubernetes on a multi-node cluster.

### [Port Requirements](../installing-on-linux/introduction/port-firewall/)

Understand the specific port requirements for different services in KubeSphere.

### [Kubernetes Cluster Configuration](../installing-on-linux/introduction/vars/)

Customize your setting in the configuration file for your cluster.

### [Persistent Storage Configuration](../installing-on-linux/introduction/storage-configuration/)

Add different storage classes to your cluster with KubeKey, such as Ceph RBD and Glusterfs.

## Installing in On-premises Environments

### [Deploy KubeSphere on VMware vSphere](../installing-on-linux/on-premises/install-kubesphere-on-vmware-vsphere/)

Learn how to create a high-availability cluster on VMware vSphere.

## Installing on Public Cloud

### [Deploy KubeSphere on Azure VM Instance](../installing-on-linux/public-cloud/install-ks-on-azure-vms/)

Learn how to create a high-availability cluster on Azure virtual machines.

### [Deploy KubeSphere on QingCloud Instance](../installing-on-linux/public-cloud/kubesphere-on-qingcloud-instance/)

Learn how to create a high-availability cluster on QingCloud platform.

## Cluster Operation

### [Add New Nodes](../installing-on-linux/cluster-operation/add-new-nodes/)

Add more nodes to scale up your cluster.

### [Remove Nodes](../installing-on-linux/cluster-operation/remove-nodes/)

Cordon a node and even delete a node to scale down your cluster.

## Uninstalling

### [Uninstalling KubeSphere and Kubernetes](../installing-on-linux/uninstalling/uninstalling-kubesphere-and-kubernetes/)

Remove KubeSphere and Kubernetes from your machines.

## Most Popular Pages

Below you will find some of the most viewed and helpful pages in this chapter. It is highly recommended that you refer to them first.

{{< popularPage icon="/images/docs/qingcloud-2.svg" title="Deploy KubeSphere on QingCloud" description="Provision an HA KubeSphere cluster on QingCloud." link="../installing-on-linux/public-cloud/kubesphere-on-qingcloud-instance/" >}}
