---
title: "启用或禁用 KubeSphere 中的 Telemetry"
keywords: "安装器, Telemetry, KubeSphere, Kubernetes"
description: "Telemetry 收集 KubeSphere 安装的汇总信息。"
linkTitle: "启用或禁用 KubeSphere 中的 Telemetry"
Weight: 16300
---

Telemetry 收集已安装 KubeSphere 集群的大小、KubeSphere 和 Kubernetes 版本、已启用的组件、集群运行时间、错误日志等汇总信息。KubeSphere 保证该信息仅由 KubeSphere 社区用于改进产品，并且不与任何第三方分享该信息。

## 信息收集范围

- 外部网络 IP 地址
- 下载日期
- Kubernetes 版本
- KubeSphere 版本
- Kubernetes 集群大小
- 操作系统类型
- 安装器错误日志
- 启用的组件
- Kubernetes 集群运行时间
- KubeSphere 集群运行时间
- 集群 ID
- 机器 ID

## 禁用 Telemetry

Telemetry 在安装 KubeSphere 时默认启用。同时，您也可以在安装前或安装后禁用 Telemetry。

### 安装前禁用 Telemetry

在现有 Kubernetes 集群上安装 KubeSphere 时，您需要下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件用于配置集群。如需禁用 Telemetry，请勿直接执行 `kubectl apply -f` 命令应用该文件。

{{< notice note >}}

如果在 Linux 上安装 KubeSphere，请直接参考[安装后禁用 Telemetry](../telemetry/#安装后禁用-telemetry)。

{{</ notice >}}

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) 文件并打开编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件末尾添加 `telemetry_enabled: false` 字段。

    ```yaml
      openpitrix:
        enabled: false
      servicemesh:
        enabled: false
      telemetry_enabled: false # Add this line here to disable Telemetry.
    ```

3. 保存文件并执行如下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

### 安装后禁用 Telemetry

1. 以 `admin` 用户登录控制台，点击页面左上角的**平台管理**。

2. 选择**集群管理**，在左侧导航栏中点击**自定义资源 CRD**。

    {{< notice note >}}
如果[多集群功能](../../multicluster-management/)已经启用，您需要先选择一个集群。
    {{</ notice >}}

3. 在搜索框中输入 `clusterconfiguration`，点击搜索结果打开详情页。

    ![edit-crd](/images/docs/zh-cn/faq/telemetry-in-kubesphere/edit-crd.jpg)

4. 点击 `ks-installer` 右边的三个点，并选择**编辑配置文件**。

    ![edit-ks-installer](/images/docs/zh-cn/faq/telemetry-in-kubesphere/edit-ks-installer.jpg)

5. 在文件末尾添加 `telemetry_enabled: false` 字段，点击**更新**。

    ![enable-telemetry](/images/docs/zh-cn/faq/telemetry-in-kubesphere/enable-telemetry.jpg)

{{< notice note >}}

如需重新启用 Telemetry，请删除 `telemetry_enabled: false` 字段或将其更改为 `telemetry_enabled: true`，并更新 `ks-installer`。

{{</ notice >}}
