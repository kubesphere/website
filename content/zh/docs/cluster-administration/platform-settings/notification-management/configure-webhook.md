---
title: "配置 Webhook 通知"
keywords: 'KubeSphere, Kubernetes, 自定义, 平台, webhook'
description: '配置 webhook 服务器以通过 webhook 接收平台通知。'
linkTitle: "配置 Webhook 通知"
weight: 8725
---

Webhook 是应用程序发送由特定事件触发的通知的一种方式，可以实时向其他应用程序发送信息，使用户可以立即接收通知。

本教程介绍如何配置 Webhook 服务器以接收平台通知。

## 准备工作

您需要准备一个被授予 `platform-admin` 角色的用户。有关详细信息，请参阅 [创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

## 配置 Webhook 服务器

1. 以 `platform-admin` 用户身份登录 KubeSphere Web 控制台。

2. 点击左上角的 **平台管理** ，选择 **平台设置** 。

3. 在左侧导航栏中，点击 **通知管理** 下的 **通知配置** ，选择 **Webhook** 。

4. 在 **Webhook** 标签页，设置如下参数：

   - **Webhook URL**: Webhook 服务器的 URL。

   - **Verification Type**: Webhook 身份验证方法。
     - **No authentication**: 无身份验证，所有通知都可以发送到该 URL。
     - **Bearer token**: 使用令牌进行身份验证。
     - **Basic authentication**: 使用用户名和密码进行身份验证。

   {{< notice note>}}目前，KubeSphere 不支持 TLS 连接(HTTPS)。如果您使用 HTTPS URL，则需要选择 **Skip TLS 验证（不安全）**。

   {{</notice>}}

5. 勾选 **通知条件** 左侧的复选框，设置通知条件。

    - **Label**: 告警策略的名称、级别或监控目标。可以选择标签，也可以自定义标签。
    - **Operator**: 标签和值之间的映射。运算符包括 **Includes values**，**Does not include values**，**Exists** 和 **Does not exist** 。
    - **Values**: 与标签关联的值。
    {{< notice note >}}

   - 运算符 **Includes values** 和 **Does not include values** 需要一个或多个标签值。使用回车符来分隔标签值。
   - 运算符 **Exists** 和 **Does not exist** 判断标签是否存在，不需要标签值。

   {{</ notice >}} 

6. 点击 **添加** 来添加通知条件，也可以点击右侧通知条件的 <img src="/images/docs/common-icons/trashcan.png" width='25' height='25' /> 来删除条件。

7. 配置完成后，可以点击 **发送测试消息** 进行验证。

8. 在右上角，可以打开 **关闭** 开关以启用通知，或关闭 **开启** 开关以禁用通知。

9. 完成后点击 **确定** 。

   {{< notice note >}}

   - 设置通知条件后，接收方只会收到满足条件的通知。
   - 如果更改现有配置，则必须单击 **确定** 才能应用修改后的配置。

   {{</ notice >}} 
