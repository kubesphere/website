---
title: "KubeSphere 在华为云 ECS 高可用实例"
keywords: "Kubesphere 安装， 华为云， ECS， 高可用性， 高可用性，  负载均衡器"
description: "了解如何在华为云虚拟机上创建高可用的 KubeSphere 集群。"

Weight: 3230
---

由于对于生产环境，我们需要考虑集群的高可用性。教您部署如何在华为云 ECS 实例服务快速部署一套高可用的生产环境
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

![1-1-创建VPC](/images/docs/v3.3/huawei-ecs/huawei-VPC-create.png)

###  创建安全组

在 `访问控制→ 安全组`下，创建一个安全组，设置入方向的规则参考如下：

![2-1-创建安全组](/images/docs/v3.3/huawei-ecs/huawei-rules-create.png)
> 提示：后端服务器的安全组规则必须放行 100.125.0.0/16 网段，否则会导致健康检查异常，详见 后端服务器配置安全组 。此外，还应放行 192.168.1.0/24 （主机之间的网络需全放行）。

### 创建主机
![3-1-选择主机配置](/images/docs/v3.3/huawei-ecs/huawei-ECS-basic-settings.png)
在网络配置中，网络选择第一步创建的 VPC 和子网。在安全组中，选择上一步创建的安全组。
![3-2-选择网络配置](/images/docs/v3.3/huawei-ecs/huawei-ECS-network-settings.png)

### 创建负载均衡器
在左侧栏选择 '弹性负载均衡器',进入后选择 购买弹性负载均衡器
> 以下健康检查结果在部署后才会显示正常,目前状态为异常
#### 内网LB 配置
为所有master 节点 添加后端监听器 ,监听端口为 6443

![4-1-配置内网LB](/images/docs/v3.3/huawei-ecs/huawei-master-lb-basic-config.png)

![4-2-配置内网LB](/images/docs/v3.3/huawei-ecs/huawei-master-lb-listeners-config.png)
#### 外网LB 配置
若集群需要配置公网访问，则需要为外网负载均衡器配置一个公网 IP为 所有节点 添加后端监听器，监听端口为 80(测试使用 30880 端口,此处 80 端口也需要在安全组中开放)。

![4-3-配置外网LB](/images/docs/v3.3/huawei-ecs/huawei-public-lb-basic-config.png)

![4-4-配置外网LB](/images/docs/v3.3/huawei-ecs/huawei-public-lb-listeners-config.png)

后面配置文件 config.yaml 需要配置在前面创建的 SLB 分配的地址（VIP）

```yaml
     controlPlaneEndpoint:
         domain: lb.kubesphere.local
         address: "192.168.1.8"
         port: 6443
```
###  获取安装程序可执行文件

下载可执行安装程序 `kk` 至一台目标机器：

{{< tabs >}}

{{< tab "如果您能正常访问 GitHub/Googleapis" >}}

从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或直接使用以下命令。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "如果您访问 GitHub/Googleapis 受限" >}}

先执行以下命令以确保您从正确的区域下载 KubeKey。

```bash
export KKZONE=cn
```

执行以下命令下载 KubeKey。

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

在您下载 KubeKey 后，如果您将其传至新的机器，且访问 Googleapis 同样受限，在您执行以下步骤之前请务必再次执行 `export KKZONE=cn` 命令。

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

执行以上命令会下载最新版 KubeKey (v2.2.2)，您可以修改命令中的版本号下载指定版本。

{{</ notice >}} 

为 `kk` 添加可执行权限：

```bash
chmod +x kk
```

{{< notice tip >}}

 您可以使用高级安装来控制自定义参数或创建多节点集群。具体来说，通过指定配置文件来创建集群。

{{</ notice >}}

###  使用 kubekey 部署

在当前位置创建配置文件 `master-HA.yaml`：

