---
title: "Auditing Operating"
keywords: "Kubernetes, docker, kubesphere, auditing"
description: "Kubernetes and KubeSphere operation auditing"

linkTitle: "Auditing Operating"
weight: 300
---

 KubeSphere Auditing Logs provides a security-relevant chronological set of records documenting the sequence of activities that have affected the system by individual users, administrators, or other components of the system. Each request to KubeSphere generates an event that is then written to a webhook and processed according to a certain rule. According to different rules, the event will be ignored, stored, or generated an alert.

## QuickStart

### Enable KubeSphere Auditing Logs

To enable Operation Auditing, see [KubeSphere Auditing Logs](../../pluggable-components/).

### Receive auditing log from KubeSphere

 KubeSphere Auditing Logs can receive auditing logs form KubeSphere and Kubernetes. By default, KubeSphere Auditing Logs only receives auditing logs from KubeSphere.

 User can stop receive auditing logs from KubeSphere by changing the value of 'auditing.enable' in ConfigMap `kubesphere-config` in the namespace `kubesphere-system` using the following command, 

```
kubectl edit cm -n kubesphere-system kubesphere-config
```

 change the value of `auditing.enabled` as false to stop receive auditing logs from KubeSphere.

```
  spec:
    auditing:
      enabled: false
```

 It should restart the KubeSphere apiserver to make the changes effective.

### Receive auditing log from Kubernetes

 To make KubeSphere Auditing Logs receive auditing logs from Kubernetes, you need to add a Kubernetes audit policy file and Kubernetes audit webhook config file to `/etc/kubernetes/manifests/kube-apiserver.yaml` like this.

