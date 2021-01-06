---
title: "在腾讯云 TKE 安装 KubeSphere"
keywords: "kubesphere, kubernetes, docker, tencent, tke"
description: "介绍如何在腾讯云 TKE 上部署 KubeSphere 3.0"


weight: 4270
---

本指南将介绍如何在[腾讯云 TKE](https://cloud.tencent.com/document/product/457/6759) 上部署并使用 KubeSphere 3.0.0 平台。

## 腾讯云 TKE 环境准备

### 创建 Kubernetes 集群
首先按使用环境的资源需求[创建 Kubernetes 集群](https://cloud.tencent.com/document/product/457/32189)，满足以下一些条件即可（如已有环境并满足条件可跳过本节内容）：

- KubeSphere 3.0.0 默认支持的 Kubernetes 版本为 `1.15.x`, `1.16.x`, `1.17.x`, `1.18.x`，需要选择其中支持的版本进行集群创建（如 `1.16.3`, `1.18.4`）。
- 如果老集群版本不大于1.15.0，需要操作控制台先升级master节点然后升级node节点，依次升级至符合要求版本即可。
- 工作节点机型配置规格方面选择 `SA2.LARGE8` 的 `4核｜8GB` 配置即可，并按需扩展工作节点数量（通常生产环境需要 3 个及以上工作节点）。

### 创建公网 kubectl 证书

- 创建完集群后，进入 `容器服务` > `集群` 界面，选择刚创建的集群，在 `基本信息`  面板中， `集群APIServer信息` 中开启 `外网访问` 。
- 然后在下方 `kubeconfig` 列表项中点击 `下载`，即可获取公用可用的 kubectl 证书。

![generate-kubeconfig.png](/images/docs/tencent-tke/generate-kubeconfig.png)

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
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

- 这里有个注意点**腾讯云申请PVC需要是10G的倍数**
- 下载集群配置文件

```bash
wget https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

- 修改集群配置文件，PVC修改为10G的倍数，1倍n倍都可以，其他可拔插组件如果开启也需要调整，开启哪个调整哪个即可，默认最小化安装未开启可插拔组件

```bash
vim cluster-configuration.yaml
//默认值
  common:
    mysqlVolumeSize: 20Gi # MySQL PVC size.
    minioVolumeSize: 20Gi # Minio PVC size.
    etcdVolumeSize: 20Gi  # etcd PVC size.
    openldapVolumeSize: 2Gi   # openldap PVC size.
    redisVolumSize: 2Gi # Redis PVC size.

//修改后的值，PVC为10G的倍数，1倍n倍都可以，其他可拔插组件如果开启也需要调整，
  common:
    mysqlVolumeSize: 10Gi # MySQL PVC size.
    minioVolumeSize: 10Gi # Minio PVC size.
    etcdVolumeSize: 10Gi  # etcd PVC size.
    openldapVolumeSize: 10Gi   # openldap PVC size.
    redisVolumSize: 10Gi # Redis PVC size.
```

- 然后执行以下命令部署：

```bash
kubectl apply -f cluster-configuration.yaml
```


- 执行以下命令查看部署日志，当日志输出如以下图片内容时则表示部署完成：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

![ks-install-log.png](/images/docs/tencent-tke/ks-install-log.png)

### 访问 KubeSphere 控制台

部署完成后，您可以通过以下步骤访问 KubeSphere 控制台。

#### NodePort 方式访问

- 在 `容器服务` > `集群` 界面中，选择创建好的集群，在 `节点管理` > `节点` 面板中，查看任意一个节点的 `公网 IP`（集群安装时默认会免费为每个节点绑定公网 IP）。

![nodeport.png](/images/docs/tencent-tke/nodeport.png)

- 由于服务安装时默认开启 NodePort 且端口为 30880，浏览器输入 `<公网 IP>:30880` ，并以默认账号（用户名 `admin`，密码 `P@88w0rd`）即可登录控制台。

![console.png](/images/docs/tencent-tke/console.png)

#### LoadBalancer 方式访问

- 在 `容器服务` > `集群` 界面中，选择创建好的集群，在 `服务与路由` > `service` 面板中，点击 `ks-console` 一行中 `更新访问方式`。

![loadbalancer1.png](/images/docs/tencent-tke/loadbalancer1.png)

- `服务访问方式` 选择 `提供公网访问`，`端口映射` 中 `服务端口` 填写您希望的端口号，点击 `更新访问方式`。

![loadbalancer2.png](/images/docs/tencent-tke/loadbalancer2.png)

- 此时界面您将会看到 LoadBalancer 公网 IP：

![loadbalancer3.png](/images/docs/tencent-tke/loadbalancer3.png)

- 浏览器输入 `<LoadBalancer 公网 IP>:<映射端口>`，并以默认账号（用户名 `admin`，密码 `P@88w0rd`）即可登录控制台。

![console.png](/images/docs/tencent-tke/console.png)

### 通过 KubeSphere 开启附加组件
KubeSphere 平台外网可访问后，接下来的操作即可都在平台内完成。开启附加组件的操作可以参考社区文档 - `KubeSphere 3.0 界面开启可插拔组件安装`。
全部附加组件开启并安装成功后，进入集群管理界面，可以得到如下界面呈现效果，特别是在 `服务组件` 部分可以看到已经开启的各个基础和附加组件：
![console-full.png](/images/docs/tencent-tke/console-full.png)
