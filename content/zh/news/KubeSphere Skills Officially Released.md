---
title: 'KubeSphere Skills 正式发布：让 OpenClaw 更懂 KubeSphere'
tag: '产品动态'
keyword: '社区, Kubernetes, 贡献, KubeSphere, release'
description: '本次发布的 KubeSphere Skills,共发布 16 个技能包，覆盖核心平台、DevOps 全流程、可观测性套件三大领域。'
createTime: '2026-04-03'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/skill%E5%B0%81%E9%9D%A2.png'
---

OpenClaw 已经是很多人日常使用的 AI 助手，但它不理解 KubeSphere 独有的资源模型和操作方式。

问多集群管理，它给的是通用 `kubectl` 命令；问 DevOps 流水线，它讲的是原生 Jenkins 的使用方式；问扩展组件安装，它又回到 Helm Chart 那一套——而这些都不是 KubeSphere 用户真正的工作路径。

现在，**KubeSphere 官方 Skills 正式发布**，补上了 OpenClaw 在 KubeSphere 场景下长期缺失的这层能力。

![](https://pek3b.qingstor.com/kubesphere-community/images/skill%E5%B0%81%E9%9D%A2.png)

## 我们发布了哪些 Skills

KubeSphere Skills 目前共发布 16 个技能包，覆盖核心平台、DevOps 全流程、可观测性套件三大领域：

### 1. 核心平台能力


| Skill | 覆盖能力 | 典型用途 |
|---|---|---|
| `kubesphere-core` | KubeSphere 核心平台架构 | 使用 KubeSphere 核心功能、扩展机制 |
| `kubesphere-extension-management` | 扩展组件生命周期管理 | 安装、配置、升级或排查扩展组件故障 |
| `kubesphere-cluster-management` | 集群查询（只读） | 查询集群列表、状态、详情、版本信息 |
| `kubesphere-multi-tenant-management` | 多租户管理 | 工作空间、命名空间、角色与访问控制 |

### 2. DevOps 全流程

| Skill | 覆盖能力 | 典型用途 |
|---|---|---|
| `kubesphere-devops-overview` | DevOps 扩展整体架构 | DevOps 搭建、架构理解、通用 CI/CD 操作 |
| `kubesphere-devops-pipeline` | 流水线管理 | 通过 API 创建、运行和监控 CI/CD 流水线 |
| `kubesphere-devops-credentials` | 凭据管理 | 管理仓库和部署凭据 |
| `kubesphere-devops-jenkins` | Jenkins 配置 | Jenkins 配置、代理管理、认证与故障排查 |
| `kubesphere-devops-tenant` | 租户操作规范 | 规范命名空间范围内的 DevOps 操作 |
| `kubesphere-devops-argocd` | Argo CD 集成 | GitOps 应用部署与管理 |

### 3. 可观测性套件

| Skill | 覆盖能力 | 典型用途 |
|---|---|---|
| `whizard-telemetry` | WizTelemetry 平台公共服务 | 提供日志、审计、事件等可观测性扩展的公共 API Server |
| `vector` | 可观测性数据采集与路由 | 配置日志、事件、审计等数据管道 |
| `opensearch` | 可观测性数据存储与检索 | 存储和查询日志、事件、审计、通知历史 |
| `whizard-logging` | 日志采集 | 采集 K8s 容器日志 |
| `whizard-events` | 事件能力 | 采集 K8s 事件 |
| `whizard-auditing` | 审计能力 | 采集 K8s 和 KubeSphere 审计事件 |

这些 Skills 将**正确的资源模型、安装约束、API 路径、依赖关系和排障方式**沉淀为可被 AI 直接调用的专业能力。

## 加载 Skills 之后，OpenClaw 能做什么

加载 KubeSphere Skills 之后，OpenClaw 不再只是输出一套通用 K8s / DevOps 方案，而是开始按照 **KubeSphere 的资源模型、安装方式和操作路径** 来理解问题，并给出更贴近实际工作流的回答。

### 场景 1：集群与多租户管理

没有对应 Skill 时，AI 往往只能给出一些通用 Kubernetes 查询命令，比如：

```
kubectl get nodes
kubectl get pods -A
kubectl get namespaces
```

加载 Skill 之后，你只需要一句话：

> 列出所有集群，告诉我每个集群的 K8s 版本和 Host/Member 角色

它就能基于 KubeSphere 的集群模型理解需求，识别`cluster` CRD，以及 Host / Member 集群在标签和角色上的区别，给出更准确的查询方式，而不是停留在泛化的 Kubernetes 命令层面。

![](https://pek3b.qingstor.com/kubesphere-community/images/openclaw17.png)

原本需要进入控制台逐个点开集群详情才能完成的事情，现在通过一轮对话就可以完成，而且结果更结构化，也更适合后续筛选和脚本化处理。

### 场景 2：扩展组件安装

没有 Skill 时，AI 很容易按照通用经验，建议你直接用 Helm Chart 方式部署，比如：

```
helm install xxx
```
但在 KubeSphere 4.x 中，扩展组件有自己明确的安装机制，正确入口并不是一条 `helm install` 命令。

加载 Skill 后，当你告诉它：
> 帮我安装 WhizardTelemetry 可观测性套件，启用监控和日志

它会直接进入 KubeSphere 的正确安装语境，生成符合要求的安装内容。下图展示了 OpenClaw 从识别安装需求，到生成符合 KubeSphere 扩展机制配置内容的过程：

![](https://pek3b.qingstor.com/kubesphere-community/images/openclaw5.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/openclaw186.png)

这些安装细节，现在 AI 都记住了。

### 场景 3：DevOps 项目管理

没有对应 Skill 时，这类操作通常要先在控制台里一层层创建资源，再手动补齐权限关系。一个看似简单的“建项目”，背后往往至少包括下面几步：

```text
1. 创建企业空间
2. 绑定管理员
3. 选择所属集群
4. 创建 DevOps 项目
5. 进入成员管理
6. 分配角色
```

加载 Skills 后，你说：
> 帮我创建企业空间，创建 DevOps 项目

OpenClaw 会先识别需要补齐的关键参数，再把企业空间创建、项目创建和角色授权串成一条完整路径。

![](https://pek3b.qingstor.com/kubesphere-community/images/openclaw42.png)

这样，AI 不只是“帮你建个项目”，而是理解 DevOps 项目从属于企业空间、受租户边界约束，并且需要角色授权才能真正可用。


## KubeSphere Skills vs 传统 GUI

两种工作模式适合不同场景。对比如下：

| 操作场景 | 传统 GUI 路径 | OpenClaw + KubeSphere Skills |
|---|---|---|
| 安装扩展组件 | 进入「扩展市场」→ 选组件 → 填写配置表单 → 等待安装 | 直接对话：「帮我安装 WhizardTelemetry」→ AI 生成正确的 InstallPlan YAML，kubectl apply 即完成 |
| 查询多集群状态 | 进入「集群管理」→ 逐个点开集群查看详情 | 对话：「列出所有集群及其 K8s 版本」→ 立即获取结构化结果，可进一步过滤 |
| 创建企业空间并授权 | 依次进入工作空间管理 → 新建 → 成员管理 → 角色绑定，至少 5 步 | 一句话描述需求，AI 按最小权限原则输出完整的 API 调用序列 |
| 触发 DevOps 流水线 | 进入 DevOps 项目 → 流水线 → 手动运行 | AI 生成 PipelineRun CR，直接 apply，触发即完成，可脚本化批量执行 |
| GitOps 应用部署 | 进入 GitOps 页面 → 手动填写仓库地址、路径、同步策略 | AI 输出 KubeSphere 租户友好的 GitOps API 调用，无需接触 argocd 命名空间 |
| 可观测性排查 | 切换到监控 → 按租户筛选 → 查告警规则 → 翻日志 | 直接问「查看 production 命名空间过去 1 小时的告警」，AI 给出精确 API 查询路径 |

Skills 主要带来了三点变化：**效率、门槛、可扩展性。**

## 现在就可以开始使用

KubeSphere Skills 已开源发布，安装方式非常简单，支持主流的 AI Agent 生态。

![](https://pek3b.qingstor.com/kubesphere-community/images/kaiyuanskill.png)

### 推荐方式：使用 `npx` 一键安装

`npx skills add kubesphere/kubesphere`

该命令会识别仓库中可安装的 Skills，并按当前 Agent 的安装方式写入对应环境。

![](https://pek3b.qingstor.com/kubesphere-community/images/npxskill.png)

**或者，通过对话让 Agent 安装：**

直接在您的 AI 助手对话中告诉它：

> 请帮我安装 https://github.com/kubesphere/kubesphere 中的 skills

安装完成后，您的 AI 助手就加载了完整的 KubeSphere 平台知识，可以直接投入使用。

![](https://pek3b.qingstor.com/kubesphere-community/images/duihuaskill.png)
社区贡献同样欢迎。如果你在使用中发现某个操作场景缺少对应的 Skill，或者现有 Skill 描述有改进空间，可以按照仓库的贡献指南提交——包括压力场景、API 示例和实际排查步骤。

**项目地址：** [https://github.com/kubesphere/kubesphere/tree/master/skills](https://github.com/kubesphere/kubesphere/tree/master/skills)

## 从点击到对话

KubeSphere Skills 做的事情其实很简单：让 OpenClaw 真正懂 KubeSphere。

从此，查集群不用翻菜单，装扩展不用记表单，触发流水线不用打开控制台——对话就够了。

如果你遇到某个场景缺少对应 Skill，或者觉得哪里还能更好，欢迎按贡献指南提出来。你的每一次反馈，都会让 KubeSphere 的 AI 能力更强。
