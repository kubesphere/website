---
title: "DevOps 用户指南"
description: "开始使用 KubeSphere DevOps 工程"
layout: "single"

linkTitle: "DevOps 用户指南"
weight: 11000

icon: "/images/docs/docs.svg"
---

您可以使用 KubeSphere DevOps 系统在 Kubernetes 集群上部署和管理 CI/CD 任务以及相关的工作负载。本章演示如何在 DevOps 工程中进行管理和操作，包括运行流水线、创建凭证和集成工具等等。

您安装 DevOps 组件时，会自动部署 Jenkins。您可以在 KubeSphere 中像以前一样通过 Jenkinsfile 构建流水线，保持一致的用户体验。此外，KubeSphere 还提供图形编辑面板，可以将整个流程可视化，为您直观地呈现流水线在每个阶段的运行状态。

## 了解和管理 DevOps 工程

### [概述](../devops-user-guide/understand-and-manage-devops-projects/overview/)

了解 DevOps 的基本知识。

### [DevOps 工程管理](../devops-user-guide/understand-and-manage-devops-projects/devops-project-management/)

创建并管理 DevOps 工程，了解 DevOps 工程中的各项基本元素。

### [角色和成员管理](../devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/)

在 DevOps 工程中创建并管理各种角色和成员。

## 使用 DevOps

### [使用 Jenkinsfile 创建流水线](../devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/)

学习如何使用示例 Jenkinsfile 创建并运行流水线。

### [使用图形编辑面板创建流水线](../devops-user-guide/how-to-use/create-a-pipeline-using-graphical-editing-panel/)

学习如何使用 KubeSphere 图形编辑面板创建并运行流水线。

### [凭证管理](../devops-user-guide/how-to-use/credential-management/)

创建凭证以便您的流水线可以与第三方应用程序或网站进行交互。

### [Jenkins 系统设置](../devops-user-guide/how-to-use/jenkins-setting/)

了解如何自定义您的 Jenkins 设置。

### [选择 Jenkins Agent](../devops-user-guide/how-to-use/choose-jenkins-agent/)

指定 Jenkins agent 并为流水线使用内置的 podTemplate。

### [为 KubeSphere 流水线设置电子邮件服务器](../devops-user-guide/how-to-use/jenkins-email/)

设置电子邮件服务器以接收有关您 Jenkins 流水线的通知。

### [为依赖项缓存设置 CI 节点](../devops-user-guide/how-to-use/set-ci-node/)

配置专门用于持续集成 (CI) 的一个或一组节点，加快流水线中的构建过程。

### [流水线设置](../devops-user-guide/how-to-use/pipeline-settings/)

了解 DevOps 工程中流水线的各个属性。

## 工具集成

### [将 SonarQube 集成到流水线](../devops-user-guide/how-to-integrate/sonarqube/)

将 SonarQube 集成到流水线中进行代码质量分析。

### [将 Harbor 集成到流水线](../devops-user-guide/how-to-integrate/harbor/)

将 Harbor 集成到流水线中并向您的 Harbor 仓库推送镜像。

## 示例

### [构建和部署 Go 工程](../devops-user-guide/examples/go-project-pipeline/)

学习如何使用 KubeSphere 流水线构建并部署 Go 工程。

### [使用 Jenkinsfile 在多集群项目中部署应用](../devops-user-guide/examples/multi-cluster-project-example/)

学习如何使用基于 Jenkinsfile 的流水线在多集群项目中部署应用。

### [构建和部署 Maven 工程](../devops-user-guide/examples/a-maven-project/)

学习如何使用 KubeSphere 流水线构建并部署 Maven 工程。