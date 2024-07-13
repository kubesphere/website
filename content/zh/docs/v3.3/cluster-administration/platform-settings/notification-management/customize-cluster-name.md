---
title: "自定义通知消息中的集群名称"
keywords: 'KubeSphere, Kubernetes, 平台, 通知'
description: '了解如何自定义 KubeSphere 发送的通知消息中的集群名称。'
linkTitle: "自定义通知消息中的集群名称"
weight: 8721
version: "v3.3"
---

本文档说明如何自定义 KubeSphere 发送的通知消息中的集群名称。

## 准备工作

您需要有一个具有 `platform-admin` 角色的用户，例如 `admin` 用户。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

## 自定义通知消息中的集群名称

1. 以 `admin` 用户登录 KubeSphere 控制台。

2. 点击右下角的 <img src="/images/docs/v3.x/common-icons/hammer.png" width="15" alt="icon" /> 并选择 **Kubectl**。

3. 在弹出的对话框中，执行以下命令：

   ```bash
   kubectl edit nm notification-manager
   ```

4. 在 `.spec.receiver.options.global` 下方添加 `cluster` 字段以自定义您的集群名称：

   ```yaml
   spec:
     receivers:
       options:
         global:
           cluster: <集群名称>
   ```
   
5. 完成操作后，请保存更改。



