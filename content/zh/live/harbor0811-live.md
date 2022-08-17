---
title: 基于 Harbor 为云原生系统打造企业级高可用镜像仓库
description: 本次分享以业界最为广泛的 Harbor 为基础，介绍 Harbor 特性及如何建设一个企业级高可用镜像仓库。
keywords: KubeSphere, Kubernetes, Harbo, 镜像仓库
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=429491136&bvid=BV1yG411t7uV&cid=801075498&page=1&high_quality=1
  type: iframe
  time: 2022-08-11 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

镜像仓库作为云原生系统的重要环节，直接影响到业务交付的效率。如何高效地管理和分发镜像，一直是众多企业需要考虑的问题。镜像仓库是否稳定直接影响客户的体验。

企业可根据现有条件，构建适合自己的镜像仓库，镜像仓库已然成为企业关注的重点。本次分享以业界最为广泛的 Harbor 为基础，介绍 Harbor 特性及如何建设一个企业级高可用镜像仓库。

## 讲师简介

仝鑫淼，青云科技容器顾问，云原生爱好者，12 年工作经验，熟悉云原生、微服务。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/harbor0811-live.png)

## 直播时间

2022 年 08 月 11 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220811` 即可下载 PPT。

## Q & A

### 1. Harbor 能在 KubeSphere 上使用吗？ 有对接途径吗？

答：Harbor 可以在 KubeSphere 上使用，对接方式：进入所在项目，选择“配置”－“保密字典”－字典类型选择“镜像服务信息”，输入镜像服务地址和账号信息。

### 2. 高可用方式详细部署文档能分享下吗？

答： https://docs.qq.com/doc/DTkVWWGd4RmptVU9l

### 3. 这样搭建，数据库是单点？请求 vip,还是有性能瓶颈。

答：实验 Demo 是高可用的最小方式实现，可以把数据库搭建为高可用形式。

### 4. Harbor 的扫描漏洞功能 如果是离线环境情况下可以用吗？

答：离线方式也支持镜像扫描。

### 5. 后端存储选啥好？

答：公有云上可使用云存储如：AWS s3、私有云可使用 Ceph、NAS 等高可用存储。

### 6. Harbor 的项目如果设置成私有的， 能够用 admin 用户使用吗？还是需要新建一个账号？因为涉及到权限认证可能通过不了。

答：可以使用 admin 用户。

### 7. Harbor 有两个版本 v1.10 还有 v2.5，有什么区别吗？

答：
- 增加了漏洞的修复；
- 镜像签名机制；
- 数据库由 MySQL 改为 PostgreSQL。

### 8. 什么时候支持双栈网络？

答：Harbor 2.2.0 以后开始支持双栈网络。
