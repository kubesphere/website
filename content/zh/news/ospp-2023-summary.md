---
title: '开源之夏 2023 KubeSphere 社区项目总结'
tag: '社区动态'
keywords: 'Kubernetes, KubeSphere, 开源, OSPP'
description: '经过 3 个月的开发，社区评审，导师评审，OSPP 官方委员会评审多个步骤，最终 6 个项目全部顺利结项，在此恭贺各位同学。'
createTime: '2023-11-17'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/ospp-kubesphere-2023-summary.png'
---

开源之夏是由中科院软件所“开源软件供应链点亮计划”发起并长期支持的一项暑期开源活动，旨在鼓励在校学生积极参与开源软件的开发维护，培养和发掘更多优秀的开发者，促进优秀开源软件社区的蓬勃发展，助力开源软件供应链建设。11 月 9 日，官方完成最终审核，并发布结果。

KubeSphere 参加了"开源之夏 2023"活动，作为导师，共获得了 6 个官方赞助名额。最终对学生开放如下任务：

- [OpenFunction 的 Node.js 函数框架支持 Dapr 状态管理](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2023/openfunction-nodejs-function-framework-upgrade_zh-CN.md) 
- [Fluent Operator Collector 输入组件开发](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2023/fluent-operator-input-plugin-development.md) 
- [OpenELB EIP 分配到 Namespace](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2023/openelb-eip-binding-namespaces.md)
- [OpenFunction 函数触发器](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2023/openfunction-function-trigger.md)
- [KubeKey 可视化界面开发](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2023/kubekey-console_zh-CN.md)
- [基于 Shipwright+Buildpacks 改造 KubeSphere-S2I](https://github.com/kubesphere/community/blob/master/sig-advocacy-and-outreach/ospp-2023/kubesphere-s2i-upgrade-with-buildpacks_zh-CN.md)


经过 3 个月的开发，社区评审，导师评审，OSPP 官方委员会评审多个步骤，最终 6 个项目全部顺利结项，在此恭贺各位同学。

> 中选学生介绍见之前[动态](https://kubesphere.io/zh/news/ospp-2023-selected-students/)。

## 项目结果

### OpenFunction 的 Node.js 函数框架支持 Dapr 状态管理

- 学生：董文龙
- 学校：电子科技大学
- 导师：[Haili Zhang](https://github.com/webup) 
- 合并 PR：
  - [✨ feat: support state store by yi-ge-dian · Pull Request #189](https://github.com/OpenFunction/functions-framework-nodejs/pull/189)
  - [✨ feature(test): finish kind based e2e testing by yi-ge-dian · Pull Request #205](https://github.com/OpenFunction/functions-framework-nodejs/pull/205)
  - [✨ feat: add ospp 20230905 by yi-ge-dian · Pull Request #39](https://github.com/webup/openfunction-talks/pull/39)

### Fluent Operator Collector 输入组件开发

- 学生：刘帅军
- 学校：四川大学
- 导师：[wenchajun](https://github.com/wenchajun)
- 合并 PR：
  - [[summerospp]add fluentbit opentelemetry plugin](https://github.com/fluent/fluent-operator/pull/890)
  - [[summerospp]add fluentbit http plugin](https://github.com/fluent/fluent-operator/pull/904)
  - [[summerospp]add fluentbit mqtt plugin](https://github.com/fluent/fluent-operator/pull/911)
  - [[summerospp]add fluentbit collectd plugin](https://github.com/fluent/fluent-operator/pull/914)
  - [[summerospp]add fluentbit nginx plugin](https://github.com/fluent/fluent-operator/pull/924)
  - [[summerospp]add fluentbit statsd plugin ](https://github.com/fluent/fluent-operator/pull/925)
  - [[summerospp]add fluentbit syslog plugin](https://github.com/fluent/fluent-operator/pull/931)
  - [[summerospp]add fluentbit tcp plugin](https://github.com/fluent/fluent-operator/pull/936)

### OpenELB EIP 分配到 Namespace

- 学生：郭辰英
- 学校：电子科技大学
- 导师：[renyunkang](https://github.com/renyunkang/)
- 合并 PR：
  - [remove default eip webhook ](https://github.com/openelb/openelb/pull/348)
  - [allocate eip to specified namespace](https://github.com/openelb/openelb/pull/352)
  - [add test case](https://github.com/openelb/openelb/pull/357)
  - [allocate eip to specified namespace](https://github.com/openelb/website/pull/86)

### OpenFunction 函数触发器

- 学生：张冠璟
- 学校：苏州科技大学
- 导师：[Fang Tian ](https://github.com/tpiperatgod/)
- 合并 PR：[Integrating KEDA http-addon](https://github.com/OpenFunction/OpenFunction/pull/483)

### KubeKey 可视化界面开发

- 学生：史继林
- 学校：华东师范大学
- 导师：[Xiao liu](https://github.com/liangzai006)
- 合并 PR：[feat: Kubekey Web Console](https://github.com/kubesphere/kubekey/pull/2007)

### 基于 Shipwright+Buildpacks 改造 KubeSphere-S2I

- 学生：甘秉坤
- 学校：东南大学
- 导师：[yudong](https://github.com/yudong2015)
- 合并 PR：
  - [add image build apis base on shipwright](https://github.com/kubesphere/ks-devops/pull/999)
  - [helm chart of shipwright and buildpacks](https://github.com/kubesphere-sigs/image-builder/pull/2)
  - [feat: Add imagebuilder in DevOps module](https://github.com/kubesphere/console/pull/4203)
- 后续情况说明：调整优化细节之后 S2I 功能即可在 DevOps 模块中正式上线了。

## 结语

今年是 KubeSphere 社区第三次参与开源之夏活动，与去年一样，我们召集了社区里的多位 contributor 和 maintainer 参与其中，涉及 KubeSphere 社区的多个开源项目：KubeSphere、KubeKey、OpenFunction、OpenELB、Fluent Operator。

通过这些项目的开发，我们希望能帮助各位参与其中的学生提高各项能力，同时能更多了解开源项目、开源社区。项目的结束其实是一个新的开始，我们也希望各位顺利结项的同学，不止步于此，能够后续继续参与开源社区，为开源的发展贡献一份力量。