---
title: "Installing on Linux"
description: "Demonstrate how to install KubeSphere on Linux on cloud and in on-premises environments."
layout: "single"

linkTitle: "Installing on Linux"
weight: 3000

icon: "/images/docs/docs.svg"
---

This chapter demonstrates how to use KubeKey to provision a production-ready Kubernetes and KubeSphere cluster on Linux in different environments. You can also use KubeKey to easily scale out and in your cluster and set various storage classes based on your needs.

## Introduction

### [Overview](../installing-on-linux/introduction/intro/)

Explore the general content in this chapter, including installation preparation, installation tool and method, as well as storage setting.

### [KubeKey](../installing-on-linux/introduction/kubekey/)

Understand what KubeKey is and how it works to help you create, scale and upgrade your Kubernetes cluster.

### [Multi-node Installation](../installing-on-linux/introduction/multioverview/)

Learn the general steps of installing KubeSphere and Kubernetes on a multi-node cluster.

### [Air-gapped Installation](../installing-on-linux/introduction/air-gapped-installation/)

Learn how to install KubeSphere and Kubernetes in an air-gapped environment.

### [Port Requirements](../installing-on-linux/introduction/port-firewall/)

Understand the specific port requirements for different services in KubeSphere.

### [Kubernetes Cluster Configurations](../installing-on-linux/introduction/vars/)

Customize your Kubernetes settings in the configuration file for your cluster.

### [Persistent Storage Configurations](../installing-on-linux/introduction/storage-configuration/)

Add different storage classes to your cluster with KubeKey, such as Ceph RBD and Glusterfs.

## High Availability Configurations

### [Set up an HA Cluster Using a Load Balancer](../installing-on-linux/high-availability-configurations/ha-configuration/)

Learn how to create a highly available cluster using a load balancer.

### [Set up an HA Cluster Using Keepalived and HAproxy](../installing-on-linux/high-availability-configurations/set-up-ha-cluster-using-keepalived-haproxy/)

Learn how to create a highly available cluster using Keepalived and HAproxy.

## Installing on Public Cloud

### [Deploy KubeSphere on Azure VM Instances](../installing-on-linux/public-cloud/install-kubesphere-on-azure-vms/)

Learn how to create a high-availability cluster on Azure virtual machines.

### [Deploy KubeSphere on QingCloud Instances](../installing-on-linux/public-cloud/install-kubesphere-on-qingcloud-vms/)

Learn how to create a high-availability cluster on QingCloud platform.

## Installing in On-premises Environments

### [Deploy KubeSphere on VMware vSphere](../installing-on-linux/on-premises/install-kubesphere-on-vmware-vsphere/)

Learn how to create a high-availability cluster on VMware vSphere.

### [Deploy KubeSphere on Bare Metal](../installing-on-linux/on-premises/install-kubesphere-on-bare-metal/)

Learn how to create a multi-node cluster with one master on bare metal.

## Add and Delete Nodes

### [Add New Nodes](../installing-on-linux/cluster-operation/add-new-nodes/)

Add more nodes to scale out your cluster.

### [Delete Nodes](../installing-on-linux/cluster-operation/remove-nodes/)

Cordon a node and even delete a node to scale in your cluster.

## [Uninstall KubeSphere and Kubernetes](../installing-on-linux/uninstall-kubesphere-and-kubernetes/)

Remove KubeSphere and Kubernetes from your machines.

## Most Popular Pages

Below you will find some of the most viewed and helpful pages in this chapter. It is highly recommended that you refer to them first.

{{< popularPage icon="/images/docs/qingcloud-2.svg" title="Deploy KubeSphere on QingCloud ff" description="Provision an HA KubeSphere cluster on QingCloud." link="../installing-on-linux/public-cloud/install-kubesphere-on-qingcloud-vms/" >}}
