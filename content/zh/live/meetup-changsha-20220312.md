---
title: 云原生 Meetup 长沙站
description: 云原生 Meetup 长沙站，来自 WasmEdge 社区、提灯医疗、中电信数智科技、阿里云及中移金科的技术大牛和嘉宾，围绕“WebAssembly、Rust、微服务治理、Serverless、多云和多集群”等话题进行了精彩分享。
keywords: KubeSphere,Meetup,ChangSha,Serverless,WebAssembly,Rust,OpenFunction,微服务
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: 
  type: iframe
  time: 2022-03-12 14:00-18:00
  timeIcon: /images/live/clock.svg
  base: 长沙市岳麓区军民融合产业园 2 栋 2 层 + 线上同步直播
  baseIcon: /images/live/base.svg
---
![](https://pek3b.qingstor.com/kubesphere-community/images/meetup-changsha-group.jpg)

<center>3 月 12 日</center>

<center>由 KubeSphere 社区和 CSDN 联合主办的</center>

<center>云原生 Meetup 长沙站</center>

<center>取得圆满成功 🎉🎉🎉</center>

<center>围绕“WebAssembly、Rust、微服务治理、Serverless、多云和多集群”等话题</center>

<center>来自 WasmEdge 社区、提灯医疗、中电信数智科技、阿里云及中移金科的技术大牛和嘉宾</center>

<center>带来了新的实践和思考</center>

<center>一起来看看</center>

<center>↓</center>

## 云原生 WebAssembly 与 K8s

讲师： Michael Yuan

个人介绍：WasmEdge Maintainer / Second State CEO

演讲概要：Docker 创始人曾经说过，如果在 2008 年有了 Wasm，那就没有必要创建 Docker 了。Wasm 在云原生中就是这么重要。WebAssembly 作为新一代软件容器，具有轻量级、高性能、安全的特点，能够很好地弥补 Linux 容器的缺陷，受到了越来越多的关注。在这个演讲中，Michael 将介绍云原生 WebAssembly 的应用场景以及如何使用现有容器工具 K8s 管理 WebAssembly 应用，使 WebAssembly 应用与 Linux 容器肩并肩运行，构建轻量级的云原生架构。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=767293765&bvid=BV1Xr4y1B7T9&cid=550056693&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 从 Java 到 Rust，提灯医疗在云原生时代的编程语言演化

讲师：谭宗威

个人介绍：提灯医疗，CEO

演讲概要：提灯医疗从 2015 年用 Spring Cloud 作为微服务开发框架、采用 DockerCompose 作为部署方案。到 2019 年简化到采用 SpringBoot 作为微服务开发框架、采用 KubeSphere 作为部署方案。从 2021 年下半年开始探索基于 OpenFunction 的 Serverless 方案。一直以来，我们都采用 Java 作为后端的主力开发语言，少量边缘业务场景采用 Node.js 来开发。Java 生态丰富，但所开发的微服务存在以下几个问题：

- 存在“世界暂停”的问题；
- 占用内存大；
- 程序初始化时间长；

因为存在以上问题，如果采用 Java 来开发 Serverless（OpenFunction）函数的话代价过高。因此，我们重新思考了在 Serverless 时代什么样的开发语言才是最合适的开发语言，我们比较了 Node.js、Go、Rust 等方案，最后确定了采用 Rust 来作为我们 Serverless 的开发语言，目前已经完成了基于 Rust 的基础框架的开发，做到了与现有的 Java 微服务可以共存。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=937346476&bvid=BV1zT4y1U7yf&cid=550067168&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 云原生环境下微服务治理应用实践

讲师：唐波涛

个人介绍：中电信数智科技湖南分公司，运维组长

演讲概要：集群镜像把整个集群看成一台服务器，把 K8s 看成云操作系统，实现整个集群的镜像化打包和交付，为企业级软件提供一种“开箱即用”的应用封装技术。以行业 ISV 为例，集群镜像帮助企业解决了分布式软件的部署一致性难题、降低了交付出错率，最终指数级降低分布式软件的交付成本。受 Docker 等容器技术的启发，集群镜像将单机应用封装技术，上升到分布式集群维度，最终实现分布式软件的高效交付（build, share, run)。

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=254758310&bvid=BV18Y41137C2&cid=550076305&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## Serverless 在函数计算 FC 的实践

讲师：袁坤

个人介绍：阿里云 aPaaS & Serverless 前端技术专家

演讲概要：

- 梳理软件架构的演进历程，展望 Serverless 技术趋势
- 剖析 Serverless 架构目前存在问题，提出解决方案
- 解构 Serverless 架构真实应用案例，探讨落地应用

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=894751967&bvid=BV1CP4y1M7ad&cid=550078437&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 生产化集群的 Day2 运营思考

讲师：郭至为

个人介绍：中移金科，容器云平台架构师

演讲概要：

- 介绍 Day2 运营的意义
- K8s 平台的生产化路径
- 基础设施运营中的一些思考

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=339768625&bvid=BV1uR4y1F79m&cid=550080991&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

> 云原生 Meetup 长沙站圆满收官！可扫描官网底部二维码关注 「KubeSphere云原生」 公众号，后台回复 “云原生长沙0312” 获取下载链接。
