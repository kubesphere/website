---
title: "DevOps用户指南"
description: "Getting started with KubeSphere DevOps project"
layout: "single"

linkTitle: "DevOps 用户指南"
weight: 4400

icon: "/images/docs/docs.svg"

---


想要在Kubernetes集群上部署和管理CI/CD任务以及相关的工作负载，请使用KubeSphere DevOps系统。 本章演示了如何在DevOps项目中进行管理和工作，包括运行流水线，创建凭据和集成工具。

在安装DevOps组件时，将自动部署Jenkins。 KubeSphere为您提供一致的用户体验，因为您可以像以前一样通过Jenkinsfile建立流水线。 此外，KubeSphere还具有高度实时化的图形化仪表板，可以可视化整个流程，为您提供一个直观的视图，方便您了解流水线在每个阶段是如何运行的。

## 使用DevOps

### [DevOps项目管理](../devops-user-guide/how-to-use/devops-project-management/)

创建和管理DevOps项目以及其中的角色和成员。

### [使用Jenkinsfile创建流水线](../devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/)

通过使用示例Jenkinsfile了解如何创建和运行流水线。

### [使用图形编辑面板创建流水线](../devops-user-guide/how-to-use/create-a-pipeline-using-graphical-editing-panel/)

了解如何使用KubeSphere的图形编辑面板创建和运行流水线。

### [选择Jenkins Agent](../devops-user-guide/how-to-use/choose-jenkins-agent/)

指定Jenkins Agent并为流水线使用内置的容器组模版。

### [凭证管理](../devops-user-guide/how-to-use/credential-management/)

创建凭证以便您的流水线可以与第三方应用程序或网站进行交互。

### [为依赖关系设置CI节点](../devops-user-guide/how-to-use/set-ci-node/)

配置专门用于持续集成（CI）的一个或一组节点从而加快流水线中的构建过程。

### [为KubeSphere流水线设置电子邮件服务器](../devops-user-guide/how-to-use/jenkins-email/)

设置邮件服务器以接收有关您Jenkins流水线的通知。

### [Jenkins系统设置](../devops-user-guide/how-to-use/jenkins-setting/)

了解如何自定义您的Jenkins配置。

## 集成工具

### [将SonarQube集成到流水线中](../devops-user-guide/how-to-integrate/sonarqube/)