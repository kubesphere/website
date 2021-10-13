---
title: "配置钉钉通知"
keywords: 'KubeSphere, Kubernetes, 钉钉, 通知, 告警'
description: '配置钉钉通知并添加会话或群机器人来接收告警通知消息。'
linkTitle: "配置钉钉通知"
weight: 8722
---

本教程演示如何配置钉钉通知并添加会话或群机器人来接收告警策略的通知。

## 准备工作

您需要准备一个[钉钉帐号](https://www.dingtalk.com/oasite/register_new.htm?spm=a213l2.13146415.4929779444.97.7f1521c9FNlFDT&lwfrom=2020052015221741000&source=1008#/)。

## 动手实验

### 步骤 1：创建应用

1. 登录[钉钉管理后台](https://oa.dingtalk.com/?spm=a213l2.13146415.4929779444.99.1c5521c9S8SsLf&lwfrom=2019051610283222000#/login)，前往**工作台**页面，点击**自建应用**。

2. 在弹出页面中，将鼠标悬停至**应用开发**，选择**企业内部开发**。

3. 选择**小程序**，然后点击**创建应用**。

4. 在弹出对话框中，填写**应用名称**和**应用描述**，本教程均输入`通知测试`作为示例，**开发方式**选择**企业自助开发**，然后点击**确定创建**。

5. 创建应用后，在基础信息页面可以查看此应用的 **AppKey** 和 **AppSecret**。

6. 在**开发管理**页面，点击**修改**。

7. 您需要在**服务器出口IP** 中输入所有节点的公网 IP，然后点击**保存**。

8. 前往**权限管理**页面，在搜索框中搜索`根据手机号姓名获取成员信息的接口访问权限`，然后点击**申请权限**。

9. 继续在搜索框中搜索`群会话`，勾选 **chat相关接口的管理权限**和 **chat相关接口的读取权限**，然后点击**批量申请（2）**。

10. 在弹出对话框中，填写**联系人**、**联系方式**和**申请原因**，然后点击**申请**。待审核通过后，您需要在**权限管理**页面的**全部状态**中筛选**已开通**，点击**确定**，然后手动点击 **chat相关接口的管理权限**和 **chat相关接口的读取权限**右侧的**申请权限**。

### 步骤 2：获取会话 ID

目前钉钉官方仅提供一种途径来获取会话 ID，即通过创建会话时的返回值来获取。如果您已知会话 ID，或者不需要通过会话接收通知消息，可跳过此步骤。

1. 登录[钉钉 API Explorer](https://open-dev.dingtalk.com/apiExplorer#/?devType=org&api=dingtalk.oapi.gettoken)，在**获取凭证**下的**获取企业凭证**页面，填写 **appkey** 和 **appsecret**，点击**发起调用**，即可在右侧获取 `access_token`。

2. 在**通讯录管理**下的**用户管理**页面，选择**根据手机号获取userid**，**access_token** 已自动预先填写，在 **mobile** 中填写用户手机号，然后点击**发起调用**，即可在右侧获取 `userid`。

   {{< notice note>}}

   您只需获取群主的 userid，待创建会话后再在客户端添加群成员。

   {{</ notice >}}

3. 在**消息通知**下的**群消息**页面，选择**创建群会话**，**access_token** 已自动预先填写，在 **name**、**owner** 和 **useridlist** 中分别填写群名称（本教程使用 `test` 作为示例，您可以按需自行设置）、群主的 userid 和群成员的 userid，然后点击**发起调用**，即可在右侧获取 `chatid`。

### 步骤 3：创建群机器人（可选）

如果您不需要通过群机器人接收通知消息，可跳过此步骤。

1. 登录钉钉电脑客户端，点击用户头像，选择**机器人管理**。

2. 在弹出对话框中，选择**自定义**，然后点击**添加**。

3. 在弹出对话框的**机器人名字**中输入名字（例如`告警通知`），在**添加到群组**中选择群组，在**安全设置**中设置**自定义关键词**和**加签**，勾选**我已阅读并同意《自定义机器人服务及免责条款》**，然后点击**完成**。

   {{< notice note >}}

   机器人创建完成后不可修改群组。

   {{</ notice >}}

4. 您可以在**机器人管理**页面点击已创建机器人右侧的 <img src="/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-dingtalk/three-dots.png" width="30" height="25" />，查看机器人的具体设置信息，例如 **Webhook**、**自定义关键词**和**加签**。

### 步骤 4：在 KubeSphere 控制台配置钉钉通知

您必须在 KubeSphere 控制台提供钉钉的通知设置，以便 KubeSphere 将通知发送至您的钉钉。

1. 使用具有 `platform-admin` 角色的用户（例如，`admin`）登录 KubeSphere Web 控制台。

2. 点击左上角的**平台管理**，选择**平台设置**。

3. 前往**通知管理**下的**通知配置**，选择**钉钉**。

4. 您可以在**会话设置**下的 **AppKey**、**AppSecret** 和**会话 ID** 中分别输入您的钉钉应用 AppKey、AppSecret、会话 ID，然后点击**添加**以添加会话 ID，您可以添加多个会话 ID。此外，您也可以在**群机器人设置**下的 **Webhook URL**、**关键词**和**密钥**中分别输入您的钉钉机器人 Webhook URL、关键词（输入关键词后请点击**添加**以添加关键词）、加签。操作完成后，点击**确定**。

5. 在右上角，打开**未启用**开关来接收钉钉通知，或者关闭**已启用**开关来停用钉钉通知。

   {{< notice note >}}

   如果您更改了现有配置，则必须点击**确定**以应用更改。

   {{</ notice >}}

### 步骤 5：接收钉钉通知

配置钉钉通知并添加会话或群机器人后，您需要启用 [KubeSphere 告警系统](../../../../pluggable-components/alerting/)，并为[工作负载](../../../../project-user-guide/alerting/alerting-policy/)或[节点](../../../cluster-wide-alerting-and-notification/alerting-policy/)创建告警策略。告警触发后，您的钉钉将收到通知消息。

请参考下方截图中的钉钉通知消息示例。

![chat-notification](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-dingtalk/chat-notification.png)

![robot-notification](/images/docs/zh-cn/cluster-administration/platform-settings/notification-management/configure-dingtalk/robot_notification.png)

{{< notice note >}}

- 如果您更新了钉钉通知配置，KubeSphere 将根据最新配置发送通知。

- 默认情况下，KubeSphere 大约每 12 小时针对同一告警发送通知。告警重复间隔主要由 `kubesphere-monitoring-system` 项目中 `alertmanager-main` 密钥的 `repeat_interval` 所控制。您可以按需自定义重复间隔。

- KubeSphere 设有内置告警策略，在不设置任何自定义告警策略的情况下，只要内置告警策略被触发，您的钉钉仍能接收通知消息。

{{</ notice >}} 