```bash
./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.22.10 -f master-HA.yaml
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
    control-plane:
     - master[1:3]
    worker:
     - node[1:3]
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: "192.168.1.8"
    port: 6443
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
    version: v3.3.0
spec:
  persistence:
    storageClass: ""        # If there is no default StorageClass in your cluster, you need to specify an existing StorageClass here.
  authentication:
    jwtSecret: ""           # Keep the jwtSecret consistent with the Host Cluster. Retrieve the jwtSecret by executing "kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret" on the Host Cluster.
  local_registry: ""        # Add your private registry address if it is needed.
  # dev_tag: ""               # Add your kubesphere image tag you want to install, by default it's same as ks-installer release version.
  etcd:
    monitoring: false       # Enable or disable etcd monitoring dashboard installation. You have to create a Secret for etcd before you enable it.
    endpointIps: localhost  # etcd cluster EndpointIps. It can be a bunch of IPs here.
    port: 2379              # etcd port.
    tlsEnable: true
  common:
    core:
      console:
        enableMultiLogin: true  # Enable or disable simultaneous logins. It allows different users to log in with the same account at the same time.
        port: 30880
        type: NodePort
    # apiserver:            # Enlarge the apiserver and controller manager's resource requests and limits for the large cluster
    #  resources: {}
    # controllerManager:
    #  resources: {}
    redis:
      enabled: false
      enableHA: false
      volumeSize: 2Gi # Redis PVC size.
    openldap:
      enabled: false
      volumeSize: 2Gi   # openldap PVC size.
    minio:
      volumeSize: 20Gi # Minio PVC size.
    monitoring:
      # type: external   # Whether to specify the external prometheus stack, and need to modify the endpoint at the next line.
      endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090 # Prometheus endpoint to get metrics data.
      GPUMonitoring:     # Enable or disable the GPU-related metrics. If you enable this switch but have no GPU resources, Kubesphere will set it to zero.
        enabled: false
    gpu:                 # Install GPUKinds. The default GPU kind is nvidia.com/gpu. Other GPU kinds can be added here according to your needs.
      kinds:
      - resourceName: "nvidia.com/gpu"
        resourceType: "GPU"
        default: true
    es:   # Storage backend for logging, events and auditing.
      # master:
      #   volumeSize: 4Gi  # The volume size of Elasticsearch master nodes.
      #   replicas: 1      # The total number of master nodes. Even numbers are not allowed.
      #   resources: {}
      # data:
      #   volumeSize: 20Gi  # The volume size of Elasticsearch data nodes.
      #   replicas: 1       # The total number of data nodes.
      #   resources: {}
      logMaxAge: 7             # Log retention time in built-in Elasticsearch. It is 7 days by default.
      elkPrefix: logstash      # The string making up index names. The index name will be formatted as ks-<elk_prefix>-log.
      basicAuth:
        enabled: false
        username: ""
        password: ""
      externalElasticsearchHost: ""
      externalElasticsearchPort: ""
  alerting:                # (CPU: 0.1 Core, Memory: 100 MiB) It enables users to customize alerting policies to send messages to receivers in time with different time intervals and alerting levels to choose from.
    enabled: false         # Enable or disable the KubeSphere Alerting System.
    # thanosruler:
    #   replicas: 1
    #   resources: {}
  auditing:                # Provide a security-relevant chronological set of records，recording the sequence of activities happening on the platform, initiated by different tenants.
    enabled: false         # Enable or disable the KubeSphere Auditing Log System.
    # operator:
    #   resources: {}
    # webhook:
    #   resources: {}
  devops:                  # (CPU: 0.47 Core, Memory: 8.6 G) Provide an out-of-the-box CI/CD system based on Jenkins, and automated workflow tools including Source-to-Image & Binary-to-Image.
    enabled: false             # Enable or disable the KubeSphere DevOps System.
    # resources: {}
    jenkinsMemoryLim: 2Gi      # Jenkins memory limit.
    jenkinsMemoryReq: 1500Mi   # Jenkins memory request.
    jenkinsVolumeSize: 8Gi     # Jenkins volume size.
    jenkinsJavaOpts_Xms: 1200m  # The following three fields are JVM parameters.
    jenkinsJavaOpts_Xmx: 1600m
    jenkinsJavaOpts_MaxRAM: 2g
  events:                  # Provide a graphical web console for Kubernetes Events exporting, filtering and alerting in multi-tenant Kubernetes clusters.
    enabled: false         # Enable or disable the KubeSphere Events System.
    # operator:
    #   resources: {}
    # exporter:
    #   resources: {}
    # ruler:
    #   enabled: true
    #   replicas: 2
    #   resources: {}
  logging:                 # (CPU: 57 m, Memory: 2.76 G) Flexible logging functions are provided for log query, collection and management in a unified console. Additional log collectors can be added, such as Elasticsearch, Kafka and Fluentd.
    enabled: false         # Enable or disable the KubeSphere Logging System.
    logsidecar:
      enabled: true
      replicas: 2
      # resources: {}
  metrics_server:                    # (CPU: 56 m, Memory: 44.35 MiB) It enables HPA (Horizontal Pod Autoscaler).
    enabled: false                   # Enable or disable metrics-server.
  monitoring:
    storageClass: ""                 # If there is an independent StorageClass you need for Prometheus, you can specify it here. The default StorageClass is used by default.
    node_exporter:
      port: 9100
      # resources: {}
    # kube_rbac_proxy:
    #   resources: {}
    # kube_state_metrics:
    #   resources: {}
    # prometheus:
    #   replicas: 1  # Prometheus replicas are responsible for monitoring different segments of data source and providing high availability.
    #   volumeSize: 20Gi  # Prometheus PVC size.
    #   resources: {}
    #   operator:
    #     resources: {}
    # alertmanager:
    #   replicas: 1          # AlertManager Replicas.
    #   resources: {}
    # notification_manager:
    #   resources: {}
    #   operator:
    #     resources: {}
    #   proxy:
    #     resources: {}
    gpu:                           # GPU monitoring-related plug-in installation.
      nvidia_dcgm_exporter:        # Ensure that gpu resources on your hosts can be used normally, otherwise this plug-in will not work properly.
        enabled: false             # Check whether the labels on the GPU hosts contain "nvidia.com/gpu.present=true" to ensure that the DCGM pod is scheduled to these nodes.
        # resources: {}
  multicluster:
    clusterRole: none  # host | member | none  # You can install a solo cluster, or specify it as the Host or Member Cluster.
  network:
    networkpolicy: # Network policies allow network isolation within the same cluster, which means firewalls can be set up between certain instances (Pods).
      # Make sure that the CNI network plugin used by the cluster supports NetworkPolicy. There are a number of CNI network plugins that support NetworkPolicy, including Calico, Cilium, Kube-router, Romana and Weave Net.
      enabled: false # Enable or disable network policies.
    ippool: # Use Pod IP Pools to manage the Pod network address space. Pods to be created can be assigned IP addresses from a Pod IP Pool.
      type: none # Specify "calico" for this field if Calico is used as your CNI plugin. "none" means that Pod IP Pools are disabled.
    topology: # Use Service Topology to view Service-to-Service communication based on Weave Scope.
      type: none # Specify "weave-scope" for this field to enable Service Topology. "none" means that Service Topology is disabled.
  openpitrix: # An App Store that is accessible to all platform tenants. You can use it to manage apps across their entire lifecycle.
    store:
      enabled: false # Enable or disable the KubeSphere App Store.
  servicemesh:         # (0.3 Core, 300 MiB) Provide fine-grained traffic management, observability and tracing, and visualized traffic topology.
    enabled: false     # Base component (pilot). Enable or disable KubeSphere Service Mesh (Istio-based).
```

