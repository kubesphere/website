---
title: "日志系统"
keywords: "Kubernetes, Elasticsearch, KubeSphere, 日志系统, 日志"
description: "关于日志系统的常见问题"
linkTitle: "日志系统"
weight: 16310
---

## 如何将日志存储改为外部弹性搜索并关闭内部弹性搜索

如果您使用的是 KubeSphere 内部的 Elasticsearch，并且想把它改成您的外部备用，请按照下面的指南操作。否则，如果你还没有启用日志系统，请到[启用日志系统](.../.../logging/)直接设置外部 Elasticsearch。

首先，更新 KubeKey 配置。

```shell
kubectl edit cc -n kubesphere-system ks-installer
```

- 将如下 `es.elasticsearchDataXXX`、`es.elasticsearchMasterXXX` 和 `status.logging` 的注释取消。

- 将 `es.externalElasticsearchUrl` 设置为弹性搜索的地址，`es.externalElasticsearchPort` 设置为它的端口号。

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
    es:
      # elasticsearchDataReplicas: 1
      # elasticsearchDataVolumeSize: 20Gi
      # elasticsearchMasterReplicas: 1
      # elasticsearchMasterVolumeSize: 4Gi
      elkPrefix: logstash
      logMaxAge: 7
      externalElasticsearchUrl: <192.168.0.2>
      externalElasticsearchPort: <9200>
  ...
status:
  ...
  # logging:
  #  enabledTime: 2020-08-10T02:05:13UTC
  #  status: enabled
  ...
```

然后，重新运行 ks-installer。

```shell
kubectl rollout restart deploy -n kubesphere-system ks-installer
```

最后，要删除内部的 Elasticsearch，请运行以下命令。请确认你已经备份了内部 Elasticsearch 中的数据。

```shell
helm uninstall -n kubesphere-logging-system elasticsearch-logging
```

## 如何在启用 X-Pack Security 的情况下将日志存储改为 Elasticsearch

目前，KubeSphere 不支持与启用 X-Pack Security 的 Elasticsearch 集成。此功能即将推出。

## 如何修改日志数据保留天数

你需要更新 KubeKey 配置并重新运行 ks-installer。

```shell
kubectl edit cc -n kubesphere-system ks-installer
```

- 将如下 `status.logging` 的注释取消。

- 将 `es.logMaxAge` 设置为所需天数（默认为 7 天）。

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
    es:
      ...
      logMaxAge: <7>
  ...
status:
  ...
  # logging:
  #  enabledTime: 2020-08-10T02:05:13UTC
  #  status: enabled
  ...
```

- 重新运行 ks-installer。

```shell
kubectl rollout restart deploy -n kubesphere-system ks-installer
```

## 无法从工具箱中的某些节点上的工作负载中找出日志

如果你采用[多节点安装](.../.../installing-on-linux/introduction/multioverview/)，并且使用符号链接作为 Docker 根目录，请确保所有节点遵循完全相同的符号链接。日志代理在 DaemonSet 中部署到节点上。容器日志路径的任何差异都可能导致该节点上的收集失败。

要找出节点上的 Docker 根目录路径，可以运行以下命令。确保所有节点都适用相同的值。

```shell
docker info -f '{{.DockerRootDir}}'
```

## 工具箱中的日志查看页面在加载中卡住

如果您发现日志搜索在加载中卡住，请检查您使用的存储系统。例如，配置不当的 NFS 存储系统可能会导致此问题。

## 工具箱显示今天没有日志记录

请检查您的日志容量是否超过了 Elasticsearch 的存储容量限制。如果是，请增加 Elasticsearch 的磁盘容量。

## 在工具箱中查看日志时，报告服务器内部错误

如果您在工具箱中观察到内部服务器错误，可能有几个原因导致此问题。

- 网络分区
- 无效的 Elasticsearch 主机和端口
- Elasticsearch 健康状态为红色

## 如何让 KubeSphere 只收集指定工作负载的日志

KubeSphere 的日志代理是由 Fluent Bit 提供的，您需要更新 Fluent Bit 配置来排除某些工作负载的日志。要修改 Fluent Bit 输入配置，请运行以下命令：

```shell
kubectl edit input -n kubesphere-logging-system tail
```

更新 `Input.Spec.Tail.ExcludePath` 字段。例如，将路径设置为 `/var/log/containers/*_kube*-system_*.log`，以排除系统组件的任何日志。

更多信息请阅读项目 [Fluent Bit Operator](https://github.com/kubesphere/fluentbit-operator)。
