---
title: 'KubeSphere 宣布开源 Thanos 的企业级发行版 Whizard'
tag: '产品动态'
keyword: '社区, 开源, Thanos, KubeSphere, Whizard'
description: '青云科技 KubeSphere 宣布开源 Thanos 的企业级发行版 Whizard，为企业带来真正高可用、可扩展、易运维的 Prometheus 长期存储方案。'
createTime: '2024-08-22'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-whizared-20240822.png'
---

日前，青云科技宣布开源 Thanos 的企业级发行版 Whizard，为企业带来真正高可用、可扩展、可存储与查询海量监控数据、易运维、安全的 Prometheus 长期存储方案。

Prometheus 已经成为云原生监控领域事实上的标准，但 Prometheus 并没有解决企业用户对高可用、可扩展、可存储与查询海量监控数据、易运维等方面的需求。Thanos 作为云原生社区主流的 Prometheus 长期存储项目，提供了 Prometheus 高可用、可存储与查询海量监控数据等能力，但也存在组件及参数众多，上手门槛较高；运维及水平扩展均需手动配置，比较繁琐且易出错；某些组件无水平扩展能力；各组件安全配置繁琐或欠缺等问题。

为了解决上述这些企业级用户的需求，青云科技 KubeSphere 可观测团队于 2021 年立项开始开发 Thanos 的企业级发行版 Whizard 并于 2022 年发布了第一版，至今已发布了 8 个大小版本。自 KubeSphere Enterprise v3.3.1 基于 Whizard 发布了可对海量 K8s 集群及边缘节点进行监控告警的 Whizard 可观测中心以来，经过 KubeSphere Enterprise v3.4.0，v3.5.0, v4.1.0 等多个企业版本的打磨，Whizard 已日臻成熟，具有很多独特的功能与亮点。

## 功能亮点：

- **云原生化部署与运维**：所有组件均支持以 CRD 的方式定义与维护，更易于配置与运维。包括 Thanos 的 Router, Ingester, Compactor, Store, Query, QueryFrontend, Ruler 等组件以及 Whizard 引入的 Service, Tenant, Storage 等。
- **基于租户的自动水平扩展机制**：基于 CPU 与 Memory 的 HPA 对于稳定性要求更高的企业级有状态工作负载并不是最好的选择，为此 Whizard 创造性地引入了基于租户的工作负载水平伸缩机制。Ingester，Compactor，Ruler 等均支持随着租户的创建与删除进行水平伸缩，保证租户工作负载稳定运行的同时，提供了租户级别的水平扩展与资源回收机制。
- **适配 K8s 多集群管理**：为了对 K8s 多集群监控告警提供更好的支持，Whizard 的维护者开发了 whizard-adapter ，可根据 K8s/KubeSphere 集群的创建与删除自动创建或删除 Whizard 的租户，进而触发 Thanos 有状态工作负载的自动水平伸缩。
- **规则计算更好的扩展性**：Thanos 原生的 Ruler 的水平扩展性并不好，无法满足海量 K8s 集群(租户)的 Alerting Rules 与 Recording Rules 的计算需求。为此 Whizard 的维护者为每个租户引入了专属的 Ruler，其可随着租户的生命周期自动创建与删除；除了租户专属的 Ruler， Whizard 的维护者还引入了全局 Ruler 的分片机制，用于满足跨海量集群(租户)的全局规则(Alerting rules or Recording Rules)计算需求; 此外 Thanos Ruler 目前尚不支持将计算后的各租户的 recording rules 分别写入各自租户的 Ingester，Whizard 的维护者为此也做了额外的支持。
- **更细粒度的规则管理**：目前社区流行用 PrometheusRule 来管理 Prometheus recording rules 及 alerting rules，这种方式存在的问题是 PrometheusRule 里存在属于多个规则组的多条规则，粒度过大，不宜并发编辑与维护。为了解决这个问题，Whizard 维护者引入了更细粒度的 RuleGroup 的 CRD 用于管理属于一个规则组内的所有规则；此外还引入了 3-tiers 的 RuleGroup 管理机制，RuleGroup 用于管理某一 namespace 下的规则组；ClusterRuleGroup 用于管理某一集群范围内的集群规则组；GlobalRuleGroup 用于管理扩跨多集群范围的全局规则组；在做到更细粒度规则管理的同时，满足了企业用户对不同权限范围的规则进行单独管理的需求。
- **支持对象存储网关 Store 的按时间分片查询**：Thanos 通过将 Prometheus 的数据写入对象存储并支持从对象存储查询海量的监控数据，如果查询的时间范围过大，会导致 Store 占用资源过多，为止 Whizard 的维护者为 Store 加入了按时间分片查询的机制，用户可以根据要查询的时间段分别创建不同的 Store CRD。
- **引入 Gateway 及 Agent Proxy 以对数据的写入与读取进行更好的控制**：客户端如 Prometheus Agent 或 Prometheus 无需直接与 Gateway 交互，通过 Whizard Agent Proxy 即可代理数据写入与查询请求至 Whizard Gateway，Whizard Gateway 进而可根据租户的权限放行或拒绝查询或写入请求。
- **支持企业级的安全需求**：企业用户通常对安全性有更高的需求。Whizard 除了支持组件间更方便的配置 tls 之外，还将 Thanos 的 WebUI 通过 Whizard Gateway 暴露出来并支持 Basic Auth 与 OAuth2-Proxy 两种认证方式，企业用户可以更安全的访问 Thanos 的 WebUI.
- **更方便的 2-Tiers 组件配置**：Whizard 支持 Service 与 Comopnents 两级组件配置，通用的配置可放在全局的 Servce 里做统一配置，各租户的所有组件共用；特殊的定制化配置可放在单独的 Component 里做个性化的定制。

## 开源贡献：

作为 Thanos 的企业级发行版，Whizard 的维护者也积极参与到了 Thanos 项目的维护中去，多次提交 PRs。

## 未来展望：

通过 Whizard 的开源，KubeSphere 可观测团队希望 KubeSphere 在企业级多集群监控与告警方面的经验惠及更多的企业用户，也希望更多开发者参与共建 Whizard 项目。除此之外，KubeSphere 历年多个版本累积下来的可观测能力将逐渐统一在 WhizardTelemetry 可观测平台中持续演进，涵盖监控、告警、通知、日志、事件、审计、事件告警等多种可观测信号（[详见 KubeSphere Enterprise v4.1.0 版本说明](https://kubesphere.cloud/docs/kse/release-notes/v4.1.0#%E5%8F%AF%E8%A7%82%E6%B5%8B%E6%80%A7)）。未来 KubeSphere 可观测团队还会对 AI Infra 的可观测进行更好的支持；结合大模型应用的可观测支持符合 OpenTelemetry 标准的 Tracing；还计划在 eBPF 赋能可观测方面做出积极探索，并可能开源相关项目。

## 获取 Whizard：

Whizard 的文档还在完善中，目前可通过 [Whizard 的 GitHub 仓库](https://github.com/WhizardTelemetry/whizard)获取 Whizard 的安装及使用方法，也可以通过 KubeSphere 社区获得更多支持。
