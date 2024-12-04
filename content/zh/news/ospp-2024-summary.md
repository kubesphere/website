---
title: '开源之夏 2024 KubeSphere 社区项目总结'
tag: '社区动态'
keywords: 'Kubernetes, KubeSphere, 开源, OSPP'
description: '经过 3 个月的开发，社区评审，导师评审，OSPP 官方委员会评审多个步骤，最终 4 个项目全部顺利结项，在此恭贺各位同学。'
createTime: '2024-11-30'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/ospp-kubesphere-2024-summary.png'
---

开源之夏是由中科院软件所“开源软件供应链点亮计划”发起并长期支持的一项暑期开源活动，旨在鼓励在校学生积极参与开源软件的开发维护，培养和发掘更多优秀的开发者，促进优秀开源软件社区的蓬勃发展，助力开源软件供应链建设。11 月 9 日，官方完成最终审核，并发布结果。

KubeSphere 社区积极参与本次活动，作为导师，共获得了 4个官方赞助名额。最终对学生开放如下任务：

- [基于 LangChain 实现的 Pod 状态分析工具](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2024/pod-state-analysis-tool-based-on-langchain_zh-CN.md) 
- [Fluent Operator 集成 Fluent-bit 3.0](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2024/integrating-fluent-bit-3.0-into-fluent-operator_zh-CN.md) 
- [OpenELB 支持 IPV6](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2024/openelb-support-ipv6_zh-CN.md)
- [cluster-api-kubekey-provider 升级](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2024/upgrading-cluster-api-kubekey-provider_zh-CN.md)


经过 3 个月的开发，社区评审，导师评审，OSPP 官方委员会评审多个步骤，最终 4 个项目全部顺利结项，在此恭贺各位同学。

> 中选学生介绍见之前[动态](https://kubesphere.io/zh/news/ospp-2024-selected-students/)。

## 项目结果

### 基于 LangChain 实现的 Pod 状态分析工具

- 学生：张豈明
- 学校：华东师范大学
- 导师：[Haili Zhang](https://github.com/webup) 
- 合并 PR：
  - [基础静态前端界面](https://github.com/kubesphere-extensions/ks-extensions-contrib/pull/1)
  - [pod信息自动获取](https://github.com/kubesphere-extensions/ks-extensions-contrib/pull/2)
  - [LLM能力接入](https://github.com/kubesphere-extensions/ks-extensions-contrib/pull/3)
  - [完善Readme文档](https://github.com/kubesphere-extensions/ks-extensions-contrib/pull/5)
  - [完善Deployment相关内容](https://github.com/kubesphere-extensions/ks-extensions-contrib/pull/6)

### Fluent Operator 集成 Fluent-bit 3.0

- 学生：李梓玄
- 学校：福州大学
- 导师：[程德昊](https://github.com/wenchajun)
- 合并 PR：
  - [Updates multiple dependencie of k8s](https://github.com/fluent/fluent-operator/pull/1251)
  - [Update fluentbit to v3.1.4](https://github.com/fluent/fluent-operator/pull/1282)
  - [config-reload Enhancements](https://github.com/fluent/fluent-operator/pull/1286)
  - [add wasm filter piugin](https://github.com/fluent/fluent-operator/pull/1325)
  - [add exec wasi input plugin](https://github.com/fluent/fluent-operator/pull/1326)
  - [update fluentbit to 3.1.7](https://github.com/fluent/fluent-operator/pull/1329)
  - [Update the module path to github.com/fluent/fluent-operator/v3](https://github.com/fluent/fluent-operator/pull/1355)
  - [Add option to disable operator resources in Helm chart](https://github.com/fluent/fluent-operator/pull/1348)

### OpenELB 支持 IPV6

- 学生：邬宇祺
- 学校：中国科学院大学
- 导师：[任云康](https://github.com/renyunkang/)
- 合并 PR：
  - [Add test for IPv6 allocation by IPAM](https://github.com/openelb/openelb/pull/442)
  - [Remove the resolveIP of arp_announcer](https://github.com/openelb/openelb/pull/443)
  - [Add NDP announcer for layer2-speaker](https://github.com/openelb/openelb/pull/445)
  - [Bug fix](https://github.com/openelb/openelb/pull/446)
  - [Change the IP prefix in BGP mode](https://github.com/openelb/openelb/pull/448)
  - [Avoid service get IP from EIP which is different family](https://github.com/openelb/openelb/pull/449)

### cluster-api-kubekey-provider 升级

- 学生：丁永亮
- 学校：华东师范大学
- 导师：[刘健](https://github.com/ImitationImmortal)
- 合并 PR：
  - [创建CRD资源](https://github.com/kubesphere/kubekey/pull/2409)
  - [工作集群生命周期管理](https://github.com/kubesphere/kubekey/pull/2419)
  - [任务流程模板](https://github.com/kubesphere/kubekey/pull/2418)

## 结语

今年是 KubeSphere 社区第四次参与开源之夏活动。与去年一样，我们邀请了多位社区中的 contributor 和 maintainer 共同参与，涵盖了多个核心开源项目，包括 KubeSphere、KubeKey、OpenELB 和 Fluent Operator。

通过这些项目的实践开发，我们希望帮助每位参与的学生提升技术能力，同时深入了解开源项目的运作和开源社区的协作方式。项目的结束并不是终点，而是新的起点。我们真诚地希望所有顺利完成项目的同学能够将这段经历作为起步，持续参与开源社区，为开源生态的繁荣发展贡献自己的力量。