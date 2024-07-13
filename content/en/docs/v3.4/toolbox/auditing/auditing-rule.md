---
title: "Auditing Rules"
keywords: "Kubernetes, docker, kubesphere, auditing"
description: "Understand the auditing rule and how to customize a rule for processing auditing logs."
linkTitle: "Auditing Rules"
weight: 15320
version: "v3.4"
---

An auditing rule defines the policy for processing auditing logs. KubeSphere Auditing Logs provide users with two CRD rules (`archiving-rule` and `alerting-rule`) for customization.

After you enable [KubeSphere Auditing Logs](../../../pluggable-components/auditing-logs/), log in to the console with a user of `platform-admin` role. In **CRDs** on the **Cluster Management** page, enter `rules.auditing.kubesphere.io` in the search bar. Click the result **Rule** and you can see the two CRD rules.

Below are examples of part of the rules.

## archiving-rule

```yaml
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

## alerting-rule

```yaml
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
 --- | --- 
 `name`    | The name of the rule.
 `type`    | The type of the rule; known values are `rule`, `macro`, `list`, and `alias`. 
 `desc`    | The description of the rule.
 `condition` | A filtering expression that is applied against auditing logs to check whether they match the rule. 
 `macro`   | The conditions of the macro.
 `list`    | The value of list. 
 `alias`   | The value of alias. 
 `enable`  | If it is set to `false`, the rule will not be effective. 
 `output`  | Specifies the message of alert.
 `priority` | The priority of the rule.

When an auditing log matches a rule in `archiving-rule` and the rule priority is no less than `archivingPriority`, it will be stored for further use. When an auditing log matches a rule in `alerting-rule`, if the priority of the rule is less than `alertingPriority`, it will be stored for further use; otherwise it will generate an alert which will be sent to the user.


## Rule Conditions

A `Condition` is a filtering expression that can use comparison operators (=, !=, <, <=, >, >=, contains, in, like, and regex) and can be combined using Boolean operators (and, or and not) and parentheses. Here are the supported filters.

 Filter | Description
 ---    | --- 
 `Workspace`              | The workspace where the audit event happens. 
 `Devops`                 | The DevOps project where the audit event happens. 
 `Level`                  | The level of auditing logs. 
 `RequestURI`             | RequestURI is the request URI as sent by the client to a server. 
 `Verb`                   | The verb associated with the request. 
 `User.Username`          | The name that uniquely identifies this user among all active users.
 `User.Groups`            | The names of groups this user is a part of.
 `SourceIPs`              | The source IP from where the request originated and intermediate proxies. 
 `ObjectRef.Resource`     | The resource of the object associated with the request.
 `ObjectRef.Namespace`  | The namespace of the object associated with the request.
 `ObjectRef.Name`         | The name of the object associated with the request.
 `ObjectRef.Subresource`  | The subresource of the object associated with the request.
 `ResponseStatus.code`    | The suggested HTTP return code for the request. 
 `ResponseStatus.Status`  | The status of the operation. 
 `RequestReceivedTimestamp` | The time the request reaches the apiserver. 
 `StageTimestamp`         | The time the request reaches the current audit stage. 

For example, to match all logs in the namespace `test`:

```
ObjectRef.Namespace = "test"
```

To match all logs in the namespaces that start with `test`:

```
ObjectRef.Namespace like "test*"
```

To match all logs happening in the latest one hour:

```
RequestReceivedTimestamp >= "2020-06-12T09:23:28.359896Z" and RequestReceivedTimestamp <= "2020-06-12T10:23:28.359896Z"
```

## Macro

A `macro` is a rule condition snippet that can be re-used inside rules and even other macros. Macros provide a way to name common patterns and factor out redundancies in rules. Here is an example of a macro.

```yaml
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

{{< notice note >}}

A `macro` can be used in rules or other macros like ${pod} or ${alerting-rule.pod}. The difference between these two methods is that ${pod} can only be used in the CRD Rule `alerting-rule`, while ${alerting-rule.pod} can be used in all CRD Rules. This principle also applies to lists and alias.

{{</ notice >}} 

## List

A `list` is a collection of items that can be included in rules, macros, or other lists. Unlike rules and macros, lists cannot be parsed as filtering expressions. Here is an example of a list.

```yaml
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

## Alias

An `alias` is a short name of a filter field. It can be included in rules, macros, lists, and output strings. Here is an example of an alias.

```yaml
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

## Output
The `Output` string is used to format the alerting message when an auditing log triggers an alert. The `Output` string can include lists and alias. Here is an example.

```yaml
Output: ${user} ${verb} a HostNetwork Pod ${name} in ${namespace}.
```
{{< notice note >}} 

The fields of `user`, `verb`, `namespace`, and `name` are all aliases.

{{</ notice >}} 