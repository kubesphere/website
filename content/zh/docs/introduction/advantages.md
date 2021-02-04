---
title: "为什么选择 KubeSphere"
keywords: "KubeSphere, Kubernetes, 优势"
description: "KubeSphere 优势"
linkTitle: "为什么选择 KubeSphere"
weight: 1600
---

## 设计愿景

Kubernetes has become the de facto standard for deploying containerized applications at scale in private, public and hybrid cloud environments. However, many people can easily get confused when they start to use Kubernetes as it is complicated and has many additional components to manage. Some components need to be installed and deployed by users themselves, such as storage and network services. At present, Kubernetes only provides open-source solutions or projects, which can be difficult to install, maintain and operate to some extent. For users, it is not always easy to quickly get started as they are faced with a steep learning curve.

KubeSphere is designed to reduce or eliminate many Kubernetes headaches related to building, deployment, management, observability and so on. It provides comprehensive services and automates provisioning, scaling and management of applications so that you can focus on code writing. More specifically, KubeSphere boasts an extensive portfolio of features including multi-cluster management, application lifecycle management, multi-tenant management, CI/CD pipelines, service mesh, and observability (monitoring, logging, alerting, auditing, events and notification).

As a comprehensive open-source platform, KubeSphere strives to make the container platform more user-friendly and powerful. With a highly responsive web console, KubeSphere provides a graphic interface for developing, testing and operating, which can be easily accessed in a browser. For users who are accustomed to command-line tools, they can quickly get familiar with KubeSphere as kubectl is also integrated in the fully-functioning web console. With the responsive UI design, users can create, modify and create their apps and resources with a minimal learning curve.

In addition, KubeSphere offers excellent solutions to storage and network. Apart from the major open-source storage solutions such as Ceph RBD and GlusterFS, users are also provided with [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/) and [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/), developed by QingCloud for persistent storage. With the integrated QingCloud CSI and NeonSAN CSI plugins, enterprises can enjoy a more stable and secure services of their apps and data.

## 为什么选择 KubeSphere

KubeSphere 为企业用户提供高性能可伸缩的容器应用管理服务，旨在帮助企业完成新一代互联网技术驱动下的数字化转型，加速应用的快速迭代与业务交付，以满足企业日新月异的业务需求。

以下是 KubeSphere 的六大主要优势。

### 跨云厂商的多集群统一管理

随着容器应用的日渐普及，各个企业跨云或在本地环境中部署多个集群，而集群管理的复杂程度也在不断增加。为满足用户统一管理多个异构集群的需求，KubeSphere 配备了全新的多集群管理功能，帮助用户跨区、跨云等多个环境管理、监控、导入和运维多个集群，全面提升用户体验。

多集群功能可在安装 KubeSphere 之前或之后启用。具体来说，该功能有两大特性：

**统一管理**：用户可以使用直接连接或间接连接导入 Kubernetes 集群。只需简单配置，即可在数分钟内在 KubeSphere 的互动式 Web 控制台上完成整个流程。集群导入后，用户可以通过统一的中央控制平面监控集群状态、运维集群资源。

**高可用**： 在多集群架构中，一个集群可以运行主要服务，于此同时由另一集群作为备用。一旦该主集群宕机，备用集群可以迅速接管相关服务。此外，当集群跨区域部署时，为最大限度地减少延迟，请求可以发送至距离最近的集群，由此实现跨区跨集群的高可用。

有关更多信息，请参见[多集群管理](../../multicluster-management/)。

### 强大的可观察性功能

The observability feature of KubeSphere has been greatly improved with key building blocks enhanced, including monitoring, logging, auditing, events, alerting and notification. The highly functional system allows users to observe virtually everything that happens in the platform. It has much to offer for users with distinct advantages listed as below:

KubeSphere 的可观察性功能在 v3.0 中，其中的重要组件得到全面的优化与改善，包括监控日志、审计事件以及告警通知。

**自定义配置**：用户可以为应用自定义监控面板，有多种模板和图表模式可供选择。用户可按需添加想要监控的指标，甚至选择指标在图表上所显示的颜色。此外，也可自定义告警策略与规则，包括告警间隔、次数和阈值等。

**全维度数据监控与查询**：KubeSphere 提供全维度的资源监控数据，将运维团队从繁杂的数据记录工作中彻底解放，同时配备了高效的通知系统，支持多种通知渠道，包括电子邮件、Slack 与企业微信等。基于 KubeSphere 的多租户管理体系，不同租户可以在控制台上查询对应的监控日志与审计事件，支持关键词过滤、模糊匹配和精确匹配。

