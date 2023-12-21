---
title: '蜘点云原生之 KubeSphere 落地实践过程'
tag: 'KubeSphere, KubeSphere, 最佳实践'
keywords: 'Kubernetes, KubeSphere, 容器化, 最佳实践'
description: '通过引入 KubeSphere 中间件管理平台，极大地提交了整体的交付效率，节省在部署环节的时间支付，通过工具更好的实现了 CI/CD；提供了可视化的资源界面，能更清楚地知道各个服务器的资源使用情况，做到很好的监控。'
createTime: '2023-12-19'
author: '池晓东'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-zhidian-cover.png'
---

## 公司平台介绍

蜘点成立于 2016 年 4 月，致力于打造社区电商业务（解决最后 3 公里的配送问题）。当初通过自建直营渠道、自建仓库、自建大型社区仓、和采用加盟仓的方式，实现在社区的电商业务的发展，配送本地化。最多的时候在全国各个省都有分公司及下属子公司，在每个省都有省仓，在南北的主要城市都建有大型仓。

后面随着电商行业的落幕，公司又转型做企业数字化整体解决方案（产业互联网方向）。整体发展如下图：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-2.png)

## 平台背景介绍

公司通过购买服务器组建了一个内部云，托管在 IDC 机房中，一直使用 VMware 的虚拟化技术，来实现虚拟机的管理。随着业务增加，项目从单体架构向分布式架构演进，虚拟机数量也随着增加，给开发与运维管理来了不少问题，随着微服务技术的发展，采用容器化架构成为了解决公司底层架构的问题。

- 业务快速发展，不新增虚拟主机，环境搭建复杂，早期通过虚拟机模板解决；
- 各个项目组之间的业务调用，都是通过 HTTP 接口交互，效率不高；
- 部署靠人工编译打包上传，测试/上线，无 CI/CD，开发效率低；
- 运维压力大，运维资源缺乏，各个服务、中间件的监控不到位，虽有 Zabbix，但管理不过来，缺少统一的监控面板；
- 虚拟机的资源难以动态分配利用，资源被固定化；
- 缺少专业的运维人员，环境安装、监控不够完善，资源使用情况难可视化（运维人员就一个）；
- 前端组也想采用容器化部署，不要在本地打包，通过 FTP 上传静态文件的方式；
- 运维人员想减少虚拟机数量，新上线业务不需要创建很多虚拟机，只需要增加少量节点就可以。

## 平台选型

### 业务痛点

从前面的介绍，在从单体架向分布式架构的演变过程中，伴随着业务的快速发现，与快速响应，基础模块及业务模块越来越多，团队都忙在打包部署的过程中。

- 修 Bug 打包部署。
- 上线打包部署。
- 每次上线全团队 StayBy, 折腾至深夜。
- 效率低下，版本延迟。

### 引入 Jenkins 半自动化部署

为解决团队的效率问题，首先引入 Jenkins，通过 Jenkins 解决大部分部署问题。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-3.png)

### 引入 Kubernetes（K8s）

Jenkins 的引入，已经能很大的提高效率，但还是存在一些问题：

- 服务太多，每次部署要排队。
- 虚拟机太多，维护 Shell 脚本成本高。
- 资源利用率低，没有用到点上。

自建 K8s 集群，可以解决繁锁的 Shell 脚本问题，结合 Jenkins 的 K8s 的插件，通过 Dockerfile + yaml 的方式进行部署。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-4.png)

自建 K8s 维护痛点：

- 运维集群困难，缺乏简单方便的可视化工具，团队大多是开发人员，运维经验有限。
- 操作 K8s 都是纯脚本形式，维护比较困难，由于缺乏可视化工具，应用部署与配置修改全是依靠命令脚本手动执行。
- 还是达不到回收服务器权限的目的，排查问题还是要上 K8s，缺少资源监控与调度。

## 选择 KubeSphere 原由

在 K8s 可视化管理工具的调研过程中，发现 KubeSphere 比较适合公司，对比国外开源的 Kubernetes Dashboard、Rancher，KubeSphere 还是比较适合国内的使用。

