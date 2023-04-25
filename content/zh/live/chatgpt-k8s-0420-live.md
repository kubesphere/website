---
title: 利用 ChatGPT 检测 K8s 安全与合规性
description: 本次直播分享将探讨 K8s 安全与合规性的检测，并介绍如何利用 ChatGPT 使用自然语言实现 K8s 风险智能识别。
keywords: KubeSphere, Kubernetes, ChatGPT, 安全
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=867813267&bvid=BV1HV4y1o7QZ&cid=1103526234&page=1&high_quality=1
  type: iframe
  time: 2023-04-20 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次直播分享将探讨 K8s 安全与合规性的检测，并介绍如何利用 ChatGPT 使用自然语言实现 K8s 风险智能识别。

## 讲师简介

刘对，Selefra 云安全研究员，T Wiki 云安全开源知识库作者，CF 云环境开源利用工具作者。


## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/chatgpt-K8s-0420.png)

## 直播时间

2023 年 04 月 20 日 20:00-21:00

## 直播地址

B 站  https://live.bilibili.com/22580654


## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20230420` 即可下载 PPT。

## Q & A

### Q1：怎么做的 GPT 对接？你们内部自己做了训练集吗？

A：Selefra 会通过用户输入的 Prompt 来判断这属于哪个 Provider，然后再判断属于哪张表，最后再生成相应的 SQL 语句，Selefra 再返回这个 SQL 的执行结果。 

### Q2：目前国内使用 CIS 扫描，大多数都是国外的标准，国内有相关的合规标准吗？

A：国内专门针对 K8s 的合规标准倒没怎么听说过，都是一些比较大而泛的标准，国外的其实大部分标准也是这样的，像 CIS 那样的一项一项专门列出来的合规标准国内应该是没有的。

### Q3：能不能添加一键安装 Ceph？

A：Selefra 开源版是一个由 Go 编写的可执行文件，可以独立使用，这个问题如果可以希望能再描述的清楚些。