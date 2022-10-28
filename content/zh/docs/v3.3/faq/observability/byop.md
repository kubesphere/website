---
title: "集成您自己的 Prometheus"
keywords: "监控, Prometheus, node-exporter, kube-state-metrics, KubeSphere, Kubernetes"
description: "在 KubeSphere 中使用您自己的 Prometheus 堆栈设置。"
linkTitle: "集成您自己的 Prometheus"
Weight: 16330
---

KubeSphere 自带一些预装的自定义监控组件，包括 Prometheus Operator、Prometheus、Alertmanager、Grafana（可选）、各种 ServiceMonitor、node-exporter 和 kube-state-metrics。在您安装 KubeSphere 之前，这些组件可能已经存在。在 KubeSphere 3.3 中，您可以使用自己的 Prometheus 堆栈设置。

## 集成您自己的 Prometheus 的步骤

要使用您自己的 Prometheus 堆栈设置，请执行以下步骤：

1. 卸载 KubeSphere 的自定义 Prometheus 堆栈

2. 安装您自己的 Prometheus 堆栈

3. 将 KubeSphere 自定义组件安装至您的 Prometheus 堆栈

4. 更改 KubeSphere 的 `monitoring endpoint`

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

KubeSphere 3.3 已经过认证，可以与以下 Prometheus 堆栈组件搭配使用：

- Prometheus Operator **v0.38.3+**
- Prometheus **v2.20.1+**
- Alertmanager **v0.21.0+**
- kube-state-metrics **v1.9.6**
- node-exporter **v0.18.1**

请确保您的 Prometheus 堆栈组件版本符合上述版本要求，尤其是 **node-exporter** 和 **kube-state-metrics**。

如果只安装了 **Prometheus Operator** 和 **Prometheus**，请您务必安装 **node-exporter** 和 **kube-state-metrics**。**node-exporter** 和 **kube-state-metrics** 是 KubeSphere 正常运行的必要条件。

**如果整个 Prometheus 堆栈已经启动并运行，您可以跳过此步骤。**

{{</ notice >}}

Prometheus 堆栈可以通过多种方式进行安装。下面的步骤演示如何使用**上游 `kube-prometheus`** 将 Prometheus 堆栈安装至命名空间 `monitoring` 中。

1. 获取 v0.6.0 版 kube-prometheus，它的 node-exporter 版本为 v0.18.1，与 KubeSphere 3.3 所使用的版本相匹配。

   ```bash
   cd ~ && git clone https://github.com/prometheus-operator/kube-prometheus.git && cd kube-prometheus && git checkout tags/v0.6.0 -b v0.6.0
   ```

2. 设置命名空间 `monitoring`，安装 Prometheus Operator 和相应角色：

   ```bash
   kubectl apply -f manifests/setup/
   ```

3. 稍等片刻待 Prometheus Operator 启动并运行。

   ```bash
   kubectl -n monitoring get pod --watch
   ```

4. 移除不必要组件，例如 Prometheus Adapter。

   ```bash
   rm -rf manifests/prometheus-adapter-*.yaml
   ```

5. 将 kube-state-metrics 的版本变更为 KubeSphere 3.3 所使用的 v1.9.6。

   ```bash
   sed -i 's/v1.9.5/v1.9.6/g' manifests/kube-state-metrics-deployment.yaml
   ```

6. 安装 Prometheus、Alertmanager、Grafana、kube-state-metrics 以及 node-exporter。您可以只应用 YAML 文件 `kube-state-metrics-*.yaml` 或 `node-exporter-*.yaml` 来分别安装 kube-state-metrics 或 node-exporter。

   ```bash
   kubectl apply -f manifests/
   ```

### 步骤 3：将 KubeSphere 自定义组件安装至您的 Prometheus 堆栈

{{< notice note >}}

KubeSphere 3.3 使用 Prometheus Operator 来管理 Prometheus/Alertmanager 配置和生命周期、ServiceMonitor（用于管理抓取配置）和 PrometheusRule（用于管理 Prometheus 记录/告警规则）。

