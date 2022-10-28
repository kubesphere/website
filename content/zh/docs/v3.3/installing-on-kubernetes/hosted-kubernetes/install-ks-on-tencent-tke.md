---
title: "在腾讯云 TKE 安装 KubeSphere"
keywords: "kubesphere, kubernetes, docker, tencent, tke"
description: "介绍如何在腾讯云 TKE 上部署 KubeSphere。"


weight: 4270
---

本指南将介绍如何在[腾讯云 TKE](https://cloud.tencent.com/document/product/457/6759) 上部署并使用 KubeSphere 3.3 平台。

## 腾讯云 TKE 环境准备

### 创建 Kubernetes 集群
首先按使用环境的资源需求[创建 Kubernetes 集群](https://cloud.tencent.com/document/product/457/32189)，满足以下一些条件即可（如已有环境并满足条件可跳过本节内容）：

- KubeSphere 3.3 默认支持的 Kubernetes 版本为 v1.19.x, v1.20.x, v1.21.x, v1.22.x 和  v1.23.x（实验性支持），选择支持的版本创建集群；
- 如果老集群版本不大于1.15.0，需要操作控制台先升级master节点然后升级node节点，依次升级至符合要求版本即可。
- 工作节点机型配置规格方面选择 `标准型S5` 的 `4核｜8GB` 配置即可，并按需扩展工作节点数量（通常生产环境需要 3 个及以上工作节点）。

### 创建公网 kubectl 证书

- 创建完集群后，进入 `容器服务` > `集群` 界面，选择刚创建的集群，在 `基本信息`  面板中， `集群APIServer信息` 中开启 `外网访问` 。
- 然后在下方 `kubeconfig` 列表项中点击 `下载`，即可获取公用可用的 kubectl 证书。

![generate-kubeconfig.png](/images/docs/v3.3/tencent-tke/generate-kubeconfig.png)

- 获取 kubectl 配置文件后，可通过 kubectl 命令行工具来验证集群连接：

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.4", GitCommit:"c96aede7b5205121079932896c4ad89bb93260af", GitTreeState:"clean", BuildDate:"2020-06-17T11:41:22Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"18+", GitVersion:"v1.18.4-tke.2", GitCommit:"f6b0517bc6bc426715a9ff86bd6aef39c81fd64a", GitTreeState:"clean", BuildDate:"2020-08-12T02:18:32Z", GoVersion:"go1.13.15", Compiler:"gc", Platform:"linux/amd64"}
```


## KubeSphere 平台部署

### 通过 ks-installer 执行最小化部署
接下来就可以使用 [ks-installer](https://github.com/kubesphere/ks-installer) 在已有的 Kubernetes 集群上来执行 KubeSphere 部署，建议首先还是以最小功能集进行安装。

- 使用 kubectl 执行以下命令安装 KubeSphere：

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
```

- 下载集群配置文件

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
```

  {{< notice tip >}}

腾讯云创建云硬盘大小必须为 10 的倍数，且普通云硬盘/高性能云硬盘最小是 10G，SSD/HSSD 云硬盘最小是 20G。Kubernetes 集群创建完成后会自动创建好普通云硬盘的 StoragClass，这里示例将直接使用默认的普通云硬盘。

  {{</ notice >}}

- 修改集群配置文件，PVC 修改为 10G 的倍数（1倍n倍都可以），其他可拔插组件如果开启也需要调整，开启哪个调整哪个即可，默认最小化安装未开启可插拔组件。

```bash
vim cluster-configuration.yaml
//默认值
  common:
    mysqlVolumeSize: 20Gi # MySQL PVC size.
    minioVolumeSize: 20Gi # Minio PVC size.
    etcdVolumeSize: 20Gi  # etcd PVC size.
    openldapVolumeSize: 2Gi   # openldap PVC size.
    redisVolumSize: 2Gi # Redis PVC size.

//修改后的值，PVC 为 10G 的倍数（1倍n倍都可以），其他可拔插组件如果开启也需要调整
  common:
    mysqlVolumeSize: 20Gi # MySQL PVC size.
    minioVolumeSize: 20Gi # Minio PVC size.
    etcdVolumeSize: 20Gi  # etcd PVC size.
    openldapVolumeSize: 10Gi   # openldap PVC size.
    redisVolumSize: 10Gi # Redis PVC size.
```

- 然后执行以下命令部署：

```bash
kubectl apply -f cluster-configuration.yaml
```


- 执行以下命令查看部署日志，当日志输出如以下图片内容时则表示部署完成：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

![ks-install-log.png](/images/docs/v3.3/tencent-tke/ks-install-log.png)

### 访问 KubeSphere 控制台

部署完成后，您可以通过以下步骤访问 KubeSphere 控制台。

#### NodePort 方式访问

- 在 `容器服务` > `集群` 界面中，选择创建好的集群，在 `节点管理` > `节点` 面板中，查看任意一个节点的 `公网 IP`（集群安装时默认会免费为每个节点绑定公网 IP）。

![nodeport.png](/images/docs/v3.3/tencent-tke/nodeport.png)

- 由于服务安装时默认开启 NodePort 且端口为 30880，浏览器输入 `<公网 IP>:30880` ，并以默认帐户（用户名 `admin`，密码 `P@88w0rd`）即可登录控制台。

#### LoadBalancer 方式访问

- 在 `容器服务` > `集群` 界面中，选择创建好的集群，在 `服务与路由` > `service` 面板中，点击 `ks-console` 一行中 `更新访问方式`。

![loadbalancer1.png](/images/docs/v3.3/tencent-tke/loadbalancer1.png)

- `服务访问方式` 选择 `提供公网访问`，`端口映射` 中 `服务端口` 填写您希望的端口号，点击 `更新访问方式`。

![loadbalancer2.png](/images/docs/v3.3/tencent-tke/loadbalancer2.png)

- 此时界面您将会看到 LoadBalancer 公网 IP：

![loadbalancer3.png](/images/docs/v3.3/tencent-tke/loadbalancer3.png)

- 浏览器输入 `<LoadBalancer 公网 IP>:<映射端口>`，并以默认帐户（用户名 `admin`，密码 `P@88w0rd`）即可登录控制台。


{{< notice tip >}}

若您用 admin 帐户无法登录控制台，界面显示 “Internal error occurred: account is not active” 且 `ks-controller-manager` pod 日志显示 “tls: bad certificate”，则需要更新一下 `ks-controller-manager` 的证书：

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/2c4b479ec65110f7910f913734b3d069409d72a8/roles/ks-core/prepare/files/ks-init/users.iam.kubesphere.io.yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/2c4b479ec65110f7910f913734b3d069409d72a8/roles/ks-core/prepare/files/ks-init/webhook-secret.yaml
kubectl -n kubesphere-system rollout restart deploy ks-controller-manager
```

{{</ notice >}}

### 通过 KubeSphere 开启附加组件
以上示例演示了默认的最小安装过程，要在 KubeSphere 中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)。
全部附加组件开启并安装成功后，进入集群管理界面，在**系统组件**区域可以看到已经开启的各个基础和附加组件。
