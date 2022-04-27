---
title: "概述"
keywords: 'Kubernetes, KubeSphere, DevOps, 概述'
description: '了解 DevOps 的基本知识。'
linkTitle: "概述"
weight: 11110
---

DevOps 是一系列做法和工具，可以使 IT 和软件开发团队之间的流程实现自动化。其中，随着敏捷软件开发日趋流行，持续集成 (CI) 和持续交付 (CD) 已经成为该领域一个理想的解决方案。在 CI/CD 工作流中，每次集成都通过自动化构建来验证，包括编码、发布和测试，从而帮助开发者提前发现集成错误，团队也可以快速、安全、可靠地将内部软件交付到生产环境。

不过，传统的 Jenkins Controller-Agent 架构（即多个 Agent 为一个 Controller 工作）有以下不足。

- 如果 Controller 宕机，整个 CI/CD 流水线会崩溃。
- 资源分配不均衡，一些 Agent 的流水线任务 (Job) 出现排队等待，而其他 Agent 处于空闲状态。
- 不同的 Agent 可能配置环境不同，并需要使用不同的编码语言。这种差异会给管理和维护带来不便。

## 了解 KubeSphere DevOps

KubeSphere DevOps 项目支持源代码管理工具，例如 GitHub、Git 和 SVN。用户可以通过图形编辑面板 (Jenkinsfile out of SCM) 构建 CI/CD 流水线，或者从代码仓库 (Jenkinsfile in SCM) 创建基于 Jenkinsfile 的流水线。

### 功能

KubeSphere DevOps 系统为您提供以下功能：

- 独立的 DevOps 项目，提供访问可控的 CI/CD 流水线。
- 开箱即用的 DevOps 功能，无需复杂的 Jenkins 配置。
- 支持 [Source-to-image (S2I)](../../../project-user-guide/image-builder/source-to-image/) 和 [Binary-to-image (B2I)](../../../project-user-guide/image-builder/binary-to-image/)，快速交付镜像。
- [基于 Jenkinsfile 的流水线](../../../devops-user-guide//how-to-use/pipelines/create-a-pipeline-using-jenkinsfile)，提供一致的用户体验，支持多个代码仓库。
- [图形编辑面板](../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/)，用于创建流水线，学习成本低。
- 强大的工具集成机制，例如 [SonarQube](../../../devops-user-guide/how-to-integrate/sonarqube/)，用于代码质量检查。

### KubeSphere CI/CD 流水线工作流

KubeSphere CI/CD 流水线基于底层 Kubernetes Jenkins Agent 而运行。这些 Jenkins Agent 可以动态扩缩，即根据任务状态进行动态供应或释放。Jenkins Controller 和 Agent 以 Pod 的形式运行在 KubeSphere 节点上。Controller 运行在其中一个节点上，其配置数据存储在一个存储卷 (Volume) 中。Agent 运行在各个节点上，但可能不会一直处于运行状态，而是根据需求动态创建并自动删除。

当 Jenkins Controller 收到构建请求，会根据标签动态创建运行在 Pod 中的 Jenkins Agent 并注册到 Controller 上。当 Agent 运行完任务后，将会被释放，相关的 Pod 也会被删除。

### 动态供应 Jenkins Agent

动态供应 Jenkins Agent 有以下优势：

**资源分配合理**：KubeSphere 动态分配已创建的 Agent 至空闲节点，避免因单个节点资源利用率高而导致任务排队等待。

**高可扩缩性**：当 KubeSphere 集群因资源不足而导致任务长时间排队等待时，您可以向集群新增节点。

**高可用性**：当 Jenkins Controller 故障时，KubeSphere 会自动创建一个新的 Jenkins Controller 容器，并将存储卷挂载至新创建的容器，保证数据不会丢失，从而实现集群高可用。