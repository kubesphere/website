---
title: "为 KubeSphere 中的 Jenkins 安装插件"
keywords: "KubeSphere, Kubernetes, DevOps, Jenkins, 插件"
description: "了解如何为 KubeSphere 中的 Jenkins 安装插件。"
linkTitle: "为 KubeSphere 中的 Jenkins 安装插件"
Weight: 16810
version: "v3.4"
---

KubeSphere DevOps 系统提供基于 Jenkins 的容器化 CI/CD 功能，而提升 Jenkins 功能的主要方法就是安装插件。本教程介绍如何在 Jenkins 面板上安装插件。

{{< notice warning >}}

并非所有的 Jenkins 插件都拥有良好的维护支持。一些插件可能会导致 Jenkins 出现问题，甚至导致 KubeSphere 出现严重问题。强烈建议您在安装任意插件之前进行备份，若条件允许，先在其他环境进行测试。

{{</ notice >}}

## 准备工作

您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。

## 安装插件

### 步骤 1：获取 Jenkins 地址

1. 运行以下命令获取 Jenkins 的地址。

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. 您会得到类似如下的输出。您可以通过输出的地址使用自己的 KubeSphere 用户和密码（例如 `admin/P@88w0rd`）访问 Jenkins 面板。

   ```
   http://192.168.0.4:30180
   ```

   {{< notice note >}}

   请确保使用自己的 Jenkins 地址。根据您 KubeSphere 集群部署位置的不同，您可能需要在安全组中打开端口，并配置相关的端口转发规则。

   {{</ notice >}}

### 步骤 2：在 Jenkins 面板上安装插件

1. 登录 Jenkins 面板，点击**系统管理**。

2. 在**系统管理**页面，下滑到**插件管理**并点击。

3. 点击**可选插件**选项卡，您必须使用搜索框来搜索所需插件。例如，您可以在搜索框中输入 `git`，勾选所需插件旁边的复选框，然后按需点击**直接安装**或**下载待重启后安装**。

   {{< notice note >}}

   Jenkins 的插件相互依赖。安装插件时，您可能还需要安装其依赖项。

   {{</ notice >}}

4. 如果已预先下载 HPI 文件，您也可以点击**高级**选项卡，上传该 HPI 文件作为插件进行安装。

5. 在**已安装**选项卡，可以查看已安装的全部插件。能够安全卸载的插件将会在右侧显示**卸载**按钮。

6. 在**可更新**选项卡，先勾选插件左侧的复选框，再点击**下载待重启后安装**，即可安装更新的插件。您也可以点击**立即获取**按钮检查更新。

## 另请参见

[管理插件](https://www.jenkins.io/zh/doc/book/managing/plugins/)