#### 持久化存储配置

如本文开头的前提条件所说，对于生产环境，我们建议您准备持久性存储，可参考以下说明进行配置。若搭建开发和测试，您可以直接使用默认集成的 OpenEBS 准备 LocalPV，则可以跳过这小节。

{{< notice note >}}
如果您有已有存储服务端，例如华为云可使用 [弹性文件存储（SFS）](https://support.huaweicloud.com/productdesc-sfs/zh-cn_topic_0034428718.html) 来作为存储服务。继续编辑上述 `config-sample.yaml` 文件，找到 `[addons]` 字段，这里支持定义任何持久化存储的插件或客户端，如 CSI、NFS Client、Ceph、GlusterFS，您可以根据您自己的持久化存储服务类型，并参考 [持久化存储服务](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/) 中对应的示例 YAML 文件进行设置。
{{</ notice >}}

###  执行命令创建集群

 ```bash
 # 指定配置文件创建集群
 ./kk create cluster --with-kubesphere v3.3.0 -f master-HA.yaml

 # 查看 KubeSphere 安装日志  -- 直到出现控制台的访问地址和登录帐户
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
 ```

```
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.1.10:30880
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
https://kubesphere.io             2020-08-28 01:25:54
#####################################################
```

访问公网 IP + Port 为部署后的使用情况，使用默认帐户密码 (`admin/P@88w0rd`)，文章组件安装为最大化，登录点击`平台管理>集群管理`可看到下图安装组件列表和机器情况。


## 如何自定义开启可插拔组件

点击**集群管理** > **定制资源定义**，在过滤条件框输入 `ClusterConfiguration`。
点击 `ClusterConfiguration` 详情，对 `ks-installer` 编辑保存退出即可，组件描述介绍：[文档说明](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml)。
