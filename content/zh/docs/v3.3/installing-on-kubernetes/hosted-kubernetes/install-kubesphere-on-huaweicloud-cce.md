---
title: "在华为云 CCE 上安装 KubeSphere"
keywords: "kubesphere, kubernetes, docker, huawei, cce"
description: "了解如何在华为云容器引擎上部署 KubeSphere。"


weight: 4250
---

本指南将介绍如果在[华为云 CCE 容器引擎](https://support.huaweicloud.com/cce/)上部署并使用 KubeSphere 3.3 平台。

## 华为云 CCE 环境准备

### 创建 Kubernetes 集群

首先按使用环境的资源需求创建 Kubernetes 集群，满足以下一些条件即可（如已有环境并满足条件可跳过本节内容）：

- 如需在 Kubernetes 上安装 KubeSphere 3.3，您的 Kubernetes 版本必须为：v1.19.x，v1.20.x，v1.21.x，v1.22.x 或 v1.23.x（实验性支持）。
- 需要确保 Kubernetes 集群所使用的云主机的网络正常工作，可以通过在创建集群的同时**自动创建**或**使用已有**弹性 IP；或者在集群创建后自行配置网络（如配置 [NAT 网关](https://support.huaweicloud.com/natgateway/)）。
- 工作节点规格建议选择 `s3.xlarge.2` 的 `4核｜8GB` 配置，并按需扩展工作节点数量（通常生产环境需要 3 个及以上工作节点）。

### 创建公网 kubectl 证书

- 创建完集群后，进入**资源管理** > **集群管理**界面，在**基本信息** > **网络** 面板中，绑定`公网apiserver地址`；
- 在右侧面板中，选择 **kubectl** 标签页，并在**下载kubectl配置文件**列表项中**点击此处下载**，即可获取公用可用的 kubectl 证书。

![生成 Kubectl 配置文件](/images/docs/v3.3/huawei-cce/zh/generate-kubeconfig.png)

获取 kubectl 配置文件后，可通过 kubectl 命令行工具来验证集群连通性：

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.8", GitCommit:"9f2892aab98fe339f3bd70e3c470144299398ace", GitTreeState:"clean", BuildDate:"2020-08-15T10:08:56Z", GoVersion:"go1.14.7", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"17+", GitVersion:"v1.17.9-r0-CCE20.7.1.B003-17.36.3", GitCommit:"136c81cf3bd314fcbc5154e07cbeece860777e93", GitTreeState:"clean", BuildDate:"2020-08-08T06:01:28Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
```

## 部署 KubeSphere

### 创建自定义 StorageClass

{{< notice note >}}

由于华为 CCE 自带的 Everest CSI 组件所提供的 StorageClass `csi-disk` 默认指定的是 SATA 磁盘（即普通 I/O 磁盘），但实际创建的 Kubernetes 集群所配置的磁盘基本只有 SAS（高 I/O）和 SSD (超高 I/O)，因此建议额外创建对应的 StorageClass（并设定为默认）以方便后续部署使用。参见官方文档 - [使用 kubectl 创建云硬盘](https://support.huaweicloud.com/usermanual-cce/cce_01_0044.html#section7)。
以下示例展示如何创建一个 SAS（高 I/O）磁盘对应的 StorageClass：

{{</ notice >}}

```yaml
# csi-disk-sas.yaml
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
    storageclass.kubesphere.io/support-snapshot: "false"
  name: csi-disk-sas
parameters:
  csi.storage.k8s.io/csi-driver-name: disk.csi.everest.io
  csi.storage.k8s.io/fstype: ext4
  # 绑定华为 “高I/O” 磁盘，如需 “超高I/O“ 则此值改为 SSD
  everest.io/disk-volume-type: SAS
  everest.io/passthrough: "true"
provisioner: everest-csi-provisioner
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: Immediate
```

关于如何设定/取消默认 StorageClass，可参考 Kubernetes 官方文档 - [改变默认 StorageClass](https://kubernetes.io/zh/docs/tasks/administer-cluster/change-default-storage-class/)。

### 通过 ks-installer 执行最小化部署

接下来就可以使用 [ks-installer](https://github.com/kubesphere/ks-installer) 在已有的 Kubernetes 集群上来部署 KubeSphere，建议首先还是以最小功能集进行安装，可执行以下命令：

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
```

执行部署命令后，可以通过进入**工作负载** > **容器组 Pod** 界面，在右侧面板中查询 `kubesphere-system` 命名空间下的 Pod 运行状态了解 KubeSphere 平台最小功能集的部署状态；通过该命名空间下 `ks-console-xxxx` 容器的状态来了解 KubeSphere 控制台应用的可用状态。

![部署 KubeSphere 最小功能集](/images/docs/v3.3/huawei-cce/zh/deploy-ks-minimal.png)

### 开启 KubeSphere 外网访问

通过 `kubesphere-system` 命名空间下的 Pod 运行状态确认 KubeSphere 基础组件都已进入运行状态后，我们需要为 KubeSphere 控制台开启外网访问。

进入**资源管理** > **网络**，在右侧面板中选择 `ks-console` 更改网络访问方式，建议选用 `负载均衡（LoadBalancer` 访问方式（需绑定弹性公网 IP），配置完成后如下图：

![开启 KubeSphere 外网访问](/images/docs/v3.3/huawei-cce/zh/expose-ks-console.png)

服务细节配置基本上选用默认选项即可，当然也可以按需进行调整：

![为 KubeSphere 控制台配置负载均衡访问](/images/docs/v3.3/huawei-cce/zh/edit-ks-console-svc.png)

通过负载均衡绑定公网访问后，即可使用给定的访问地址进行访问，进入到 KubeSphere 的登录界面并使用默认帐户（用户名 `admin`，密码 `P@88w0rd`）即可登录平台。

### 通过 KubeSphere 开启附加组件

上面的示例演示了默认的最小安装过程，要在 KubeSphere 中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)。

{{< notice warning >}}

在开启 Istio 组件之前，由于定制资源定义（CRD）冲突的问题，需要先删除华为 CCE 自带的 `applications.app.k8s.io` ，最直接的方式是通过 kubectl 工具来完成：

```bash
kubectl delete crd applications.app.k8s.io
```

{{</ notice >}}

全部附加组件开启并安装成功后，进入集群管理界面，在**系统组件** 区域可以看到已经开启的各个基础和附加组件。
