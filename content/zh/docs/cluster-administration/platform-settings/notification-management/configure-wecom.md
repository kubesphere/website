---
title: "配置企业微信通知"
keywords: 'KubeSphere, Kubernetes, 企业微信, 通知, 告警'
description: '配置企业微信通知并添加相应 ID 来接收告警通知消息。'
linkTitle: "配置企业微信通知"
weight: 8723
---

本教程演示如何配置企业微信通知并添加相应 ID 来接收告警策略的通知。

## 准备工作

您需要准备一个[企业微信帐号](https://work.weixin.qq.com/wework_admin/register_wx?from=myhome)。

## 动手实验

### 步骤 1：创建应用

1. 登录[企业微信管理后台](https://work.weixin.qq.com/wework_admin/loginpage_wx)，点击**应用管理**。

2. 在**应用管理**页面，点击**自建**下的**创建应用**。

   ![click-create-app](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/click-create-app.png)

3. 在**创建应用**页面，上传应用 Logo、输入应用名称（例如，`通知测试`），点击**选择部门 / 成员**编辑**可见范围**，然后点击**创建应用**。

   ![create-app](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/create-app.png)

   {{< notice note >}}

   请确保将需要接收通知的用户、部门或标签加入可见范围中。

   {{</ notice >}}

4. 应用创建完成后即可查看其详情页面，**AgentId** 右侧显示该应用的 ID。点击 **Secret** 右侧的**查看**，然后在弹出对话框中点击**发送**，便可以在企业微信客户端查看 Secret。此外，您还可以点击**编辑**来编辑可见范围。

   ![app-detail](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/app-detail.png)

   ![view-secret](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/view-secret.png)

### 步骤 2：创建部门或标签

1. 在**通讯录**页面的**组织架构**选项卡下，点击**测试**（本教程使用`测试`部门作为示例）右侧的 <img src="/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/three-dots.png" height="20px">，然后选择**添加子部门**。

   ![add-dept](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/add-dept.png)

2. 在弹出对话框中，输入部门名称（例如`测试二组`），然后点击**确定**。

   ![enter-dept-name](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/enter-dept-name.png)

3. 创建部门后，您可以点击右侧的**添加成员**、**批量导入**或**从其他部门移入**来添加成员。添加成员后，点击该成员进入详情页面，查看其帐号。

   ![add-member](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/add-member.png)

   ![member-account](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/member-account.png)

4. 您可以点击`测试二组`右侧的 <img src="/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/three-dots.png" height="20px">来查看其部门 ID。

   ![dept-id](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/dept-id.png)

5. 点击**标签**选项卡，然后点击**添加标签**来创建标签。若管理界面无**标签**选项卡，请点击加号图标来创建标签。

   ![add-tag](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/add-tag.png)

6. 在弹出对话框中，输入标签名称，例如`组长`。您可以按需指定**可使用人**，点击**确定**完成操作。

   ![create-tag](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/create-tag.png)

7. 创建标签后，您可以点击右侧的**添加部门/成员**或**批量导入**来添加部门或成员。点击**标签详情**进入详情页面，可以查看此标签的 ID。

   ![add-member-to-tag](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/add-member-to-tag.png)

   ![tag-id](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/tag-id.png)

8. 要查看企业 ID，请点击**我的企业**，在**企业信息**页面查看 ID。

   ![company-id](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/company-id.png)

### 步骤 3：在 KubeSphere 控制台配置企业微信通知

您必须在 KubeSphere 控制台提供企业微信的相关 ID 和凭证，以便 KubeSphere 将通知发送至您的企业微信。

1. 使用具有 `platform-admin` 角色的帐户（例如，`admin`）登录 KubeSphere Web 控制台。

2. 点击左上角的**平台管理**，选择**平台设置**。

3. 前往**通知管理**下的**企业微信**。

   ![platform](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/platform.png)

4. 在**服务器配置**下的**企业 ID**、**企业应用 ID** 以及**企业应用凭证**中分别输入您的企业 ID、应用 AgentId 以及应用 Secret。

5. 在**接收设置**中，从下拉列表中选择**用户 ID**、**部门 ID** 或者**标签 ID**，输入对应 ID 后点击**添加**。您可以添加多个 ID。

6. 点击**保存**，然后开启**接收通知**并点击**更新**。

   {{< notice note >}}

   如果您更改了现有配置，则必须点击**更新**以应用更改。

   {{</ notice >}}

### 步骤 4：接收企业微信通知

配置企业微信通知并添加 ID 后，您需要启用 [KubeSphere 告警系统](../../../../pluggable-components/alerting/)，并为[工作负载](../../../../project-user-guide/alerting/alerting-policy/)或[节点](../../../cluster-wide-alerting-and-notification/alerting-policy/)创建告警策略。告警触发后，接收设置中添加的用户或部门将收到通知消息。

请参考下方截图中的企业微信通知消息示例。

![notification-message](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-wecom/notification_message.png)

{{< notice note >}}

- 如果您更新了企业微信服务器配置，KubeSphere 将根据最新配置发送通知。

- 默认情况下，KubeSphere 大约每 12 小时针对同一告警发送通知。告警重复间隔主要由 `kubesphere-monitoring-system` 项目中 `alertmanager-main` 密钥的 `repeat_interval` 所控制。您可以按需自定义重复间隔。

- KubeSphere 设有内置告警策略，在不设置任何自定义告警策略的情况下，只要内置告警策略被触发，您的企业微信仍能接收通知消息。

{{</ notice >}} 
