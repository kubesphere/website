---
title: "配置 Webhook 通知"
keywords: 'KubeSphere, Kubernetes, 自定义, 平台, Webhook, 通知'
description: '配置 Webhook 服务器，通过 Webhook 接收平台通知。'
linkTitle: "配置 Webhook 通知"
weight: 8725
---

Webhook 是应用发送由特定事件触发的通知的一种方式。它将信息实时发送至其他应用，使用户能够立刻接收到通知。

本教程描述如何配置 Webhook 服务器以接收平台通知。

## 准备工作

您需要准备一个具有 `Platform-admin` 角色的帐户。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../../quick-start/create-workspace-and-project/)。

## 配置 Webhook 服务器

1. 使用 `platform-admin` 用户登录 KubeSphere Web 控制台。

2. 点击左上角的**平台管理**，选择**平台设置**。

3. 在左侧导航栏，点击**通知管理**下的 **Webhook**。

4. 在 **Webhook** 页面，配置以下参数：

   - **URL**：Webhook 服务器的 URL。

   - **验证类型**：Webhook 的验证方法。
     - **No Auth**：不进行验证。所有通知都能发送至该 URL。
     - **Bearer Token**：使用令牌 (token) 进行验证。
     - **Basic Auth**：使用用户名和密码进行验证。

   {{< notice note>}}目前，KubeSphere 不支持 TLS 认证 (HTTPS)。如果您使用 HTTPS URL，则需要勾选**跳过 TLS 认证**。

   {{</notice>}}

5. 在**通知设置**下，开启/关闭**接收通知**开关以开始/停止向 Webhook 发送通知。

6. 完成后，点击**保存**。