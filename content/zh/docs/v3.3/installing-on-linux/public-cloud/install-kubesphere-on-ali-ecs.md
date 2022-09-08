---
title: "KubeSphere 在阿里云 ECS 高可用实例"
keywords: "Kubesphere 安装， 阿里云， ECS， 高可用性， 高可用性，  负载均衡器"
description: "了解如何在阿里云虚拟机上创建高可用的 KubeSphere 集群。"

Weight: 3240
---

对于生产环境，我们需要考虑集群的高可用性。本文教您部署如何在多台阿里 ECS 实例快速部署一套高可用的生产环境。要满足 Kubernetes 集群服务需要做到高可用，需要保证 kube-apiserver 的 HA ，可使用以下下列两种方式：

- 阿里云 SLB （推荐）
- keepalived + haproxy [keepalived + haproxy](https://kubesphere.com.cn/forum/d/1566-kubernetes-keepalived-haproxy)对 kube-apiserver 进行负载均衡，实现高可用 kubernetes 集群。

## 前提条件

- 考虑到数据的持久性，对于生产环境，我们建议您准备持久化存储。若搭建开发和测试，您可以直接使用默认集成的 OpenEBS 准备 LocalPV；
- SSH 可以访问所有节点；
- 所有节点的时间同步；
- Red Hat 在其 Linux 发行版本中包括了 SELinux，建议关闭 SELinux 或者将 SELinux 的模式切换为 Permissive [宽容]工作模式。

## 部署架构

![部署架构](/images/docs/v3.3/ali-ecs/ali.png)

## 创建主机

本示例创建 SLB + 6 台 **CentOS Linux release 7.6.1810 (Core)** 的虚拟机，每台配置为 **2 Core 4 GB 40 G**，仅用于最小化安装，若资源充足建议使用每台配置 **4 Core 8 GB 100 G** 以上的虚拟机。

| 主机IP | 主机名称 | 角色 |
| --- | --- | --- |
|39.104.82.170|Eip|slb|
|172.24.107.72|master1|master1, etcd|
|172.24.107.73|master2|master2, etcd|
|172.24.107.74|master3|master3, etcd|
|172.24.107.75|node1|node|
|172.24.107.76|node2|node|
|172.24.107.77|node3|node|

> 注意: 由于演示机器有限，所以把 etcd 跟 master 放在同样 3 台机器，在生产环境建议单独部署至少 3 台 etcd，提高稳定性。

## 使用阿里 SLB 部署

以下创建一个 SLB，设置监听集群的 6443 端口。

###  创建 SLB

进入到阿里云控制， 在左侧列表选择'负载均衡'， 选择'实例管理' 进入下图， 选择'创建负载均衡'

![1-1-创建slb](/images/docs/v3.3/ali-ecs/ali-slb-create.png)

###  配置 SLB

配置规格根据自身流量规模创建

![2-1-创建slb](/images/docs/v3.3/ali-ecs/ali-slb-config.png)

注意在后面的 config.yaml 需要配置 slb 分配的地址

```yaml
controlPlaneEndpoint:
   domain: lb.kubesphere.local
   address: "39.104.82.170"
   port: 6443
```

###  配置SLB 主机实例

需要在服务器组添加需要负载的3台 master 主机后按下图顺序配置监听 TCP 6443 端口 (api-server)

![3-1-添加主机](/images/docs/v3.3/ali-ecs/ali-slb-add.png)

![3-2-配置监听端口](/images/docs/v3.3/ali-ecs/ali-slb-listen-conf1.png)

![3-3-配置监听端口](/images/docs/v3.3/ali-ecs/ali-slb-listen-conf2.png)

![3-4-配置监听端口](/images/docs/v3.3/ali-ecs/ali-slb-listen-conf3.png)

{{< notice note >}}
- 现在的健康检查暂时是失败的，因为还没部署 master 的服务，所以端口 telnet 不通的。
- 完成上述操作后，提交审核即可
{{</ notice >}}

###  获取 Installer

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

###  使用 KubeKey 部署集群

在当前位置创建配置文件 `config-sample.yaml`：

```bash
./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.22.10 -f config-sample.yaml
```

> 提示：默认是 Kubernetes 1.17.9，这些 Kubernetes 版本也与 KubeSphere 同时进行过充分的测试： v1.15.12, v1.16.13, v1.17.9 (default), v1.18.6，您可以根据需要指定版本。

###  集群配置调整

修改配置文件 `config-sample.yaml`：

```
vi config-sample.yaml
```

参考以下 `config-sample.yaml` 的主机节点配置，替换为您

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
      address: "39.104.82.170"
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
      registryMirrors: []
      insecureRegistries: []
    addons: []

···
# 其它配置可以在安装后之后根据需要进行修改
```

#### 持久化存储配置

如本文开头的前提条件所说，对于生产环境，我们建议您准备持久性存储，可参考以下说明进行配置。若搭建开发和测试，您可以直接使用默认集成的 OpenEBS 准备 LocalPV，则可以跳过这小节。

{{< notice note >}}
- 继续编辑上述 `config-sample.yaml` 文件，找到 `[addons]` 字段，这里支持定义任何持久化存储的插件或客户端，如 CSI (
alibaba-cloud-csi-driver)、NFS Client、Ceph、GlusterFS，您可以根据您自己的持久化存储服务类型，并参考 [持久化存储服务](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/) 中对应的示例 YAML 文件进行设置。
- 只需要将 CSI 存储插件安装时需要 apply 的所有 yaml 文件在 `[addons]` 中列出即可，注意预先参考 [Alibaba Cloud Kubernetes CSI Plugin](https://github.com/kubernetes-sigs/alibaba-cloud-csi-driver#alibaba-cloud-kubernetes-csi-plugin)，选择您需要的存储类型的 CSI 插件，如 Cloud Disk CSI Plugin、NAS CSI Plugin、NAS CSI Plugin、OSS CSI Plugin，然后在 CSI 的相关 yaml 中配置对接阿里云的相关信息。
{{</ notice >}}

###  执行命令创建集群

完成上述配置后，通过配置文件创建集群。

```bash
./kk create cluster -f config-sample.yaml

# 查看 KubeSphere 安装日志  -- 直到出现控制台的访问地址和登录帐户
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

```
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://172.24.107.72:30880
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
https://kubesphere.io             2020-08-24 23:30:06
#####################################################
```

- 访问公网 IP + Port 为部署后的使用情况，使用默认帐户密码 (`admin/P@88w0rd`)，文章安装为最小化，登录点击`工作台` 可看到下图安装组件列表和机器情况。

![面板图](/images/docs/v3.3/ali-ecs/succes.png)

## 如何自定义开启可插拔组件

- 点击**集群管理** > **定制资源定义**，在过滤条件框输入 `ClusterConfiguration`。

- 点击 `ClusterConfiguration` 详情，对 `ks-installer` 编辑保存退出即可，组件描述介绍:[文档说明](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml)。

## FAQ

> 提示: 如果安装过程中碰到 `Failed to add worker to cluster: Failed to exec command...`
> <br>
``` bash 处理方式
kubeadm reset
```
