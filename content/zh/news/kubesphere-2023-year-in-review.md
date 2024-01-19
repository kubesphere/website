---
title: 'KubeSphere 开源社区 2023 年度回顾与致谢'
tag: '社区动态'
keywords: 'KubeSphere, Kubernetes, Community, 云原生, OpenFunction, Fluent Operator '
description: '2023 年结束了，让我们再一次一起回顾一下 KubeSphere 开源社区在过去一年的变化。'
createTime: '2024-01-18'
author: 'KubeSphere 社区'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/2023-kubesphere-year-in-review.png'
---

2023 年结束了，让我们再一次一起回顾一下 KubeSphere 开源社区在过去一年的变化。更重要的是，本篇文章将会对 2023 年所有参与过 KubeSphere 社区贡献的成员致以最诚挚的感谢，快来看看有没有你！

## 开源项目发展情况

2023 年，在国内外社区贡献者的参与下，KubeSphere 及 KubeSphere 社区衍生出的其他开源项目得以稳定且活跃的前进。感谢各位贡献者！

| 开源项目 | 正式发版 | 新增重要功能 |
| -------- | -------- | -------- |
| KubeSphere     | 3 个     | 扩大对 K8s 的支持范围，最新稳定性支持 v1.26；<br/>重构告警策略架构，解耦为告警规则与规则组；<br/>提升集群别名展示权重，减少原集群名称不可修改导致的管理问题。 |
| KubeKey     | 11 个    | Kubeadm 配置更新至 v1beta3，支持部署 K8s v1.27+；<br/>支持部署 Hybrident 网络查件；<br/> 支持自定义配置集群 DNS 参数；<br/> 支持自定义配置集群 Etcd 参数。|
| OpenFunction     | 4 个     | 集成 WasmEdge，支持 Wasm 函数和更完整的 CI/CD；<br/>新增 v1beta2 API，支持 Dapr 状态管理；<br/>集成 KEDA http-addon 作为同步函数运行时；<br/>支持在启用 SkyWalking 跟踪时添加环境变量。  |
| Fluent Operator    | 9 个     |    支持 FluentBit 部署为 StatefulSet；<br/> Fluentd CRD 提供自定义插件类型；<br/> 为 FluentBit daemonset 提供 namespace 级别的权限；<br/>添加多个插件（如 Datadog、S3、nginx 插件等）；<br/>完善helm，提供更多自定义设置完成安装；<br/>支持以 DaemonSet 的方式部署 Fluentd；<br/>添加禁用未使用 controller 的参数；<br/>支持以 StatefulSet 的形式部署 FluentBit。|

需要特别指出的是，Fluent Operator 已经是一个全球化的项目，其贡献者大部分来自海外，越来越受欢迎和具有影响力。

## 合作伙伴与应用生态

2022 年年末，我们重新梳理了 KubeSphere 合作伙伴的类型与权益说明。在 2023 年，我们也新增了合作伙伴，丰富了应用生态。在此，向所有的合作伙伴致以最诚挚的谢意！

2023 年，我们与以下开源社区/机构建立或保持了合作关系（顺序不分先后）：

