---
title: "KubeSphere 在阿里云 ECS 高可用实例"
keywords: "Kubesphere 安装， 阿里云， ECS， 高可用性， 高可用性， 负载均衡器"
description: "本教程用于安装高可用性集群"

Weight: 2230
---

由于对于生产环境，我们需要考虑集群的高可用性。教你部署如何在阿里 ECS 实例服务快速部署一套高可用的生产环境
Kubernetes 服务需要做到高可用，需要保证 kube-apiserver 的 HA ，推荐下列两种方式
 1. 阿里云 SLB 
 2. keepalived + haproxy [keepalived + haproxy](https://kubesphere.com.cn/forum/d/1566-kubernetes-keepalived-haproxy)对 kube-apiserver 进行负载均衡，实现高可用 kubernetes 集群。

 ## 前提条件

 - 请遵循该[指南] (https://github.com/kubesphere/kubekey)，确保您已经知道如何将 KubeSphere 与多节点集群一起安装。有关用于安装的 config.yaml 文件的详细信息。本教程重点介绍配置阿里负载均衡器服务高可用安装。
 - 考虑到数据的持久性，对于生产环境，我们不建议您使用存储OpenEBS，建议 NFS ， GlusterFS 等存储(需要提前安装)。文章为了进行开发和测试，集成的 OpenEBS 直接将 LocalPV 设置为存储服务。
 - SSH 可以访问所有节点。
 - 所有节点的时间同步。
 - Red Hat 在其 Linux 发行版本中包括了SELinux，建议关闭 SELinux 或者将 SELinux 的模式切换为 Permissive [宽容]工作模式。

 ## 部署架构
 
 ![部署架构](/images/docs/ali-ecs/ali.png)
 
 ## 创建主机

 本示例创建 SLB + 6 台 **CentOS Linux release 7.6.1810 (Core)** 的虚拟机，每台配置为 2Core4GB40G

 | 主机IP | 主机名称 | 角色 |
 | --- | --- | --- |
 |39.104.82.170|Eip|slb|
 |172.24.107.72|master1|master1, etcd|
 |172.24.107.73|master2|master2, etcd| 
 |172.24.107.74|master3|master3, etcd| 
 |172.24.107.75|node1|node|
 |172.24.107.76|node2|node|
 |172.24.107.77|node3|node|
 
 > 注意:机器有限，所以把 etcd 放入 master，在生产环境建议单独部署 etcd，提高稳定性

 ## 使用阿里 SLB 部署
 ###  创建 SLB
 
 进入到阿里云控制， 在左侧列表选择'负载均衡'， 选择'实例管理' 进入下图， 选择'创建负载均衡'
 
 ![1-1-创建slb](/images/docs/ali-ecs/ali-slb-create.png)
 
 ###  配置 SLB
 
 配置规格根据自身流量规模创建
 
 ![2-1-创建slb](/images/docs/ali-ecs/ali-slb-config.png)
 
后面的 config.yaml 需要配置 slb 分配的地址
 ```yaml
     controlPlaneEndpoint:
         domain: lb.kubesphere.local
         address: "39.104.82.170"
         port: "6443"
```
 ###  配置SLB 主机实例
 
 需要在服务器组添加需要负载的3台 master 主机后按下图顺序配置监听 6443 端口( api-server ) 
 
![3-1-添加主机](/images/docs/ali-ecs/ali-slb-add.png)

![3-2-配置监听端口](/images/docs/ali-ecs/ali-slb-listen-conf1.png)

![3-3-配置监听端口](/images/docs/ali-ecs/ali-slb-listen-conf2.png)

![3-4-配置监听端口](/images/docs/ali-ecs/ali-slb-listen-conf3.png)

再按上述操作配置监听 30880 端口( ks-console )，主机添加选择全部主机节点。

![3-5-配置监听端口](/images/docs/ali-ecs/ali-slb-listen-conf4.png)

- <font color=red>现在的健康检查暂时是失败的，因为还没部署 master 的服务，所以端口 telnet 不通的。</font>
- 然后提交审核即可

 ###  获取安装程序可执行文件
 
 ```bash
 #下载 kk installer 至任意一台机器
 curl -O -k https://kubernetes.pek3b.qingstor.com/tools/kubekey/kk
 chmod +x kk
 ```

{{< notice tip >}} 

 您可以使用高级安装来控制自定义参数或创建多节点群集。具体来说，通过指定配置文件来创建集群。
 
{{</ notice >}}

 ###  使用 kubekey 部署k8s集群和 KubeSphere 控制台

 ```bash
 # 在当前位置创建配置文件 config-sample.yaml |包含 KubeSphere 的配置文件
 ./kk create config --with-kubesphere v3.0.0 -f config-sample.yaml
--- 
# 同时安装存储插件 (支持：localVolume、nfsClient、rbd、glusterfs)。您可以指定多个插件并用逗号分隔。请注意，您添加的第一个将是默认存储类。
./kk create config --with-storage localVolume --with-kubesphere v3.0.0 -f config-sample.yaml
 ```

```bash
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://172.24.107.72:30880
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
https://kubesphere.io             2020-08-24 23:30:06
#####################################################
```
 ###  集群配置调整
 
 ```yaml
 #vi ~/config-sample.yaml
 apiVersion: kubekey.kubesphere.io/v1alpha1
 kind: Cluster
 metadata:
   name: config-sample
 spec:
   hosts:
   - {name: master1, address: 172.24.107.72, internalAddress: 172.24.107.72, user: root, password: QWEqwe123}
   - {name: master2, address: 172.24.107.73, internalAddress: 172.24.107.73, user: root, password: QWEqwe123}
   - {name: master3, address: 172.24.107.74, internalAddress: 172.24.107.74, user: root, password: QWEqwe123}
   - {name: node1, address: 172.24.107.75, internalAddress: 172.24.107.75, user: root, password: QWEqwe123}
   - {name: node2, address: 172.24.107.76, internalAddress: 172.24.107.76, user: root, password: QWEqwe123}
   - {name: node3, address: 172.24.107.77, internalAddress: 172.24.107.77, user: root, password: QWEqwe123}
 
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
     address: "39.104.82.170"
     port: "6443"
   kubernetes:
     version: v1.17.9
     imageRepo: kubesphere
     clusterName: cluster.local
   network:
     plugin: calico
     kubePodsCIDR: 10.233.64.0/18
     kubeServiceCIDR: 10.233.0.0/18
   registry:
     registryMirrors: ["https://*.mirror.aliyuncs.com"] # # input your registryMirrors
     insecureRegistries: []
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
     monitoring: true
     endpointIps: 172.24.107.72,172.24.107.73,172.24.107.74
     port: 2379
     tlsEnable: true
   common:
     es:
       elasticsearchDataVolumeSize: 20Gi
       elasticsearchMasterVolumeSize: 4Gi
       elkPrefix: logstash
       logMaxAge: 7
     mysqlVolumeSize: 20Gi
     minioVolumeSize: 20Gi
     etcdVolumeSize: 20Gi
     openldapVolumeSize: 2Gi
     redisVolumSize: 2Gi
   console:
     enableMultiLogin: false  # enable/disable multi login
     port: 30880
   alerting:
     enabled: false
   auditing:
     enabled: false
   devops:
     enabled: false
     jenkinsMemoryLim: 2Gi
     jenkinsMemoryReq: 1500Mi
     jenkinsVolumeSize: 8Gi
     jenkinsJavaOpts_Xms: 512m
     jenkinsJavaOpts_Xmx: 512m
     jenkinsJavaOpts_MaxRAM: 2g
   events:
     enabled: false
     ruler:
       enabled: true
       replicas: 2
   logging:
     enabled: false
     logsidecarReplicas: 2
   metrics_server:
     enabled: true
   monitoring:
     prometheusMemoryRequest: 400Mi
     prometheusVolumeSize: 20Gi
   multicluster:
     clusterRole: none  # host | member | none
   networkpolicy:
     enabled: false
   notification:
     enabled: false
   openpitrix:
     enabled: false
   servicemesh:
     enabled: false
 ```

 ###  执行命令创建集群
 ```bash
 # 指定配置文件创建集群
./kk create cluster -f config-sample.yaml

 # 查看 KubeSphere 安装日志  -- 直到出现控制台的访问地址和登陆账号
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```
 
 - 访问公网 IP + Port 为部署后的使用情况，使用默认账号密码 (`admin/P@88w0rd`)，文章安装为最小化，登陆点击`工作台` 可看到下图安装组件列表和机器情况。

 ![面板图](/images/docs/ali-ecs/succes.png)

## 如何自定义开启可插拔组件

 + 点击 `集群管理` - `自定义资源CRD` ，在过滤条件框输入 `ClusterConfiguration` ，如图下 

 ![修改KsInstaller](/images/docs/ali-ecs/update_crd.png)
 
 + 点击 `ClusterConfiguration` 详情，对 `ks-installer` 编辑保存退出即可，组件描述介绍:[文档说明](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml)
 
 ![修改KsInstaller](/images/docs/ali-ecs/ks-install-source.png)

## 安装问题

> 提示: 如果安装过程中碰到 `Failed to add worker to cluster: Failed to exec command...`
> <br>
``` bash 处理方式
    kubeadm reset
```
