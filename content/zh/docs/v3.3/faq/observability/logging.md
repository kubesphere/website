---
title: "日志"
keywords: "Kubernetes, Elasticsearch, KubeSphere, 日志"
description: "有关日志功能的常见问题。"
linkTitle: "日志"
weight: 16310
---

本页包含一些关于日志的常见问题。

- [如何将日志存储改为外部 Elasticsearch 并关闭内部 Elasticsearch](../../observability/logging/#如何将日志存储改为外部-elasticsearch-并关闭内部-elasticsearch)
- [如何在启用 X-Pack Security 的情况下将日志存储改为 Elasticsearch](../../observability/logging/#如何在启用-x-pack-security-的情况下将日志存储改为-elasticsearch)
- [如何修改日志数据保留期限](../../observability/logging/#如何修改日志数据保留期限)
- [无法使用工具箱找到某些节点上工作负载的日志](../../observability/logging/#无法使用工具箱找到某些节点上工作负载的日志)
- [工具箱中的日志查询页面在加载时卡住](../../observability/logging/#工具箱中的日志查询页面在加载时卡住)
- [工具箱显示今天没有日志记录](../../observability/logging/#工具箱显示今天没有日志记录)
- [在工具箱中查看日志时，报告内部服务器错误](../../observability/logging/#在工具箱中查看日志时报告内部服务器错误)
- [如何让 KubeSphere 只收集指定工作负载的日志](../../observability/logging/#如何让-kubesphere-只收集指定工作负载的日志)
- [在查看容器实时日志的时候，控制台上看到的实时日志要比 kubectl log -f xxx 看到的少](../../observability/logging/#在查看容器实时日志的时候控制台上看到的实时日志要比-kubectl-log--f-xxx-看到的少)

## 如何将日志存储改为外部 Elasticsearch 并关闭内部 Elasticsearch

如果您使用的是 KubeSphere 内部的 Elasticsearch，并且想把它改成您的外部 Elasticsearch，请按照以下步骤操作。如果您还没有启用日志系统，请参考 [KubeSphere 日志系统](../../../pluggable-components/logging/)直接设置外部 Elasticsearch。

1. 首先，请执行以下命令更新 KubeKey 配置：

   ```bash
   kubectl edit cc -n kubesphere-system ks-installer
   ```

2. 将 `es.elasticsearchDataXXX`、`es.elasticsearchMasterXXX` 和 `status.logging` 的注释取消，将 `es.externalElasticsearchUrl` 设置为 Elasticsearch 的地址，将 `es.externalElasticsearchPort` 设置为其端口号。以下示例供您参考：

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

3. 重新运行 `ks-installer`。

   ```bash
   kubectl rollout restart deploy -n kubesphere-system ks-installer
   ```

4. 运行以下命令删除内部 Elasticsearch，请确认您已备份内部 Elasticsearch 中的数据。

   ```bash
   helm uninstall -n kubesphere-logging-system elasticsearch-logging
   ```

5. 如果启用了 Istio，需要修改 Jaeger 配置。

   ```yaml
   $ kubectl -n istio-system edit jaeger 
   ...
    options:
         es:
           index-prefix: logstash
           server-urls: http://elasticsearch-logging-data.kubesphere-logging-system.svc:9200  # 修改为外部地址
   ```

## 如何在启用 X-Pack Security 的情况下将日志存储改为 Elasticsearch

KubeSphere 暂不支持启用 X-Pack Security 的 Elasticsearch 集成，此功能即将推出。

## 如何设置审计、事件、日志及 Istio 日志信息的保留期限

KubeSphere v3.3 还支持您设置日志、审计、事件及 Istio 日志信息的保留期限。

您需要更新 KubeKey 配置并重新运行 `ks-installer`。

1. 执行以下命令：

   ```bash
   kubectl edit cc -n kubesphere-system ks-installer
   ```

2. 在 YAML 文件中，如果您只想修改日志的保存期限，可以直接修改 `logMaxAge` 的默认值。如果您想设置审计、事件及 Istio 日志信息的保留期限，需要添加参数 `auditingMaxAge`、`eventMaxAge` 和 `istioMaxAge`，并分别设置它们的保存期限，如下例所示：

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
       es:   # Storage backend for logging, events and auditing.
         ...
         logMaxAge: 7             # Log retention time in built-in Elasticsearch. It is 7 days by default.
         auditingMaxAge: 2
         eventMaxAge: 1
         istioMaxAge: 4
     ...
   ```

3. 重新运行 `ks-installer`。

   ```bash
   kubectl rollout restart deploy -n kubesphere-system ks-installer
   ```

## 无法使用工具箱找到某些节点上工作负载的日志

如果您采用[多节点安装](../../../installing-on-linux/introduction/multioverview)部署 KubeSphere，并且使用符号链接作为 Docker 根目录，请确保所有节点遵循完全相同的符号链接。日志代理以守护进程集的形式部署到节点上。容器日志路径的任何差异都可能导致该节点上日志收集失败。

若要找出节点上的 Docker 根目录路径，您可以运行以下命令。请确保所有节点都适用相同的值。

```shell
docker info -f '{{.DockerRootDir}}'
```

## 工具箱中的日志查询页面在加载时卡住

如果您发现日志查询页面在加载时卡住，请检查您所使用的存储系统。例如，配置不当的 NFS 存储系统可能会导致此问题。

## 工具箱显示今天没有日志记录

请检查您的日志存储卷是否超过了 Elasticsearch 的存储限制。如果是，请增加 Elasticsearch 的磁盘存储卷容量。

## 在工具箱中查看日志时，报告内部服务器错误

如果您在工具箱中看到内部服务器错误，可能有以下几个原因：

- 网络分区
- 无效的 Elasticsearch 主机和端口
- Elasticsearch 健康状态为红色

## 如何让 KubeSphere 只收集指定工作负载的日志

KubeSphere 的日志代理由 Fluent Bit 所提供，您需要更新 Fluent Bit 配置来排除某些工作负载的日志。若要修改 Fluent Bit 输入配置，请运行以下命令：

```shell
kubectl edit input -n kubesphere-logging-system tail
```

更新 `Input.Spec.Tail.ExcludePath` 字段。例如，将路径设置为 `/var/log/containers/*_kube*-system_*.log`，以排除系统组件的全部日志。

有关更多信息，请参见 [Fluent Bit Operator](https://github.com/kubesphere/fluentbit-operator)。

## 在查看容器实时日志的时候，控制台上看到的实时日志要比 kubectl log -f xxx 看到的少

主要有以下几个原因：

- 当实时去查看容器日志时，Kubernetes 是分 chunk 形式返回，Kubernetes 大概 2 分钟左右会返回一次数据，比较慢
- 未开启‘实时查看’时看到的末尾部分，在实时查看时，被划分在下次返回的部分中，现象看起来像是日志缺失