```
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

 > Note that this action will restart the Kubernetes apiserver.

 The `audit-policy.yaml` define rules about what events should be recorded and what data they should include. You can use a minimal audit policy file to log all requests at the Metadata level:

```
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

 For more information about audit policy, see [audit policy](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/#audit-policy).

 The `audit-webhook.yaml` defines the webhook which the Kubernetes auditing logs will be sent to. Here is a config to the Kube-Auditing webhook.

```
apiVersion: v1
kind: Config
clusters:
- name: kube-auditing
  cluster:
    server: https://{ip}:443/audit/webhook/event
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

 The `ip` is the `CLUSTER-IP` of Service `kube-auditing-webhook-svc` in the namespace `kubesphere-logging-system`, you can get it used this command.

```
kubectl get svc -n kubesphere-logging-system
```

> It should restart the Kubernetes apiserver to make the changes effective after you modified these two files.

 Edit the CRD Webhook `kube-auditing-webhook`, change the value of `k8sAuditingEnabled` to `true`.

```
kubectl edit webhooks.auditing.kubesphere.io kube-auditing-webhook
```

```
spec:
  auditing:
    k8sAuditingEnabled: true
```

 To stop receive auditing logs from Kubernetes, remove config about auditing webhook backend, then change the value of `k8sAuditingEnabled` to `false`.

### Custom auditing log

 KubeSphere Auditing Logs provides a CRD Webhook `kube-auditing-webhook` to custom auditing logs.

```
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
 replicas           | The replicas of the Kube-Auditing webhook. | 2
 archivingPriority  | The priority of the archiving rule, The known audit types are DEBUG, INFO, and WARNING. | DEBUG
 alertingPriority   | The priority of the alerting rule, The known audit types are DEBUG, INFO, and WARNING. | WARNING
 auditLevel         | The level of auditing logs, The known levels are: <br> - `None`: don't log events. <br> - `Metadata`: log request metadata (requesting user, timestamp, resource, verb, etc.) but not request or response body. <br> - `Request`: log event metadata and request body but no response body. This does not apply to non-resource requests. <br> - `RequestResponse`: log event metadata, request, and response bodies. This does not apply to non-resource requests. | Metadata
 k8sAuditingEnabled | Whether to Receive Kubernetes Auditing Logs. | false.
 receivers          | The receivers to receive the alerts.

 > You can change the level of Kubernetes auditing logs by modified the file `audit-policy.yaml`, then restart the Kubernetes apiserver. 

### Auditing Rule

 The auditing `Rule` defines the policy for processing auditing logs. KubeSphere Auditing Logs provides two CRD Rule `archiving-rule` and `alerting-rule` to custom rules. Here is part of the rules.

```
apiVersion: auditing.kubesphere.io/v1alpha1
kind: Rule
metadata:
  labels:
    type: archiving
    workspace: system-workspace
  name: archiving-rule
spec:
  rules:
  - desc: all action not need to be audit
    list:
    - get
    - list
    - watch
    name: ignore-action
    type: list
  - condition: Verb not in ${ignore-action}
    desc: All audit event except get, list, watch event
    enable: true
    name: archiving
    priority: DEBUG
    type: rule
```

```
apiVersion: auditing.kubesphere.io/v1alpha1
kind: Rule
metadata:
  labels:
    type: alerting
    workspace: system-workspace
  name: alerting-rule
spec:
  rules:
  - desc: all operator need to be audit
    list:
    - create
    - delete
    - update
    - patch
    name: action
    type: list
  - condition: Verb in ${action}
    desc: audit the change of resource
    enable: true
    name: ResourceChange
    priority: INFO
    type: rule
```

 Attributes | Description
 --- | --- |
 name      | The name of the rule.
 type      | The type of rule, the known value is `rule`, `macro`, `list`, `alias`.
 desc      | The description of the rule.
 condition | A filtering expression that is applied against auditing log to check whether they matched the rule.
 macro     | The conditions of the macro.
 list      | Value of list.
 alias     | Value of alias.
 enable    | If false, the rule will not be effective.
 output    | Specifies the message of alert.
 priority  | The priority of the rule.

 When an auditing log matched a rule in `archiving-rule` and the priority of rule is not less than `archivingPriority`, it will be stored for further use. When an auditing log matched a rule in `alerting-rule`, if the priority of the rule is less than `alertingPriority`, it will be stored for further use;  else it will generate an alert will be sent to the user. 

#### Rule condition

`Condition` is a filtering expression that can use comparison operators (=, !=, <, <=, >, >=, contains, in, like, regex) and can be combined using Boolean operators (and, or and not) and parentheses. Here are the supported Filters.

 Filter | Description
 ---    | --- 
 Workspace                | The workspace which this audit event happened
 Devops                   | The devops project which this audit event happened
 Level                    | Level of auditing logs
 RequestURI               | RequestURI is the request URI as sent by the client to a server.
 Verb                     | Verb is the verb associated with the request
 User.Username            | The name that uniquely identifies this user among all active users.
 User.Groups              | The names of groups this user is a part of.
 SourceIPs                | Source IPs, from where the request originated and intermediate proxies.
 ObjectRef.Resource       | The resource of the object associated with the request.
 ObjectRef.Namespace      | The namespace of the object associated with the request.
 ObjectRef.Name           | The name of the object associated with the request.
 ObjectRef.Subresource    | The subresource of the object associated with the request.
 ResponseStatus.code      | Suggested HTTP return code for the request
 ResponseStatus.Status    | Status of the operation.
 RequestReceivedTimestamp | Time the request reached the apiserver.
 StageTimestamp           | Time the request reached the current audit stage.

 For example, to match all logs in the namespace `test`,

```
ObjectRef.Namespace = "test"
```

 to match all logs in the namespaces start with `test`,

```
ObjectRef.Namespace like "test*"
```

 to match all logs happened in the latest one hour,

```
RequestReceivedTimestamp >= "2020-06-12T09:23:28.359896Z" and RequestReceivedTimestamp <= "2020-06-12T10:23:28.359896Z"
```

#### Macro
`Macro` is a rule condition snippets that can be re-used inside rules and even other macros. Macros provide a way to name common patterns and factor out redundancies in rules. Here¡¯s an example of a macro.

```
apiVersion: auditing.kubesphere.io/v1alpha1
kind: Rule
metadata:
  name: alerting-rule
  labels:
    workspace: system-workspace
    type: alerting
spec:
  rules:
  - name: pod
    type: macro
    desc: pod
    macro: ObjectRef.Resource="pods"
```

 > `Macro` can bu used in rules or other macros like ${pod} or ${alerting-rule.pod}. The difference between these two methods is, ${pod} only can be used in the CRD Rule `alerting-rule`, ${alerting-rule.pod} can be used in all CRD Rule. It is also applied to lists and alias.

#### List
`List` is collections of items that can be included in rules, macros, or other lists. Unlike rules and macros, lists cannot be parsed as filtering expressions. Here¡¯s an example of a list.
```
apiVersion: auditing.kubesphere.io/v1alpha1
kind: Rule
metadata:
  name: alerting-rule
  labels:
    workspace: system-workspace
    type: alerting
spec:
  rules:
  - name: action
    type: list
    desc: all operator needs to be audit
    list:
      - create
      - delete
      - update
      - patch
```

#### Alias
`Alias` is a short name of a filter field, it can be included in rules, macros, lists, and output string. Here¡¯s an example of an alias.
```
apiVersion: auditing.kubesphere.io/v1alpha1
kind: Rule
metadata:
  name: alerting-rule
  labels:
    workspace: system-workspace
    type: alerting
spec:
  rules:
  - name: namespace
    type: alias
    desc: the alias of the resource namespace
    alias: ObjectRef.Namespace
```

#### Output
 The `Output` string used to format the alert message when the auditing log triggered an alert. The `Output` string can include lists and alias. Here is an example.

```
Output: ${user} ${verb} a HostNetwork Pod ${name} in ${namespace}.
```
 > The field of the user, verb, namespace, name all are alias.

### KubeSphere Auditing Logs Query

 KubeSphere supports auditing logs query for tenant isolation. Use the `admin` account to log in KubeSphere, choose **Toolbox -> Auditing Operating**.

 ![Toolbox](/images/docs/toolbox/toolbox.png)

 As shown in the pop-up window, you can see the trends in the total number of auditing logs in the last 12 hours. 

![Auditing Operating](/images/docs/toolbox/auditing-operating.png)

The Auditing Operating console supports the following query parameters:

![Auditing Log Filter](/images/docs/toolbox/auditing-log-filter.png)

 Parameter         | Description
 ---               | --- 
 Cluster           | The cluster that the operation happens. It is enabled when Multi-cluster is enabled.
 Project           | The project which the operation happens, support exact and fuzzy query.
 Workspace         | The workspace which the operation happens, support exact and fuzzy query.
 Resource Type     | The type of resource associated with the request. It supports fuzzy query.
 Resource Name     | The name of the resource associated with the request. It supports fuzzy query.
 Verb              | Verb is the kubernetes verb associated with the request, for non-resource requests, this is the lower-cased HTTP method, support exact query.
 Status Code       | Http response code, support exact query.
 Operation Account | The user who called this request. It supports exact and fuzzy query.
 Source IP         | Source IPs, from where the request originated and intermediate proxies, support fuzzy query.
 Time Range        | The time when the request reached the apiserver. 

 > - Fuzzy query supports case-insensitive fuzzy matching and retrieval of full terms by the first half of a word or phrase because of the ElasticSearch segmentation rules. 

 > - KubeSphere stores the logs for the last seven days by default. You can modify the retained period in the ConfigMap `elasticsearch-logging-curator`.

#### How to Query

 For example, let's query the auditing logs that `user` changed as shown in the following screenshot:

 ![User Changed](/images/docs/toolbox/user-changed.png)


 Click any one of the results from the list, you can see the detail of the auditing log.


 ![Auditing Log Detail](/images/docs/toolbox/auditing-log-detail.png)