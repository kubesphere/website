---
title: 云原生数据工厂——中海庭数字化转型之路
description: 本次分享将会介绍中海庭在业务上引入以及实践云原生技术的过程，作为实例会讲解 Argo 结合 KubeSphere 在数据处理上的应用实践。
keywords: KubeSphere, Kubernetes, 云原生数字化转型, Argo
css: scss/live-detail.scss

section1:
  snapshot: 
  videoUrl: //player.bilibili.com/player.html?aid=342603831&bvid=BV1f94y127E1&cid=748763288&page=1&high_quality=1
  type: iframe
  time: 2022-06-16 20:00-21:00
  timeIcon: /images/live/clock.svg
  base: 线上
  baseIcon: /images/live/base.svg
---
## 分享内容简介

本次分享将会介绍中海庭在业务上引入以及实践云原生技术的过程，作为实例会讲解 Argo 结合 KubeSphere 在数据处理上的应用实践。

## 讲师简介

郭杨斌，中海庭云端平台科室经理，原东风畅行斑马快跑架构负责人。

许维明，中海庭云端平台架构师，原 IBM DevOps 架构师。

## 分享大纲

![](https://pek3b.qingstor.com/kubesphere-community/images/headingdata0616-live.png)

## 直播时间

2022 年 06 月 16 日 20:00-21:00

## 直播地址

B 站  http://live.bilibili.com/22580654

## PPT 下载

可扫描官网底部二维码，关注 「KubeSphere云原生」公众号，后台回复 `20220616` 即可下载 PPT。

## Q & A

### Q1：大数据调度系统选型有哪些？比如 DolphinScheduler/Airflow，Oozie，Kettle 之类的。他们各自优势有哪些？我想做一个能够支持实时数据、离线数据依赖调度、数据血缘关系、数据映射同步、在线开发编辑等集大成的系统。对应这些功能点应该选择哪些开源系统？

A：简单的做个对比。


| 工作流引擎 | 优势 | 不足 |
| -------- | -------- | -------- |
| airflow     | 老牌任务管理、调度、监控     | 语言强绑定，Python 依赖    |
|K8s native workflow|简单直接|灵活度不够|
|Apache Dolphin Scheduler|界面友好，任务定制简单| API 不太友好，模板编排不太灵活|
|Argo Workflow|容器编排灵活、模板编排支持模块化、与云原生结合紧密|目前还在快速迭代中，用于生产有一定的风险，中文资料不足|

### Q2：Argo 最佳实战的 simple 地址麻烦老师给一下
A：这个是官方的例子集合涵盖了绝大部份的应用场景： https://github.com/argoproj/argo-workflows/tree/master/examples。

这个是我个人的 Argo 工作流使用例子集合，目前包括了 dag 流程，暂停/恢复流程，并行流程，串行流程，循环流程，递归循环嵌套流程： https://github.com/xwm111/argodemo。