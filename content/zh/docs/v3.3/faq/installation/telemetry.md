---
title: "启用或禁用 KubeSphere 中的 Telemetry"
keywords: "安装器, Telemetry, KubeSphere, Kubernetes"
description: "了解 Telemetry 并学习如何在 KubeSphere 中启用或禁用。"
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

在安装 KubeSphere 时 Telemetry 默认启用。同时，您也可以在安装前或安装后禁用 Telemetry。

### 安装前禁用 Telemetry

在现有 Kubernetes 集群上安装 KubeSphere 时，您需要下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件用于配置集群。如需禁用 Telemetry，请勿直接执行 `kubectl apply -f` 命令应用该文件。

{{< notice note >}}

如果在 Linux 上安装 KubeSphere，请直接参考[安装后禁用 Telemetry](../telemetry/#安装后禁用-telemetry)。

{{</ notice >}}

1. 下载 [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) 文件并编辑。

    ```bash
    vi cluster-configuration.yaml
    ```

2. 在 `cluster-configuration.yaml` 文件末尾添加 `telemetry_enabled: false` 字段。

    ```yaml
      openpitrix:
        store:
          enabled: false
      servicemesh:
        enabled: false
      telemetry_enabled: false # 请手动添加此行以禁用 Telemetry。
    ```

3. 保存文件并执行以下命令开始安装：

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

### 安装后禁用 Telemetry

1. 以 `admin` 用户登录控制台，点击页面左上角的**平台管理**。

2. 选择**集群管理**，在左侧导航栏中点击**定制资源定义**。

    {{< notice note >}}
如果[多集群功能](../../../multicluster-management/)已经启用，您需要先选择一个集群。
    {{</ notice >}}

3. 在搜索框中输入 `clusterconfiguration`，点击搜索结果打开详情页。

4. 点击 `ks-installer` 右侧的 <img src="/images/docs/v3.3/zh-cn/faq/installation/telemetry-in-kubesphere/three-dots.png" height="20px">，并选择**编辑 YAML**。

5. 在文件末尾添加 `telemetry_enabled: false` 字段，点击**确定**。


{{< notice note >}}

如需重新启用 Telemetry，请删除 `telemetry_enabled: false` 字段或将其更改为 `telemetry_enabled: true`，并更新 `ks-installer`。

{{</ notice >}}
