---
title: 'KubeSphere 开源社区 2024 年度回顾与致谢'
tag: '社区动态'
keywords: 'KubeSphere, Kubernetes, Community, 云原生, OpenFunction, Fluent Operator '
description: '2024 年结束了，让我们再一次一起回顾一下 KubeSphere 开源社区在过去一年的变化。'
createTime: '2025-01-21'
author: 'KubeSphere 社区'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/2024-kubesphere-year-in-review.png'
---

随着 2024 年圆满落幕，我们回顾 KubeSphere 社区这一年走过的每一步，感慨万千。2024 年，KubeSphere 继续领跑云原生技术的创新与发展，推动开源文化的传播，致力于为全球开发者和企业用户提供更强大的平台和解决方案。感谢每一位社区成员的辛勤付出，正是因为你们的共同努力，KubeSphere 才能不断发展壮大，成为全球云原生技术的核心力量。

特别值得一提的是，KubeSphere v4 的正式发布，标志着我们迈入了全新的篇章。基于全新的可插拔架构 LuBan，KubeSphere 不仅提升了平台的灵活性、模块化和扩展性，还推动了云原生技术和生态系统的创新与深化。LuBan 架构使得 KubeSphere 能够更快速、更加高效地应对多变的技术需求，并为开发者提供了更加灵活、可定制的解决方案。

## 开源项目发展情况

2024 年，KubeSphere 社区在多个开源项目上取得了显著突破，为全球开发者和企业用户提供了强大的支持。通过持续的创新和优化，KubeSphere 成为云原生领域的重要工具之一，并在全球范围内得到了广泛的应用和认可。


| 开源项目 | 正式发版 | 新增重要功能 |
| -------- | -------- | -------- |
| KubeSphere     | 2 个     | 基于全新微内核架构 KubeSphere LuBan 重构；<br/>支持 UI、API 扩展；<br/>支持扩展组件管理，提供 KubeSphere 扩展市场；<br/>简化成员集群的纳管方式；<br/>支持基于 OCI 的 Helm Chart 仓库；<br/>支持 KubeSphere 服务帐户；<br/>支持快捷访问功能；<br/>支持通过容器终端进行文件上传和下载；<br/>支手动创建持久卷。 |
| KubeKey     | 8 个    | 支持 Kubernetes 新版本至 v1.32；<br/>支持部署 IPv4/IPv6 双栈集群；<br/>支持部署 Hybrident 网络插件；<br/> 支持自定义配置集群 DNS 参数；<br/> 支持自定义配置集群 Etcd 参数；<br/> 支持针对本地 Docker 导入/导出镜像；<br/> 支持集群部署完成后的自定义任务执行；<br/> 支持自定义创建 manifest 文件。|
| Fluent Operator    | 5 个     |    支持 Elasticsearch 数据流；<br/> 新增 Kubernetes 事件输入插件；<br/> 引入 WASM 插件和 LUA 插件；<br/>OpenTelemetry 集成增强；<br/>支持 Datadog 和其他云平台插件；<br/>更新 FluentBit 到 3.1.7，更新 Fluentd 到 1.17.0。|
| Whizard    | 1 个     | 云原生化部署与运维； <br/>基于租户的自动水平扩展机制；<br/> 适配 K8s 多集群管理；<br/> 规则计算更好的扩展性；<br/>更细粒度的规则管理；<br/>支持对象存储网关 Store 的按时间分片查询；<br/>引入 Gateway 及 Agent Proxy 以对数据的写入与读取进行更好的控制。|

### 用户和社区数据：


![](https://pek3b.qingstor.com/kubesphere-community/images/star-history-2025114.png)

- **GitHub Star 数量** 突破 15,000，Fork 超过 2,150，KubeSphere 的影响力进一步扩大，已经吸引了全球开发者的关注。
- **开源版本累计安装量** 突破 500 万次，生产环境用户超过千家企业，成为全球企业数字化转型的核心工具之一。
- **全球贡献者** 超过 500 名，涵盖超过 100 个国家和地区，体现了 KubeSphere 的全球影响力和开放精神。

### 关键项目进展：

- **KubeSphere v4**： 2024 年，KubeSphere 迎来了历史性的升级，发布了基于全新可插拔架构 LuBan 的 KubeSphere v4 版本。这一架构革新不仅极大提升了平台的灵活性和扩展性，还简化了集群管理和扩展组件的开发过程。借助 LuBan 架构，KubeSphere 的插件化能力得到全面强化，用户可以根据需求自由选择和集成不同的功能组件，从而实现更高效的定制化部署和运维。

- **Fluent Operator** ：在日志管理方面，Fluent Operator继续扩展其国际影响力，成为一个全球化项目，并新增了多个插件支持。此举显著提升了日志收集和处理的灵活性和可定制性，支持更多云平台集成和数据流处理，助力企业实现更加精细的日志监控和分析。

## 社区活动与生态建设

### 社区活动：

举办了 6 场线下 Meetup 和 6 场线上直播，覆盖全国多个城市及领域，为社区成员带来了深度的技术解读和实战分享。活动内容覆盖云原生与 AI 的交汇点，进一步拓展了 KubeSphere 的技术场景应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/Kubespheremeetup2024.png)

