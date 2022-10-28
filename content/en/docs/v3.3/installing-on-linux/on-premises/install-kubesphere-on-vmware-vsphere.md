---
title: "Deploy KubeSphere on VMware vSphere"
keywords: 'Kubernetes, KubeSphere, VMware-vSphere, installation'
description: 'Learn how to create a high-availability cluster on VMware vSphere.'


weight: 3510
---

## Introduction

For a production environment, we need to consider the high availability of the cluster. If the key components (for example, kube-apiserver, kube-scheduler, and kube-controller-manager) are all running on the same control plane node, Kubernetes and KubeSphere will be unavailable once the control plane node goes down. Therefore, we need to set up a high-availability cluster by provisioning load balancers with multiple control plane nodes. You can use any cloud load balancer, or any hardware load balancer (for example, F5). In addition, Keepalived and [HAProxy](https://www.haproxy.com/), or Nginx is also an alternative for creating high-availability clusters.

This tutorial walks you through an example of how to create Keepalived and HAProxy, and implement high availability of control plane and etcd nodes using the load balancers on VMware vSphere.

## Prerequisites

- Please make sure that you already know how to install KubeSphere with a multi-node cluster by following the [guide](../../introduction/multioverview/). This tutorial focuses more on how to configure load balancers.
- You need a VMware vSphere account to create VMs.
- Considering data persistence, for a production environment, we recommend you to prepare persistent storage and create a **default** StorageClass in advance. For development and testing, you can use the integrated OpenEBS to provision LocalPV as the storage service directly.

## Architecture

![Architecture](/images/docs/v3.3/vsphere/kubesphereOnVsphere-zh-architecture.png)

## Prepare Linux Hosts

This tutorial creates 8 virtual machines of **CentOS Linux release 7.6.1810 (Core)** for the default minimal installation. Every machine has 2 Cores, 4 GB of memory and 40 G disk space.

| Host IP | Host Name | Role |
| --- | --- | --- |
|10.10.71.214|master1|master, etcd|
|10.10.71.73|master2|master, etcd|
|10.10.71.62|master3|master, etcd|
|10.10.71.75|node1|worker|
|10.10.71.76|node2|worker|
|10.10.71.79|node3|worker|
|10.10.71.67|vip|vip (No need to create a VM)|
|10.10.71.77|lb-0|lb (Keepalived + HAProxy)|
|10.10.71.66|lb-1|lb (Keepalived + HAProxy)|

{{< notice note >}}
You do not need to create a virtual machine for `vip` (i.e. Virtual IP) above, so only 8 virtual machines need to be created.
{{</ notice >}}

You can follow the New Virtual Machine wizard to create a virtual machine to place in the VMware Host Client inventory.

![create](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-create.png)

1. In the first step **Select a creation type**, you can deploy a virtual machine from an OVF or OVA file, or register an existing virtual machine directly.

    ![kubesphereOnVsphere-en-0-1-1-create-type](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-1-create-type.png)

2. When you create a new virtual machine, provide a unique name for the  virtual machine to distinguish it from existing virtual machines on the  host you are managing.

    ![kubesphereOnVsphere-en-0-1-2-name](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-2-name.png)

3. Select a compute resource and storage (datastore) for the configuration and disk files. You can select the  datastore that has the most suitable properties, such as size, speed,  and availability, for your virtual machine storage.

    ![kubesphereOnVsphere-en-0-1-3-resource](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-3-resource.png)

    ![kubesphereOnVsphere-en-0-1-4-storage](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-4-storage.png)

    ![kubesphereOnVsphere-en-0-1-5-compatibility](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-5-compatibility.png)

4. Select a guest operating system. The wizard will provide the appropriate defaults for the operating system installation.

    ![kubesphereOnVsphere-en-0-1-6-system](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-6-system.png)

5. Before you finish deploying a new virtual machine, you have the option to set **Virtual Hardware** and **VM Options**. You can refer to the images below for part of the fields.

    ![kubesphereOnVsphere-en-0-1-7-hardware-1](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-7-hardware-1.png)

    ![kubesphereOnVsphere-en-0-1-7-hardware-2](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-7-hardware-2.png)

    ![kubesphereOnVsphere-en-0-1-7-hardware-3](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-7-hardware-3.png)

    ![kubesphereOnVsphere-en-0-1-7-hardware-4](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-7-hardware-4.png)

6. In **Ready to complete** page, you review the configuration selections that you have made for the virtual machine. Click **Finish** at the bottom-right corner to continue.

    ![kubesphereOnVsphere-en-0-1-8](/images/docs/v3.3/vsphere/kubesphereOnVsphere-en-0-1-8.png)

## Install a Load Balancer using Keepalived and HAProxy

For a production environment, you have to prepare an external load balancer for your cluster with multiple control plane nodes. If you do not have a load balancer, you can install it using Keepalived and HAProxy. If you are provisioning a development or testing environment by installing a cluster with a control plane node, please skip this section.

### Yum Install

host lb-0 (`10.10.71.77`) and host lb-1 (`10.10.71.66`).

```bash
yum install keepalived haproxy psmisc -y
```

### Configure HAProxy

On the servers with IP `10.10.71.77` and `10.10.71.66`, configure HAProxy as follows.

{{< notice note >}}

The configuration of the two lb machines is the same. Please pay attention to the backend service address.

{{</ notice >}}

```yaml
# HAProxy Configure /etc/haproxy/haproxy.cfg
global
    log         127.0.0.1 local2
    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon
    # turn on stats unix socket
    stats socket /var/lib/haproxy/stats
#---------------------------------------------------------------------
# common defaults that all the 'listen' and 'backend' sections will
# use if not designated in their block
#---------------------------------------------------------------------
defaults
    log                     global
    option                  httplog
    option                  dontlognull
    timeout connect         5000
    timeout client          5000
    timeout server          5000
#---------------------------------------------------------------------
# main frontend which proxys to the backends
#---------------------------------------------------------------------
frontend  kube-apiserver
    bind *:6443
    mode tcp
    option tcplog
    default_backend kube-apiserver
#---------------------------------------------------------------------
# round robin balancing between the various backends
#---------------------------------------------------------------------
backend kube-apiserver
    mode tcp
    option tcplog
    balance     roundrobin
    default-server inter 10s downinter 5s rise 2 fall 2 slowstart 60s maxconn 250 maxqueue 256 weight 100
    server kube-apiserver-1 10.10.71.214:6443 check
    server kube-apiserver-2 10.10.71.73:6443 check
    server kube-apiserver-3 10.10.71.62:6443 check
```

Check grammar first before you start it.

```bash
haproxy -f /etc/haproxy/haproxy.cfg -c
```

Restart HAProxy and execute the command below to enable HAProxy.

```bash
systemctl restart haproxy && systemctl enable haproxy
```

Stop HAProxy.

```bash
systemctl stop haproxy
```

### Configure Keepalived

Main HAProxy 77 lb-0-10.10.71.77 (/etc/keepalived/keepalived.conf).

```bash
global_defs {
  notification_email {
  }
  smtp_connect_timeout 30
  router_id LVS_DEVEL01
  vrrp_skip_check_adv_addr
  vrrp_garp_interval 0
  vrrp_gna_interval 0
}
vrrp_script chk_haproxy {
  script "killall -0 haproxy"
  interval 2
  weight 20
}
vrrp_instance haproxy-vip {
  state MASTER  
  priority 100  
  interface ens192
  virtual_router_id 60
  advert_int 1
  authentication {
    auth_type PASS
    auth_pass 1111
  }
  unicast_src_ip 10.10.71.77
  unicast_peer {
    10.10.71.66
  }
  virtual_ipaddress {
    #vip
    10.10.71.67/24
  }
  track_script {
    chk_haproxy
  }
}
```

Remark HAProxy 66 lb-1-10.10.71.66 (/etc/keepalived/keepalived.conf).

```bash
global_defs {
  notification_email {
  }
  router_id LVS_DEVEL02
  vrrp_skip_check_adv_addr
  vrrp_garp_interval 0
  vrrp_gna_interval 0
}
vrrp_script chk_haproxy {
  script "killall -0 haproxy"
  interval 2
  weight 20
}
vrrp_instance haproxy-vip {
  state BACKUP
  priority 90
  interface ens192
  virtual_router_id 60
  advert_int 1
  authentication {
    auth_type PASS
    auth_pass 1111
  }
  unicast_src_ip 10.10.71.66
  unicast_peer {
    10.10.71.77
  }
  virtual_ipaddress {
    10.10.71.67/24
  }
  track_script {
    chk_haproxy
  }
}
```

Start keepalived and enable keepalived.

```bash
systemctl restart keepalived && systemctl enable keepalived
```

```bash
systemctl stop keepalived
```

```bash
systemctl start keepalived
```

### Verify Availability

Use `ip a s` to view the vip binding status of each lb node:

```bash
ip a s
```

Pause VIP node HAProxy through the following command:

```bash
systemctl stop haproxy
```

Use `ip a s` again to check the vip binding of each lb node, and check whether vip drifts:

```bash
ip a s
```

Alternatively, use the command below:

```bash
systemctl status -l keepalived
```

## Download KubeKey

[Kubekey](https://github.com/kubesphere/kubekey) is the brand-new installer which provides an easy, fast and flexible way to install Kubernetes and KubeSphere 3.3.

Follow the step below to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.3.0 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v2.3.0) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

## Create a High Availability Cluster

With KubeKey, you can install Kubernetes and KubeSphere together. You have the option to create a multi-node cluster by customizing parameters in the configuration file.

Create a Kubernetes cluster with KubeSphere installed (for example, `--with-kubesphere v3.3.1`):

```bash
./kk create config --with-kubernetes v1.22.10 --with-kubesphere v3.3.1
```

{{< notice note >}}

- Recommended Kubernetes versions for KubeSphere 3.3: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support). If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.23.7 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../../installing-on-linux/introduction/kubekey/#support-matrix).

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.
- If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.

