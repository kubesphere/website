---
title: "删除应用后复用相同应用名称"
keywords: "KubeSphere, OpenPitrix, 应用程序, 应用"
description: "了解如何在删除应用后复用相同应用名称。"
linkTitle: "删除应用后复用相同应用名称"
Weight: 16920
---

若要在 KubeSphere 中部署应用，租户可以进入应用商店，根据自己的需求选择可用的应用。但是，租户在部署与被删除的应用名称相同的应用时，可能会遇到错误。本教程演示了如何在删除应用后复用相同应用名称。

## 准备工作

- 您需要使用被邀请到项目中、且具有 `operator` 角色的用户。本教程使用 `project-regular` 帐户进行演示。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要[启用应用商店](../../../pluggable-components/app-store/)。

## 复用相同应用名称

### 从应用商店中部署应用

1. 以 `project-regular` 身份登录 KubeSphere 的 Web 控制台，从应用商店中部署应用。本教程使用 Redis 作为示例应用，将应用名称设置为 `redis-1`。有关更多如何部署 Redis 的信息，请参考[在 KubeSphere 上部署 Redis](../../../application-store/built-in-apps/redis-app/)。

   ![redis-1](/images/docs/zh-cn/faq/applications/reuse-the-same-app-name-after-deletion/redis-1.png)

2. 点击该应用访问其详情页，然后点击**删除**以删除应用。

   ![delete-redis-1](/images/docs/zh-cn/faq/applications/reuse-the-same-app-name-after-deletion/delete-redis-1.png)

### 复用相同应用名称

1. 如果您尝试使用与 `redis-1` 相同的应用名称来部署新的 Redis 应用，您将在右上角看到以下错误提示。

   ![error-prompt](/images/docs/zh-cn/faq/applications/reuse-the-same-app-name-after-deletion/error-prompt.png)

3. 在项目中，访问**配置中心**下的**密钥**，在搜索栏中输入 `redis-1` 搜索密钥。

   ![search-secret](/images/docs/zh-cn/faq/applications/reuse-the-same-app-name-after-deletion/search-secret.png)

3. 点击该密钥以访问其详情页，点击**更多操作**从下拉菜单中选择**删除**。

   ![delete-secret](/images/docs/zh-cn/faq/applications/reuse-the-same-app-name-after-deletion/delete-secret.png)

4. 在出现的对话框中，输入密钥名称，点击**确定**以删除密钥。

   ![confirm-delete](/images/docs/zh-cn/faq/applications/reuse-the-same-app-name-after-deletion/confirm-delete.png)

5. 现在，您就能用与 `redis-1` 相同的应用名称来部署新的 Redis 应用。

   ![new-redis-app](/images/docs/zh-cn/faq/applications/reuse-the-same-app-name-after-deletion/new-redis-app.png)