---
title: "使用 Webhook 触发流水线"
keywords: 'Kubernetes, DevOps, Jenkins, 流水线, Webhook'
description: '学习如何使用 webhook 触发 Jenkins 流水线'
linkTitle: "使用 Webhook 触发流水线"
weight: 11293

---

如果从远程代码仓库创建 Jenkinsfile-based 流水线，则可以在远程仓库中配置 webhook，以便对远程仓库进行改变时，自动触发流水线。

本教程概述如何用 webhook 触发流水线。

## 准备工作

- [启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 创建一个企业空间， DevOps 工程和一个帐户（例如，`project-regular`）。`project-regular` 需要被邀请至 DevOps 工程中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 在远程代码仓库，创建一个 Jenkinsfiel-based 流水线。有关更多信息，请参见[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/)

## 配置 Webhook

### 获得 webhook URL

1. 使用 `project-regular` 帐户登录 Kubesphere web 控制台。转到 DevOps 工程，点击流水线（例如，`jenkins-in-scm`）以查看详情页面。

2. 点击**更多**，在下拉菜单中选择**编辑配置文件**。

   ![edit-config](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/edit-config.png)

3. 在出现的会话框中，滑动至 **Webhook Push** 以获得 webhook push URL。

   ![webhook-push](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/webhook-push.png)

### 在 GitHub 仓库中设置 webhook

1. 登录您的 GitHub，并转到 `devops-java-sample` 项目。

2. 点击 **Setting**，然后点击 **Webhooks**，然后点击 **Add webhook**。

   ![click-add-webhook](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/click-add-webhook.png)

3. 在 **Payload URL** 中输入流水线中的 webhook push URL，然后点击 **Add webhook**。出于演示需要，本教程选择 **Just the push event**。您可以根据需要进行配置。有关更多信息，请参见 [GitHub 文档](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks)。

   ![add-webhook](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/add-webhook.png)

4. 配置好的 webhook 会展示在 **Webhooks** 页面。

   ![webhook-ready](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/webhook-ready.png)

## 使用 Webhook 触发流水线

### 提交拉取请求到仓库

1. 在您仓库的**代码**页面，点击 **master** 然后选择 **sonarqube**。

   ![click-sonar](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/click-sonar.png)

2. 转到 `/deploy/dev-ol` 然后点击文件 `devops-sample.yaml`。

   ![click-file](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/click-file.png)

3. 点击 <img src="/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/edit-btn.png" width="20px" /> 以编辑文件。 例如，将 `spec.replicas` 的值改变为 `3`。

   ![edit-file](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/edit-file.png)

4. 在页面底部点击 **Commit changes**。

### 检查 webhook 交付

1. 查看在您仓库的 **Webhooks** 页面，点击 webhook。

   ![webhook-ready](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/webhook-ready.png)

2. 点击 **Recent Deliveries**，然后点击 specific delivery record 查看详情。

   ![delivery-detail](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/delivery-detail.png)

### 检查流水线

1. 使用 `project-regular` 帐户登录 Kubesphere web 控制台。转到 DevOps 工程，点击流水线。

2. 在**活动**选项卡，检查提交到远程仓库 `sonarqube` 分支的拉取请求是否触发了新的运行。

   ![pipeline-triggered](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/pipeline-triggered.png)

3. 转到 `kubesphere-sample-dev` 项目的 **Pods** 页面，检查 3 个 Pods 的状态。如果 3 个 Pods 为运行状态，表示流水线运行正常。

   ![pods](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-webhook/pods.png)