{{</ notice >}}

A default file `config-sample.yaml` will be created. Modify it according to your environment.

```bash
vi config-sample.yaml
```

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: config-sample
spec:
  hosts:
  - {name: master1, address: 10.10.71.214, internalAddress: 10.10.71.214, password: P@ssw0rd!}
  - {name: master2, address: 10.10.71.73, internalAddress: 10.10.71.73, password: P@ssw0rd!}
  - {name: master3, address: 10.10.71.62, internalAddress: 10.10.71.62, password: P@ssw0rd!}
  - {name: node1, address: 10.10.71.75, internalAddress: 10.10.71.75, password: P@ssw0rd!}
  - {name: node2, address: 10.10.71.76, internalAddress: 10.10.71.76, password: P@ssw0rd!}
  - {name: node3, address: 10.10.71.79, internalAddress: 10.10.71.79, password: P@ssw0rd!}
  roleGroups:
    etcd:
    - master1
    - master2
    - master3
    control-plane:
    - master1
    - master2
    - master3
    worker:
    - node1
    - node2
    - node3
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    # vip
    address: "10.10.71.67"
    port: 6443
  kubernetes:
    version: v1.21.5
    imageRepo: kubesphere
    clusterName: cluster.local
    masqueradeAll: false  # masqueradeAll tells kube-proxy to SNAT everything if using the pure iptables proxy mode. [Default: false]
    maxPods: 110  # maxPods is the number of pods that can run on this Kubelet. [Default: 110]
    nodeCidrMaskSize: 24  # internal network node size allocation. This is the size allocated to each node on your network. [Default: 24]
    proxyMode: ipvs  # mode specifies which proxy mode to use. [Default: ipvs]
  network:
    plugin: calico
    calico:
      ipipMode: Always  # IPIP Mode to use for the IPv4 POOL created at start up. If set to a value other than Never, vxlanMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Always]
      vxlanMode: Never  # VXLAN Mode to use for the IPv4 POOL created at start up. If set to a value other than Never, ipipMode should be set to "Never". [Always | CrossSubnet | Never] [Default: Never]
      vethMTU: 1440  # The maximum transmission unit (MTU) setting determines the largest packet size that can be transmitted through your network. [Default: 1440]
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: ""
  storage:
    defaultStorageClass: localVolume
    localVolume:
      storageClassName: local  

