---
title: "Deploy KubeSphere on Azure VM Instance"
keywords: "Kubesphere, Installation, HA, high availability, load balancer, Azure"
description: "The tutorial is for installing a high-availability cluster on Azure."
---

## Before you begin

Technically, you can either install, administer, and manage Kubernetes yourself or go for a managed Kubernetes solution. If you are looking for a way to take advantage of Kubernetes with a hands-off approach, a fully managed platform solution is what you’re looking for, please see [Deploy KubeSphere on AKS](../../../installing-on-kubernetes/hosted-kubernetes/install-ks-on-aks) for more details. But if you want a bit more control over your configuration and setup a highly available cluster on Azure, this instruction will help you to setup a production-ready Kubernetes and KubeSphere.

## Introduction

In this tutorial, we will use two key features of Azure virtual machines (VMs): 

- Virtual Machine Scale Sets: Azure VMSS let you create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule(Kubernates Autoscaler is available, but not covered in this tutorial, see [autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/azure) for more details), which perfectly fits the Worker Nodes.
- Availability sets: An availability set is a logical grouping of VMs within a datacenter that automatically distributed across fault domains. This approach limits the impact of potential physical hardware failures, network outages, or power interruptions. All the Master and ETCD VMs will be placed in an Availability sets to meet our High Availability goals.

Besides those VMs, other resources like Load Balancer, Virtual Network and Network Security Group will be involved.

## Prerequisites

