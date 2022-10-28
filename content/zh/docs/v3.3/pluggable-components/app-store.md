---
title: "KubeSphere 应用商店"
keywords: "Kubernetes, KubeSphere, App Store, OpenPitrix"
description: "了解如何启用应用商店，一个可以在内部实现数据和应用共享、并制定应用交付流程的行业标准的组件。"
linkTitle: "KubeSphere 应用商店"
weight: 6200
---

作为一个开源的、以应用为中心的容器平台，KubeSphere 在 [OpenPitrix](https://github.com/openpitrix/openpitrix) 的基础上，为用户提供了一个基于 Helm 的应用商店，用于应用生命周期管理。OpenPitrix 是一个开源的 Web 平台，用于打包、部署和管理不同类型的应用。KubeSphere 应用商店让 ISV、开发者和用户能够在一站式服务中只需点击几下就可以上传、测试、安装和发布应用。

对内，KubeSphere 应用商店可以作为不同团队共享数据、中间件和办公应用的场所。对外，有利于设立构建和交付的行业标准。启用该功能后，您可以通过应用模板添加更多应用。

有关更多信息，请参阅[应用商店](../../application-store/)。

## 在安装前启用应用商店

### 在 Linux 上安装

当您在 Linux 上安装多节点 KubeSphere 时，首先需要创建一个配置文件，该文件列出了所有 KubeSphere 组件。

1. [在 Linux 上安装 KubeSphere](../../installing-on-linux/introduction/multioverview/) 时，您需要创建一个默认文件 `config-sample.yaml`，通过执行以下命令修改该文件：

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
如果您采用 [All-in-One 安装](../../quick-start/all-in-one-on-linux/)，则不需要创建 `config-sample.yaml` 文件，因为可以直接创建集群。一般来说，All-in-One 模式是为那些刚接触 KubeSphere 并希望熟悉系统的用户而准备的。如果您想在这个模式下启用应用商店（比如用于测试），请参考[下面的部分](#在安装后启用应用商店)，查看如何在安装后启用应用商店。
    {{</ notice >}}

2. 在该文件中，搜索 `openpitrix`，并将 `enabled` 的 `false` 改为 `true`，完成后保存文件。

    ```yaml
    openpitrix:
      store:
        enabled: true # 将“false”更改为“true”。
    ```

3. 执行以下命令使用该配置文件创建集群：

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### 在 Kubernetes 上安装

当您[在 Kubernetes 上安装 KubeSphere](../../installing-on-kubernetes/introduction/overview/) 时，需要先在 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件中启用应用商店。

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件，执行以下命令打开并编辑该文件。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件中，搜索 `openpitrix`，并将 `enabled` 的 `false` 改为 `true`。完成后保存文件。

    ```yaml
    openpitrix:
      store:
        enabled: true # 将“false”更改为“true”。
    ```

3. 执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## 在安装后启用应用商店

1. 使用 `admin` 用户登录控制台，点击左上角的**平台管理**，选择**集群管理**。

2. 点击**定制资源定义**，在搜索栏中输入 `clusterconfiguration`，点击结果查看其详细页面。

    {{< notice info >}}
定制资源定义（CRD）允许用户在不增加额外 API 服务器的情况下创建一种新的资源类型，用户可以像使用其他 Kubernetes 原生对象一样使用这些定制资源。
    {{</ notice >}}

3. 在**自定义资源**中，点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-app-store/three-dots.png" height="20px">，选择**编辑 YAML**。

4. 在该 YAML 文件中，搜索 `openpitrix`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的**确定**，保存配置。

    ```yaml
    openpitrix:
      store:
        enabled: true # 将“false”更改为“true”。
    ```

5. 在  kubectl 中执行以下命令检查安装过程：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

您可以通过点击控制台右下角的 <img src="/images/docs/v3.3/zh-cn/enable-pluggable-components/kubesphere-app-store/hammer.png" height="20px"> 找到 kubectl 工具。
    {{</ notice >}}

## 验证组件的安装

在您登录控制台后，如果您能看到页面左上角的**应用商店**以及其中的应用，则说明安装成功。

{{< notice note >}}

- 您可以在不登录控制台的情况下直接访问 `<节点 IP 地址>:30880/apps` 进入应用商店。
- KubeSphere 3.2.x 中的应用商店启用后，**OpenPitrix** 页签不会显示在**系统组件**页面。

{{</ notice >}} 

## 在多集群架构中使用应用商店

[在多集群架构中](../../multicluster-management/introduction/kubefed-in-kubesphere/)，一个主集群管理所有成员集群。与 KubeSphere 中的其他组件不同，应用商店是所有集群（包括主集群和成员集群）的全局应用程序池。您只需要在主集群上启用应用商店，便可以直接在成员集群上使用应用商店的相关功能（无论成员集群是否启用应用商店），例如[应用模板](../../project-user-guide/application/app-template/)和[应用仓库](../../workspace-administration/app-repository/import-helm-repository/)。

但是，如果只在成员集群上启用应用商店而没有在主集群上启用，您将无法在多集群架构中的任何集群上使用应用商店。

