---
title: "落盘日志收集"
keywords: 'KubeSphere, Kubernetes, 项目, 落盘, 日志, 收集'
description: '启用落盘日志收集，对日志进行统一收集、管理和分析。'
linkTitle: "落盘日志收集"
weight: 13600
---

KubeSphere 支持多种日志收集方式，使运维团队能够以灵活统一的方式收集、管理和分析日志。

本教程演示了如何为示例应用收集落盘日志。

## 准备工作

- 您需要创建企业空间、项目和帐户 (`project-admin`)。该帐户必须被邀请到项目中，并在项目级别具有 `admin` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere 日志系统](../../pluggable-components/logging/)。

## 启用落盘日志收集

1. 以 `project-admin` 身份登录 KubeSphere 的 Web 控制台，进入项目。

2. 在左侧导航栏中，选择**项目设置**中的**高级设置**。在**落盘日志收集**一栏下，点击 <img src="/images/docs/zh-cn/project-administration/disk-log-collection/log-toggle-switch.png" width="60" /> 以启用该功能。


## 创建部署

1. 在左侧导航栏中，选择**应用负载**中的**工作负载**。在**部署**选项卡下，点击**创建**。

2. 在出现的对话框中，设置部署的名称（例如 `demo-deployment`），再点击**下一步**。

3. 在**容器镜像**下，点击**添加容器镜像**。

4. 在搜索栏中输入 `alpine`，以该镜像（标签：`latest`）作为示例。

   ![alpine-image](/images/docs/zh-cn/project-administration/disk-log-collection/alpine-image.png)

5. 向下滚动并勾选**启动命令**。在**运行命令**和**参数**中分别输入以下值，点击 **√**，然后点击**下一步**。

   **运行命令**

   ```bash
   /bin/sh
   ```

   **参数**

   ```bash
   -c,if [ ! -d /data/log ];then mkdir -p /data/log;fi; while true; do date >> /data/log/app-test.log; sleep 30;done
   ```

   {{< notice note >}}

   以上命令及参数意味着每 30 秒将日期信息导出到 `/data/log` 的 `app-test.log` 中。

   {{</ notice >}} 

   ![run-command](/images/docs/zh-cn/project-administration/disk-log-collection/run-command.png)

6. 在**挂载存储**选项卡下，切换 <img src="/images/docs/zh-cn/project-administration/disk-log-collection/toggle-switch.png" width="20" /> 启用**落盘日志收集**，点击**添加存储卷**。

7. 在**临时存储卷**选项卡下，输入存储卷名称（例如 `demo-disk-log-collection`），并设置访问模式和路径。请参考以下示例。

   ![volume-example](/images/docs/zh-cn/project-administration/disk-log-collection/volume-example.png)

   点击 **√**，然后点击**下一步**继续。

8. 点击**高级设置**中的**创建**以完成创建。

   {{< notice note >}}

   有关更多信息，请参见[部署](../../project-user-guide/application-workloads/deployments/)。

   {{</ notice >}} 

## 查看日志

1. 在**部署**选项卡下，点击刚才创建的部署以访问其详情页。

2. 在**资源状态**中，点击 <img src="/images/docs/zh-cn/project-administration/disk-log-collection/arrow.png" width="20" /> 查看容器详情，然后点击 `logsidecar-container`（filebeat 容器)日志图标 <img src="/images/docs/zh-cn/project-administration/disk-log-collection/log-icon.png" width="20" /> 以检查落盘日志。

3. 或者，您也可以使用右下角**工具箱**中的**日志查询**功能来查看标准输出日志。例如，使用该部署的 Pod 名称进行模糊匹配：

   ![fuzzy-match](/images/docs/zh-cn/project-administration/disk-log-collection/fuzzy-match.png)