- You need an [Azure](https://portal.azure.com) account to create all the resources.
- Basic knowledge of [Azure Resource Manager](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/)(ARM) templates, which are files that define the Azure infrastructure and configuration.
- Considering data persistence, for a production environment, we recommend you to prepare persistent storage and create a StorageClass in advance. For development and testing, you can use the integrated OpenEBS to provision LocalPV as the storage service directly.

## Architecture

Six machines of "Ubuntu 18.04" will be deployed in Azure Resources Group. Three of them are grouped into an Availability sets, playing the role of both Master and ETCD of the Kubernetes control plane. Another three VMs will be defined as a VMSS, Worker nodes will be run on it.

![Architecture](/images/docs/aks/Azure-architecture.png)

Those VMs will be attached to a load balancer, there are two predefined rules in the LB:

- **Inbound NAT**: ssh port will be mapped for each machine, so we can easily manage VMs.
- **Load Balancing**: http and https ports will be mapped to Node pools by default, we can add other ports on demand.

| Service | Protocol | Rule | Backend Port | Frontend Port/Ports | Pools |
|---|---|---|---|---|---|
| ssh | TCP | Inbound NAT | 22 |50200, 50201,50202, 50100~50199| Master, Node |
| apiserver | TCP | Load Balancing | 6443 | 6443 | Master |
| ks-console | TCP | Load Balancing | 30880 | 30880 | Master |
| http | TCP | Load Balancing | 80 | 80 | Node |
| https | TCP | Load Balancing | 443 | 443 | Node |

## Deploy HA Cluster Infrastructrue

You don't have to create those resources one by one with Wizards. Following the best practice of **infrastructure as code** on Azure, all resources in the architecture are already defined as ARM templates.

### Start to deploy with one click

Click the *Deploy* button below, you will be redirected to Azure and asked to fill in deployment parameters.

[![Deploy to Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FRolandMa1986%2Fazurek8s%2Fmaster%2Fazuredeploy.json) [![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FRolandMa1986%2Fazurek8s%2Fmaster%2Fazuredeploy.json)

### Change template parameters

Only a few parameter need to be changed.

- Choose the *Create new* link under the Resources group and fill in a Name such as "KubeSphereVMRG".
- Fill in the admin's Username.
- Copy your public ssh key and fill in the Admin Key. Or create new one with *ssh-keygen*.

> Password authentication is restriced in the Linux configuration, only SSH accept.

Click the *Purchase* button in the bottom when you ready to continue.

### Review Azure Resources in the Portal

Once the deployment success, you can find all the resources you need in the KubeSphereVMRG Resources group. Take your time and check them one by one if you are new to Azure. Then find the public IP of LB and private IP addresses of the VMs. You will need them in the next step.

![New Created Resources](/images/docs/aks/azure-vm-all-resources.png)

## Deploy Kubernetes and Kubesphere

You can execute the following command on your laptop or SSH to one of the Master VMs. There are files will be downloaded to local and disturbed to each VM during the installation. The installation will be much faster when you use **kk** in the Intranet than the Internet.

```bash
# copy your private ssh to master-0
scp -P 50200  ~/.ssh/id_rsa kubesphere@40.81.5.xx:/home/kubesphere/.ssh/

# ssh to the master-0
ssh -i .ssh/id_rsa2  -p50200 kubesphere@40.81.5.xx
```

### Download KubeKey

[Kubekey](https://github.com/kubesphere/kubekey) is the next-gen installer which is used for installing Kubernetes and KubeSphere v3.0.0 fastly, flexibly and easily.

1. First, download it and generate a configuration file to customize the installation as follows.

```
curl -O -k https://kubernetes.pek3b.qingstor.com/tools/kubekey/kk
chmod +x kk
```

2. Then create an example configuration file with default configurations. Here we use Kubernetes v1.17.9 as an example.

```
./kk create config --with-kubesphere v3.0.0 --with-kubernetes v1.17.9
```
> Kubernetes Versions
> - v1.15:   v1.15.12
> - v1.16:   v1.16.13
> - v1.17:   v1.17.9 (default)
> - v1.18:   v1.18.6

### config-sample.yaml Example

```yaml
spec:
  hosts:
  - {name: master-0, address: 40.81.5.xx, port: 50200, internalAddress: 10.0.1.4, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: master-1, address: 40.81.5.xx, port: 50201, internalAddress: 10.0.1.5, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: master-2, address: 40.81.5.xx, port: 50202, internalAddress: 10.0.1.6, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: node000000, address: 40.81.5.xx, port: 50100, internalAddress: 10.0.0.4, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: node000001, address: 40.81.5.xx, port: 50101, internalAddress: 10.0.0.5, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  - {name: node000002, address: 40.81.5.xx, port: 50102, internalAddress: 10.0.0.6, user: kubesphere, privateKeyPath: "~/.ssh/id_rsa"}
  roleGroups:
    etcd:
    - master-0
    - master-1
    - master-2
    master:
    - master-0
    - master-1
    - master-2
    worker:
    - node000000
    - node000001
    - node000002
```
For a complete configuration sample explanation, please see [this file](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md).

### Configure the Load Balancer

In addition to the node information, you need to provide the load balancer information in the same yaml file. For the IP address, you can find it in *Azure -> KubeSphereVMRG -> PublicLB*. Assume the IP address and listening port of the **load balancer** are `40.81.5.xx` and `6443` respectively, and you can refer to the following example.

#### The configuration example in config-sample.yaml

```yaml
## Public LB config example
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "40.81.5.xx"
    port: "6443"
```

> - Note we are using the public load balancer directly instead of an internal load balancer due to the Azure [Load Balancer limits](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-troubleshoot#cause-4-accessing-the-internal-load-balancer-frontend-from-the-participating-load-balancer-backend-pool-vm).

### Persistent Storage Plugin Configuration

See [Storage Configuration](../storage-configuration) for details.

### Configure the Network Plugin

Azure Virtual Network doesn't support IPIP mode which used by [calico](https://docs.projectcalico.org/reference/public-cloud/azure#about-calico-on-azure). So let's change the network plugin to flannel.

```yaml
  network:
    plugin: flannel
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
```

### Start to Bootstrap a Cluster

After you complete the configuration, you can execute the following command to start the installation:

```bash
./kk create cluster -f config-sample.yaml
```

Inspect the logs of installation:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```
When the installation finishes, you can see the following message:

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.128.0.44:30880
Account: admin
Password: P@88w0rd
NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are ready.
  2. Please modify the default password after login.
#####################################################
https://kubesphere.io             2020-xx-xx xx:xx:xx
```

### Access KubeSphere Console

Congratulation! Now you can access the KubeSphere console using http://10.128.0.44:30880 (Replace the IP with yours).

## Add addtional Ports

Since we are using self-hosted Kubernetes solutions on Azure, So the Load Balancer is not integrated with [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer). But you still can manually map the Nodeport to the PublicLB. There are 2 steps required.

1. Create a new Load Balance Rule in the Load Balancer.
   ![Load Balancer](/images/docs/aks/azure-vm-loadbalancer-rule.png)
2. Create an Inbound Security rule to allow Internet access in the Network Security Group.
   ![Firewall](/images/docs/aks/azure-vm-firewall.png)

