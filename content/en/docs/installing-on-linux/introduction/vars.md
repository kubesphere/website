---
title: "Kubernetes Cluster Configuration"
keywords: 'KubeSphere, kubernetes, docker, cluster, jenkins, prometheus'
description: 'Configure cluster parameters before installing'

linkTitle: "Kubernetes Cluster Configuration"
weight: 2130
---

This tutorial explains how to customize the Kubernetes cluster configurations in `config-example.yaml` when you start to use [KubeKey](https://github.com/kubesphere/kubekey) to provision a cluster. You can reference the following section to understand each parameter.

```yaml
######################### Kubernetes #########################

kubernetes:
    version: v1.17.9 # The default k8s version is v1.17.9, you can specify 1.15.2, v1.16.13, v1.18.6 as you want
    imageRepo: kubesphere  # DockerHub Repo
    clusterName: cluster.local # Kubernetes Cluster Name
    masqueradeAll: false  # masqueradeAll tells kube-proxy to SNAT everything if using the pure iptables proxy mode. [Default: false]
    maxPods: 110  # maxPods is the number of pods that can run on this Kubelet. [Default: 110]
    nodeCidrMaskSize: 24  # internal network node size allocation. This is the size allocated to each node on your network. [Default: 24]
    proxyMode: ipvs  # mode specifies which proxy mode to use. [Default: ipvs]
  network:
    plugin: calico   # Calico by default, KubeSphere Network Policy is based on Calico. You can also specify Flannel as you want
    calico:
      ipipMode: Always  # IPIP Mode to use for the IPv4 POOL created at start up. If set to a value other than Never, vxlanMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Always]
      vxlanMode: Never  # VXLAN Mode to use for the IPv4 POOL created at start up. If set to a value other than Never, ipipMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Never]
      vethMTU: 1440  # The maximum transmission unit (MTU) setting determines the largest packet size that can be transmitted through your network. [Default: 1440]
    kubePodsCIDR: 10.233.64.0/18    # A valid CIDR range for Kubernetes pod subnet, it should not overlap with node subnet, and it should not overlap with Kubernetes services subnet.
    kubeServiceCIDR: 10.233.0.0/18  # A valid CIDR range for Kubernetes services, it should not overlap with node subnet, and it should not overlap with Kubernetes pod subnet
  registry:
    registryMirrors: []   # For users who need to accelerate image download speed
    insecureRegistries: [] # Configure an address of Insecure image Registry, see https://docs.docker.com/registry/insecure/
    privateRegistry: ""   # Configure a private image registry for air-gapped installation (e.g. docker local registry or Harbor)
  addons: []  # You can specify any add-ons with one or more Helm Charts or YAML files in this field, e.g. CSI plugins or cloud provider plugins.
```
