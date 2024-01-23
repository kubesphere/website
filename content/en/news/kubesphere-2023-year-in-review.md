---
title: '2023 Annual Review of Kubesphere Community'
tag: 'Community News'
keywords: 'KubeSphere, Kubernetes, Community, Cloud Native'
description: 'As we bid farewell to 2023, let's reflect on the developments within the KubeSphere open-source community throughout the year. '
createTime: '2024-01-18'
author: 'KubeSphere Community'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/2023-kubesphere-community-review-en-cover.png'
---

As we bid farewell to 2023, let's reflect on the developments within the KubeSphere open-source community throughout the year. This article serves as a heartfelt appreciation to all the contributors who dedicated their efforts to the KubeSphere community in 2023. Check it out to see if your name is among those recognized!

## Developments of KubeSphere Projects

In 2023, with the participation of contributors from China and international communities, KubeSphere and the open-source projects derived from the KubeSphere community have made steady and active progress. All the contributors are appreciated!

| Projects | Released Versions | New Features |
| -------- | -------- | -------- |
| KubeSphere     | 3      | Supported more versions of Kubernetes, with stable support to v1.26;<br/>Restructured the alerting policy architecture, decoupling it into alerts and rule groups;<br/>Improved the display weight of cluster aliases, reducing management issues caused by unchangeable cluster names. |
| KubeKey     | 11    | Kubeadm configuration updated to v1beta3, supporting the deployment of K8s v1.27+;<br/>Support for deploying Hybrident network plugin;<br/> Support for customizing cluster DNS parameters;<br/> Support for customizing cluster Etcd parameters.|
| OpenFunction     | 4     | Integration of WasmEdge, providing support for Wasm functions and a more comprehensive CI/CD;<br/>Addition of v1beta2 API, enabling Dapr state management;<br/>Integration of KEDA http-addon as a runtime for synchronous functions;<br/>Support for adding environment variables when enabling SkyWalking tracing.  |
| Fluent Operator    | 9     |    Support for deploying FluentBit as a StatefulSet;<br/> Fluentd CRD provides custom plugin types;<br/> Provide namespace-level permissions for FluentBit daemonset;<br/>Addition of multiple plugins (such as Datadog, S3, nginx plugins, etc.);<br/>Improved helm chart to provide more customizable settings for installation;<br/>Support for deploying Fluentd as a DaemonSet;<br/>Addition of parameters to disable unused controllers.|

It is worth noting that Fluent Operator has become a global project, with the majority of its contributors coming from overseas. It is gaining popularity and influence.

## Partners

At the end of 2022, we reorganized the types and benefits of KubeSphere partners. In 2023, we had more new partners to enrich the application ecosystem. Let's express our deepest appreciation to all of our partners!

In 2023, we have established or maintained partnerships with the following open-source communities/organizations (in no particular order):

![](https://pek3b.qingstor.com/kubesphere-community/images/2023-kubesphere-partner-en.png)

It is worth mentioning that in August 2023, KubeSphere LuBan, a cloud-native extensible architecture, was officially released. It enables seamless plug-and-play integration of third-party applications with cloud-native ecosystem components. As of now, we have released [six extensions](https://kubesphere.com.cn/extensions/) based on the KubeSphere LuBan architecture. Welcome more cloud-native software vendors, open-source communities, and developers to join the KubeSphere extension ecosystem and provide users with diverse and personalized extensions.

## Contributors

### 2023 KubeSphere Ambassadors

In 2023, the community launched the KubeSphere Ambassadorship Program, opening it for the first time to global contributors. After a thorough evaluation process, we selected 14 KubeSphere Ambassadors for the year 2023.

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

The selected KubeSphere Ambassadors serve a one-year term (September 20, 2023 - September 21, 2024), and new elections will be held at the same time in 2024. We aim to foster a more open community through the Ambassadorship Program.

### 2023 KubeSphere Contributors

In 2023, a total of 112 new KubeSphere Contributors emerged. They have either submitted at least one pull request on GitHub or shared their practical experiences with KubeSphere through  articles in the community.

Here are the GitHub IDs or names of the 2023 KubeSphere Contributors (in no particular order):

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


### 2023 KubeSphere Members

In 2023, one new KubeSphere Member, [zaunist](https://github.com/zaunist), joined. He actively participated in [contributions](https://github.com/kubesphere/community/issues/420), independently completing feature development, documentation writing, and testing in the community.

The community welcomes more contributors to advance to members. If you have made at least one significant PR or completed the development of one or more features for a specific SIG repository within six months, you can [submit an issue on GitHub](https://github.com/kubesphere/community/issues) to apply to be a member.

In 2023, the community awarded certificates to the new contributors joined in 2023 through the bi-weekly community newsletter and updated these certificates in [the forum's certificate wall](https://ask.kubesphere.io/forum/d/9280-kubesphere). This post also includes certificates for KubeSphere Ambassadors and KubeSphere Members.

KubeSphere community expresses its gratitude to the 2023 KubeSphere Members, KubeSphere Ambassadors, and KubeSphere Contributors. Welcome more community members to participate in contributions and collaborate in building the open-source ecosystem.

## Community Influence

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-media-numbers-2023-en.png)

> Note: The data above is as of December 31, 2022.

## Conclusion

In 2023, the KubeSphere community continued to grow steadily, thanks to the active participation and contributions of each community member. We would like to express our sincere gratitude to all members.

In 2024, the KubeSphere community will maintain its current development pace, ensuring quality in terms of content, activities, products, and more. Welcome more individuals to join and participate in the community.