![](https://pek3b.qingstor.com/kubesphere-community/images/2023-kubesphere-partner.png)

如果您希望与 KubeSphere 深度合作，成为 KubeSphere 的合作伙伴，欢迎您与我们取得联系。具体请参考：[欢迎加入 KubeSphere 社区合作伙伴阵容！](https://kubesphere.io/zh/news/kubesphere-partner/)。

> 值得一提的是，2023 年 8月，KubeSphere LuBan 云原生可扩展架构正式发布，可以非常方便地使第三方应用与云原生生态组件进行即插即用（plug-and-play）的集成。截止目前，我们已发布了基于 KubeSphere Luban 架构开发的 [6 款扩展组件](https://kubesphere.com.cn/extensions/)，欢迎更多的云原生软件开发商、开源社区和开发者加入 KubeSphere 扩展组件生态，为用户提供多样化和个性化的场景拓展。

## 社区活动

2023 年，KubeSphere 社区组织了 6 场线下 Meetup，6 场线上云原生直播活动，分享了云原生领域的多个方向的实践经验、技术解读等等，为 KubeSphere 社区用户持续赋能，此外也紧跟 AI 时代的大潮，在 AI 领域进行了一点探索，分享了多个 AI 相关的内容。

您可以通过以下链接回顾每场活动：
- [深圳站 Meetup](https://kubesphere.io/zh/live/meetup-shenzhen-20230408/)
- [杭州站 Meetup](https://kubesphere.io/zh/live/meetup-hangzhou-20230603/)
- [上海站 Meetup](https://kubesphere.io/zh/live/meetup-shanghai-20230805/)
- [成都站 Meetup](https://kubesphere.io/zh/live/meetup-chengdu-20231104/)
- [广州站 Meetup](https://kubesphere.io/zh/live/meetup-guangzhou-20231125/)
- [苏州站 Meetup](https://kubesphere.io/zh/live/meetup-suzhou-20231223/)
- [云原生直播](https://kubesphere.io/zh/live/)

再次感谢在这些活动中做出贡献的讲师、社区委员会成员、志愿者以及合作伙伴，大家的齐心协力，促使了活动的成功组织及内容输出。

## 年度用户落地实践案例

20232 年又有十多家企业在社区发布了实践案例，帮助其他社区用户落地 KubeSphere 和云原生技术：
- [蜘点云原生之 KubeSphere 落地实践过程](https://kubesphere.io/zh/blogs/best-practices-of-kubesphere-in-zhidian/)
- [花生好车基于 KubeSphere 的微服务架构实践](https://kubesphere.io/zh/case/hshc/)
- [微宏科技基于 KubeSphere 的微服务架构实践](https://kubesphere.io/zh/case/alphaflow/)
- [KubeSphere 在互联网医疗行业的应用实践](https://kubesphere.io/zh/blogs/kubesphere-practice-of-internet-healthcare-industry/)
- [某物联网数智化园区行业基于 KubeSphere 的云原生实践](https://kubesphere.io/zh/blogs/kubesphere-practice-iot-dici/)
- [基于 KubeSphere 的应用容器化在智能网联汽车领域的实践](https://kubesphere.io/zh/blogs/kubesphere-best-practices-in-smart-connected-vehicles/)
- [某制造企业基于 KubeSphere 的云原生落地实践](https://kubesphere.io/zh/blogs/best-practice-kubesphere-a-manufacturing-company/)
- [东方通信基于 KubeSphere 的云计算落地经验](https://kubesphere.io/zh/case/eastcom/)
- [文鼎创智能物联云原生容器化平台实践](https://kubesphere.io/zh/case/excelsecu/)
- [KubeSphere 助力提升研发效能的应用实践分享](https://kubesphere.io/zh/blogs/best-practices-kubesphere-assist-in-improving-the-efficiency-of-rd/)
- [无锡广电新媒体云原生容器化平台实践](https://kubesphere.io/zh/case/wuxitv/)
- [T3 出行云原生容器化平台实践](https://kubesphere.io/zh/blogs/t3-kubesphere-best-practice/)
- [好上好信息 API 微服务集群在 KubeSphere 的部署实践](https://kubesphere.io/zh/case/bobinfo/)
- [技研智联云原生容器化平台实践](https://kubesphere.io/zh/case/keyenlinx/)
- [怡合达业务大规模容器化最佳实践](https://kubesphere.io/zh/case/yiheda/)

在此十分感谢以上各位社区用户慷慨的贡献自己的实践经验，帮助其他用户成长。

社区也非常欢迎各大企业或组织向 KubeSphere 社区提交自己的实践案例。详情参考：[快来投稿吧！KubeSphere 社区征稿活动开启啦！](https://mp.weixin.qq.com/s/QZXEyxFubDMUQvY0kbZdcA)。

## 2023 年度 KubeSphere 贡献者

### 2023 年度 KubeSphere Ambassador

2023 年，社区发起了一个 KubeSphere 大使计划（KubeSphere Ambassadorship Program），首次向全球的贡献者公开征集。最终，我们通过评估选出了 2023 年的 14 位 KubeSphere Ambassador：

* Onur Canoğlu
* Rossana Suarez
* Jona Apelbaum
* Nilo Yucra Gavilan
* Halil BUGOL
* Eda Konyar
* İremnur Önder
* Harun Eren SAT
* Min Yin
* Kevin Xu
* Haili Zhang
* Zhengjun Zhou
* Zhenfei Pei
* Jianlin Zheng

此次评选出的 KubeSphere Ambassador 任期为一年（2023.9.20-2024.9.21），新的选举可在明年同期举行。我们希望通过大使计划营造一个更加开放的社区环境。

### 2023 年度 KubeSphere Talented Speaker

2023 年共有 44 位 KubeSphere Talented Speaker 参与了 KubeSphere 组织或参与的技术交流分享活动，分享了 KubeSphere 及其他云原生技术的理论知识或实践经验，此外还有部分讲师分享了 AI 方向的内容。

![](https://pek3b.qingstor.com/kubesphere-community/images/2023-ks-all-talented-speaker.png)

所有的分享内容（视频或文字）均已更新到 KubeSphere 官网，欢迎大家回顾：
- https://kubesphere.io/zh/live/
- https://kubesphere.io/zh/conferences/

### 2023 年度 KubeSphere Contributor

2023 年共诞生了 112 位新的 KubeSphere Contributor，他们在 GitHub 提交了至少一个 PR，或在社区通过文章形式分享过 KubeSphere 实践经验。

以下为 2023 年度 KubeSphere Contributor 的 GitHub ID 或名字（排名不分先后）：

|  | |||
| ---- | ---- |----|----|
|fm2022aa|zhengzehong331|NeonSludge|antrema|
|dundun9|fengshunli|lwabish|qyz87|
|samanthacastille|yudong2015|HarleyB123|adiforluls|
|sigboom|xmsanchez|xiaoniankang|Jacklalala|
|anhoderai|ericwinn|sekfung|k8sk-kevin|
|Yong Lin|Fritzmomoto|jseutter|schuenen|
|soybean217|zhbinary|Wei Mao|ExerciseBook|
|MioOgbeni|akardes|ialidzhikov|jouve|
|nicognaW|snowgo|JorgeReus|chuan-you|
|deqingLv|jynolen|littleplus|felfa01|
|sologgfun|lucumt|JensLoe|lewis262626|
|cubxxw|duguhaotian|nemcikjan|erhudy|
|ksdpmx|littleBlackHouse|athlonreg|drzhangg|
|joshuabaird|testwill|tuoeg|gnadaban|
|gregorycuellar|kaiohenricunha|sakateka|littlejiancc|
|wongearl|Feng Zhou|Xiaobin Wu|vincent-vinf|
|yash97|Mike|ajax-bychenok-y|ikolesnikovrevizto|
|Zhenglong Zhang|BaiMeow|L1ghtman2k|Nyefan|
|Rajan-226|WaywardWizard|alexandrevilain|cuishuang|
|sjliu1|xuelangos|zhuxiujuan28|Shoufa Wang|
|Xiaobu|husnialhamdani|ic0xgkk|inksnw|
|lamadome|leonsteinhaeuser|tomsun28|win5923|
|Xiaoyu Bi|OlegVanHorst|nekomeowww|caoxianfei1|
|cw-Guo|king-119|stexandev|Hanmo123|
|JoeDerby|SongJXin|gunine|jongwooo|
|studyingwang23|Leirong Luo|Ganbingkun|MisterMX|
|Shimada666|donniean|guerzon|liuxu623|
|nyuxiao|samt42|oklizy|blackshy|


### 2023 年度 KubeSphere Member

2023 年共诞生 1 位新的 KubeSphere Member——[zaunist](https://github.com/zaunist)，他深度参与了 KubeSphere 社区[开源贡献](https://github.com/kubesphere/community/issues/420)，在社区独立完成了功能特性开发、文档撰写以及测试。

社区也欢迎更多的 contributor 能进阶为 member，如果您在半年内为特定的 SIG 代码库贡献了至少一个显著的 PR 或者完成一项或多项功能的开发，即可去 GitHub 提交 [Issue](https://github.com/kubesphere/community/issues) 来申请。

**2023 年，社区通过[社区双周报](https://ask.kubesphere.io/forum/t/ks-beweekly)给 2023 年诞生的新贡献者及讲师都颁发了证书，同时也将这些证书更新到了论坛的[证书汇总贴](https://ask.kubesphere.io/forum/d/9280-kubesphere)。当然这个帖子里也包括了 KubeSphere Ambassador 和 KubeSphere Member 的证书，欢迎大家领取。**

KubeSphere 社区向 2023 年度 KubeSphere Member、KubeSphere Ambassador、KubeSphere Talented Speaker 及 KubeSphere Contributor 致谢，也欢迎更多的社区小伙伴参与开源贡献，共建开源生态。

## 社区用户委员会发展情况

2023 年 4 月 8 日，KubeSphere 社区用户委员会深圳站成立，此后上海站与杭州站也分别有新的成员加入。

至此，KubeSphere 社区用户委员会已成立五个城市站：上海站、杭州站、成都站、广州站、深圳站。

2023 年，KubeSphere 用户委员会继续发挥着巨大的作用，他们在社区非常活跃，做了非常多且高质量的贡献，比如组织活动、输出文章、参与播客录制等等。

在此，照例感谢下各位站长，他们在社区做出了大量贡献，他们积极的布道，发展用户委员会和社区：
- 上海站站长张海立
- 杭州站站长尹珉
- 成都站站长周正军
- 广州站站长裴振飞
- 深圳站站长徐鹏

## KubeSphere 个人认证考试

2023 年 11 月 22 日，KubeSphere 个人认证考试上线。截止到 12 月 31 日，已有 200+ 用户参与。

认证考试题目来自于社区活动征集，提供者大部分为社区用户。

关于考试的具体介绍，大家可以参考这篇文章：[快来考试拿证书！KubeSphere 个人技能专业考试认证上线啦！](https://ask.kubesphere.io/forum/d/22924-kuai-lai-kao-shi-na-zheng-shu-kubesphere-ge-ren-ji-neng-zhuan-ye-kao-shi-ren-zheng-shang-xian-la)。

目前第二期考试活动正在进行中，欢迎大家参与！详情参考：[KubeSphere 管理员考试认证参与者获奖名单公布](https://ask.kubesphere.io/forum/d/23057-kubesphere-guan-li-yuan-kao-shi-ren-zheng-can-yu-zhe-huo-jiang-ming-dan-gong-bu)。

## 社区关注度情况

![](http://pek3b.qingstor.com/kubesphere-community/images/kubesphere-media-numbers-2023-1.png)

> 注：以上数据为 2023 年 12 月 31 日数据。

## 总结与展望

2023 年，KubeSphere 社区依旧在稳定发展，这得益于每一位社区成员的参与与贡献，在此向各位社区成员表示诚挚的感谢。

2024 年，KubeSphere 社区将保持目前的发展节奏，在内容、活动、产品等多个方向保质保量。我们也期待更多的小伙伴加入社区、参与社区。