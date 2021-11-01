---
title: "告警策略（节点级别）"
keywords: 'KubeSphere, Kubernetes, 节点, 告警, 策略, 通知'
description: '了解如何为节点设置告警策略。'

linkTitle: "告警策略（节点级别）"
weight: 8530
---

KubeSphere 为节点和工作负载提供告警策略。本教程演示如何为集群中的节点创建告警策略。如需了解如何为工作负载配置告警策略，请参见[告警策略（工作负载级别）](../../../project-user-guide/alerting/alerting-policy/)。

KubeSphere 还具有内置策略，一旦满足为这些策略定义的条件，将会触发告警。 在**内置策略**选项卡，您可以点击任一策略查看其详情。请注意，这些策略不能直接在控制台上进行删除或编辑。

## 准备工作

- 您需要启用 [KubeSphere 告警系统](../../../pluggable-components/alerting)。
- 如需接收告警通知，您需要预先配置[通知渠道](../../../cluster-administration/platform-settings/notification-management/configure-email/)。
- 您需要创建一个用户 (`cluster-admin`) 并授予其 `clusters-admin` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/#step-4-create-a-role)。
- 您需要确保集群中存在工作负载。如果尚未就绪，请参见[部署并访问 Bookinfo](../../../quick-start/deploy-bookinfo-to-k8s/) 创建一个示例应用。

## 创建告警策略

1. 使用 `cluster-admin` 用户登录控制台。点击左上角的**平台管理**，然后点击**集群管理**。

2. 前往**监控告警**下的**告警策略**，然后点击**创建**。

3. 在出现的对话框中，填写以下基本信息。点击**下一步**继续。

   - **名称**：使用简明名称作为其唯一标识符，例如 `node-alert`。
   - **别名**：帮助您更好地识别告警策略。
   - **阈值时间（分钟）**：告警规则中设置的情形持续时间达到该阈值后，告警策略将变为触发中状态。
   - **告警级别**：提供的值包括**一般告警**、**重要告警**和**危险告警**，代表告警的严重程度。
   - **描述信息**：对告警策略的简要介绍。

4. 在**规则设置**选项卡，您可以使用规则模板或创建自定义规则。如需使用规则模板，请设置以下参数，然后点击**下一步**继续。

   - **监控目标**：选择至少一个集群节点进行监控。
   - **告警规则**：为告警策略定义一个规则。下拉菜单中提供的规则基于 Prometheus 表达式，满足条件时将会触发告警。您可以对 CPU、内存等对象进行监控。

   {{< notice note >}}

   您可以在**监控指标**字段输入表达式（支持自动补全），以使用 PromQL 创建自定义规则。有关更多信息，请参见 [Querying Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/)。

   {{</ notice >}} 

5. 在**消息设置**选项卡，输入告警消息的概括和详情，点击**创建**。

6. 告警策略刚创建后将显示为**未触发**状态；一旦满足规则表达式中的条件，则会首先达到**待触发**状态；满足告警条件的时间达到阈值时间后，将变为**触发中**状态。

## 编辑告警策略

如需在创建后编辑告警策略，在**告警策略**页面点击右侧的 <img src="/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/edit-policy.png" height="25px">。

1. 点击下拉菜单中的**编辑**，根据与创建时相同的步骤来编辑告警策略。点击**消息设置**页面的**确定**保存更改。

2. 点击下拉菜单中的**删除**以删除告警策略。

## 查看告警策略

在**告警策略**页面，点击一个告警策略的名称查看其详情，包括告警规则和历史。您还可以看到创建告警策略时基于所使用模板的告警规则表达式。

在**监控**下，**告警监控**图显示一段时间内的实际资源使用情况或使用量。**告警消息**显示您在通知中设置的自定义消息。

{{< notice note >}}

您可以点击右上角的 <img src="/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/drop-down-list.png" width='20' /> 选择告警监控的时间范围或者自定义时间范围。

您还可以点击右上角的 <img src="/images/docs/zh-cn/cluster-administration/cluster-wide-alerting-and-notification/alerting-policy-node-level/refresh.png" width='25' /> 来手动刷新告警监控图。

{{</ notice >}}
