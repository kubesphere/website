---
title: "集成您自己的 Prometheus"
keywords: "监控, Prometheus, node-exporter, kube-state-metrics, KubeSphere, Kubernetes"
description: "在 KubeSphere 中使用您自己的 Prometheus 堆栈设置。"
linkTitle: "集成您自己的 Prometheus"
Weight: 16330
---

KubeSphere 自带一些预装的自定义监控组件，包括 Prometheus Operator、Prometheus、Alertmanager、Grafana（可选）、各种 ServiceMonitor、node-exporter 和 kube-state-metrics。在您安装 KubeSphere 之前，这些组件可能已经存在。在 KubeSphere 3.3.0 中，您可以使用自己的 Prometheus 堆栈设置。

## 集成您自己的 Prometheus

要使用您自己的 Prometheus 堆栈设置，请执行以下步骤：

### 步骤 1：卸载 KubeSphere 的自定义 Prometheus 堆栈

1. 执行以下命令，卸载堆栈：

   ```bash
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/alertmanager/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/devops/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/etcd/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/grafana/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/kube-state-metrics/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/node-exporter/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/upgrade/ 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus-rules-v1.16\+.yaml 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus-rules.yaml 2>/dev/null
   kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/prometheus 2>/dev/null
   # Uncomment this line if you don't have Prometheus managed by Prometheus Operator in other namespaces.
   # kubectl -n kubesphere-system exec $(kubectl get pod -n kubesphere-system -l app=ks-installer -o jsonpath='{.items[0].metadata.name}') -- kubectl delete -f /kubesphere/kubesphere/prometheus/init/ 2>/dev/null
   ```

2. 删除 Prometheus 使用的 PVC。

   ```bash
   kubectl -n kubesphere-monitoring-system delete pvc `kubectl -n kubesphere-monitoring-system get pvc | grep -v VOLUME | awk '{print $1}' |  tr '\n' ' '`
   ```

### 步骤 2：安装您自己的 Prometheus 堆栈

{{< notice note >}}

KubeSphere 3.3.0 已经过认证，可以与以下 Prometheus 堆栈组件搭配使用：

- Prometheus Operator **v0.55.1+**
- Prometheus **v2.34.0+**
- Alertmanager **v0.23.0+**
- kube-state-metrics **v2.5.0**
- node-exporter **v1.3.1**

请确保您的 Prometheus 堆栈组件版本符合上述版本要求，尤其是 **node-exporter** 和 **kube-state-metrics**。

如果只安装了 **Prometheus Operator** 和 **Prometheus**，请您务必安装 **node-exporter** 和 **kube-state-metrics**。**node-exporter** 和 **kube-state-metrics** 是 KubeSphere 正常运行的必要条件。

**如果整个 Prometheus 堆栈已经启动并运行，您可以跳过此步骤。**

{{</ notice >}}

Prometheus 堆栈可以通过多种方式进行安装。下面的步骤演示如何使用 `ks-prometheus`（基于上游的 `kube-prometheus` 项目） 将 Prometheus 堆栈安装至命名空间 `monitoring` 中。

1. 获取 KubeSphere 3.3.0 所使用的 `ks-prometheus`。

   ```bash
   cd ~ && git clone -b release-3.3 https://github.com/kubesphere/ks-prometheus.git && cd ks-prometheus
   ```

2. 设置命名空间。

   ```bash
   sed -i 's/kubesphere-monitoring-system/monitoring/g' kustomization.yaml
   ```

3. （可选）移除不必要的组件。例如，KubeSphere 未启用 Grafana 时，可以删除 `kustomization.yaml` 中的 `grafana` 部分：

   ```bash
   sed -i '/manifests\/grafana\//d' kustomization.yaml
   ```

4. 安装堆栈。

   ```bash
   kubectl apply -k .
   ```

### 步骤 3：将 KubeSphere 自定义组件安装至您的 Prometheus 堆栈

{{< notice note >}}

如果您的 Prometheus 堆栈是通过 `ks-prometheus` 进行安装，您可以跳过此步骤。

KubeSphere 3.3.0 使用 Prometheus Operator 来管理 Prometheus/Alertmanager 配置和生命周期、ServiceMonitor（用于管理抓取配置）和 PrometheusRule（用于管理 Prometheus 记录/告警规则）。

如果您的 Prometheus 堆栈不是由 Prometheus Operator 进行管理，您可以跳过此步骤。但请务必确保：

