---
title: '抢先体验 KubeSphere 3.3.0 RC 版，支持 Argo CD'
tag: '产品动态'
keyword: '社区, 开源, 贡献, KubeSphere, release, Argo, DevOps'
description: '距离 KubeSphere 3.2.1 GA 已经过去 4 个月了，现在 KubeSphere 3.3.0 RC 版终于发布了，带来了很多比较重量级的功能，欢迎下载试用。'
createTime: '2022-05-23'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/202205232124305.png'
---

距离 KubeSphere 3.2.1 GA 已经过去 4 个月了，现在 KubeSphere 3.3.0 RC 版终于发布了，带来了很多比较重量级的功能，例如：

### DevOps

- **提供了基于 GitOps 的持续部署方案，底层支持 Argo CD；**
- 支持持续部署白名单配置；
- 持续部署状态统计；
- 支持代码仓库集中管理；
- 新增多款基于 CRD 的内置流水线模板；
- 支持添加只允许执行流水线的自定义角色。

### 存储

- 新增 volumesnapshotcontent 管理；
- 支持 volumesnapshotclass 管理；
- 新增 StorageClass 权限控制；
- 新增 PVC 自动扩容；
- 增加单块硬盘占用率数据显示。

### 其他优化

- 多集群场景下 Member 集群支持上传更新 Kubeconfig 文件；
- 支持多集群下集群 kubeconfig 到期提示；
- 支持应用整个配置字典；
- 支持容器生命周期管理；
- **支持节点终端，可以直接在 UI 上登陆集群节点**；
- 启用 Istio 支持 CNI 等更细化的配置；
- **优化了 clusterconfiguration 配置机制，无需重启 ks-apiserver/ks-controller-manager**。

**每个功能的具体细节会在正式版本发布之后在 Release Notes 中详述，GA 日期在 5 月份**。想尝鲜的同学可通过以下两种方式部署和测试，欢迎大家帮助测试并提交 GitHub Issue，部署方式如下：

## 在 Linux 上安装 KubeSphere

若要以 All-in-One 模式进行安装，您仅需参考以下对机器硬件和操作系统的要求准备一台主机。

**硬件推荐配置：**

| 操作系统                                           | 最低配置                            |
| -------------------------------------------------- | ----------------------------------- |
| Ubuntu 16.04, 18.04, 20.04                                | 2 核 CPU，4 GB 内存，40 GB 磁盘空间 |
| Debian Buster, Stretch                             | 2 核 CPU，4 GB 内存，40 GB 磁盘空间 |
| CentOS 7.x                                         | 2 核 CPU，4 GB 内存，40 GB 磁盘空间 |
| Red Hat Enterprise Linux 7                         | 2 核 CPU，4 GB 内存，40 GB 磁盘空间 |
| SUSE Linux Enterprise Server 15/openSUSE Leap 15.2 | 2 核 CPU，4 GB 内存，40 GB 磁盘空间 |

其他要求及配置请参考[官方文档](https://kubesphere.com.cn/docs/quick-start/all-in-one-on-linux/)。

先从 [GitHub Release 页面](https://github.com/kubesphere/kubekey/releases/tag/v2.1.0)下载 KubeKey 或者直接运行以下命令。

```
$ curl -sfL https://get-kk.kubesphere.io | VERSION=v2.1.0 sh -
```

为 `kk` 添加可执行权限：

```
$ chmod +x kk
```

开始同时安装 Kubernetes 和 KubeSphere：

```
$ ./kk create cluster --with-kubernetes v1.21.5 --with-kubesphere v3.3.0-rc.0
```

多节点安装可以参考 [KubeSphere 的官方文档](https://kubesphere.com.cn/docs/installing-on-linux/introduction/multioverview/)。

## 在已有 K8s 集群上安装

除了在 Linux 机器上安装 KubeSphere 之外，您还可以将其直接部署在现有的 Kubernetes 集群上。前提条件：

- 您的 Kubernetes 版本必须为：1.19.x、1.20.x、1.21.x、1.22.x 或 1.23.x。
- 确保您的机器满足最低硬件要求：CPU > 2 核，内存 > 4 GB。
- 在安装之前，需要配置 Kubernetes 集群中的**默认**存储类型。

确保您的机器满足安装的前提条件之后，可以执行以下命令开始安装：

```
$ kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.0-rc.0/kubesphere-installer.yaml
$ kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.0-rc.0/cluster-configuration.yaml
```

----

**不使用 KubeSphere 的 YAML 工程师一定不是正经的云原生工程师**，想尝鲜的小伙伴欢迎参考上面的步骤安装试用最新 RC 版。大家如果在试用的过程中有任何问题都可以直接向社区[提交 Issue](https://github.com/kubesphere/kubesphere/issues/new/choose) 进行反馈，社区会及时跟进测试并修复问题，这样也可以让 GA 版本更加稳定。

在 GA 版本正式发布之前，还有部分工作尚待完成，感兴趣的可以查看[当前正在跟进的 Feature 和 Issue 列表](https://github.com/orgs/kubesphere/projects/6)。