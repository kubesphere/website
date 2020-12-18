---
title: "KubeSphere DevOps 系统"
keywords: "Kubernetes, Jenkins, KubeSphere, DevOps, cicd"
description: "如何启用 KubeSphere DevOps 系统"

linkTitle: "KubeSphere DevOps"
weight: 6300
---

## 什么是 KubeSphere DevOps 系统

基于 [Jenkins](https://jenkins.io/) 的 KubeSphere DevOps 系统是专为 Kubernetes 中的 CI/CD 工作流设计的，它提供了一站式的解决方案，帮助开发和运维团队用非常简单的方式构建、测试和发布应用到 Kubernetes。它还具有插件管理、Binary-to-Image (B2I)、Source-to-Image (S2I)、代码依赖缓存、代码质量分析、流水线日志等功能。

DevOps 系统为用户提供了一个赋能的环境，它使得应用可以自动发布到同一个平台。它还兼容第三方私有镜像仓库（如 Harbor）和代码库（如 GitLab/GitHub/SVN/BitBucket）。也就是说，它为用户提供了全面的、可视化的 CI/CD 流水线，使得用户体验非常优秀，而且这种兼容性强的流水线能力在隔离环境中非常有用。

有关更多信息，请参见 [DevOps 用户指南](../../devops-user-guide/)。

## 在安装前启用 DevOps

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. 基于[在Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 的教程，您需要创建一个默认文件 `config-sample.yaml`，通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-one 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-one 模式是为那些刚刚接触 KubeSphere 并希望熟悉系统的用户准备的，如果您想在这个模式下启用 DevOps（比如用于测试），请参考[下面的部分](#在安装后启用-devops-系统)，查看如何在安装后启用 DevOps。
    {{</ notice >}}

2. 在该文件中，搜寻到 `devops`，并将 `enabled` 的 `false `改为 `true`，完成后保存文件。

    ```bash
    devops:
        enabled: true # Change "false" to "true"
    ```

3. 使用配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 的教程中说明了在 Kubernetes 上安装 KubeSphere 的流程，不过，需要事先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件中启用 DevOps（可选服务组件）。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件，然后打开并开始编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在该本地 `cluster-configuration.yaml` 文件中，搜寻到 `devops`，并将 `enabled` 的 `false` 改为 `true`，完成后保存文件。

    ```bash
    devops:
        enabled: true # Change "false" to "true"
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用 DevOps

1. 以 `admin` 身份登录控制台，点击左上角的**平台管理**，选择**集群管理**。

    ![集群管理](/images/docs/zh-cn/enable-pluggable-components/kubesphere-devops-system/clusters-management.png)

2. 点击**自定义资源 CRD**，在搜索栏中输入 `clusterconfiguration`，点击搜索结果查看其详细页面。

    {{< notice info >}}
自定义资源定义（CRD）允许用户在不增加额外 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些自定义资源。
    {{</ notice >}}

3. 在**资源列表**中，点击 `ks-installer` 右边的三个点，选择**编辑配置文件**。

    ![编辑 YAML](/images/docs/zh-cn/enable-pluggable-components/kubesphere-devops-system/edit-yaml.PNG)

4. 在该 YAML 文件中，搜寻到 `devops`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**更新**，保存配置。

    ```bash
    devops:
        enabled: true # Change "false" to "true"
    ```

5. 您可以使用 Web Kubectl 工具执行以下命令来检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
您可以通过点击控制台右下角的锤子图标找到 Web Kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

{{< tabs >}}

{{< tab "在仪表板中验证组件的安装" >}}

进入**服务组件**，检查 **DevOps** 的状态，可以看到如下类似图片：

![devops](/images/docs/zh-cn/enable-pluggable-components/kubesphere-devops-system/devops.PNG)

{{</ tab >}}

{{< tab "通过 kubectl 验证组件的安装" >}}

执行以下命令来检查 Pod 的状态：

```bash
kubectl get pod -n kubesphere-devops-system
```

如果组件运行成功，输出结果如下：

```bash
NAME                                       READY   STATUS    RESTARTS   AGE
ks-jenkins-68b8949bb-jcvkt                 1/1     Running   0          1h3m
s2ioperator-0                              1/1     Running   1          1h3m
uc-jenkins-update-center-8c898f44f-hqv78   1/1     Running   0          1h14m
```

{{</ tab >}}

{{</ tabs >}}
