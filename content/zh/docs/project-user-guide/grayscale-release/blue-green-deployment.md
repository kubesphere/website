---
title: "Volume Snapshots"
keywords: 'KubeSphere, kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Volume Snapshots'

linkTitle: "Volume Snapshots"
weight: 2130
---

This tutorial explains how to customize KubeSphere configurations in `conf/common.yaml`. You can reference the following section to understand each parameter.

```yaml
######################### Kubernetes #########################
# The default k8s version will be installed
kube_version: v1.16.7  

# The default etcd version will be installed
etcd_version: v3.2.18  

# Configure a cron job to backup etcd data, which is running on etcd machines.
# Period of running backup etcd job, the unit is minutes.
# The default value 30 means backup etcd every 30 minutes.
etcd_backup_period: 30

# How many backup replicas to keep.
# The default value5 means to keep latest 5 backups, older ones will be deleted by order.
keep_backup_number: 5

# The location to store etcd backups files on etcd machines.
etcd_backup_dir: "/var/backups/kube_etcd"

# Add other registry. (For users who need to accelerate image download)
docker_registry_mirrors:
  - https://docker.mirrors.ustc.edu.cn
  - https://registry.docker-cn.com
  - https://mirror.aliyuncs.com

# Kubernetes network plugin, Calico will be installed by default. Note that Calico and flannel are recommended, which are tested and verified by KubeSphere.
kube_network_plugin: calico

# A valid CIDR range for Kubernetes services,
# 1. should not overlap with node subnet
# 2. should not overlap with Kubernetes pod subnet
kube_service_addresses: 10.233.0.0/18

# A valid CIDR range for Kubernetes pod subnet,
# 1. should not overlap with node subnet
# 2. should not overlap with Kubernetes services subnet
kube_pods_subnet: 10.233.64.0/18

# Kube-proxy proxyMode configuration, either ipvs, or iptables
kube_proxy_mode: ipvs

# Maximum pods allowed to run on every node.
kubelet_max_pods: 110

# Enable nodelocal dns cache, see https://github.com/kubernetes-sigs/kubespray/blob/master/docs/dns-stack.md#nodelocal-dns-cache for further information
enable_nodelocaldns: true

# Highly Available loadbalancer example config
# apiserver_loadbalancer_domain_name: "lb.kubesphere.local"  # Loadbalancer domain name
# loadbalancer_apiserver:  # Loadbalancer apiserver configuration, please uncomment this line when you prepare HA install
#   address: 192.168.0.10  # Loadbalancer apiserver IP address
#   port: 6443             # apiserver port

######################### KubeSphere #########################

# Version of KubeSphere
ks_version: v2.1.0  

# KubeSphere console port, range 30000-32767,
# but 30180/30280/30380 are reserved for internal service
console_port: 30880 # KubeSphere console nodeport

#CommonComponent
mysql_volume_size: 20Gi # MySQL PVC size
minio_volume_size: 20Gi # Minio PVC size
etcd_volume_size: 20Gi  # etcd PVC size
openldap_volume_size: 2Gi # openldap PVC size
redis_volume_size: 2Gi # Redis PVC size


# Monitoring
prometheus_replica: 2 #	Prometheus replicas with 2 by default which are responsible for monitoring different segments of data source and provide high availability as well.
prometheus_memory_request: 400Mi # Prometheus request memory
prometheus_volume_size: 20Gi # 	Prometheus PVC size
grafana_enabled: true # enable grafana or not


## Container Engine Acceleration
## Use nvidia gpu acceleration in containers
# nvidia_accelerator_enabled: true # enable Nvidia GPU accelerator or not. It supports hybrid node with GPU and CPU installed.
# nvidia_gpu_nodes: # The GPU nodes specified in hosts.ini. FOr now we only support Ubuntu 16.04
#   - kube-gpu-001  # The host name of the GPU node specified in hosts.ini
```

## How to Configure a GPU Node

You may want to use GPU nodes for special purpose such as machine learning. Let's say you have a GPU node called `node2` in `hosts.ini`, then in the file `common.yaml` specify the following configuration. Please be aware the `- node2` has two spaces indent.

```yaml
 nvidia_accelerator_enabled: true
 nvidia_gpu_nodes:
   - node2
```

> Note: The GPU node now only supports Ubuntu 16.04.
