---
title: "Kubernetes Cluster Configurations"
keywords: 'KubeSphere, Kubernetes, docker, cluster, configuration'
description: 'Configure cluster parameters before installing'
linkTitle: "Kubernetes Cluster Configurations"
weight: 3160
---

This tutorial explains how to customize Kubernetes cluster configurations in `config-sample.yaml` (needed for [Multi-node Installation](../multioverview/)) when you use [KubeKey](https://github.com/kubesphere/kubekey) to provision a cluster. You can refer to the following section to understand each parameter.

```yaml
######################### Kubernetes #########################

kubernetes:
    version: v1.17.9 # The default k8s version is v1.17.9; you can specify 1.15.2, v1.16.13 or v1.18.6 based on your needs.
    imageRepo: kubesphere  # DockerHub Repo
    clusterName: cluster.local # Kubernetes Cluster Name
    masqueradeAll: false  # masqueradeAll tells kube-proxy to SNAT everything if using the pure iptables proxy mode. [Default: false]
    maxPods: 110  # maxPods is the number of pods that can run on this Kubelet. [Default: 110]
    nodeCidrMaskSize: 24  # Internal network node size allocation. This is the size allocated to each node in your network. [Default: 24]
    proxyMode: ipvs  # The mode specifies which proxy mode to use. [Default: ipvs]
  network:
    plugin: calico   # Calico by default. KubeSphere Network Policy is based on Calico. You can also specify Flannel based on your needs.
    calico:
      ipipMode: Always  # IPIP Mode to use for the IPv4 POOL created at start up. If it is set to a value other than Never, vxlanMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Always]
      vxlanMode: Never  # VXLAN Mode to use for the IPv4 POOL created at start up. If it is set to a value other than Never, ipipMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Never]
      vethMTU: 1440  # The maximum transmission unit (MTU) setting determines the largest packet size that can be transmitted through your network. [Default: 1440]
    kubePodsCIDR: 10.233.64.0/18    # A valid CIDR range for Kubernetes pod subnet. It should not overlap with node subnet, and it should not overlap with Kubernetes services subnet.
    kubeServiceCIDR: 10.233.0.0/18  # A valid CIDR range for Kubernetes services. It should not overlap with node subnet, and it should not overlap with Kubernetes pod subnet.
  registry:
    registryMirrors: []   # For users who need to speed up downloads.
    insecureRegistries: [] # Set an address of insecure image registry. See https://docs.docker.com/registry/insecure/
    privateRegistry: ""   # Configure a private image registry for air-gapped installation (e.g. docker local registry or Harbor).
  addons: []  # You can specify any add-ons with one or more Helm Charts or YAML files in this field (e.g. CSI plugins or cloud provider plugins).
```
