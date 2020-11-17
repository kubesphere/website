---
title: "KubeSphere 在华为云 ECS 高可用实例"
keywords: "Kubesphere 安装， 华为云， ECS， 高可用性， 高可用性，  负载均衡器"
description: "本教程用于安装高可用性集群"

Weight: 2230
---

由于对于生产环境，我们需要考虑集群的高可用性。教你部署如何在华为云 ECS 实例服务快速部署一套高可用的生产环境
Kubernetes 服务需要做到高可用，需要保证 kube-apiserver 的 HA ，推荐华为云负载均衡器服务.

## 前提条件

- 请遵循该[指南](https://github.com/kubesphere/kubekey)，确保您已经知道如何将 KubeSphere 与多节点集群一起安装。有关用于安装的 config.yaml 文件的详细信息。本教程重点介绍配置华为云负载均衡器服务高可用安装。
- 考虑到数据的持久性，对于生产环境，我们不建议您使用存储OpenEBS，建议 NFS、GlusterFS、Ceph 等存储(需要提前准备)。文章为了进行开发和测试，集成了 OpenEBS 将 LocalPV 设置为默认的存储服务。
- SSH 可以互相访问所有节点。
- 所有节点的时间同步。

## 创建主机

本示例创建 6 台 Ubuntu 18.04 server 64bit 的云服务器，每台配置为 4 核 8 GB

| 主机IP | 主机名称 | 角色 |
| --- | --- | --- |
|192.168.1.10|master1|master1, etcd|
|192.168.1.11|master2|master2, etcd|
|192.168.1.12|master3|master3, etcd|
|192.168.1.13|node1|node|
|192.168.1.14|node2|node|
|192.168.1.15|node3|node|

> 注意:机器有限，所以把 etcd 放入 master，在生产环境建议单独部署 etcd，提高稳定性

## 华为云负载均衡器部署
###  创建 VPC

进入到华为云控制， 在左侧列表选择'虚拟私有云'， 选择'创建虚拟私有云' 创建VPC,配置如下图

![1-1-创建VPC](/images/docs/huawei-ecs/huawei-VPC-create.png)

###  创建安全组

在 `访问控制→ 安全组`下，创建一个安全组，设置入方向的规则参考如下：

![2-1-创建安全组](/images/docs/huawei-ecs/huawei-rules-create.png)
> 提示：后端服务器的安全组规则必须放行 100.125.0.0/16 网段，否则会导致健康检查异常，详见 后端服务器配置安全组 。此外，还应放行 192.168.1.0/24 （主机之间的网络需全放行）。

### 创建主机
![3-1-选择主机配置](/images/docs/huawei-ecs/huawei-ECS-basic-settings.png)
在网络配置中，网络选择第一步创建的 VPC 和子网。在安全组中，选择上一步创建的安全组。
![3-2-选择网络配置](/images/docs/huawei-ecs/huawei-ECS-network-settings.png)

### 创建负载均衡器
在左侧栏选择 '弹性负载均衡器',进入后选择 购买弹性负载均衡器
> 以下健康检查结果在部署后才会显示正常,目前状态为异常
#### 内网LB 配置
为所有master 节点 添加后端监听器 ,监听端口为 6443

![4-1-配置内网LB](/images/docs/huawei-ecs/huawei-master-lb-basic-config.png)

![4-2-配置内网LB](/images/docs/huawei-ecs/huawei-master-lb-listeners-config.png)
#### 外网LB 配置
若集群需要配置公网访问，则需要为外网负载均衡器配置一个公网 IP为 所有节点 添加后端监听器，监听端口为 80(测试使用 30880 端口,此处 80 端口也需要在安全组中开放)。

![4-3-配置外网LB](/images/docs/huawei-ecs/huawei-public-lb-basic-config.png)

![4-4-配置外网LB](/images/docs/huawei-ecs/huawei-public-lb-listeners-config.png)

后面配置文件 config.yaml 需要配置在前面创建的 SLB 分配的地址（VIP）

```yaml
     controlPlaneEndpoint:
         domain: lb.kubesphere.local
         address: "192.168.1.8"
         port: "6443"
```
###  获取安装程序可执行文件

下载可执行安装程序 `kk` 至一台目标机器：

```
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

给 `kk` 授予可执行权限：

```bash
chmod +x kk
```

{{< notice tip >}}

 您可以使用高级安装来控制自定义参数或创建多节点群集。具体来说，通过指定配置文件来创建集群。

{{</ notice >}}

###  使用 kubekey 部署

在当前位置创建配置文件 `master-HA.yaml`：

```bash
./kk create config --with-kubesphere v3.0.0 --with-kubernetes v1.17.9 -f master-HA.yaml
```

> 提示：默认是 Kubernetes 1.17.9，这些 Kubernetes 版本也与 KubeSphere 同时进行过充分的测试： v1.15.12, v1.16.13, v1.17.9 (default), v1.18.6，您可以根据需要指定版本。

### 集群配置调整

目前当前集群开启了全量的组件,文末也提供了自定义的方法.可默认为 false：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: master-HA
spec:
  hosts:
  - {name: master1, address: 192.168.1.10, internalAddress: 192.168.1.10, password: yourpassword} # Assume that the default port for SSH is 22, otherwise add the port number after the IP address as above
  - {name: master2, address: 192.168.1.11, internalAddress: 192.168.1.11, password: yourpassword} # Assume that the default port for SSH is 22, otherwise add the port number after the IP address as above
  - {name: master3, address: 192.168.1.12, internalAddress: 192.168.1.12, password: yourpassword} # Assume that the default port for SSH is 22, otherwise add the port number after the IP address as above
  - {name: node1, address:  192.168.1.13, internalAddress: 192.168.1.13, password: yourpassword} # Assume that the default port for SSH is 22, otherwise add the port number after the IP address as above
  - {name: node2, address: 192.168.1.14, internalAddress: 192.168.1.14, password: yourpassword} # Assume that the default port for SSH is 22SSH is 22, otherwise add the port number after the IP address as above
  - {name: node3, address: 192.168.1.15, internalAddress: 192.168.1.15, password: yourpassword} # Assume that the default port for SSH is 22, otherwise add the port number after the IP address as above
  roleGroups:
    etcd:
     - master[1:3]
    master:
     - master[1:3]
    worker:
     - node[1:3]
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "192.168.1.8"
    port: "6443"
  kubernetes:
    version: v1.17.9
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
    registryMirrors: ["https://*.mirror.aliyuncs.com"] # # input your registryMirrors
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
    version: v3.0.0
spec:
  local_registry: ""
  persistence:
    storageClass: ""
  authentication:
    jwtSecret: ""
  etcd:
    monitoring: true        # Whether to install etcd monitoring dashboard
    endpointIps: 192.168.1.10,192.168.1.11,192.168.1.12  # etcd cluster endpointIps
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
    enableMultiLogin: false  # enable/disable multiple sing on, it allows an account can be used by different users at the same time.
    port: 30880
  alerting:                # Whether to install KubeSphere alerting system. It enables Users to customize alerting policies to send messages to receivers in time with different time intervals and alerting levels to choose from.
    enabled: true
  auditing:                # Whether to install KubeSphere audit log system. It provides a security-relevant chronological set of records，recording the sequence of activities happened in platform, initiated by different tenants.
    enabled: true         
  devops:                  # Whether to install KubeSphere DevOps System. It provides out-of-box CI/CD system based on Jenkins, and automated workflow tools including Source-to-Image & Binary-to-Image
    enabled: true
    jenkinsMemoryLim: 2Gi      # Jenkins memory limit
    jenkinsMemoryReq: 1500Mi   # Jenkins memory request
    jenkinsVolumeSize: 8Gi     # Jenkins volume size
    jenkinsJavaOpts_Xms: 512m  # The following three fields are JVM parameters
    jenkinsJavaOpts_Xmx: 512m
    jenkinsJavaOpts_MaxRAM: 2g
  events:                  # Whether to install KubeSphere events system. It provides a graphical web console for Kubernetes Events exporting, filtering and alerting in multi-tenant Kubernetes clusters.
    enabled: true
  logging:                 # Whether to install KubeSphere logging system. Flexible logging functions are provided for log query, collection and management in a unified console. Additional log collectors can be added, such as Elasticsearch, Kafka and Fluentd.
    enabled: true
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
    enabled: true     
  notification:        # It supports notification management in multi-tenant Kubernetes clusters. It allows you to set AlertManager as its sender, and receivers include Email, Wechat Work, and Slack.
    enabled: true
  openpitrix:          # Whether to install KubeSphere App Store. It provides an application store for Helm-based applications, and offer application lifecycle management
    enabled: true
  servicemesh:         # Whether to install KubeSphere Service Mesh (Istio-based). It provides fine-grained traffic management, observability and tracing, and offer visualization for traffic topology
    enabled: true
 ```

#### 持久化存储配置

如本文开头的前提条件所说，对于生产环境，我们建议您准备持久性存储，可参考以下说明进行配置。若搭建开发和测试，您可以直接使用默认集成的 OpenEBS 准备 LocalPV，则可以跳过这小节。

{{< notice note >}}
如果你有已有存储服务端，例如华为云可使用 [弹性文件存储（SFS）](https://support.huaweicloud.com/productdesc-sfs/zh-cn_topic_0034428718.html) 来作为存储服务。继续编辑上述 `config-sample.yaml` 文件，找到 `[addons]` 字段，这里支持定义任何持久化存储的插件或客户端，如 CSI、NFS Client、Ceph、GlusterFS，您可以根据您自己的持久化存储服务类型，并参考 [持久化存储服务](https://kubesphere.com.cn/docs/installing-on-linux/introduction/storage-configuration/) 中对应的示例 yaml 文件进行设置。
{{</ notice >}}

###  执行命令创建集群

 ```bash
 # 指定配置文件创建集群
 ./kk create cluster --with-kubesphere v3.0.0 -f master-HA.yaml

 # 查看 KubeSphere 安装日志  -- 直到出现控制台的访问地址和登陆账号
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

```
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.1.10:30880
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
https://kubesphere.io             2020-08-28 01:25:54
#####################################################
```

访问公网 IP + Port 为部署后的使用情况，使用默认账号密码 (`admin/P@88w0rd`)，文章组件安装为最大化，登陆点击`平台管理>集群管理` 可看到下图安装组件列表和机器情况。


## 如何自定义开启可插拔组件

点击 `集群管理` - `自定义资源CRD` ，在过滤条件框输入 `ClusterConfiguration` ，如图下
![5-1-自定义组件](/images/docs/huawei-ecs/huawei-crds-config.png)
点击 `ClusterConfiguration` 详情，对 `ks-installer` 编辑保存退出即可，组件描述介绍:[文档说明](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml)
![5-2-自定义组件](/images/docs/huawei-ecs/huawei-crds-edit-yaml.png)
