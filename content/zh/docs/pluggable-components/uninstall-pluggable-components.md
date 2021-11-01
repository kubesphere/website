---
title: "KubeSphere v3.1.x 卸载可插拔组件"
keywords: "Installer, uninstall, KubeSphere, Kubernetes"
description: "学习如何在 KubeSphere v3.1.x 卸载所有可插拔组件。"
linkTitle: "KubeSphere v3.1.x 卸载可插拔组件"
Weight: 6940
---

[启用 KubeSphere 可插拔组件之后](../../pluggable-components/)，还可以根据以下步骤卸载他们。请在卸载这些组件之前，备份所有重要数据。

{{< notice note >}}

KubeSphere v3.1.x 卸载某些可插拔组件的方法与 KubeSphere v3.0.0 不相同。有关 KubeSphere v3.0.0 卸载可插拔组件的详细方法，请参见[从 KubeSphere 上卸载可插拔组件](https://v3-0.docs.kubesphere.io/zh/docs/faq/installation/uninstall-pluggable-components/)。


{{</ notice >}}

## 准备工作

在卸载除服务拓扑图和容器组 IP 池之外的可插拔组件之前，必须将 CRD 配置文件 `ClusterConfiguration` 中的 `ks-installer` 中的 `enabled` 字段的值从 `true` 改为 `false`。

使用下列其中一方法更改 `enabled` 字段的值：

- 运行以下命令编辑 `ks-installer`：

```bash
kubectl -n kubesphere-system edit clusterconfiguration ks-installer
```

- 使用 `admin` 身份登录 KubeSphere Web 控制台，左上角点击**平台管理**，选择**集群管理**，在**自定义资源 CRD** 中搜索 `ClusterConfiguration`。有关更多信息，请参见[启用可插拔组件](../../pluggable-components/)。

{{< notice note >}}

更改值之后，需要等待配置更新完成，然后继续进行后续操作。

{{</ notice >}}

## 卸载 KubeSphere 应用商店

将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `openpitrix.store.enabled` 字段的值从 `true` 改为 `false`。

## 卸载 KubeSphere DevOps

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `devops.enabled` 字段的值从 `true` 改为 `false`。

2. 运行[准备工作](#准备工作)中提到的命令，然后删除 CRD `ClusterConfiguration` 配置文件 `ks-installer` 参数中 `status.devops` 字段下的代码。

3. 运行下面的命令。

   ```bash
   helm -n kubesphere-devops-system delete ks-jenkins
   helm -n kubesphere-devops-system delete uc
   ```

   ```bash
   # Delete DevOps projects
   for devopsproject in `kubectl get devopsprojects -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch devopsprojects $devopsproject -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for pip in `kubectl get pipeline -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch pipeline $pip -n `kubectl get pipeline -A | grep $pip | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2ibinaries in `kubectl get s2ibinaries -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2ibinaries $s2ibinaries -n `kubectl get s2ibinaries -A | grep $s2ibinaries | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2ibuilders in `kubectl get s2ibuilders -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2ibuilders $s2ibuilders -n `kubectl get s2ibuilders -A | grep $s2ibuilders | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2ibuildertemplates in `kubectl get s2ibuildertemplates -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2ibuildertemplates $s2ibuildertemplates -n `kubectl get s2ibuildertemplates -A | grep $s2ibuildertemplates | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   for s2iruns in `kubectl get s2iruns -A -o jsonpath="{.items[*].metadata.name}"`
   do
     kubectl patch s2iruns $s2iruns -n `kubectl get s2iruns -A | grep $s2iruns | awk '{print $1}'` -p '{"metadata":{"finalizers":null}}' --type=merge
   done
   
   kubectl delete devopsprojects --all 2>/dev/null
   ```

   ```bash
   kubectl delete ns kubesphere-devops-system
   ```

## 卸载 KubeSphere 日志系统

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `logging.enabled` 字段的值从 `true` 改为 `false`。

2. 仅禁用日志收集：

   ```bash
   delete inputs.logging.kubesphere.io -n kubesphere-logging-system tail
   ```

   {{< notice note >}}

   运行此命令后，默认情况下仍可查看 Kubernetes 提供的容器最近日志。但是，容器历史记录日志将被清除，您无法再浏览它们。

   {{</ notice >}}

3. 卸载包括 Elasticsearch 的日志系统，请执行以下操作：

   ```bash
   kubectl delete crd fluentbitconfigs.logging.kubesphere.io
   kubectl delete crd fluentbits.logging.kubesphere.io
   kubectl delete crd inputs.logging.kubesphere.io
   kubectl delete crd outputs.logging.kubesphere.io
   kubectl delete crd parsers.logging.kubesphere.io
   kubectl delete deployments.apps -n kubesphere-logging-system fluentbit-operator
   helm uninstall elasticsearch-logging --namespace kubesphere-logging-system
   ```

   {{< notice note >}}

   此操作可能导致审计、事件和服务网格的异常。

   {{</ notice >}}

## 卸载 KubeSphere 事件系统

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `events.enabled` 字段的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   helm delete ks-events -n kubesphere-logging-system
   ```

## 卸载 KubeSphere 告警系统

2. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `alerting.enabled` 字段的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   kubectl -n kubesphere-monitoring-system delete thanosruler kubesphere
   ```

   {{< notice note >}}

   KubeSphere v3.1.x 通知系统为默认安装，您无需卸载。

   {{</ notice >}} 


## 卸载 KubeSphere 审计

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `auditing.enabled` 字段的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   helm uninstall kube-auditing -n kubesphere-logging-system
   kubectl delete crd awh
   kubectl delete crd ar
   ```

## 卸载 KubeSphere 服务网格

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `servicemesh.enabled` 字段的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   curl -L https://istio.io/downloadIstio | sh -
   istioctl x uninstall --purge
   
   kubectl -n istio-system delete kiali kiali
   helm -n istio-system delete kiali-operator
   
   kubectl -n istio-system delete jaeger jaeger
   helm -n istio-system delete jaeger-operator
   ```

## 卸载网络策略

对于 NetworkPolicy 组件，禁用它不需要卸载组件，因为其控制器位于 `ks-controller-manager` 中。如果想要将其从 KubeSphere 控制台中移除，将 CRD `ClusterConfiguration`  配置文件中参数 `ks-installer` 中 `network.networkpolicy.enabled` 的值从 `true` 改为 `false`。

## 卸载 Metrics Server

1. 将 CRD `ClusterConfiguration`  配置文件中参数 `ks-installer` 中 `metrics_server.enabled` 的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   kubectl delete apiservice v1beta1.metrics.k8s.io
   kubectl -n kube-system delete service metrics-server
   kubectl -n kube-system delete deployment metrics-server
   ```

## 卸载服务拓扑图

1. 将 CRD `ClusterConfiguration`  配置文件中参数 `ks-installer` 中 `network.topology.type` 的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   kubectl delete ns weave
   ```

## 卸载容器 IP 池

将 CRD `ClusterConfiguration`  配置文件中参数 `ks-installer` 中 `network.ippool.type` 的值从 `true` 改为 `false`。

## 卸载 KubeEdge

1. 将 CRD `ClusterConfiguration`  配置文件中参数 `ks-installer` 中 `kubeedege.enabled` 的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   helm uninstall kubeedge -n kubeedge
   kubectl delete ns kubeedge
   ```
   
   {{< notice note >}}
   
   卸载后，您将无法为集群添加边缘节点。
   
   {{</ notice >}}

