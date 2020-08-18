---
标题: "KubeSphere 在 VMware vSphere 高可用实例"
关键字: "Kubesphere，安装，高可用性，高可用性，负载均衡器"
描述: "本教程用于安装高可用性集群"
---

# 在vSphere部署高可用的 KubeSphere

对于生产环境，我们需要考虑集群的高可用性。如果关键组件（例如kube-apiserver，kube-scheduler和kube-controller-manager）都在同一主节点上运行，则一旦主节点出现故障，Kubernetes和KubeSphere将不可用。因此，我们需要通过为负载均衡器配置多个主节点来设置高可用性集群。您可以使用任何云负载平衡器或任何硬件负载平衡器（例如F5）。另外，Keepalived和HAproxy或Nginx也是创建高可用性集群的替代方法。

本教程为您提供了一个示例，说明如何使用[keepalived + haproxy](https://kubesphere.com.cn/forum/d/1566-kubernetes-keepalived-haproxy)对kube-apiserver进行负载均衡，实现高可用kubernetes集群。

## 前提条件

- 请遵循该[指南](https://github.com/kubesphere/kubekey)，确保您已经知道如何将KubeSphere与多节点集群一起安装。有关用于安装的config yaml文件的详细信息，请参阅多节点安装。本教程重点介绍如何配置负载均衡器。
- 您需要一个VMware vSphere帐户来创建VM资源。
- 考虑到数据的持久性，对于生产环境，我们建议您准备持久性存储并预先创建StorageClass。为了进行开发和测试，您可以使用集成的OpenEBS直接将LocalPV设置为存储服务。

## 部署架构
![部署架构](../../../../../static/images/docs/kubesphereOnVsphere-部署架构.png)
## 创建主机

本示例创建 9 台 **CentOS Linux release 7.6.1810 (Core)** 的虚拟机，每台配置为 8Core16GB100G。

| 主机IP | 主机名称 | 角色 |
| --- | --- | --- |
|10.10.71.214|master1|master1, etcd|
|10.10.71.73|master2|master2, etcd|
|10.10.71.62|master3|master3, etcd|
|10.10.71.75|node1|node|
|10.10.71.76|node2|node|
|10.10.71.79|node3|node|
|10.10.71.67|vip|vip|
|10.10.71.77|lb-0|lb（keepalived + haproxy）|
|10.10.71.66|lb-1|lb（keepalived + haproxy）|
选择可创建的资源池，点击右键-新建虚拟机(创建虚拟机入口请好几个，自己选择）
![0-1-新创](../../../../../static/images/docs/kubesphereOnVsphere-0-1-新创.png)
选择创建类型-创建新虚拟机
![0-1-1创建类型](../../../../../static/images/docs/kubesphereOnVsphere-0-1-1创建类型.png)
填写虚拟机名称和存放文件夹
![0-1-2-name](../../../../../static/images/docs/kubesphereOnVsphere-0-1-2-name.png)
选择计算资源
![0-1-3-资源](../../../../../static/images/docs/kubesphereOnVsphere-0-1-3-资源.png)
选择存储
![0-1-4-存储](../../../../../static/images/docs/kubesphereOnVsphere-0-1-4-存储.png)
选择兼容性，这里是ESXi7.0及更高版本
![0-1-5-兼容性](../../../../../static/images/docs/kubesphereOnVsphere-0-1-5-兼容性.png)
选择客户机操作系统，Linux CentOS 7 (64位)
![0-1-6-系统](../../../../../static/images/docs/kubesphereOnVsphere-0-1-6-系统.png)
自定义硬件，这里操作系统是挂载的ISO文件（打开电源时连接），网络是VLAN71（勾选）
![0-1-7-硬件](../../../../../static/images/docs/kubesphereOnVsphere-0-1-7-硬件.png)
清单，确认无误后，点击确定
![0-1-8](../../../../../static/images/docs/kubesphereOnVsphere-0-1-8.png)

## 部署keepalived+haproxy
###  1. yum 安装

```bash
#在主机为lb-0和lb-1中部署keepalived+haproxy
#即IP为10.10.71.77与10.10.71.66的服务器上安装部署haproxy、keepalived、psmisc
yum install keepalived haproxy psmisc -y
```

### 2. 配置haproxy

在IP为10.10.71.77与10.10.71.66的服务器 ，配置haproxy (两台lb机器配置一致即可，注意后端服务地址)
```bash
#Haproxy配置/etc/haproxy/haproxy.cfg
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
```bash
#启动之前检查语法是否有问题
haproxy -f /etc/haproxy/haproxy.cfg -c
#启动Haproxy，并设置开机自启动
systemctl restart haproxy && systemctl enable haproxy
#停止Haproxy
systemctl stop haproxy
```
### 3. 配置keepalived
```bash
# 主haproxy 77 lb-0-10.10.71.77
#/etc/keepalived/keepalived.conf
global_defs {
  notification_email {
  }
  smtp_connect_timeout 30    #连接超时时间
  router_id LVS_DEVEL01 ##相当于给这个服务器起个昵称
  vrrp_skip_check_adv_addr
  vrrp_garp_interval 0
  vrrp_gna_interval 0
}
vrrp_script chk_haproxy {
  script "killall -0 haproxy"
  interval 2
  weight 2
}
vrrp_instance haproxy-vip {
  state MASTER  #主服务器 是MASTER
  priority 100  #主服务器优先级要比备服务器高
  interface ens192                        #实例绑定的网卡
  virtual_router_id 60 #定义一个热备组，可以认为这是60号热备组
  advert_int 1 #1秒互相通告一次，检查对方死了没。
  authentication {
    auth_type PASS #认证类型
    auth_pass 1111 #认证密码  这些相当于暗号
  }
  unicast_src_ip 10.10.71.77      #当前机器地址
  unicast_peer {
    10.10.71.66                       #peer中其它机器地址
  }
  virtual_ipaddress {
    #vip地址
    10.10.71.67/24 
  }
  track_script {
    chk_haproxy
  }
}
```
```bash
#备haproxy 66 lb-1-10.10.71.66
#/etc/keepalived/keepalived.conf
global_defs {
  notification_email {
  }
  router_id LVS_DEVEL02 ##相当于给这个服务器起个昵称
  vrrp_skip_check_adv_addr
  vrrp_garp_interval 0
  vrrp_gna_interval 0
}
vrrp_script chk_haproxy {
  script "killall -0 haproxy"
  interval 2
  weight 2
}
vrrp_instance haproxy-vip {
  state BACKUP #备份服务器 是backup
  priority 90 #优先级要低（把备份的90修改为100）
  interface ens192                        #实例绑定的网卡
  virtual_router_id 60
  advert_int 1
  authentication {
    auth_type PASS
    auth_pass 1111
  }
  unicast_src_ip 10.10.71.66      #当前机器地址
  unicast_peer {
    10.10.71.77                         #peer中其它机器地址
  }
  virtual_ipaddress {
    #加/24
    10.10.71.67/24 
  }
  track_script {
    chk_haproxy
  }
}
```
```bash
#启动keepalived，设置开机自启动
systemctl restart keepalived && systemctl enable keepalived
systemctl stop keepaliv
systemctl start keepalived    #开启keepalived服务
```

### 4. 验证keepalived + haproxy

- 使用`ip a s`查看各lb节点vip绑定情况
- 暂停vip所在节点haproxy：`systemctl stop haproxy`
- 再次使用`ip a s`查看各lb节点vip绑定情况，查看vip是否发生漂移
- 或者使用`systemctl status -l keepalived` 命令查看

## 获取安装程序可执行文件

```bash
#下载installer 至一台目标机器
curl -O -k https://kubernetes.pek3b.qingstor.com/tools/kubekey/kk
chmod +x kk
```

## 创建多节点群集

您可以使用高级安装来控制自定义参数或创建多节点群集。具体来说，通过指定配置文件来创建集群。

### 使用kubekey部署k8s集群

```bash
# 创建配置文件(一个示例配置文件)|包含kubesphere的配置文件
./kk create config --with-kubesphere v3.0.0 -f ~/config-sample.yaml
#如果重复安装，镜像就不用再下载了，可以skip
./kk create cluster -f ~/config-sample.yaml --debug --skip-pull-images
#删除cluster
./kk delete cluster -f ~/config-sample.yaml --debug --skip-pull-images
#小提示，如果安装过程中碰到`Failed to add worker to cluster: Failed to exec command...`
kubeadm reset
```
#### 多集群配置
```yaml
#vi ~/config-sample.yaml
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
    master: 
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
    version: v3.0.0
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
    enableMultiLogin: false  # enable/disable multiple sing on, it allows an account can be used by different users at the same time.
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
  openpitrix:          # Whether to install KubeSphere Application Store. It provides an application store for Helm-based applications, and offer application lifecycle management
    enabled: false
  servicemesh:         # Whether to install KubeSphere Service Mesh (Istio-based). It provides fine-grained traffic management, observability and tracing, and offer visualization for traffic topology
    enabled: false
```
#### 输出结果
```bash
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.10.71.214:30880
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
https://kubesphere.io             2020-08-15 23:32:12
#####################################################
```

