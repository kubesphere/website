---
title: 'KubeSphere 社区版重磅发布：永久免费，秒享企业级容器管理！'
tag: '产品动态'
keyword: 'KubeSphere, 社区版'
description: 'KubeSphere 社区版正式发布，永久免费。'
createTime: '2025-10-09'
author: 'KubeSphere'
image: 'http://pek3b.qingstor.com/kubesphere-community/images/v4.2.0%20Community%20Edition%20GA.png'
---

今天，我们正式发布 **KubeSphere 社区版**——一款为开发者与中小团队量身定制的**永久免费**容器管理平台。这是 KubeSphere 产品战略的重要里程碑，标志着我们在降低云原生技术门槛、服务更广泛用户群体方面迈出了实质性一步。


## 四大优势，让免费也能用得安心

### 永久免费，企业级体验

**零成本使用，无隐藏费用**。KubeSphere 社区版承诺永久免费，无需任何许可费用，让中小团队、初创企业、小规模生产业务能够平等地享受云原生技术红利。

但免费并不意味着妥协。社区版享受企业级产品的**长期支持与持续迭代**，所有功能均经过各行业生产环境验证，为您的业务构建可靠的云原生基石。我们相信，技术的普惠性与产品的高质量并不矛盾。

### 极简安装，开箱即用

**灵活部署，全场景适配**。
KubeSphere 社区版支持公有云、私有云及裸金属等多种环境，无缝兼容不同类型的基础设施，满足多样化部署需求。无论您是在企业数据中心、云服务器，还是自建硬件集群，都能轻松运行。

**轻量方案，高效上手**。
平台提供轻量化安装方式，显著简化 Kubernetes 集群的搭建与管理流程。您无需繁琐的前期配置和复杂脚本，安装过程快捷顺畅，从部署到使用仅需数分钟，让团队能够快速进入业务开发与运维阶段。

### 开放架构，无限扩展

**可插拔设计，生态兼容**。KubeSphere 社区版采用高度模块化的架构，UI/API 支持动态扩展，所有功能均可按需启用。这种设计确保了平台的轻量与灵活：您可以只安装所需组件，避免资源浪费。

更重要的是，KubeSphere 与各类开源工具无缝集成，您可以自由扩展平台能力，将 KubeSphere 打造成最适合您团队的云原生操作系统。

### 功能全面，构建云原生基石

KubeSphere 社区版包含了**构建和管理云原生容器平台的核心能力**：

- **统一管理**：支持集群管理、细粒度 RBAC 访问控制、多租户隔离体系，满足企业级权限与资源治理需求。
- **强大可观测性**：提供多维度的监控、告警、通知功能，集群与应用状态一目了然，故障排查效率显著提升。
- **高效运维**：涵盖应用全生命周期管理、DevOps 流水线、灵活的存储与网络方案，让运维团队专注业务价值创造。


## 扩展组件：覆盖关键场景

KubeSphere 社区版精心筛选并集成了 **18 个扩展组件**，覆盖可观测性、DevOps、安全治理、AI 推理、服务网关、数据库运维等关键领域：

**可观测性体系**
- WizTelemetry 平台服务
- WizTelemetry 监控
- WizTelemetry 告警
- WizTelemetry 通知
- WizTelemetry 数据流水线
- Metrics Server

**网关与流量管理**
- KubeSphere 网关
- Higress（云原生 API 网关）

**DevOps 与持续交付**
- DevOps（完整 CI/CD 流水线）

**安全与合规**
- Gatekeeper（策略引擎）
- cert-manager（证书管理）

**AI 与 GPU 支持**
- NVIDIA GPU Operator
- DeepSeek（AI 推理）

**数据管理与存储**
- ob-operator（OceanBase Operator）
- oceanbase-dashboard（OceanBase 管理面板）
- Fluid（数据集编排与加速）

这些组件的集成不是简单的"打包"，而是经过深度适配与测试，确保在 KubeSphere 平台上开箱即用。每个组件都可通过扩展市场一键安装，降低了学习成本与运维复杂度。开发者可以像搭积木一样，根据自身需求自由扩展平台能力边界，驱动创新与持续演进。

