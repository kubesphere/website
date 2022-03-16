---
title: 从 Java 到 Rust，提灯医疗在云原生时代的编程语言演化
description: 提灯医疗比较了 Node.js、Go、Rust 等方案，最后确定了采用 Rust 来作为 Serverless（OpenFunction） 的开发语言，目前已经完成了基于 Rust 的基础框架的开发，做到了与现有的 Java 微服务可以共存。
keywords:  KubeSphere,Kubernetes,Java,Rust,Serverless,OpenFunction
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=937346476&bvid=BV1zT4y1U7yf&cid=550067168&page=1&high_quality=1
  type: iframe
  time: 2022-03-12 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 线下 + 线上
  baseIcon: /images/live/base.svg
---

## 分享人简介

谭宗威，提灯医疗 CEO

## 分享主题介绍

提灯医疗从 2015 年用 Spring Cloud 作为微服务开发框架、采用 DockerCompose 作为部署方案。到 2019 年简化到采用 SpringBoot 作为微服务开发框架、采用 KubeSphere 作为部署方案。从 2021 年下半年开始探索基于 OpenFunction 的 Serverless 方案。一直以来，我们都采用 Java 作为后端的主力开发语言，少量边缘业务场景采用 Node.js 来开发。Java 生态丰富，但所开发的微服务存在以下几个问题：

- 存在“世界暂停”的问题；
- 占用内存大；
- 程序初始化时间长；

因为存在以上问题，如果采用 Java 来开发 Serverless（OpenFunction）函数的话代价过高。因此，我们重新思考了在 Serverless 时代什么样的开发语言才是最合适的开发语言，我们比较了 Node.js、Go、Rust 等方案，最后确定了采用 Rust 来作为我们 Serverless 的开发语言，目前已经完成了基于 Rust 的基础框架的开发，做到了与现有的 Java 微服务可以共存。

## 下载 PPT

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 “云原生长沙0312” 即可下载 PPT。
