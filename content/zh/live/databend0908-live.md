---
title: 解密云原生数仓 Databend
description: 通过和大家交流一下什么是云原生数仓及在云上开发实践降低成本的一些经验，引入云原生数仓大数据生态中的定位，最终给大家介绍一下基于 Databend 定制的 Databend Cloud 目前取得的成就。
keywords: KubeSphere, Kubernetes, Databend,  云原生数仓
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=387868825&bvid=BV1Bd4y1X75C&cid=827436170&page=1&high_quality=1
  type: iframe
  time: 2022-09-08 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

通过和大家交流一下什么是云原生数仓及在云上开发实践降低成本的一些经验，引入云原生数仓大数据生态中的定位，最终给大家介绍一下基于 Databend 定制的 Databend Cloud 目前取得的成就。希望对想做云原生数仓的一些朋友提供一些参考。

## 讲师简介

吴炳锡，Datafuse Labs 联合创始人，腾讯 TVP 成员，TGO 成员，原知数堂联合创始人。  专注 Databend 大数据分析及应用， 熟悉 MySQL 生态应用。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/databend0908-live.png)

## 直播时间

2022 年 09 月 08 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654



## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220908` 即可下载 PPT。

## Q & A 

### Q1. Databend 是新的数仓套件吗？跟阿里云的数仓有什么区别？
A：Databend 是一款针对云原生环境开发的云原生数仓。

阿里云现在的数仓，现在更多的还是一种 PaaS 理念，需要为预留资源付费，基于 Databend 构建的数仓，可以实现计算和存储都是按需付费。

### Q2：国内支持吗？
A：现在我们分两个产品：Databend 和 Databend Cloud。目前国内需要个人基于开源产品 Databend 做有私化部署。Databend 存储层现在支持 S3 接口的大多存储。例如国内可以跑在：阿里云、腾讯云、火山云、青云，最近开源社区的小伙伴给贡献了华为云的支持，私有化环境也可以使用 minio、ceph 类存储系统。Databend Cloud 近期也计划部署到国内的云平台上。

### Q3：数据清洗能界面可视化？低代码形式？
A：目前 Databend 数据清洗过程还都是基于 SQL。不过，这个方向也有比较成功的公司，例如： https://voyancehq.com/ 这家公司就基于开源 Databend 构建一个非州金融低代码大数据处理平台，把数据清洗、展示都做到了低代码。

### Q4：底层都封装好，不需要操心机器运维的吧？
A：Databend Cloud 相当于基于云上现有的资源做了封装，更利于用户的使用，无需再关心云上的资源申请和回收，也无需关心复杂网络的问题，只需关注于应用的使用就可以了。