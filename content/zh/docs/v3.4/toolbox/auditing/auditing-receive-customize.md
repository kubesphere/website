---
title: "接收和自定义审计日志"
keywords: "Kubernetes, KubeSphere, 审计, 日志, 自定义, 接收"
description: "了解如何接收和自定义审计日志。"
linkTitle: "接收和自定义审计日志"
weight: 15310
version: "v3.4"
---

KubeSphere 审计日志提供了与安全相关的、按时间顺序排列的记录集，记录每个用户、管理员或系统其他组件对系统产生影响的一系列活动。对 KubeSphere 的每个请求都会生成一个事件，随后该事件会写入 Webhook 并根据特定规则进行处理。根据不同规则，该事件会被忽略、存储或生成告警。

## 启用 KubeSphere 审计日志

要启用审计日志，请参见 [KubeSphere 审计日志](../../../pluggable-components/auditing-logs/)。

## 接收来自 KubeSphere 的审计日志

KubeSphere 审计日志系统默认只接收来自 KubeSphere 的审计日志，同时也可以接收来自 Kubernetes 的审计日志。

用户可以使用以下命令在命名空间 `kubesphere-system` 中修改 `kubesphere-config` ConfigMap 中 `auditing.enable` 的值，停止接收来自 KubeSphere 的审计日志：

```bash
kubectl edit cm -n kubesphere-system kubesphere-config
```

将 `auditing.enabled` 的值修改为 `false`，停止接收来自 KubeSphere 的审计日志。

```yaml
  spec:
    auditing:
      enabled: false
```

您需要重启 KubeSphere Apiserver 使修改生效。

## 接收来自 Kubernetes 的审计日志

要使 KubeSphere 审计日志系统接收来自 Kubernetes 的审计日志，您需要向 `/etc/kubernetes/manifests/kube-apiserver.yaml` 添加 Kubernetes 审计策略文件和 Kubernetes 审计 Webhook 配置文件。

### 审计策略

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-apiserver
    - --audit-policy-file=/etc/kubernetes/audit/audit-policy.yaml
    - --audit-webhook-config-file=/etc/kubernetes/audit/audit-webhook.yaml
    volumeMounts:
    - mountPath: /etc/kubernetes/audit
      name: k8s-audit
      readOnly: true
  volumes:
  - hostPath:
      path: /etc/kubernetes/audit
      type: DirectoryOrCreate
    name: k8s-audit
```

{{< notice note >}} 

该操作会重启 Kubernetes Apiserver。

{{</ notice >}}  

`audit-policy.yaml` 文件定义了关于应记录哪些事件和应包含哪些数据的规则。您可以使用最小审计策略文件记录元数据级别的所有请求。

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

有关审计策略的更多信息，请参见[审计策略](https://kubernetes.io/zh/docs/tasks/debug/debug-cluster/audit/)。

### 审计 Webhook

`audit-webhook.yaml` 文件定义了 Kubernetes 审计日志将要发送至的 Webhook。以下是 Kube-Auditing Webhook 的示例配置。

```yaml
apiVersion: v1
kind: Config
clusters:
- name: kube-auditing
  cluster:
    server: https://{ip}:6443/audit/webhook/event
    insecure-skip-tls-verify: true
contexts:
- context:
    cluster: kube-auditing
    user: ""
  name: default-context
current-context: default-context
preferences: {}
users: []
```

`ip` 即命名空间 `kubesphere-logging-system` 中 `kube-auditing-webhook-svc` 服务的 `CLUSTER-IP`，您可以使用以下命令来获取。

```bash
kubectl get svc -n kubesphere-logging-system
```

{{< notice note >}}

修改这两个文件后，您需要重启 Kubernetes Apiserver 使修改生效。

{{</ notice >}} 

使用以下命令编辑 `kube-auditing-webhook` CRD Webhook，将 `k8sAuditingEnabled` 的值改为 `true`。

```bash
kubectl edit webhooks.auditing.kubesphere.io kube-auditing-webhook
```

```yaml
spec:
  auditing:
    k8sAuditingEnabled: true
```
{{< notice tip >}} 

您也可以使用拥有 `platform-admin` 角色的用户登录控制台，在**集群管理**页面转到**定制资源定义**，搜索 `Webhook`，直接编辑 `kube-auditing-webhook`。

{{</ notice >}}

要停止接收来自 Kubernetes 的审计日志，请移除审计 Webhook 后端的配置，然后将 `k8sAuditingEnabled` 的值修改为 `false`。

## 自定义审计日志

KubeSphere 审计日志系统提供 `kube-auditing-webhook` CRD Webhook 来自定义审计日志。下方是一个示例 YAML 文件：

```yaml
apiVersion: auditing.kubesphere.io/v1alpha1
kind: Webhook
metadata:
  name: kube-auditing-webhook
spec:
  auditLevel: RequestResponse
  auditSinkPolicy:
    alertingRuleSelector:
      matchLabels:
        type: alerting
    archivingRuleSelector:
      matchLabels: 
        type: persistence
  image: kubesphere/kube-auditing-webhook:v0.1.0
  archivingPriority: DEBUG
  alertingPriority: WARNING
  replicas: 2
  receivers:
    - name: alert
      type: alertmanager
      config:
        service:
          namespace: kubesphere-monitoring-system
          name: alertmanager-main
          port: 9093
```

 参数        | 描述信息 | 默认值 
 ---                | ---         | ---
 `replicas`         | Kube-Auditing Webhook 的副本数量。 | 2
 `archivingPriority` | 存档规则的优先级。已知的审计类型有 `DEBUG`、`INFO` 和 `WARNING`。 | `DEBUG` 
 `alertingPriority` | 告警规则的优先级。已知的审计类型有 `DEBUG`、`INFO` 和 `WARNING`。 | `WARNING` 
 `auditLevel`       | 审计日志的级别。已知的级别有： <br> - `None`：不记录事件。 <br> - `Metadata`：记录请求的元数据，例如请求的用户、时间戳、资源和操作行为 (Verb) 等，但不记录请求或响应的消息体。 <br> - `Request`：记录事件的元数据和请求的消息体但不记录响应的消息体。这不适用于非资源类型的请求。 <br> - `RequestResponse`：记录事件的元数据、请求以及响应的消息体。这不适用于非资源类型的请求。 | `Metadata` 
 `k8sAuditingEnabled` | 是否接收 Kubernetes 审计日志。 | `false` 
 `receivers`        | 接收告警的接收器。 |

{{< notice note >}} 

您可以通过修改 `audit-policy.yaml` 文件变更 Kubernetes 审计日志的级别，然后重启 Kubernetes Apiserver。

{{</ notice >}} 