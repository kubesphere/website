---
title: "审计规则"
keywords: "Kubernetes, docker, kubesphere, 审计"
description: "了解审计规则以及如何自定义有关处理审计日志的规则。"
linkTitle: "审计规则"
weight: 15320
---

审计规则定义了处理审计日志的策略。KubeSphere 审计日志为用户提供两种 CRD 规则（`archiving-rule` 和 `alerting-rule`）以供自定义。

启用 [KubeSphere 审计日志](../../../pluggable-components/auditing-logs/)后，使用拥有 `platform-admin` 角色的用户登录控制台。在**集群管理**页面转到 **CRD**，在搜索栏中输入 `rules.auditing.kubesphere.io`。点击搜索结果 **Rule**，您便可以看到这两种 CRD 规则，如下所示。

![审计 CRD](/images/docs/zh-cn/toolbox/auditing/auditing-rules/auditing-crd.PNG)

![告警和归档规则](/images/docs/zh-cn/toolbox/auditing/auditing-rules/alerting-archiving-rule.PNG)

下方是部分规则的示例。

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

 属性 | 描述信息 
 --- | --- 
 `name`    | 该规则的名称。 
 `type`    | 该规则的类型；已知的值有 `rule`、`macro`、`list` 和 `alias`。 
 `desc`    | 该规则的描述。 
 `condition` | 对审计日志应用的过滤表达式，检查是否符合规则。 
 `macro`   | 宏的条件。 
 `list`    | List 的值。 
 `alias`   | Alias 的值。 
 `enable`  | 如果设置为 `false`，该规则将不会生效。 
 `output`  | 指定告警消息。 
 `priority` | 规则的优先级。 

如果审计日志符合 `archiving-rule` 中的规则并且该规则的优先级不低于 `archivingPriority`，则会保存该日志供后续使用。如果审计日志符合 `alerting-rule` 中的规则并且该规则的优先级低于 `alertingPriority`，则会保存该日志供后续使用；否则将生成告警并发送至用户。


## 规则条件（即 Condition）

`Condition` 是一个过滤表达式，可以使用比较运算符（=、!=、<、<=、>、>=、contains、in、like 以及正则表达式），也可以使用布尔运算符（and、or 和 not）和括号进行组合。以下是支持的过滤器。

 过滤器 | 描述信息 
 ---    | --- 
 `Workspace`              | 发生审计事件的企业空间。
 `Devops`                 | 发生审计事件的 DevOps 项目。 
 `Level`                  | 审计日志的级别。 
 `RequestURI`             | RequestURI 是由客户端发送至服务器的请求 URI。 
 `Verb`                   | 与该请求相关联的动词。 
 `User.Username`          | 在所有活跃用户中唯一标识该用户的名称。 
 `User.Groups`            | 该用户所属的组的名称。 
 `SourceIPs`              | 该请求来源的源 IP 和中间代理。 
 `ObjectRef.Resource`     | 与该请求相关联的对象的资源。 
 `ObjectRef.Namespace`  | 与该请求相关联的对象的命名空间。 
 `ObjectRef.Name`         | 与该请求相关联的对象的名称。 
 `ObjectRef.Subresource`  | 与该请求相关联的对象的子资源。 
 `ResponseStatus.code`    | 对该请求的建议 HTTP 返回码。 
 `ResponseStatus.Status`  | 操作状态。 
 `RequestReceivedTimestamp` | 该请求到达 Apiserver 的时间。 
 `StageTimestamp`         | 该请求到达当前审计阶段的时间。 

 例如，匹配命名空间 `test` 中的所有日志：

```
ObjectRef.Namespace = "test"
```

 匹配命名空间中以 `test` 开头的所有日志：

```
ObjectRef.Namespace like "test*"
```

匹配最近一小时内发生的所有日志：

```
RequestReceivedTimestamp >= "2020-06-12T09:23:28.359896Z" and RequestReceivedTimestamp <= "2020-06-12T10:23:28.359896Z"
```

## 宏（即 Macro）

`macro` 是一种规则条件片段，可以在规则甚至其他宏中复用。宏提供了一种命名常用模式的方法，并消除了规则中的冗余。以下是一个宏的示例。

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

`macro` 可用在规则中或者其他宏中，例如 ${pod} 或 ${alerting-rule.pod}。这两种方法的区别在于 ${pod} 只能用在 `alerting-rule` CRD 规则中，而 ${alerting-rule.pod} 可以用在所有 CRD 规则中。该原则也适用于 List 和 Alias。

{{</ notice >}} 

## 列表（即 List）

`list` 是一个可以包含在规则、宏或其他 List 中的项目的集合。与规则和宏不同，List 不能被解析为过滤表达式。下面是一个 List 的示例。

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

## 别名（即 Alias）

`alias` 是一个过滤字段的简称。它可以包含在规则、宏、List 和输出字符串中。下面是一个 Alias 的示例。

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

## 输出（即 Output）
当审计日志触发告警时，`Output` 字符串用于格式化告警消息。`Output` 字符串可以包括 List 和 Alias。下面是一个示例。

```yaml
Output: ${user} ${verb} a HostNetwork Pod ${name} in ${namespace}.
```
{{< notice note >}} 

`user`、`verb`、`namespace` 和 `name` 字段都是 Alias。

{{</ notice >}} 
