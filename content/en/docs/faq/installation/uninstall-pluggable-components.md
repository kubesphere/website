---
title: "Uninstall Pluggable Components from KubeSphere"
keywords: "Installer, uninstall, KubeSphere, Kubernetes"
description: "How to uninstall pluggable components from KubeSphere"
linkTitle: "Uninstall Pluggable Components from KubeSphere"
Weight: 16500
---

After you [enable pluggable components of KubeSphere](../../../pluggable-components/), you can also uninstall them using the following commands. Please back up any necessary data before you uninstall them.

## App Store

```bash
kubectl delete ns openpitrix-system
```

## Metrics Server

```bash
helm delete metrics-server -n kube-system
```

## Events

```bash
helm delete ks-events -n kubesphere-logging-system
```

## Auditing

```bash
helm delete kube-auditing -n kubesphere-logging-system
```

## Logging

```bash
kubectl delete ns kubesphere-logging-system
```

Optional:

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

## Alerting and Notification

```bash
kubectl delete ns kubesphere-alerting-system
```

To uninstall **alerting** only:

```bash
kubectl delete deployment -n kubesphere-alerting-system alerting-client alerting-executor alerting-manager alerting-watcher
kubectl delete svc -n kubesphere-alerting-system alerting-client-server alerting-manager-server
```

To uninstall **notification** only:

```bash
kubectl delete deployment -n kubesphere-alerting-system notification-deployment
kubectl delete svc -n kubesphere-alerting-system notification
```

{{< notice note >}}

Alerting and notification are often enabled at the same time, which run together in the namespace `kubesphere-alerting-system`.

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

