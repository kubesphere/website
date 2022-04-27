---
title: "使用流水线模板"
keywords: 'KubeSphere, Kubernetes, Jenkins, 图形化流水线, 流水线模板'
description: '了解如何在 KubeSphere 上使用流水线模板。'
linkTitle: "使用流水线模板"
weight: 11290
---

KubeSphere 提供图形编辑面板，您可以通过交互式操作定义 Jenkins 流水线的阶段和步骤。KubeSphere 3.3.0 中提供两个内置流水线模板，作为持续集成 (CI) 和持续交付 (CD) 的框架。

在 KubeSphere 的 DevOps 项目中创建了流水线后，您可以点击该流水线查看其详情，然后点击**编辑流水线**按需选择一个流水线模板。本文档对这两个流水线模板的概念进行阐述。

## CI 流水线模板

![ci-template](/images/docs/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/ci-template.png)

![ci-stages](/images/docs/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/ci-stages.png)

CI 流水线模板包含两个阶段。**clone code** 阶段用于检出代码，**build & push** 阶段用于构建镜像并将镜像推送至 Docker Hub。您需要预先为代码仓库和 Docker Hub 仓库创建凭证，然后在相应的步骤中设置仓库的 URL 以及凭证。完成编辑后，流水线即可开始运行。

## CI & CD 流水线模板

![cicd-template](/images/docs/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/cicd-template.png)

![cicd-stages](/images/docs/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/cicd-stages.png)

CI & CD 流水线模板包含六个阶段。有关每个阶段的更多信息，请参考[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/#流水线概述)，您可以在该文档中找到相似的阶段及描述。您需要预先为代码仓库、Docker Hub 仓库和集群的 kubeconfig 创建凭证，然后在相应的步骤中设置仓库的 URL 以及凭证。完成编辑后，流水线即可开始运行。

{{< notice info >}}

您还可以按需在流水线模板中自定义步骤和阶段。有关如何使用图形编辑面板的更多信息，请参考[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-graphical-editing-panel/)。

{{</ notice >}}