## 快速上手

### 安装与升级

#### 在线安装

若您是**从零开始**安装，请仔细阅读[在线安装 Kubernetes 和 KubeSphere](https://docs.kubesphere.com.cn/v4.2.0/03-installation-and-upgrade/02-install-kubesphere/01-online-install-kubernetes-and-kubesphere/)，帮助您在可访问 Internet 的情况下安装 Kubernetes 和 KubeSphere 。

若您**已安装好 Kubernetes**，可直接通过 Helm 安装 KubeSphere，具体步骤可参考文档[安装 KubeSphere](https://docs.kubesphere.com.cn/v4.2.0/03-installation-and-upgrade/02-install-kubesphere/01-online-install-kubernetes-and-kubesphere/#_安装_kubesphere) 。

#### 从开源版升级至社区版

若您已安装 KubeSphere 开源版本，想升级到社区版，请注意以下要点：

**使用建议**：社区版建议集群总规模控制在 **128 vCPU** 以内，以保证完整的管理与操作体验。超过该规模时，系统将进入资源只读模式，可继续查看资源，但无法进行新建或修改操作。

**升级前必读**：
1. 请根据升级文档中的步骤，执行脚本检查当前的集群规模
2. 社区版安装的具体依赖要求，请根据文档中的内容检查各项依赖的版本


详细流程请参考文档[从 KubeSphere 开源版升级到社区版 v4.2.0](https://docs.kubesphere.com.cn/v4.2.0/03-installation-and-upgrade/03-upgrade-kubesphere/05-online-upgrade-to-community-4.2.x/)。


### 许可证激活

**步骤 1：获取集群 ID**

完成 KubeSphere 安装后，打开 KubeSphere 容器管理平台，进入**组件坞 → 平台管理 → 许可证页面**，获取当前集群的集群 ID。

<p align="center">
  <img src="http://pek3b.qingstor.com/kubesphere-community/images/Community%20Edition%20GA1b2v1.png" alt="Community%20Edition%20GA1b2v1.png">
</p>

**步骤 2：申请免费许可证**

通过官方链接[申请 KubeSphere 社区版的免费许可证](https://kubesphere.com.cn/apply-license/)，填入个人信息和集群 ID，提交申请。随后许可证将发送至您的邮箱（邮件可能会被拦截，如长时间未收到，请尝试在垃圾箱中查找）。

<p align="center">
  <img src="http://pek3b.qingstor.com/kubesphere-community/images/image2025-9-24_14-26-34.png" alt="image2025-9-24_14-26-34.png">
</p>

**关于有效期**：许可证提供了有效期选项。许可证到期，如需继续使用，可再次申请免费许可，确保服务不中断。

**步骤 3：添加许可证**

收到邮件后，复制邮件中的授权码，打开 KubeSphere 容器管理平台，进入**组件坞 → 平台管理 → 许可证页面**，点击**添加许可证**，将授权码填入即可完成激活。

<p align="center">
  <img src="http://pek3b.qingstor.com/kubesphere-community/images/image2025-9-24_14-36-39.png" alt="image2025-9-24_14-36-39.png">
</p>

<p align="center">
  <img src="http://pek3b.qingstor.com/kubesphere-community/images/v4.20gazh-v4bf69f6.png" alt="v4.20gazh-v4bf69f6.png">
</p>

至此，KubeSphere 社区版已经可以正常使用！

## 为什么选择 KubeSphere 社区版？

**真正的零门槛**

无需采购预算、无需复杂审批流程，任何团队都可以立即开始云原生转型。

**生产级可靠性**

基于 Kubernetes 生态的最佳实践，经过大量企业用户验证，功能稳定可靠，可直接用于生产环境。

**平滑的升级路径**

随着业务规模的扩大，只需更换 License，即可无缝升级至企业版，立即获得企业级功能与技术支持，确保系统稳定、高效、持续扩展。


## 立即开启云原生新篇章

**用 KubeSphere 社区版释放 Kubernetes 的全部潜能，高效管理您的云原生应用！** 我们期待您的反馈与建议，让我们一起构建更好的云原生平台。


