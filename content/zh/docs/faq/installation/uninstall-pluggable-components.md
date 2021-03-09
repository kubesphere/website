---
title: "从 KubeSphere 卸载可插拔组件"
keywords: "安装程序, 卸载, KubeSphere, Kubernetes"
description: "如何从 KubeSphere 卸载可插拔组件"
linkTitle: "从 KubeSphere 卸载可插拔组件"
Weight: 16500
---

在[启用 KubeSphere 可插拔组件](../../../pluggable-components/)之后，您还可以使用以下命令将其卸载。卸载前，请备份所有必要的数据。

## 应用商店

```bash
kubectl delete ns openpitrix-system
```

## Metrics Server

```bash
helm delete metrics-server -n kube-system
```

## 事件

```bash
helm delete ks-events -n kubesphere-logging-system
```

## 审计

```bash
helm delete kube-auditing -n kubesphere-logging-system
```

## 日志

```bash
kubectl delete ns kubesphere-logging-system
```

可选：

```bash
# Uninstall es and curator
helm uninstall -n kubesphere-logging-system elasticsearch-logging
helm uninstall -n kubesphere-logging-system elasticsearch-logging-curator

# Uninstall fluent bit operator and fluent bit
kubectl delete -f https://github.com/kubesphere/fluentbit-operator/tree/v0.2.0/manifests/logging-stack
kubectl delete -f https://github.com/kubesphere/fluentbit-operator/tree/v0.2.0/manifests/setup

# Uninstall log sidecar injector
helm uninstall -n kubesphere-logging-system logsidecar-injector
```

## 告警和通知

```bash
kubectl delete ns kubesphere-alerting-system
```

仅卸载**告警**：

```bash
kubectl delete deployment -n kubesphere-alerting-system alerting-client alerting-executor alerting-manager alerting-watcher
kubectl delete svc -n kubesphere-alerting-system alerting-client-server alerting-manager-server
```

仅卸载**通知**：

```bash
kubectl delete deployment -n kubesphere-alerting-system notification-deployment
kubectl delete svc -n kubesphere-alerting-system notification
```

{{< notice note >}}

告警和通知通常同时启用，两者在命名空间 `kubesphere-alerting-system` 中同时运行。

{{</ notice >}} 

## Service Mesh

```bash
helm -n istio-system delete istio-init
helm -n istio-system delete istio
helm -n istio-system delete jaeger-operator
kubectl delete ns istio-system
```

## DevOps

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

{{< notice note >}} 

对于组件 NetworkPolicy 而言，无需卸载组件就能禁用该组件，因为该组件的控制器如今在 `ks-controller-manager` 中。如果您想从 KubeSphere 控制台删除组件 NetworkPolicy，请将 `ks-installer` 中的 `networkPolicy.enabled` 改为 `false`。

{{</ notice >}} 