您可以通过以下链接回顾每场活动：

- [杭州站 Meetup](https://kubesphere.io/zh/live/meetup-hangzhou-20240323/)
- [深圳站 Meetup](https://kubesphere.io/zh/live/meetup-shenzhen-20240420/)
- [北京站 Meetup](https://kubesphere.io/zh/live/meetup-beijing-20240525/)
- [上海站 Meetup](https://kubesphere.io/zh/live/meetup-shanghai-20240720/)
- [成都站 Meetup](https://kubesphere.io/zh/live/meetup-chengdu-20241123/)
- [广州站 Meetup](https://kubesphere.io/zh/live/meetup-guangzhou-20241228/)

### 社区用户委员会

2024 年，KubeSphere 用户委员会继续发挥着巨大的作用，他们在社区非常活跃，做了非常多且高质量的贡献，比如组织活动、分享经验等等。

在此，照例感谢下各位站长，他们在社区做出了大量贡献，他们积极的布道，发展用户委员会和社区：
- 上海站站长张海立
- 杭州站站长尹珉
- 成都站站长周正军
- 广州站站长裴振飞
- 深圳站站长徐鹏

### 2024 年度社区贡献者

2024 年共诞生了 67 位新的 KubeSphere Contributor，他们在 GitHub 提交了至少一个 PR，或在社区通过文章形式分享过 KubeSphere 实践经验，在此代表社区表示由衷的感谢。

以下为 2024 年度 KubeSphere Contributor 的 GitHub ID 或名字（排名不分先后）：

|  | |||
| ---- | ---- |----|----|
|isemichastnov|shawn0915|ClearSeve|JiaweiGithub|
|UgurcanAkkok|everpcpc|zliang90|fangzhong|
|markusthoemmes|dennis-ge|mohamed-rafraf|wenwutang1|
|icy|lukasboettcher|sarathchandra24|baikjy0215|
|opp-svega|bluezd|Cajga|aido93|
|onecer|jeff303|nitintecg|MarkusFreitag|
|Spinestars|fschlager|jihoon-seo|knowmost|
|will4j|bzd111|lansaloni|nickytd|
|reegnz|smallc2009|SvenThies|bakervos|
|localleon|mritunjaysharma394|zmw85|raynay-r|
|rayzhou4|jiuxia211|yildizozan|developer-guy|
|dex4er|rmvangun|thomasgouveia|Athishpranav2003|
|LKummer|RajatPorwal5|havardelnan|jk-mob|
|dbbDylan|yq-wu|Qi-ming-Zhang|Leioy|
|donniean|lingbohome|Hiiirad|ROOMrepair|
|btalakola|os14|xLexih|yilmazo|
|bestpala|hiyongliz|redscholar||



### 合作生态：

2024 年，我们进一步拓展了合作伙伴网络，深化了与开源社区和机构的合作，基于 LuBan 架构累计开发了 40 余款扩展组件，推动了生态的多样性与开放性。衷心感谢所有合作伙伴的支持与信任。
![](https://pek3b.qingstor.com/kubesphere-community/images/2024-kubesphere-partner.png)

如果您希望与 KubeSphere 深度合作，成为 KubeSphere 的合作伙伴，欢迎您与我们取得联系。具体请参考：[欢迎加入 KubeSphere 社区合作伙伴阵容！](https://kubesphere.io/zh/news/kubesphere-partner/)。


## 社区关注度情况


![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-media-numbers-2024.png)

> 注：以上数据为 2024 年 12 月 31 日数据。

## 未来展望

展望 2025 年，KubeSphere 社区将继续推动以下几个方向：

- 加强生态建设：依托 LuBan 架构，为更多合作伙伴赋能，支持更多场景化解决方案的实现。
- 社区发展：持续吸引全球贡献者，提升用户参与感和协作效率。
- 技术突破：在边缘计算、AI 和跨集群管理等领域深耕，打造云原生全景解决方案。

感谢每一位参与到 KubeSphere 社区中的成员，是你们的努力让这一年如此充实和辉煌。期待 2025 年与大家携手同行，共创更美好的云原生未来！

