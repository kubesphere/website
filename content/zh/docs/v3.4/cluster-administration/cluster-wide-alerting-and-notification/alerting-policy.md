---
title: "规则组（节点级别）"
keywords: 'KubeSphere, Kubernetes, 节点, 告警, 规则组，策略, 通知'
description: '了解如何为节点设置告警规则组。'

linkTitle: "规则组（节点级别）"
weight: 8530
---

KubeSphere 为节点提供告警规则，提供编组，允许用户将相似的规则编入一个规则组中，一旦满足这些规则定义的条件，将会触发告警。本教程将演示如何为集群中的节点创建规则组及告警规则。

KubeSphere 还具有内置规则组。 在<strong>内置规则组</strong>选项卡，可以点击任一规则组查看该规则组中所有规则，点击任一规则查看其详情。请注意，这些规则不能直接在控制台上进行删除，但可以通过编辑调整规则。

## 准备工作

- 需先启用 [KubeSphere 告警系统](../../pluggable-components/alerting)。
- 如需接收告警通知，需预先配置[通知渠道](../platform-settings/notification-management/configure-email)。
- 需要创建一个用户 (cluster-admin) 并授予其 clusters-admin 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project#step-4-create-a-role)。

## 创建规则组及告警策略

1. 使用 cluster-admin 用户登录控制台。点击左上角的<strong>平台管理</strong>，然后点击<strong>集群管理</strong>。
2. 前往<strong>监控告警</strong>下的<strong>规则组</strong>，然后点击<strong>创建</strong>。
   ![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/alert-policy-group-list.png)
3. 在出现的对话框中，填写以下基本信息。点击<strong>下一步</strong>继续。
   ![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/add-alert-policy-group-info.png)
- 名称：使用简明名称作为其唯一标识符，例如 `node-rules`。
- 别名：帮助用户更好地识别规则组。
- 检查间隔（时分秒）：设置指标检查之间的时间间隔。默认值为 1 分钟。
- 描述：对规则组的简要介绍。

4. 在告警规则选项卡中，点击添加告警规则，为规则组添加告警规则。
   ![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/add-policy-rule.png)
5. 在告警规则的<strong>规则设置</strong>选项卡中，可使用规则模板或创建自定义规则。如需使用规则模板，请设置以下参数。
   ![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/policy-template.png)
- 规则名称：使用简明名称作为其唯一标识符，例如 `node1-cpu-rule`。
- 监控目标：选择至少一个集群节点进行监控。
- 触发条件：设置合适的触发条件。
   - 监控指标：点击下拉框，选择合适的监控指标。
   - 操作符：点击下拉框，选择合适的操作符（>、>=、<、<=）。
   - 阈值：设置的指标达到该阈值后，告警规则将变为验证中状态。
   - 持续时间：告警规则中设置的情形达到阈值的持续时间后，告警规则将变为触发中状态。
   - 告警级别：提供的值包括一般告警、重要告警和危险告警，代表告警的严重程度。

6. 在告警规则的<strong>消息设置</strong>选项卡中，可设置告警的通知消息。

- 概要：该告警规则触发告警时，告警通知的概要信息。
- 详情：自定义描述该告警通知的详细信息。

7. 点击✔，完成这一告警规则的设置（可为该规则组添加多个告警规则）。规则设置完毕后，点击<strong>创建</strong>完成这一规则组的创建。

## 编辑规则组
如需在创建后编辑规则组，在<strong>规则组</strong>页面点击右侧的![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/edit-policy.png)。
![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/policy-group-operator.png)
1. 点击下拉菜单中的编辑信息，根据与创建时第3步来编辑规则组。点击信息设置页面的确定保存更改。
2. 点击下拉菜单中的删除以删除规则组。
3. 点击下拉菜单中的禁用以禁用规则组。
4. 点击下拉菜单中的编辑告警规则对该规则组中告警规则进行增删改以及单个规则的禁用操作。

## 查看规则组
在<strong>规则组</strong>页面，点击一个规则组的名称查看其详情，包括告警规则和告警。
![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/alert-policy-list.png)

在输入框输入关键字，可搜索到关联的告警规则。点击任一告警规则，还可以看到创建告警规则时基于所使用模板的告警规则表达式。
![](/images/docs/v3.x/cluster-administration/cluster-wide-alerting-and-notification/alerting-policies-node-level/alert-policy-info.png)

<strong>告警消息</strong>显示在消息设置中设置的自定义消息。
