---
title: "Receive and Customize Auditing Logs"
keywords: "Kubernetes, KubeSphere, auditing, log, customize, receive"
description: "Learn how to receive and customize auditing logs."
linkTitle: "Receive and Customize Auditing Logs"
weight: 15310
version: "v3.4"
---

KubeSphere Auditing Logs provide a security-relevant chronological set of records documenting the sequence of activities that have affected the system by individual users, administrators, or other components of the system. Each request to KubeSphere generates an event that is then written to a webhook and processed according to a certain rule. The event will be ignored, stored, or generate an alert based on different rules.

## Enable KubeSphere Auditing Logs

To enable auditing logs, see [KubeSphere Auditing Logs](../../../pluggable-components/auditing-logs/).

## Receive Auditing Logs from KubeSphere

The KubeSphere Auditing Log system receives auditing logs only from KubeSphere by default, while it can also receive auditing logs from Kubernetes.

Users can stop receiving auditing logs from KubeSphere by changing the value of `auditing.enable` in ConfigMap `kubesphere-config` in the namespace `kubesphere-system` using the following command: 

```bash
kubectl edit cm -n kubesphere-system kubesphere-config
```

Change the value of `auditing.enabled` as `false` to stop receiving auditing logs from KubeSphere.

```yaml
  spec:
    auditing:
      enabled: false
```

You need to restart the KubeSphere apiserver to make the changes effective.

## Receive Auditing Logs from Kubernetes

To make the KubeSphere Auditing Log system receive auditing logs from Kubernetes, you need to add a Kubernetes audit policy file and Kubernetes audit webhook config file to `/etc/kubernetes/manifests/kube-apiserver.yaml` as follows.

### Audit policy

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

This operation will restart the Kubernetes apiserver.

{{</ notice >}}  

The file `audit-policy.yaml` defines rules about what events should be recorded and what data they should include. You can use a minimal audit policy file to log all requests at the Metadata level:

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

For more information about the audit policy, see [Audit Policy](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/).

### Audit webhook

The file `audit-webhook.yaml` defines the webhook which the Kubernetes auditing logs will be sent to. Here is an example configuration of the Kube-Auditing webhook.

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

The `ip` is the `CLUSTER-IP` of Service `kube-auditing-webhook-svc` in the namespace `kubesphere-logging-system`. You can get it using this command.

```bash
kubectl get svc -n kubesphere-logging-system
```

{{< notice note >}}

You need to restart the Kubernetes apiserver to make the changes effective after you modified these two files.

{{</ notice >}} 

Edit the CRD Webhook `kube-auditing-webhook`, and change the value of `k8sAuditingEnabled` to `true` through the following commands.

```bash
kubectl edit webhooks.auditing.kubesphere.io kube-auditing-webhook
```

```yaml
spec:
  auditing:
    k8sAuditingEnabled: true
```
{{< notice tip >}} 

You can also use a user of `platform-admin` role to log in to the console, search `Webhook` in **CRDs** on the **Cluster Management** page, and edit `kube-auditing-webhook` directly.

{{</ notice >}}

To stop receiving auditing logs from Kubernetes, remove the configuration of auditing webhook backend, then change the value of `k8sAuditingEnabled` to `false`.

## Customize Auditing Logs

KubeSphere Auditing Log system provides a CRD Webhook `kube-auditing-webhook` to customize auditing logs. Here is an example yaml file:

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

 Parameter          | Description | Default
 ---                | ---         | ---
 `replicas`         | The replica number of the Kube-Auditing webhook. | 2
 `archivingPriority` | The priority of the archiving rule. The known audit types are `DEBUG`, `INFO`, and `WARNING`. | `DEBUG` 
 `alertingPriority` | The priority of the alerting rule. The known audit types are `DEBUG`, `INFO`, and `WARNING`. | `WARNING` 
 `auditLevel`       | The level of auditing logs. The known levels are: <br> - `None`: don't log events. <br> - `Metadata`: log request metadata (requesting user, timestamp, resource, verb, etc.) but not requests or response bodies. <br> - `Request`: log event metadata and request bodies but no response body. This does not apply to non-resource requests. <br> - `RequestResponse`: log event metadata, requests, and response bodies. This does not apply to non-resource requests. | `Metadata` 
 `k8sAuditingEnabled` | Whether to receive Kubernetes auditing logs. | `false` 
 `receivers`        | The receivers to receive alerts. |

{{< notice note >}} 

You can change the level of Kubernetes auditing logs by modifying the file `audit-policy.yaml`, then restart the Kubernetes apiserver.

{{</ notice >}} 