[KubeSphere kustomization](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/kustomization.yaml) 中列出了一些条目，其中 `prometheus-rules.yaml` 和 `prometheus-rulesEtcd.yaml` 是 KubeSphere 3.3 正常运行的必要条件，其他均为可选。如果您不希望现有 Alertmanager 的配置被覆盖，您可以移除 `alertmanager-secret.yaml`。如果您不希望自己的 ServiceMonitor 被覆盖（KubeSphere 自定义的 ServiceMonitor 弃用许多无关指标，以便 Prometheus 只存储最有用的指标），您可以移除 `xxx-serviceMonitor.yaml`。

如果您的 Prometheus 堆栈不是由 Prometheus Operator 进行管理，您可以跳过此步骤。但请务必确保：

- 您必须将 [PrometheusRule](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/prometheus-rules.yaml) 和 [PrometheusRule for etcd](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/prometheus-rulesEtcd.yaml) 中的记录/告警规则复制至您的 Prometheus 配置中，以便 KubeSphere 3.3 能够正常运行。

- 配置您的 Prometheus，使其抓取指标的目标 (Target) 与 [KubeSphere kustomization](https://github.com/kubesphere/kube-prometheus/blob/ks-v3.0/kustomize/kustomization.yaml) 中列出的 ServiceMonitor 的目标相同。

{{</ notice >}}

1. 获取 KubeSphere 3.3 的自定义 kube-prometheus。

   ```bash
   cd ~ && mkdir kubesphere && cd kubesphere && git clone https://github.com/kubesphere/kube-prometheus.git && cd kube-prometheus/kustomize
   ```

2. 将命名空间更改为您自己部署 Prometheus 堆栈的命名空间。例如，如果您按照步骤 2 将 Prometheus 安装在命名空间 `monitoring` 中，这里即为 `monitoring`。

   ```bash
   sed -i 's/my-namespace/<your own namespace>/g' kustomization.yaml
   ```

3. 应用 KubeSphere 自定义组件，包括 Prometheus 规则、Alertmanager 配置和各种 ServiceMonitor 等。

   ```bash
   kubectl apply -k .
   ```

4. 配置服务 (Service) 用于暴露 kube-scheduler 和 kube-controller-manager 指标。

   ```bash
   kubectl apply -f ./prometheus-serviceKubeScheduler.yaml
   kubectl apply -f ./prometheus-serviceKubeControllerManager.yaml
   ```

5. 在您自己的命名空间中查找 Prometheus CR，通常为 Kubernetes。

   ```bash
   kubectl -n <your own namespace> get prometheus
   ```

6. 将 Prometheus 规则评估间隔设置为 1m，与 KubeSphere 3.3 的自定义 ServiceMonitor 保持一致。规则评估间隔应大于或等于抓取间隔。

   ```bash
   kubectl -n <your own namespace> patch prometheus k8s --patch '{
     "spec": {
       "evaluationInterval": "1m"
     }
   }' --type=merge
   ```

### 步骤 4：更改 KubeSphere 的 `monitoring endpoint`

您自己的 Prometheus 堆栈现在已启动并运行，您可以更改 KubeSphere 的监控 Endpoint 来使用您自己的 Prometheus。

1. 运行以下命令，编辑 `kubesphere-config`：

   ```bash
   kubectl edit cm -n kubesphere-system kubesphere-config
   ```

2. 搜寻到 `monitoring endpoint` 部分，如下所示：

   ```bash
       monitoring:
         endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
   ```

3. 将 `monitoring endpoint` 更改为您自己的 Prometheus：

   ```bash
       monitoring:
         endpoint: http://prometheus-operated.monitoring.svc:9090
   ```

4. 运行以下命令，重启 KubeSphere APIserver。

   ```bash
   kubectl -n kubesphere-system rollout restart deployment/ks-apiserver
   ```

{{< notice warning >}}

如果您按照[此指南](../../../pluggable-components/overview/)启用/禁用 KubeSphere 可插拔组件，`monitoring endpoint` 会重置为初始值。此时，您需要再次将其更改为您自己的 Prometheus 并重启 KubeSphere APIserver。

{{</ notice >}}