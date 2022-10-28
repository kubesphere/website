---
title: "KubeSphere DevOps 系统"
keywords: "Kubernetes, Jenkins, KubeSphere, DevOps, cicd"
description: "了解如何启用 DevOps 系统来进一步解放您的开发人员，让他们专注于代码编写。"
linkTitle: "KubeSphere DevOps"
weight: 6300
---

基于 [Jenkins](https://jenkins.io/) 的 KubeSphere DevOps 系统是专为 Kubernetes 中的 CI/CD 工作流设计的，它提供了一站式的解决方案，帮助开发和运维团队用非常简单的方式构建、测试和发布应用到 Kubernetes。它还具有插件管理、[Binary-to-Image (B2I)](../../project-user-guide/image-builder/binary-to-image/)、[Source-to-Image (S2I)](../../project-user-guide/image-builder/source-to-image/)、代码依赖缓存、代码质量分析、流水线日志等功能。

DevOps 系统为用户提供了一个自动化的环境，应用可以自动发布到同一个平台。它还兼容第三方私有镜像仓库（如 Harbor）和代码库（如 GitLab/GitHub/SVN/BitBucket）。它为用户提供了全面的、可视化的 CI/CD 流水线，打造了极佳的用户体验，而且这种兼容性强的流水线能力在离线环境中非常有用。

有关更多信息，请参见 [DevOps 用户指南](../../devops-user-guide/)。

## 在安装前启用 DevOps

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`，通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的，如果您想在这个模式下启用 DevOps（比如用于测试），请参考[下面的部分](#在安装后启用-devops)，查看如何在安装后启用 DevOps。
    {{</ notice >}}

2. 在该文件中，搜索 `devops`，并将 `enabled` 的 `false `改为 `true`，完成后保存文件。

    ```yaml
    devops:
      enabled: true # 将“false”更改为“true”。
    ```

3. 执行以下命令使用该配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用 DevOps。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件，执行以下命令打开并编辑该文件：

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件中，搜索 `devops`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    devops:
      enabled: true # 将“false”更改为“true”。
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用 DevOps

1. 以 `admin` 用户登录控制台，点击左上角的**平台管理**，选择**集群管理**。

2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`，点击搜索结果查看其详细页面。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不新增 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-devops-system/three-dots.png" height="20px">，选择**编辑 YAML**。

4. 在该 YAML 文件中，搜索 `devops`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**，保存配置。

    ```yaml
    devops:
      enabled: true # 将“false”更改为“true”。
    ```

5. 在  kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-devops-system/hammer.png" height="20px"> 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入**系统组件**，检查是否 **DevOps** 标签页中的所有组件都处于**健康**状态。如果是，组件安装成功。

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查容器组的状态：

```bash
kubectl get pod -n kubesphere-devops-system
```

如果组件运行成功，输出结果如下：

```bash
NAME                          READY   STATUS    RESTARTS   AGE
devops-jenkins-5cbbfbb975-hjnll   1/1     Running   0          40m
s2ioperator-0                 1/1     Running   0          41m
```

{{</ tab >}}

{{</ tabs >}}
