---
title: "在 KubeSphere 中部署 Redis"
keywords: 'KubeSphere, Kubernetes, 安装, Redis'
description: '了解如何从 KubeSphere 应用商店中部署 Redis 并访问服务。'
linkTitle: "在 KubeSphere 中部署 Redis"
weight: 14291
---

[Redis](https://redis.io/) 是一个开源的（遵循 BSD 协议）、内存中的 (in-memory) 数据结构存储库，用作数据库、缓存和消息代理。

本教程演示如何从 KubeSphere 应用商店部署 Redis。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 Redis

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

   ![应用商店](/images/docs/zh-cn/appstore/built-in-apps/redis-app/app-store-1.PNG)

2. 找到 Redis，点击**应用信息**页面上的**部署**。

   ![应用商店中的 Redis](/images/docs/zh-cn/appstore/built-in-apps/redis-app/redis-in-app-store-2.PNG)

   ![部署 Redis](/images/docs/zh-cn/appstore/built-in-apps/redis-app/deploy-redis-3.PNG)

3. 设置名称并选择应用版本。请确保将 Redis 部署在 `demo-project` 中，点击**下一步**。

   ![确认部署](/images/docs/zh-cn/appstore/built-in-apps/redis-app/confirm-deployment-4.PNG)

4. 在**应用配置**页面，为应用指定持久化存储卷和密码。操作完成后，点击**部署**。

   ![配置 Redis](/images/docs/zh-cn/appstore/built-in-apps/redis-app/config-redis-5.PNG)

   {{< notice note >}}

   要为 Redis 指定更多值，请打开右上角的拨动开关查看 YAML 格式的应用清单文件，编辑其配置。

   {{</ notice >}}

5. 稍等片刻待 Redis 启动并运行。

   ![redis 运行中](/images/docs/zh-cn/appstore/built-in-apps/redis-app/redis-running-6.PNG)

### 步骤 2：访问 Redis 终端

1. 转到**服务**页面，点击 Redis 的服务名称。

   ![访问 Redis](/images/docs/zh-cn/appstore/built-in-apps/redis-app/access-redis-7.PNG)

2. 在**容器组**中展开菜单查看容器详情，随后点击**终端**图标。

   ![Redis 终端](/images/docs/zh-cn/appstore/built-in-apps/redis-app/redis-terminal-8.PNG)

3. 在弹出窗口的终端中运行 `redis-cli` 命令来使用该应用。

   ![使用 Redis](/images/docs/zh-cn/appstore/built-in-apps/redis-app/use-redis-9.PNG)

4. 有关更多信息，请参见 [Redis 官方文档](https://redis.io/documentation)。
