---
title: '在 VMware vSphere 中构建 Kubernetes 存储环境'
tag: 'KubeSphere'
keywords: 'KubeSphere, Kubernetes, vSphere, 存储, CSI, vCenter, CNS'
description: '本文将以 VMware vSphere CNS+KubeSphere 为工具在虚拟化环境搭建容器及存储环境。'
createTime: '2022-10-19'
author: '马伟'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/k8s-vmware-vsphere-cover.png'
---

> 作者：马伟，青云科技容器顾问，云原生爱好者，目前专注于云原生技术，云原生领域技术栈涉及 Kubernetes、KubeSphere、kubekey等。

相信很多小伙伴和企业在构建容器集群时都会考虑存储选型问题，不论是块存储 / 文件存储 / 对象存储的选择，亦或是一体机 / 裸机+外置存储 / 虚拟化+存储的纠结，都是在规划容器集群时的顾虑。对于原先就有虚拟化环境的用户来说，我能否**直接搭建容器集群在虚拟化环境中，并直接使用现有的存储用于容器**呢？本文将以 VMware vSphere CNS+KubeSphere 为工具在虚拟化环境搭建容器及存储环境。

## vSphere CNS

VMware vSphere Cloud Native Storage（CNS）是 VMware 结合 vSphere 和 K8s 提供容器卷管理的组件。K8s 存储有 in tree 和 out of tree 两种存储类型，in tree 存储如 AWS EBS，Ceph RBD 等。是 VMware in tree 存储 VCP 演进到 out of tree 存储提供的符合 CSI 插件规范的容器存储。它由两部分构成：

- **vCenter 的 CNS 控制平台**。vCenter 调度底层虚拟化结合的存储平台创建容器存储卷。
- **K8s 的 CSI 存储插件**。对 vCenter 创建的卷进行附加 / 分离 / 挂载等操作。

