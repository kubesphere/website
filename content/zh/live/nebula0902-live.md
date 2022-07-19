---
title: Kubernetes 上的图数据库
description: 本次分享将介绍 K8s 上的图数据库 Nebula Graph(NG) 的演进、实现，解谜图数据库的知识与应用，NG 2.5.0 新版简介，最后带大家上手 NG 在 K8s 上的部署与在此之上的图数据库应用场景实操。
keywords: KubeSphere, Kubernetes, 图数据库, 微服务, Nebula Graph
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=590352950&bvid=BV1tq4y1Z7yA&cid=401911106&page=1&high_quality=1
  type: iframe
  time: 2021-09-02 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享将介绍 K8s 上的图数据库 Nebula Graph(NG) 的演进、实现，解谜图数据库的知识与应用，NG 2.5.0 新版简介，最后带大家上手 NG 在 K8s 上的部署与在此之上的图数据库应用场景实操。

## 讲师简介

古思为，VEsoft inc.（欧若数网）开发者布道师

个人简介：
Nebula Graph 开发者布道师，开源信徒，软件工程师，前 Ericsson IaaS 产品 System Manager/ OpenStack Downstream Developer。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/nebula0902-live.png)

## 直播时间

2021 年 09 月 02 日晚 8:00-9:00

## 直播地址

B 站  https://live.bilibili.com/22580654


## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20210902` 即可下载 PPT。

## Q & A

### Q1：Nebula Graph 怎样在 KubeSphere 界面上部署，有没有教程？

A：

感谢您的问题，这次分享我只做了一个命令行一行在 KubeSphere 拉起来 Nebula 的工具，我们确实还没有在界面上操作部署过，这个我们之后会找机分享，应该不会很难。

另外，听 KubeSphere 社区经理周鹏飞提到，KubeSphere 社区后续会把 Nebula 集成到 KubeSphere 的应用商店里，这样的话会更容易部署的。


### Q2：Nebula 有没有 Prometheus Exporter? 如果要通过 Grafana 或者 KubeSphere 自定义监控面板来监控 Nebula 怎样做？

A：

有的，开源的在[这里](https://github.com/vesoft-inc/nebula-stats-exporter)， 另外我们的压测工具的 [repo](https://github.com/vesoft-inc/nebula-bench/tree/master/third) 里也有可以参考的现成 dashboard 可以用。

除此之外，[dashboard](https://docs.nebula-graph.com.cn/2.5.0/nebula-dashboard/1.what-is-dashboard/) 也可以用来一站式部署监控集群。

 
### Q3：Nebula 有没有做成 helm chart? 可否直接安装体验？我刚才安装的时候挂了。
![](https://pek3b.qingstor.com/kubesphere-community/images/image-0902.png)

A：

有的，我们的 operator 就是基于 helm chart 分发的，请参考[这里](https://github.com/vesoft-inc/nebula-operator)。

从您发的错误信息看，报错是因为 operator 依赖的 cert-manager 没安装，如 [guide](https://github.com/vesoft-inc/nebula-operator/blob/master/doc/user/install_guide.md) 里提及，，几个必须的依赖需要先安装，否则一些 CRD 没法识别。

这里安利一下我写的 [nebula-operator-KIND](https://github.com/wey-gu/nebula-operator-kind)，可以一键把所有需要的东西部署在一个 K8s in Docker 内部。

