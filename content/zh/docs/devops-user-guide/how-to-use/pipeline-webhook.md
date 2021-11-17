---
title: "使用 Webhook 触发流水线"
keywords: 'Kubernetes, DevOps, Jenkins, 流水线, Webhook'
description: '学习如何使用 webhook 触发 Jenkins 流水线。'
linkTitle: "使用 Webhook 触发流水线"
weight: 11293
---

如果通过远程代码仓库创建基于 Jenkinsfile 的流水线，则可以在远程仓库中配置 webhook，以便对远程仓库进行变更时，自动触发流水线。

本教程演示如何用 webhook 触发流水线。

## 准备工作

- [启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 创建一个企业空间、一个 DevOps工程和一个用户（例如，`project-regular`）。`project-regular` 需要被邀请至 DevOps 项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 通过远程代码仓库创建一个基于 Jenkinsfile 的流水线。有关更多信息，请参见[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/)。

## 配置 Webhook

### 获取 webhook URL

1. 使用 `project-regular` 帐户登录 Kubesphere Web 控制台。转到 DevOps 项目，点击流水线（例如，`jenkins-in-scm`）以查看详情页面。

2. 点击**更多**，在下拉菜单中选择**编辑设置**。

3. 在出现的会话框中，滑动至 **Webhook** 以获得 webhook push URL。

### 在 GitHub 仓库中设置 webhook

1. 登录您的 GitHub，并转到 `devops-maven-sample` 仓库。

2. 点击 **Settings**，然后点击 **Webhooks**，然后点击 **Add webhook**。

3. 在 **Payload URL** 中输入流水线中的 webhook push URL，然后点击 **Add webhook**。出于演示需要，本教程选择 **Just the push event**。您可以根据需要进行配置。有关更多信息，请参见 [GitHub 文档](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks)。

4. 配置好的 webhook 会展示在 **Webhooks** 页面。

## 使用 Webhook 触发流水线

### 提交拉取请求到仓库

1. 在您仓库的 **Code** 页面，点击 **master** 然后选择 **sonarqube** 分支。

2. 转到 `/deploy/dev-ol` 然后点击文件 `devops-sample.yaml`。

3. 点击 <img src="/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/edit-btn.png" width="20px" /> 以编辑文件。 例如，将 `spec.replicas` 的值改变为 `3`。

4. 在页面底部点击 **Commit changes**。

### 检查 webhook 交付

1. 在您仓库的 **Webhooks** 页面，点击 webhook。

2. 点击 **Recent Deliveries**，然后点击一个具体交付记录查看详情。

### 检查流水线

1. 使用 `project-regular` 帐户登录 Kubesphere Web 控制台。转到 DevOps 项目，点击流水线。

2. 在**运行记录**选项卡，检查提交到远程仓库 `sonarqube` 分支的拉取请求是否触发了新的运行。

3. 转到 `kubesphere-sample-dev` 项目的 **Pods** 页面，检查 3 个 Pods 的状态。如果 3 个 Pods 为运行状态，表示流水线运行正常。