---
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: v3.3.1
spec:
  local_registry: ""
  persistence:
    storageClass: ""
  authentication:
    jwtSecret: ""
  etcd:
    monitoring: true        # Whether to install etcd monitoring dashboard
    endpointIps: 192.168.0.7,192.168.0.8,192.168.0.9  # etcd cluster endpointIps
    port: 2379              # etcd port
    tlsEnable: true
  common:
    mysqlVolumeSize: 20Gi # MySQL PVC size
    minioVolumeSize: 20Gi # Minio PVC size
    etcdVolumeSize: 20Gi  # etcd PVC size
    openldapVolumeSize: 2Gi   # openldap PVC size
    redisVolumSize: 2Gi # Redis PVC size
    es:  # Storage backend for logging, tracing, events and auditing.
      elasticsearchMasterReplicas: 1   # total number of master nodes, it's not allowed to use even number
      elasticsearchDataReplicas: 1     # total number of data nodes
      elasticsearchMasterVolumeSize: 4Gi   # Volume size of Elasticsearch master nodes
      elasticsearchDataVolumeSize: 20Gi    # Volume size of Elasticsearch data nodes
      logMaxAge: 7                     # Log retention time in built-in Elasticsearch, it is 7 days by default.
      elkPrefix: logstash              # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log
      # externalElasticsearchUrl:
      # externalElasticsearchPort:
  console:
    enableMultiLogin: false  # enable/disable multiple sing on, it allows a user can be used by different users at the same time.
    port: 30880
  alerting:                # Whether to install KubeSphere alerting system. It enables Users to customize alerting policies to send messages to receivers in time with different time intervals and alerting levels to choose from.
    enabled: false
  auditing:                # Whether to install KubeSphere audit log system. It provides a security-relevant chronological set of records，recording the sequence of activities happened in platform, initiated by different tenants.
    enabled: false
  devops:                  # Whether to install KubeSphere DevOps System. It provides out-of-box CI/CD system based on Jenkins, and automated workflow tools including Source-to-Image & Binary-to-Image
    enabled: false
    jenkinsMemoryLim: 2Gi      # Jenkins memory limit
    jenkinsMemoryReq: 1500Mi   # Jenkins memory request
    jenkinsVolumeSize: 8Gi     # Jenkins volume size
    jenkinsJavaOpts_Xms: 512m  # The following three fields are JVM parameters
    jenkinsJavaOpts_Xmx: 512m
    jenkinsJavaOpts_MaxRAM: 2g
  events:                  # Whether to install KubeSphere events system. It provides a graphical web console for Kubernetes Events exporting, filtering and alerting in multi-tenant Kubernetes clusters.
    enabled: false
  logging:                 # Whether to install KubeSphere logging system. Flexible logging functions are provided for log query, collection and management in a unified console. Additional log collectors can be added, such as Elasticsearch, Kafka and Fluentd.
    enabled: false
    logsidecarReplicas: 2
  metrics_server:                    # Whether to install metrics-server. IT enables HPA (Horizontal Pod Autoscaler).
    enabled: true
  monitoring:                        #
    prometheusReplicas: 1            # Prometheus replicas are responsible for monitoring different segments of data source and provide high availability as well.
    prometheusMemoryRequest: 400Mi   # Prometheus request memory
    prometheusVolumeSize: 20Gi       # Prometheus PVC size
    alertmanagerReplicas: 1          # AlertManager Replicas
  multicluster:
    clusterRole: none  # host | member | none  # You can install a solo cluster, or specify it as the role of host or member cluster
  networkpolicy:       # Network policies allow network isolation within the same cluster, which means firewalls can be set up between certain instances (Pods).
    enabled: false
  notification:        # It supports notification management in multi-tenant Kubernetes clusters. It allows you to set AlertManager as its sender, and receivers include Email, Wechat Work, and Slack.
    enabled: false
  openpitrix:          # Whether to install KubeSphere App Store. It provides an application store for Helm-based applications, and offer application lifecycle management
    enabled: false
  servicemesh:         # (0.3 Core, 300 MiB) Provide fine-grained traffic management, observability and tracing, and visualized traffic topology
    enabled: false
```

Create a cluster using the configuration file you customized above:

```bash
./kk create cluster -f config-sample.yaml
```

## Verify the Multi-node Installation

Inspect the logs of installation by executing the command below:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

If you can see the welcome log return, it means the installation is successful. Your cluster is up and running.

```yaml
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.10.71.214:30880
Account: admin
Password: P@88w0rd
NOTES：
  1. After you log into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are up and running.
  2. Please change the default password after login.
#####################################################
https://kubesphere.io             2020-08-15 23:32:12
#####################################################
```

### Log in to the Console

You will be able to use default account and password `admin/P@88w0rd` to log in to the console `http://{$IP}:30880` to take a tour of KubeSphere. Please change the default password after login.

## Enable Pluggable Components (Optional)

The example above demonstrates the process of a default minimal installation. To enable other components in KubeSphere, see [Enable Pluggable Components](../../../pluggable-components/) for more details.
