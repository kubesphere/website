---
title: "在 KubeSphere 中部署 Memcached"
keywords: 'Kubernetes, KubeSphere, Memcached, 应用商店'
description: '了解如何从 KubeSphere 应用商店中部署 Memcached 并访问服务。'
linkTitle: "在 KubeSphere 中部署 Memcached"
weight: 14230
---
[Memcached](https://memcached.org/) 是一个内存中的 (in-memory) 键值存储库，用于存储由数据库调用、API 调用或页面渲染产生的小块任意数据（字符串、对象）。它的 API 对大多数主流的语言均可用。

本教程演示如何从 KubeSphere 应用商店部署 Memcached。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 Memcached

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

2. 找到 Memcached，点击**应用信息**页面上的**安装**。

3. 设置名称并选择应用版本。请确保将 Memcached 部署在 `demo-project` 中，点击**下一步**。

4. 在**应用配置**页面，您可以使用默认配置或者直接编辑 YAML 文件来自定义配置。点击**安装**继续。

5. 稍等片刻待 Memcached 启动并运行。


### 步骤 2：访问 Memcached

1. 在**服务**页面点击 Memcached 的服务名称。

2. 在详情页面，您可以分别在**端口**和**容器组**下找到端口号和 Pod IP。

3. Memcached 服务是 Headless 服务，因此在集群内通过 Pod IP 和端口号访问它。Memcached `telnet` 命令的基本语法是 `telnet HOST PORT`。例如：

   ```bash
   # telnet 10.10.235.3 11211
   Trying 10.10.235.3...
   Connected to 10.10.235.3.
   Escape character is '^]'.
   set runoob 0 900 9
   memcached
   STORED
   ```

4. 有关更多信息，请参见 [Memcached](https://memcached.org/)。