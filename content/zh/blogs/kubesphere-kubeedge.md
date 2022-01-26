---
title: 'KubeEdge 结合 KubeSphere 实现海量边缘节点与边缘设备管理'
tag: 'KubeSphere'
keywords: 'KubeSphere, KubeEdge, 边缘节点'
description: '深入介绍如何解决 KubeEdge 在 KubeSphere 容器平台的容器化部署集成和可观测性难题。'
createTime: '2022-01-12'
author: '朱含'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-KubeEdge-zh.png'
---

## KubeEdge 赋能 KubeSphere 边缘节点管理

KubeSphere 是在 Kubernetes 之上构建的企业级分布式多租户的容器平台，在与 KubeEdge 集成中，扮演者着“云端控制面”的角色。

下图中展示了边缘节点集成后，作为 Node 角色在 KubeSphere Console 上的展示效果，我们可以很方便的查看边缘节点容器日志和 Metrics。

![](https://pek3b.qingstor.com/kubesphere-community/images/abc3947ada0084472d3d24fb43d95741.jpg)

## 为什么选择 KubeEdge 集成边缘计算能力？

首先 KubeEdge 本身的云边枢纽和架构，具有非常出色的云原生自治能力，支持边缘自治、消息与资源的可靠性同步、边缘节点的管理能力，边缘节点的 KubeFed 是极度轻量的，可按需裁剪定制。

![](https://pek3b.qingstor.com/kubesphere-community/images/c4390108fc7f7f79447502c88cd43ed2.jpg)

除了 KubeEdge 本身架构带来的特性外，我们集成 KubeEdge 的其他原因主要有：
- KubeEdge 是最早进入 CNCF 的边缘计算项目，项目成熟度比较高且社区比较活跃；
- KubeSphere v2.1.0/v3.0.0 起，社区用户陆续提出了边缘节点自动化安装部署、监控、日志、调试等方面的需求；
- KubeEdge 逐渐对边缘节点监控、日志、调试等有了更好的支持；
- 补充 KubeEdge 边缘计算框架云端控制面。

在这样的背景下，KubeSphere 社区和 KubeEdge 社区紧密合作，从云端控制层面解决边缘节点纳管易用性和可观测性难题。KubeEdge 集成在 KubeSphere 容器平台后，可以补充 KubeSphere 的边缘计算能力，KubeSphere 则充当计算框架的一个云端控制面。

## 在集成过程中，我们也遇到了一些挑战：

- 提供快速容器化部署方案
- 实现边缘容器监控、日志依赖手动添加iptables规则，运维成本较高：`iptables -t nat -A OUTPUT -p tcp --dport 10350 -j DNAT --to cloudcore ip:10003`
- 提供边缘节点辅助验证服务
- 边缘测部署配置项较多，希望一条脚本解决边缘节点加入云端组件

以上描述低版本的版本的场景，高版本的场景有所变化。

## 集成方案
- 方案：云端组件容器化部署、边缘节点 Binary 部署
- 集成 Helm 安装云端组件，包括 cloudcore 和 edge-watcher controller 组件
- edge-watcher controller 组件: 边缘节点验证、Join 脚本生成服务以及 iptables-manager 自动运维能力
- 给边缘节点部署 keadm 工具添加额外自定义参数、添加国内下载源

目前 KubeSphere 支持的 KubeEdge 版本有 v1.5.1/1.6.1/1.6.2/1.7.2，支持的 Linux 系统 ubuntu/centos 等, cpu 架构类型：amd64（x86_64）/arm64。

## KubeSphere 容器平台如何激活云端组件

- 确保在 K8s 集群上安装了 KubeSphere 云控制面板和 ks-installer 安装工具，也可以使用 KubeKey 来直接创建 K8s 集群和 KubeSphere 套件
- 确保激活了 metrics-server 组件
- 按照文档进行安装集成
- 另外还需要开放一些端口

![](https://pek3b.qingstor.com/kubesphere-community/images/fc5588db24a5fb530fdfd3e88884d4d7.jpg)

### 添加边缘节点主要有两种集成方式：
- 如果边缘节点与 K8s 集群不在一个局域网，云端相应端口 10000 ~ 10004 允许防火墙通过，映射到NodePort 30000~30004;
- 如果边缘节点与 K8s 集群局域网内可达边缘节点，则直接使用 30000~30004 NodePort 方式集成；
- 此外，需要激活 edgemesh 云边网络工具

![](https://pek3b.qingstor.com/kubesphere-community/images/966f6a6a1e565e5a332ef0a3adadd0c1.jpg)

### KubeEdge 单 cloudcore 下可观测链路转发：
apiserver/metrics-server 通过 edge vip: 10351 进而转发给 Stream server | Tunnel server，最后会下发到边缘获取日志或者 Metrics 数据；

![](https://pek3b.qingstor.com/kubesphere-community/images/f4cfd7ba969514edebcc97f6b46b24d8.jpg)

### 集成工作与可观测性- edge-watcher controller

![](https://pek3b.qingstor.com/kubesphere-community/images/b58a16f430619838c8cbcd03487ab61e.jpg)

controller 定义了两个 CRD：
- iptables 作为 controller 的申明式 CRD，定义了控制器用于调谐的目标 iptables daemonset agent 的一些属性，如镜像，节点亲和性等；
- iptablesrules 作为用户期望的 iptables 规则，会被 iptable daemonset watch，用于保证期望 iptables 规则生成，实现自动化运维；

> 注意：KubeEdge > 1.8 之后已经支持相同功能，后续集成会考虑弃用该组件，因为 KubeEdge 实现的 iptables manager 组件更加轻量；

### 集成工作与可观测性 - 边缘容器日志获取

![](https://pek3b.qingstor.com/kubesphere-community/images/0ad205fc6fe606742005f83c7d2a6357.jpg)

在 UI 上的界面，在我们 KubeSphere 里面的界面大概如上图，这是边缘容器的一个日志，我们可以开启实施 debug 功能。

## 应用案例：中移物联网边缘计算平台

![](https://pek3b.qingstor.com/kubesphere-community/images/6dd456ed8fbe8f1789b1784e0deb13df.jpg)

此案例来自中移物联网何毓川老师，分享了使用 KubeSphere + KubeEdge 来构建中移物联网边缘计算平台，中移物联网计划基于以上的集成和可观测方案，预期在每一个 KubeSphere 容器平台上，边缘节点接入量期望在1k左右。

视频播放地址： https://kubesphere.com.cn/live/edgebox-cic/

## 可观测性展望
1. 目前的可观测数据主要通过 metrics-server 来获取，是实时数据，无法长期保存；
2. 为解决边缘场景长期存储的问题提供最佳实践，例如，grafana/agent + cortex 或者 opentelemetry-collector + thanos 等套件, 利用 Remote Write 和 Object Storage 进行长期存储；
3. 一起建设更好的 KubeEdge 社区：
   - Edge Runtime Service，用于辅助边缘场景中健康检查、节点合法性验证、收集重要 events 甚至生命周期监测等的 sidecar ；
   - KubeEdge 开发者接口, 类似 client-go，不限于 go 语言；
