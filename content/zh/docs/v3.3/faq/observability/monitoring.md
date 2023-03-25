---
title: "监控"
keywords: "Kubernetes, Prometheus, KubeSphere, 监控"
description: "有关监控功能的常见问题。"
linkTitle: "监控"
weight: 16320
---

本页包含关于监控的一些常见问题。

- [如何访问 KubeSphere Prometheus 控制台](../../observability/monitoring/#如何访问-kubesphere-prometheus-控制台)
- [Node Exporter 引起的主机端口 9100 冲突](../../observability/monitoring/#node-exporter-引起的主机端口-9100-冲突)
- [与现有的 Prometheus Operator 相冲突](../../observability/monitoring/#与现有的-prometheus-operator-相冲突)
- [如何更改监控数据保留期限](../../observability/monitoring/#如何更改监控数据保留期限)
- [kube-scheduler 和 kube-controller-manager 没有监控数据](../../observability/monitoring/#kube-scheduler-和-kube-controller-manager-没有监控数据)
- [近几分钟没有监控数据](../../observability/monitoring/#近几分钟没有监控数据)
- [节点和控制平面都没有监控数据](../../observability/monitoring/#节点和控制平面都没有监控数据)
- [Prometheus 产生错误日志：打开存储失败、没有此文件或目录](../../observability/monitoring/#prometheus-产生错误日志打开存储失败没有此文件或目录)

## 如何访问 KubeSphere Prometheus 控制台

KubeSphere 监控引擎由 Prometheus 提供支持。出于调试目的，您可能希望通过 NodePort 访问内置的 Prometheus 服务，请运行以下命令将服务类型更改为 `NodePort`：

```shell
kubectl edit svc -n kubesphere-monitoring-system prometheus-k8s
```

{{< notice note >}}

若要访问 Prometheus 控制台，您可能需要根据您的环境开放相关端口并配置端口转发规则。

{{</ notice >}} 

## Node Exporter 引起的主机端口 9100 冲突 / 暴漏 http 协议

如果有进程占用主机端口 9100，`kubespher-monitoring-system` 下的 Node Exporter 会崩溃。若要解决冲突，您需要终止进程或将 Node Exporter 换到另一个可用端口。

若要采用另一个主机端口（例如 `29100`），请运行以下命令将标注🟢的 `9100` 替换为 `29100`（需要更改 3 处）。

 ```shell
 kubectl edit ds -n kubesphere-monitoring-system node-exporter
 ```

 ```shell
 apiVersion: apps/v1
 kind: DaemonSet
 metadata:
   name: node-exporter
   namespace: kubesphere-monitoring-system
   ...
 spec:
   ...
   template:
     ...
     spec:
       containers:
       - name: node-exporter
         image: kubesphere/node-exporter:ks-v0.18.1
         args:
         - --web.listen-address=127.0.0.1:9100 🔴
         ...
       - name: kube-rbac-proxy
         image: kubesphere/kube-rbac-proxy:v0.4.1
         args:
         - --logtostderr
         - --secure-listen-address=[$(IP)]:9100 🟢
         - --upstream=http://127.0.0.1:9100/
         ...
         ports:
         - containerPort: 9100 🟢
           hostPort: 9100 🟢
  ...
 ```
 这样，serviceMonitor 对象：node-exporter，将暴漏新的 29100 端口给 kubesphere 的 prometheus。
 在此基础上，如果你自建的 prometheus 通过 consul 获取了所有的云服务（阿里云）ecs 下 http 协议的 9100，则还需要将 🔴 标注部分变更为 0.0.0.0:9100。

## 与现有的 Prometheus Operator 相冲突

如果您已自行部署 Prometheus Operator，请确保在安装 KubeSphere 之前将 Prometheus Operator 删除。否则，可能会出现冲突，即 KubeSphere 内置的 Prometheus Operator 选择重复的 ServiceMonitor 对象。

## 如何更改监控数据保留期限

运行以下命令编辑最大保留期限。导航到 `retention` 字段，并设置所需保留期限（默认为 `7d`）。

```shell
kubectl edit prometheuses -n kubesphere-monitoring-system k8s
```

## kube-scheduler 和 kube-controller-manager 没有监控数据

首先，请确保标志 `--bind-address` 设置为 `0.0.0.0`（默认），而不是 `127.0.0.1`。Prometheus 可能需要从其他主机访问这些组件。

其次，请检查 `kube-scheduler` 和 `kube-controller-manager` 的端点对象是否存在。如果缺失，请通过创建服务和选择目标 Pod 手动创建。

```shell
kubectl get ep -n kube-system | grep -E 'kube-scheduler|kube-controller-manager'
```

## 近几分钟没有监控数据

请检查计算机浏览器的本地时钟是否与互联网时间以及您的集群同步，时差可能会导致该问题。如果您的计算机连接的是内联网，尤其可能会出现这种情况。

## 节点和控制平面都没有监控数据

请检查您的网络插件，并确保您的主机和 Pod 网络 CIDR 之间没有 IPPool 重叠。强烈建议您使用 [KubeKey](https://github.com/kubesphere/kubekey) 安装 Kubernetes。

中文读者可以参考 KubeSphere 开发者社区的[讨论](https://kubesphere.com.cn/forum/d/2027/16)了解更多信息。

## Prometheus 产生错误日志：打开存储失败、没有此文件或目录

如果 `kubesphere-monitoring-system` 中的 Prometheus Pod 崩溃并产生以下错误日志，您的 Prometheus 数据可能已经损坏，需要手动删除才能恢复。

```shell
level=error ts=2020-10-14T17:43:30.485Z caller=main.go:764 err="opening storage failed: block dir: \"/prometheus/01EM0016F8FB33J63RNHFMHK3\": open /prometheus/01EM0016F8FB33J63RNHFMHK3/meta.json: no such file or directory"
```

执行进入 Prometheus Pod（如果可能），并删除目录 `/prometheus/01EM0016F8FB33J63RNHFMHK3`：

```shell
kubectl exec -it -n kubesphere-monitoring-system prometheus-k8s-0 -c prometheus sh

rm -rf 01EM0016F8FB33J63RNHFMHK3/
```

或者，您可以直接从绑定到 Prometheus PVC 的持久卷中删除该目录。

