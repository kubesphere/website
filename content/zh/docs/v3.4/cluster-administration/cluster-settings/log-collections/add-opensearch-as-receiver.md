---
title: "添加 OpenSearch 作为接收器"
keywords: 'Kubernetes, 日志, OpenSearch, Pod, 容器, Fluentbit, 输出'
description: '了解如何添加 OpenSearch 来接收容器日志、资源事件或审计日志。'
linkTitle: "添加 OpenSearch 作为接收器"
weight: 8625
---

[OpenSearch](https://opensearch.org/) 是一种分布式，由社区驱动并取得 Apache 2.0 许可的、 100% 开源的搜索和分析套件，可用于实时应用程序监控、日志分析和网站搜索等场景。
OpenSearch 由 Apache Lucene 搜索库提供技术支持，它支持一系列搜索及分析功能，如 k-最近邻（KNN）搜索、SQL、异常检测、Machine Learning Commons、Trace Analytics、全文搜索等。
OpenSearch 提供了一个高度可扩展的系统，通过集成可视化工具，使用户可以轻松地探索他们的数据。

KubeSphere 在 `v3.4.0` 版本集成了 OpenSearch 的 `v1` 和 `v2` 版本，并作为 `logging`、`events` 和 `auditing` 组件的默认后端存储。


## 准备工作

- 您需要一个被授予集群管理权限的用户。例如，您可以直接用 `admin` 用户登录控制台，或创建一个具有集群管理权限的角色然后将此角色授予一个用户。

- 添加日志接收器前，您需要启用组件 `logging`、`events` 或 `auditing`。有关更多信息，请参见[启用可插拔组件](https://www.kubesphere.io/zh/docs/v3.3/pluggable-components/)。本教程启用 `logging` 作为示例。


## 使用 OpenSearch 作为日志接收器

在 KubeSphere `v3.4.0` 版本中，默认 OpenSearch 为 `logging`、`events` 或 `auditing` 组件的后端存储。 配置如下：

```shell
$ kubectl edit cc -n kubesphere-system ks-installer

apiVersion: installer.kubesphere.io/v1alpha1

kind: ClusterConfiguration

metadata:

  name: ks-installer

  namespace: kubesphere-system

  ...

spec:

  ...

  common:

    opensearch:   # Storage backend for logging, events and auditing.

      ...

      enabled: true

      logMaxAge: 7             # Log retention time in built-in Opensearch. It is 7 days by default.

      opensearchPrefix: whizard      # The string making up index names. The index name will be formatted as ks-<opensearchPrefix>-logging.

  ...

```
KubeSphere 版本低于 `v3.4.0`的，请先[升级](https://github.com/kubesphere/ks-installer/tree/release-3.4#upgrade)。

### 通过控制台启用 `logging` 组件，并使用 `OpenSearch` 作为后端存储

1. 以 admin 用户登录控制台。点击左上角的平台管理，选择集群管理。

2. 点击定制资源定义，在搜索栏中输入 `clusterconfiguration`。点击结果查看其详细页面。

![](https://hackmd.io/_uploads/ByIDs6Zan.png)

3. 在自定义资源中，点击 ks-installer 右侧的 ，选择编辑 YAML。

![](https://hackmd.io/_uploads/HJrYs6Wah.png)

4. 在该 YAML 文件中，搜索 `logging`，将 `enabled` 的 `false` 改为 `true`。完成后，点击右下角的确定以保存配置。

```yaml
common:
  opensearch:
    enabled: true
    
logging:
  enabled: true
```


## 将日志存储改为外部 OpenSearch 并关闭内部 OpenSearch

如果您使用的是 KubeSphere 内部的 OpenSearch，并且想把它改成您的外部 OpenSearch，请按照以下步骤操作。

1. 执行以下命令更新 ClusterConfig 配置：

```shell
kubectl edit cc -n kubesphere-system ks-installer
```

2. 将 `opensearch.externalOpensearchHost` 设置为外部 `OpenSearch` 的地址，将 `opensearch.externalOpensearchPort` 设置为其端口号，并将 `status.logging` 字段注释或者删除掉。以下示例供您参考：

```yaml
apiVersion: installer.kubesphere.io/v1alpha1

kind: ClusterConfiguration

metadata:

  name: ks-installer

  namespace: kubesphere-system

  ...

spec:

  ...

  common:

    opensearch:

      enabled: true

      ...

      externalOpensearchHost: ""

      externalOpensearchPort: ""

      dashboard:

        enabled: false

  ...

status:

  ...

  # logging:

  #  enabledTime: 2023-08-21T21:05:13UTC

  #  status: enabled

  ...

```

如果要使用 `OpenSearch` 的可视化工具，可将 `opensearch.dashboard.enabled` 设置为 `true`。

3. 重新运行 ks-installer。

```shell
kubectl rollout restart deploy -n kubesphere-system ks-installer
```

4. 运行以下命令删除内部 OpenSearch，请确认您已备份内部 OpenSearch 中的数据。

```shell
helm uninstall opensearch-master -n kubesphere-logging-system && helm uninstall opensearch-data -n kubesphere-logging-system && helm uninstall opensearch-logging-curator -n kubesphere-logging-system
```

## 在 KubeSphere 中查询日志

1. 所有用户都可以使用日志查询功能。使用任意帐户登录控制台，在右下角的 icon 上悬停，然后在弹出菜单中选择日志查询。

![](https://hackmd.io/_uploads/HkHSK6Za3.png)

2. 在弹出窗口中，您可以看到日志数量的时间直方图、集群选择下拉列表以及日志查询栏。

![](https://hackmd.io/_uploads/BkqvY6W62.png)

3. 您可以点击搜索栏并输入搜索条件，可以按照消息、企业空间、项目、资源类型、资源名称、原因、类别或时间范围搜索事件（例如，输入时间范围:最近 10 分钟，来搜索最近 10 分钟的事件）。或者，点击时间直方图中的柱状图，KubeSphere 会使用该柱状图的时间范围进行日志查询。

![](https://hackmd.io/_uploads/HkrhKpZT3.png)