![](https://pek3b.qingstor.com/kubesphere-community/images/1660111355913-8b5fed67-a378-4b31-a418-a17f066c28d2.png)

结合上面这张官方提供的图，可以理解为，现在我的 vSphere 虚拟化环境已经准备好了不同的存储（本地存储 /NAS/FC SAN/vSAN），*我不用在乎存储是什么品牌，不需要考虑这款存储是否有厂商支持的 CSI 插件，我可以基于业务类型，将不同的存储直接挂载给我不同业务的容器使用。*

这种设计模式也带来众多好处 :
- **简便运维**。想在 vSphere 虚拟化平台上运行容器的用户，不再担心怎么结合存储，不用再去纠结 Ceph 还是 GlusterFS 好用，也不用想去哪倒腾个闲置的 NFS 挂在容器集群上了。相反可以在 vSphere 上监控容器虚拟机节点和存储状态，运维方式不变，运维效率得到提升。
- **屏蔽存储差异**。不论是 NAS 存储还是集中存储，只要对接于 vSphere 存储，使用 VMFS/NFS/vSAN 协议或格式的存储，皆可提供给容器使用。
- **基于策略的放置**。基于存储策略（SPBM）的 StorageClass Provisioner 定义，管理员可在虚拟化平台定义相应的存储策略， 直接应用于 SC 中给容器使用。

## 容器环境搭建

在了解了基本概念后，本章开始实操演练。首先搭建一个 vSphere 虚拟化上的容器集群。为了快速搭建一个从 0 到 1 的容器集群，此处使用一款开源工具——"KubeKey"。Kubekey 是青云开源的一款快速搭建 K8s 和 KubeSphere 容器集群的工具，KubeSphere 是青云开源的 K8s PaaS 管理平台，可以帮助用户可视化统一管理所有 K8s 环境，包括 AWS EKS，华为 CCE，VMware Tanzu 等 K8s 环境纳管。KubeKey 和 KubeSphere 皆通过 CNCF 一致性认证，感兴趣的小伙伴可以在 [GitHub](https://github.com/kubesphere/kubekey) 查看详情。

获取 KubeKey 很简单，使用以下命令：

接下来使用一条命令快速安装一个 Kubernetes 平台和 KubeSphere 平台。

```bash
🐳  → export KKZONE=cn #国内网络环境友好
🐳  → curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.1 sh -
```

Docker 的出现让我们可以一条命令运行一个 MySQL 应用，Kubekey 让我们一条命令运行一个完整的 K8s 集群和 KubeSphere 平台。

```bash
🐳  → kk create cluster --with-kubernetes v1.23.8 --with-kubesphere v3.3.0
```

若是多台节点，使用配置文件定义节点信息即可。

```yaml
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  roleGroups:
    etcd:
    - master
    control-plane:
    - master
    worker:
    - node1
```

在 kk create 后等待 20 分钟，K8s 和 KubeSphere 即可搭建完毕。

![](https://pek3b.qingstor.com/kubesphere-community/images/1660114838093-308a3490-102a-4034-9987-483585db42d0.png)

KubeKey 不仅是一个 K8s 集群创建工具，还可以轻松创建 Harbor，Addon 网络存储插件，并可基于 Manifest 的形式定义节点依赖包，镜像，工具后标准化交付，过段时间我会更新一篇 KubeKey 使用手册，可以三连关注一波。

## vSphere 容器存储插件安装

第一章节提过，vSphere CNS 整体由 vCenter 的 CNS 控制面和面向 k8s 的存储插件构成。CNS 控制面已存在于 vCenter 6.7U3 及更高版本中，接下来只需要在 vSphere 虚拟机部署的 k8s 中安装 CSI 插件即可。

这里有一个准备条件，在准备 K8s 节点虚拟机时，要先设置以下参数：
- 安装 VMTools；
- 配置虚拟机高级参数 disk.EnableUUID=TRUE；
- 调整虚拟机硬件版本至 15 以上；
- 添加 VMware 准 SCSI 存储控制器到 VM，使用 VMware 准虚拟类型。

安装 vSphere CSI 插件时，提前查阅官网检查对应版本的 vCenter，K8s 的兼容性。

### 安装 vsphere-cloud-controller-manager

对所有节点打标签

```bash
🐳  → kubectl taint node k8s node.cloudprovider.kubernetes.io/uninitialized=true:NoSchedule
```

下载 vsphere-cloud-controller-manager yaml 文件，

```bash
🐳  → wget https://raw.githubusercontent.com/kubernetes/cloud-provider-vsphere/release-1.23/releases/v1.23/vsphere-cloud-controller-manager.yaml
```

修改其中 Secret 和 Configmap 部分的 vCenter 配置：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: vsphere-cloud-secret
  namespace: kube-system
stringData:
  10.0.0.1.username: "<ENTER_YOUR_VCENTER_USERNAME>"
  10.0.0.1.password: "<ENTER_YOUR_VCENTER_PASSWORD>"
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vsphere-cloud-config
  namespace: kube-system
data:
    vcenter:
      <your-vcenter-name-here>:
        server: 10.0.0.1
        user: <use-your-vcenter-user-here>
        password: <use-your-vcenter-password-here>
        datacenters:
          - Datacenter01
```

作为一个合格的 yaml 工程师，一定注意缩进。在调整完后，kubectl apply 一下：

```bash
🐳  → kubectl apply -f vsphere-con-ma.yaml
serviceaccount/cloud-controller-manager created
secret/vsphere-cloud-secret created
configmap/vsphere-cloud-config created
rolebinding.rbac.authorization.k8s.io/servicecatalog.k8s.io:apiserver-authentication-reader created
clusterrolebinding.rbac.authorization.k8s.io/system:cloud-controller-manager created
clusterrole.rbac.authorization.k8s.io/system:cloud-controller-manager created
daemonset.apps/vsphere-cloud-controller-manager created

🐳  → kubectl get pods -A | grep vsphere
kube-system                    vsphere-cloud-controller-manager-km68c           1/1     Running   0          3m4s
```

创建 vmware-system-csi 命名空间：

```bash
🐳  → kubectl create ns vmware-system-csi
namespace/vmware-system-csi created
```

创建 CSI 驱动配置文件：

```bash
🐳  → cat /etc/kubernetes/csi-vsphere.conf
[Global]
cluster-id = "<cluster-id>"#t填写集群名称

[VirtualCenter "<IP or FQDN>"] #填写vcenter信息
insecure-flag = "<true or false>"#选择false后要注明ca文件和指纹，可选择true
user = "<username>"
password = "<password>"
port = "<port>"
datacenters = "<datacenter1-path>"#选择集群节点所在的datacenter
```

生成 Secret：

```bash
🐳  → kubectl create secret generic vsphere-config-secret --from-file=csi-vsphere.conf --namespace=vmware-system-csi
```

安装 vsphere-csi-driver：

```bash
🐳  → kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/vsphere-csi-driver/v2.6.0/manifests/vanilla/vsphere-csi-driver.yaml
```

等待 Pod 成功运行：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660118233167-2f2b07dc-c52f-4970-8428-26ff748f79f1.png)

查看 csidriver 和 csinode 状态：

```bash
🐳  → kubectl get csidriver
NAME                     ATTACHREQUIRED   PODINFOONMOUNT   STORAGECAPACITY   TOKENREQUESTS   REQUIRESREPUBLISH   MODES        AGE
csi.vsphere.vmware.com   true             false            false             <unset>         false               Persistent   85m
🐳  → kubectl get CSINODE
NAME   DRIVERS   AGE
k8s    1         16h
```

到这里 vsphere csi driver 安装完成，可以准备底层存储和 StorageClass 置备了。

### StorageClass 创建

CNS 使 vSphere 存储成为运行有状态 K8s 工作负载的平台，因此 CNS 可基于存储策略或指定挂载的 vSphere 存储（VMFS/NFS/vSAN）创建 StorageClass 进行动态持久卷置备。

创建 StorageClass：

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: example-block-sc
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: csi.vsphere.vmware.com
parameters:
  storagepolicyname: "vSAN Default Storage Policy"  #使用存储策略定义
# datastoreurl: "ds:///vmfs/volumes/vsan:52cdfa80721ff516-ea1e993113acfc77/" #使用指定的数据存储定义，可以是挂载给ESXi的NFS，FC/IP SAN，本地存储等
# csi.storage.k8s.io/fstype: "ext4" #设定格式化文件类型
```

进入 KubeSphere，查看已经同步的存储类和快照类：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660118898352-10e3118f-82f6-4753-b4c7-73f29d72f264.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660118905959-1fc81eb3-c1f4-490a-8836-23d36f43aa74.png)

## 运行有状态应用

打开 KubeSphere 容器平台的应用商店，部署一个 MySQL 应用示例，以验证 vSphere 持久卷的可行性。

![](https://pek3b.qingstor.com/kubesphere-community/images/1660118974138-9ad4e02d-015f-452d-85cc-cd29faa2a7bb.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660118981574-aca5a56e-adc7-4200-8145-03496e3b4203.png)

设置对应的 StorageClass 为刚才基于 vSphere CSI 创建的 example-block-sc：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119045412-47fe4a2e-fae8-4cd2-bdf7-50c732cc6b72.png)

应用创建成功，已创建并附加声明的存储卷：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119078870-51438550-8304-42c9-8f50-048f84b82176.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119117141-57688f73-6359-41f4-b384-a4544ce8923e.png)

进入 vCenter，可以看到这台节点虚拟机已挂载一个 8G 的硬盘，容量和 PVC 一致，后端存储和 StorageClass 定义的一致。

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119246301-f8a7377d-7697-47f8-997f-f39fc998b671.png)

