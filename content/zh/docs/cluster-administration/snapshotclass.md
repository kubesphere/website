---
title: "卷快照类"
keywords: 'KubeSphere, Kubernetes, 持久卷声明, 快照'
description: '了解如何在 KubeSphere 中管理卷快照类。'
linkTitle: "卷快照类"
weight: 8900
---

卷快照类（Volume Snapshot Class）用于定义卷快照的存储种类。本教程演示如何创建和使用卷快照类。

## 准备工作

- 您需要创建一个企业空间、一个项目和一个用户（例如 `project-regular`）。该用户必须已邀请至该项目，并具有 `operator` 角色。有关更多信息，请参阅[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

- 您需要确保 Kubernetes 版本为 1.17 或更新版本。

- 您需要确保底层存储插件支持快照。

## 操作步骤

1. 以 `project-regular` 用户登录 KubeSphere Web 控制台并进入项目。在左侧导航栏选择**存储**下的**卷快照类**。

2. 在右侧的**卷快照类**页面，点击**创建**。

<<<<<<< HEAD
3. 在弹出的对话框中，设置卷快照类的名称，点击**下一步**。您也可以设置别名和添加描述信息。
=======
3. 在弹出的对话框中设置卷快照类的名称，点击**下一步**。您也可以设置别名和添加描述信息。
>>>>>>> bbbae3e5 (add persistent storage docs)

4. 在**卷快照类设置**页签，选择供应者和删除策略。
   
   删除策略目前支持以下两种：

<<<<<<< HEAD
   -  Delete：底层的存储快照会和 VolumeSnapshotContent 对象一起删除。
=======
   -  Delete：底层的存储快照会和 VolumeSnapshotContent 对象 一起删除。
>>>>>>> bbbae3e5 (add persistent storage docs)
   -  Retain：底层快照和 VolumeSnapshotContent 对象都会被保留。

