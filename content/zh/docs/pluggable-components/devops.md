---
title: "KubeSphere DevOps 系统"
keywords: "Kubernetes, Jenkins, KubeSphere, DevOps, cicd"
description: "如何启用 KubeSphere DevOps 系统"

linkTitle: "KubeSphere DevOps"
weight: 3520
---

## 什么是 KubeSphere DevOps 系统

KubeSphere DevOps 系统是专为 Kubernetes 中的 CI/CD 工作流设计的。基于 [Jenkins](https://jenkins.io/)，它提供了一站式的解决方案，帮助开发和运维团队以直接的方式构建、测试和发布应用到 Kubernetes。它还具有插件管理、二进制到图像（B2I）、源到图像（S2I）、代码依赖缓存、代码质量分析、流水线日志等功能。

DevOps 系统为用户提供了一个有利的环境，因为应用可以自动发布到同一个平台。它还兼容第三方私有镜像注册库（如 Harbor）和代码库（如 GitLab/GitHub/SVN/BitBucket）。因此，它通过为用户提供全面的、可视化的 CI/CD 管道来创造优秀的用户体验，这些管道在气垫环境中非常有用。

有关更多信息，请参阅 DevOps 管理。

## 在安装前启用 DevOps

### 在 Linux 上安装

当您在 Linux 上安装 KubeSphere 时，你需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在 Linux 上安装 KubeSphere](.../.../installing-on-linux/introduction/multioverview/) 的教程，您创建了一个默认文件 **config-sample.yaml**。通过执行以下命令修改该文件：

```bash
vi config-sample.yaml
```

{{< notice note >}}

如果采用 [All-in-one 安装](.../.../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚刚接触 KubeSphere 并希望熟悉系统的用户准备的。如果您想在这个模式下启用 DevOps（比如出于测试的目的），可以参考下面的部分，看看安装后如何启用 DevOps 系统。

{{</ notice >}}

2. 在该文件中，搜寻到 `devops`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

```bash
devops:
    enabled: true # Change "false" to "true"
```

3. 使用配置文件创建一个集群：

```bash
./kk create cluster -f config-sample.yaml
```

### 在 Kubernetes 上安装

在 Kubernetes 上安装 KubeSphere 时，需要下载文件 [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) 进行集群设置。如果要安装 DevOps 系统，不要直接使用 `kubectl apply -f` 对这个文件进行设置。

1. 参照[在 Kubernetes 上安装 KubeSphere](.../.../installing-on-kubernetes/introduction/overview/) 的教程，先对文件 [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml) 执行 `kubectl apply -f`。之后，为了启用 DevOps，创建一个本地文件 `cluster-configuration.yaml`。

```bash
vi cluster-configuration.yaml
```

2. 将 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中的所有内容复制到刚才创建的本地文件中。
   
3. 在这个本地 `cluster-configuration.yaml` 文件中，搜寻到 `devops`，并将  `enabled` 的 `false` 改为 `true`，启用它们。完成后保存文件。

```bash
devops:
    enabled: true # Change "false" to "true"
```

4. 执行以下命令开始安装：

```bash
kubectl apply -f cluster-configuration.yaml
```

## 在安装后启用 DevOps 系统

1. 以 `admin` 身份登录控制台。点击左上角的**平台管理**，选择**集群管理**。

![集群管理](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. 点击 **自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

{{< notice info >}}

自定义资源定义（CRD）允许用户在不增加另一个 API 服务器的情况下创建一种新的资源类型。他们可以像其他任何本地 Kubernetes 对象一样使用这些资源。

{{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右边的三个点，选择**编辑 YAML**。

![编辑 YAML](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. 在这个 YAML 文件中，搜寻到 `devops`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

```bash
devops:
    enabled: true # Change "false" to "true"
```

5. 您可以通过执行以下命令，使用 Web Kubectl 工具来检查安装过程：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}}

您可以通过点击控制台右下角的锤子图标找到 Kubectl 工具。

{{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入**服务组件**，检查 DevOps 的状态。你可能会看到如下图片：

![devops](https://ap3.qingstor.com/kubesphere-website/docs/20200829125245.png)

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n kubesphere-devops-system
```

如果组件运行成功，输出结果可能如下：

```bash
NAME                                       READY   STATUS    RESTARTS   AGE
ks-jenkins-68b8949bb-jcvkt                 1/1     Running   0          1h3m
s2ioperator-0                              1/1     Running   1          1h3m
uc-jenkins-update-center-8c898f44f-hqv78   1/1     Running   0          1h14m
```

{{</ tab >}}

{{</ tabs >}}