进入 MySQL 终端，写入一些测试数据：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119326110-2ccc0c58-fc64-40e4-990d-aa5a1cb6f156.png)

这里创建一个表，插入示例值：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119352791-cf42ec4f-0435-4e53-991b-80607a46475c.png)

对现有 PVC 创建一个快照：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119374971-4153b725-9d03-48ce-936e-076d2047b784.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119379696-b26b11ae-e2c6-4ae9-85f1-4a6cac2594db.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119385045-87764aa4-94a1-4397-bbeb-9977615af1fb.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119973071-851eae59-0dfa-4435-85ae-4740c98beb07.png)

再次进入 MySQL 添加数据：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119408664-3d38bfe1-7c16-4ecb-bbaa-8a5c57221d25.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660119411492-88ba5d89-f317-4129-8e0f-0bd6cd1196ba.png)

删除现有绑定的 PVC，进入 MySQL 查看表已检索不到。

![](https://pek3b.qingstor.com/kubesphere-community/images/1660120031814-3ff5971b-ff46-4f7a-8d39-e566cda77baf.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660120036075-51576eb2-af9f-476f-b59f-25d046d9c962.png)

使用卷快照的 PVC，进入 MySQL 查看数据，为创建快照时的状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/1660120097557-ae5b49d6-5d28-4e9a-9d95-01b8e253b8e7.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660120105019-01091a50-9025-4b00-9d53-4546d689cb19.png)

## 监控

vsphere-csi 提供了基于 Prometheus 的监控指标，提供 CNS 组件和容器存储的指标暴露。
在 KubeSphere 上可以通过监控导出器创建对应服务的 ServiceMontior：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660121280218-159cb344-563b-463c-b1b0-91c3be0b24db.png)

vSphere 官方提供了 Grafana 的监控模板，可直接使用：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660121323321-566607e5-d454-4af5-8f27-d0b2f43c3485.png)

用户也可根据监控指标在 KubeSphere 设置基于偏好的自定义监控面板，如观察容器块存储创建成功的次数统计：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660121383689-9b0d1a14-56e4-4dd7-ab50-baa1344fa308.png)

除此之外，虚拟化管理员亦可在 vCenter 查看 CNS 监控信息：

![](https://pek3b.qingstor.com/kubesphere-community/images/1660121455585-866247af-5703-4697-95c1-8b0545c332f5.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660121460593-528c47fc-9017-4394-b66e-6cca24df01f5.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/1660121464662-232e9729-57f3-42c1-9162-e951b1ba47e7.png)

> 首次分享就到这里了，作为一名之前从事虚拟化，现在从事云原生的工程师，不论是采用哪种基础设施环境，最终目的都是为了上层应用站在巨人的肩膀上大施拳脚，因此在不同的基础环境提供不同的解决方案，也是一名售前工程师的乐趣，感谢观看。
PS: 感谢老东家的 VMware 环境借用哈哈。
