---
title: "卸载可插拔组件"
keywords: "Installer, uninstall, KubeSphere, Kubernetes"
description: "学习如何在 KubeSphere上卸载所有可插拔组件。"
linkTitle: "卸载可插拔组件"
Weight: 6940
---

[启用 KubeSphere 可插拔组件之后](../../pluggable-components/)，还可以根据以下步骤卸载他们。请在卸载这些组件之前，备份所有重要数据。
## 准备工作

在卸载除服务拓扑图和容器组 IP 池之外的可插拔组件之前，必须将 CRD 配置文件 `ClusterConfiguration` 中的 `ks-installer` 中的 `enabled` 字段的值从 `true` 改为 `false`。

使用下列任一方法更改 `enabled` 字段的值：

- 运行以下命令编辑 `ks-installer`：

```bash
kubectl -n kubesphere-system edit clusterconfiguration ks-installer
```

- 使用 `admin` 身份登录 KubeSphere Web 控制台，左上角点击**平台管理**，选择**集群管理**，在**定制资源定义**中搜索 `ClusterConfiguration`。有关更多信息，请参见[启用可插拔组件](../../pluggable-components/)。

{{< notice note >}}

更改值之后，需要等待配置更新完成，然后继续进行后续操作。

{{</ notice >}}

## 卸载 KubeSphere 应用商店

将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `openpitrix.store.enabled` 字段的值从 `true` 改为 `false`。

## 卸载 KubeSphere DevOps

1. 卸载 DevOps：

   ```bash
   helm uninstall -n kubesphere-devops-system devops
   kubectl patch -n kubesphere-system cc ks-installer --type=json -p='[{"op": "remove", "path": "/status/devops"}]'
   kubectl patch -n kubesphere-system cc ks-installer --type=json -p='[{"op": "replace", "path": "/spec/devops/enabled", "value": false}]'
   ```
2. 删除 DevOps 资源：

   ```bash
   # 删除所有 DevOps 相关资源
   for devops_crd in $(kubectl get crd -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | grep "devops.kubesphere.io"); do
       for ns in $(kubectl get ns -ojsonpath='{.items..metadata.name}'); do
           for devops_res in $(kubectl get $devops_crd -n $ns -oname); do
               kubectl patch $devops_res -n $ns -p '{"metadata":{"finalizers":[]}}' --type=merge
           done
       done
   done
   # 删除所有 DevOps CRD
   kubectl get crd -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | grep "devops.kubesphere.io" | xargs -I crd_name kubectl delete crd crd_name
   # 删除 DevOps 命名空间
   kubectl delete namespace kubesphere-devops-system
   ```


## 卸载 KubeSphere 日志系统

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `logging.enabled` 字段的值从 `true` 改为 `false`。

2. 仅禁用日志收集：

   ```bash
   kubectl delete inputs.logging.kubesphere.io -n kubesphere-logging-system tail
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

   {{< notice warning >}}

   此操作可能导致审计、事件和服务网格的异常。

   {{</ notice >}}
   
3. 运行以下命令：

   ```bash
   kubectl delete deployment logsidecar-injector-deploy -n kubesphere-logging-system
   kubectl delete ns kubesphere-logging-system
   ```

## 卸载 KubeSphere 事件系统

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `events.enabled` 字段的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   helm delete ks-events -n kubesphere-logging-system
   ```

## 卸载 KubeSphere 告警系统

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `alerting.enabled` 字段的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   kubectl -n kubesphere-monitoring-system delete thanosruler kubesphere
   ```

   {{< notice note >}}

   KubeSphere 3.3 通知系统为默认安装，您无需卸载。

   {{</ notice >}} 


## 卸载 KubeSphere 审计

1. 将 CRD `ClusterConfiguration`  配置文件中 `ks-installer` 参数的 `auditing.enabled` 字段的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   helm uninstall kube-auditing -n kubesphere-logging-system
   kubectl delete crd rules.auditing.kubesphere.io
   kubectl delete crd webhooks.auditing.kubesphere.io
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

1. 将 CRD `ClusterConfiguration`  配置文件中参数 `ks-installer` 中 `network.topology.type` 的值从 `weave-scope` 改为 `none`。

2. 运行以下命令：

   ```bash
   kubectl delete ns weave
   ```

## 卸载容器组 IP 池

将 CRD `ClusterConfiguration`  配置文件中参数 `ks-installer` 中 `network.ippool.type` 的值从 `calico` 改为 `none`。

## 卸载 KubeEdge

1. 将 CRD `ClusterConfiguration` 配置文件中参数 `ks-installer` 中 `kubeedege.enabled` 和 `edgeruntime.enabled` 的值从 `true` 改为 `false`。

2. 运行以下命令：

   ```bash
   helm uninstall kubeedge -n kubeedge
   kubectl delete ns kubeedge
   ```
   
   {{< notice note >}}
   
   卸载后，您将无法为集群添加边缘节点。
   
   {{</ notice >}}

