---
title: "监控系统"
keywords: "Kubernetes, Prometheus, KubeSphere, Monitoring"
description: "FAQ"

linkTitle: "监控系统"
weight: 6930
---

## 如何访问 KubeSphere Prometheus 控制台

KubeSphere 监控引擎由 Prometheus 提供支持。出于调试目的，您可能希望通过 NodePort 访问内置的 Prometheus 服务。要做到这一点，运行以下命令来编辑服务类型。

```shell
kubectl edit svc -n kubesphere-monitoring-system prometheus-k8s
```

## Node Exporter 引起的主机端口 9100 冲突

如果有进程占用主机端口 9100，`kubespher-monitoring-system` 下的 Node Exporter 会崩溃。为了解决冲突，你需要终止进程或将 Node Exporter 换到另一个可用端口。

要采用另一个主机端口，例如 `29100`，运行以下命令，将所有 `9100` 替换为 `29100`（需要更改 5 处）。
 
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
         - --web.listen-address=127.0.0.1:9100
         ...
       - name: kube-rbac-proxy
         image: kubesphere/kube-rbac-proxy:v0.4.1
         args:
         - --logtostderr
         - --secure-listen-address=[$(IP)]:9100
         - --upstream=http://127.0.0.1:9100/
         ...
         ports:
         - containerPort: 9100
           hostPort: 9100
  ...
```

## 与现有的 Prometheus Operator 相冲突

如果你已经自行部署了 Prometheus Operator，请确保在安装 KubeSphere 之前将 Prometheus Operator 删除。否则，可能会出现 KubeSphere 内置的 Prometheus Operator 选择重复的 ServiceMonitor 对象的冲突。

## 如何修改监控数据保留天数

运行下面的命令来编辑最大保留天数。找出 `retention` 字段，并将其更新为所需天数（默认为 7）。

```shell
kubectl edit prometheuses -n kubesphere-monitoring-system k8s
```

## kube-scheduler / kube-controller-manager 没有监测数据

首先，请确保标志 `--bind-address` 被设置为 `0.0.0.0`（默认），而不是 `127.0.0.1`。Prometheus 可能需要从其它主机到达这些组件。

随后，请检查 kube-scheduler 和 kube-controller-manager 的端点对象是否存在。如果它们缺失，请通过创建服务选择目标 Pod 手动创建它们。

```shell
kubectl get ep -n kube-system | grep -E 'kube-scheduler|kube-controller-manager'
```

## 过去几分钟没有监测数据

请检查您的计算机浏览器本地时钟是否与互联网时间和您的群集同步。时差可能会导致这个问题。特别是您处于在局域网中，可能会出现这种情况。

## 两个节点和控制平面都没有监控数据

请检查您的网络插件，并确保您的主机和 Pod 网络 CIDR 之间没有 IPPool 重叠。KubeSphere 强烈建议您使用 [KubeKey](https://github.com/kubesphere/kubekey) 安装 Kubernetes。

中国读者可以参考 KubeSphere 中文论坛的[讨论](https://kubesphere.com.cn/forum/d/2027/16)了解更多信息。

## Prometheus 产生错误日志：打开存储失败，没有这样的文件或目录

如果 `kubesphere-monitoring-system` 下的 Prometheus Pod 崩溃并产生以下错误日志，您的 Prometheus 数据可能已经损坏，需要手动删除才能恢复。

```
level=error ts=2020-10-14T17:43:30.485Z caller=main.go:764 err="opening storage failed: block dir: \"/prometheus/01EM0016F8FB33J63RNHFMHK3\": open /prometheus/01EM0016F8FB33J63RNHFMHK3/meta.json: no such file or directory"
```

执行进入 Prometheus Pod（如果可能的话），并删除目录 `/prometheus/01EM0016F8FB33J63RNHFMHK3`。

```shell
kubectl exec -it -n kubesphere-monitoring-system prometheus-k8s-0 -c prometheus sh

rm -rf 01EM0016F8FB33J63RNHFMHK3/
```

或者您可以简单地从链接到 Prometheus PVC 的持久存储卷中删除目录。