**图形化交互式界面设计**：KubeSphere 为用户提供图形化 Web 控制台，便于从不同维度监控各个资源。资源的监控数据会显示在交互式图表上，详细记录集群中的资源用量情况。不同级别的资源可以根据用量进行排序，方便用户对数据进行对比与分析。

**高精度秒级监控**：整个监控系统提供秒级监控数据，帮助用户快速定位组件异常。此外，所有审计事件均会准确记录在 KubeSphere 中，便于后续数据分析。

有关更多信息，请参见[集群管理](../../cluster-administration/)、[项目用户指南](../../project-user-guide/)和[工具箱](../../toolbox/)。

### Automated DevOps

Automation represents a key part of implementing DevOps. With automatic, streamlined pipelines in place, users are better positioned to distribute apps in terms of continuous delivery and integration.

**Jenkins-powered**. KubeSphere DevOps system is built with Jenkins as the engine, which is abundant in plugins. On top of that, Jenkins provides an enabling environment for extension development, making it possible for the DevOps team to work smoothly across the whole process (developing, testing, building, deploying, monitoring, logging, notifying, etc.) in a unified platform. The KubeSphere account can also be used for the built-in Jenkins, meeting the demand of enterprises for multi-tenant isolation of CI/CD pipelines and unified authentication.

**Convenient built-in tools**. Users can easily take advantage of automation tools (e.g. Binary-to-Image and Source-to-Image) even without a thorough understanding of how Docker or Kubernetes works. They only need to submit a registry address or upload binary files (e.g. JAR/WAR/Binary). Ultimately, services will be released to Kubernetes automatically without any coding in a Dockerfile.

For more information, see DevOps Administration.

### Fine-grained Access Control

KubeSphere users are allowed to implement fine-grained access control across different levels, including clusters, workspaces and projects. Users with specific roles can operate on different resources if they are authorized to do so.

**Self-defined**. Apart from system roles, KubeSphere empowers users to define their roles with a spectrum of operations that they can assign to tenants. This meets the need of enterprises for detailed task allocation as they can decide who should be responsible for what while not being affected by irrelevant resources.

**Secure**. As tenants at different levels are completely isolated from each other, they can share resources while not affecting one another. The network can also be completely isolated to ensure data security.

For more information, see Role and Member Management in Workspace.

### Out-of-Box Microservices Governance

On the back of Istio, KubeSphere features major grayscale strategies. All these features are out of the box, which means consistent user experiences without any code hacking. Traffic control, for example, plays an essential role in microservices governance. In this connection, Ops teams, in particular, are able to implement operational patterns (e.g. circuit breaking) to compensate for poorly behaving services. Here are two major reasons why you use microservices governance, or service mesh in KubeSphere:

- **Comprehensive**. KubeSphere provides users with a well-diversified portfolio of solutions to traffic management, including canary release, blue-green deployment, traffic mirroring and circuit breaking. In addition, the distributed tracing feature also helps users monitor apps, locate failures, and improve performance. 
- **Visualized**. With a highly responsive web console, KubeSphere allows users to view how microservices interconnect with each other in a straightforward way.

KubeSphere aims to make service-to-service calls within the microservices architecture reliable and fast. For more information, see Project Administration and Usage.

### Vibrant Open Source Community

As an open-source project, KubeSphere represents more than just a container platform for app deployment and distribution. We believe that a true open-source model focuses more on sharing, discussions and problem solving with everyone involved. Together with partners, ambassadors and contributors, and other community members, we file issues, submit pull requests, participate in meetups, and exchange ideas of innovation.

At KubeSphere, we have the capabilities and technical know-how to help you share the benefits that the open-source model can offer. More importantly, we have community members from around the world who make everything here possible.

**Partners**. KubeSphere partners play a critical role in KubeSphere's go-to-market strategy. They can be app developers, technology companies, cloud providers or go-to-market partners, all of whom drive the community ahead in their respective aspects.

**Ambassadors**. As community representatives, ambassadors promote KubeSphere in a variety of ways (e.g. activities, blogs and user cases) so that more people can join us.

**Contributors**. KubeSphere contributors help the whole community by contributing to code or documentation. You don't need to be an expert while you can still make a different even it is a minor code fix or language improvement.

For more information, see [Partner Program](https://kubesphere.io/partner/) and [Community Governance](https://kubesphere.io/contribution/).