- 可视化的 K8s 管理工具，包含了所有 K8s 的功能。
- 一体化的 DevOps，降低部署复杂度，应用生命周期。
- 多租户管理，满足不同子公司的业务隔离需求。
- 集成角色权限管理功能，满足对不同人员分配不同权限的需求。
- 在线日志查看功能，降低对服务器用户的管理。
- 集群可视化管理，监控可视化。
- 平台中的所有功能都是可插拔与松耦合，可以根据业务场景可选安装所需功能组件。

## 落地实践、效果

### 平台微服务架构部署

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-5.png)

### KubeSphere 生产环境规划与安装

生产环的配置规划是: 3 个 Master Node：8C 16G 100G 磁盘， 10+ Worker Node（初期），20+ Worker Node（后续增加）。

部署 SpringCloud 的微服务套件，包括 Eureka，Redis, 电商平台的微服务，如商品、订单、会员等。ToB 微服务，企业数字化 10+ 项目。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-6.png)

### KubeSphere 的使用规则

#### 团队及项目划分

- 按子公司及不同的端建立不同的企业空间 -- 企业空间。
- 在项目管理中按不同的业务线，建立不同的项目组合。
- 创建的用户，按 platform-regular 的角色。
- 在企业空间、项目管理、流水线中添加成员。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-7.png)

#### 节点管理及部署

- 节点标签，为每个节点配置标签，和 yml 配合使用。
- 不使用主机网络模式。
- 重要数据文件采用挂载宿主机目录。
- 对外服务需提供 NodePort 配置。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-8.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-9.png)

### KubeSphere 集群

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-10.png)

### KubeSphere 应用部署与流水线

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-11.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-12.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-zhidian-13.png)

## KubeSphere 使用效果

- 全流程的 DevOps，释放开发频繁打包部署的工作，专注于研发。
- 可视化的资源监控，配合告警等措施，提升运维的能力。
- 多租户，多空间，项目的隔离，使用者权限的分管，让跨业务团队的管理更精准。
- 缩减原来的虚拟主机（4C 8G），组成资源更大的节点，资源利用率提升。
- 支持在线化的动态扩容，操作方便，想增加或减少实例，操作一下就搞定。
- 前端也实现容器化部署，释放手动打包上传的工作量。

## 存在问题及解决方法

### 当时官方提供的 Maven 版本不是 3.6 的版本，如何解决？

解决：自己制作了一个 3.6 的 Maven 基础镜像，然后在 Clusterconfiguration，找到 Maven 的 image，修改即可。

### 自建了 nexus，如何修改 maven setting.xml？

解决：在 CRDs 筛选 kubesphere-devops-system，找到 ks-install，修改里面的 maven setting.xml 即可，修改后，要登录 Jenkins，重新 reload 配置。

### 如何访问 Jenkins？

解决：Master 的 ip + 30180，登录账号密码和 KubeSphere 的管理员。可以参考文件： https://juejin.cn/post/7124589639536476190

### 在容器中如何访问共享文件？

解决：通过挂载 NFS 系统来访问。

### 容器中的文件随着容器销毁而消失，想要保存更长时间文件？

解决：通过挂载宿主机的文件/或磁盘。

### 容器在滚动部署过程中会被销毁，其他服务调用还是走旧 IP 访问，404？

解决：通过在 Kubernetes 的 Service 来调用（SVC）。

### DevOps 与自建 Gitlab 搭配怎么触发构建？

解决：进入 Jenkins 在流水线上使用通用钩子触发。

## 未来规划

通过引入 KubeSphere 中间件管理平台，极大地提交了整体的交付效率，节省在部署环节的时间支付，通过工具更好的实现了 CI/CD；提供了可视化的资源界面，能更清楚地知道各个服务器的资源使用情况，做到很好的监控。

随着平台的使用成熟，越来越多的业务将迁入平台，包括前端、.net、或者其他子公司的业务。KubeSphere 的更多功能，将为业务的发展提供很好的基础。