- 您必须将 [PrometheusRule](https://github.com/kubesphere/ks-prometheus/blob/release-3.3/manifests/kubernetes/kubernetes-prometheusRule.yaml) 和 [PrometheusRule for etcd](https://github.com/kubesphere/ks-prometheus/blob/release-3.3/manifests/etcd/prometheus-rulesEtcd.yaml) 中的记录/告警规则复制至您的 Prometheus 配置中，以便 KubeSphere 3.3.0 能够正常运行。

- 配置您的 Prometheus，使其抓取指标的目标 (Target) 与 各组件的 [serviceMonitor](https://github.com/kubesphere/ks-prometheus/tree/release-3.3/manifests) 文件中列出的目标相同。

{{</ notice >}}

1. 获取 KubeSphere 3.3.0 所使用的 `ks-prometheus`。

   ```bash
   cd ~ && git clone -b release-3.3 https://github.com/kubesphere/ks-prometheus.git && cd ks-prometheus
   ```

2. 设置 `kustomization.yaml`，仅保留如下内容。

   ```yaml
   apiVersion: kustomize.config.k8s.io/v1beta1
   kind: Kustomization
   namespace: <your own namespace>
   resources:
   - ./manifests/alertmanager/alertmanager-secret.yaml
   - ./manifests/etcd/prometheus-rulesEtcd.yaml
   - ./manifests/kube-state-metrics/kube-state-metrics-serviceMonitor.yaml
   - ./manifests/kubernetes/kubernetes-prometheusRule.yaml
   - ./manifests/kubernetes/kubernetes-serviceKubeControllerManager.yaml
   - ./manifests/kubernetes/kubernetes-serviceKubeScheduler.yaml
   - ./manifests/kubernetes/kubernetes-serviceMonitorApiserver.yaml
   - ./manifests/kubernetes/kubernetes-serviceMonitorCoreDNS.yaml
   - ./manifests/kubernetes/kubernetes-serviceMonitorKubeControllerManager.yaml
   - ./manifests/kubernetes/kubernetes-serviceMonitorKubeScheduler.yaml
   - ./manifests/kubernetes/kubernetes-serviceMonitorKubelet.yaml
   - ./manifests/node-exporter/node-exporter-serviceMonitor.yaml
   - ./manifests/prometheus/prometheus-clusterRole.yaml
   ```

   {{< notice note >}}

   - 将此处 `namespace` 的值设置为您自己的命名空间。例如，如果您在步骤 2 将 Prometheus 安装在命名空间 `monitoring` 中，这里即为 `monitoring`。
   - 如果您启用了 KubeSphere 的告警，还需要保留 `kustomization.yaml` 中的 `thanos-ruler` 部分。

   {{</ notice >}}


3. 安装以上 KubeSphere 必要组件。

   ```bash
   kubectl apply -k .
   ```

4. 在您自己的命名空间中查找 Prometheus CR，通常为 k8s。

   ```bash
   kubectl -n <your own namespace> get prometheus
   ```

5. 将 Prometheus 规则评估间隔设置为 1m，与 KubeSphere 3.3.0 的自定义 ServiceMonitor 保持一致。规则评估间隔应大于或等于抓取间隔。

   ```bash
   kubectl -n <your own namespace> patch prometheus k8s --patch '{
     "spec": {
       "evaluationInterval": "1m"
     }
   }' --type=merge
   ```

### 步骤 4：更改 KubeSphere 的 `monitoring endpoint`

您自己的 Prometheus 堆栈现在已启动并运行，您可以更改 KubeSphere 的监控 Endpoint 来使用您自己的 Prometheus。

1. 运行以下命令，编辑 `kubesphere-config`。

   ```bash
   kubectl edit cm -n kubesphere-system kubesphere-config
   ```

2. 搜索 `monitoring endpoint` 部分，如下所示。

   ```yaml
       monitoring:
         endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
   ```

3. 将 `endpoint` 的值更改为您自己的 Prometheus。

   ```yaml
       monitoring:
         endpoint: http://prometheus-operated.monitoring.svc:9090
   ```

4. 如果您启用了 KubeSphere 的告警组件，请搜索 `alerting` 的 `prometheusEndpoint` 和 `thanosRulerEndpoint`，并参照如下示例修改。KubeSphere Apiserver 将自动重启使设置生效。

   ```yaml
   ...
      alerting:
        ...
        prometheusEndpoint: http://prometheus-operated.monitoring.svc:9090
        thanosRulerEndpoint: http://thanos-ruler-operated.monitoring.svc:10902
        ...
   ...
   ```

{{< notice warning >}}

如果您按照[此指南](../../../pluggable-components/overview/)启用/禁用 KubeSphere 可插拔组件，`monitoring endpoint` 会重置为初始值。此时，您需要再次将其更改为您自己的 Prometheus。

{{</ notice >}}