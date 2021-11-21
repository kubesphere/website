---
title: '使用 KubeSphere 应用商店 5 分钟内快速部署 JuiceFS'
tag: 'KubeSphere,JuiceFS'
keyword: 'Kubernetes, KubeSphere, JuiceFS, 对象存储 '
description: '本教程将介绍如何在 KubeSphere 中一键部署 JuiceFS CSI Driver，为集群上的各种应用提供数据持久化。'
createTime: '2021-11-17'
author: 'KubeSphere'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-juicefs-cover.png'
---

## JuiceFS 简介

JuiceFS 是为海量数据设计的分布式文件系统，使用对象存储来做数据持久化，避免重复造轮子，还能大大降低工程复杂度，让用户专注解决元数据和访问协议部分的难题。
 
使用 JuiceFS 存储数据，数据本身会被持久化在对象存储（例如，Amazon S3），而数据所对应的元数据可以根据场景需要被持久化在 Redis、MySQL、SQLite 等多种数据库中。

## KubeSphere 平台介绍

KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。

KubeSphere 提供了运维友好的向导式操作界面，即便是 Kubernetes 经验并不丰富的用户，也能相对轻松的上手开始管理和使用。它提供了基于 Helm 的应用市场，可以在可视化界面下非常轻松地安装各种 Kubernetes 应用。

----

本教程将介绍如何在 KubeSphere 中一键部署 JuiceFS CSI Driver，为集群上的各种应用提供数据持久化。

## 前提条件

- [安装 KubeSphere](https://v3-1.docs.kubesphere.io/zh/docs/installing-on-linux/public-cloud/install-kubesphere-on-huaweicloud-ecs/)
- [在 KubeSphere 中启用应用商店](https://kubesphere.com.cn/docs/pluggable-components/app-store/)
- 准备对象存储
  - [创建华为云 OBS](https://support.huaweicloud.com/function-obs/index.html)
  - [创建秘钥](https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html)

## 部署 Redis

Redis 是 JuiceFS 架构中的关键组件，它负责存储所有元数据并响应客户端对元数据的操作。所以在部署 JuiceFS CSI Driver 之前，需要先部署一个 Redis 数据库，部署详细步骤可参考 [KubeSphere 官方文档](https://kubesphere.com.cn/docs/application-store/built-in-apps/redis-app/)。

## 部署 JuiceFS CSI Driver

KubeSphere 从 3.2.0 开始新增了 “**动态加载应用商店**” 的功能，合作伙伴可通过提交 PR 申请将应用的 Helm Chart 集成到 KubeSphere 应用商店，这样 KubeSphere 应用商店即可动态加载应用。目前 JuiceFS CSI Driver 的 Helm Chart 已经通过这种方式集成到了 KubeSphere 的应用商店，用户可以一键将 JuiceFS CSI Driver 部署至 Kubernetes。

首先选择您所需部署的企业空间和项目。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111171258640.png)

进入项目后，点击“创建”部署新应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111171322458.png)

选择“从应用商店”。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111171323750.png)

点击目标应用，然后点击“部署”。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111171324754.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202111171326929.png)

修改 backend 参数。

![](https://pek3b.qingstor.com/kubesphere-community/images/df9d86c2-590f-4699-a4da-698ffce2e0cf.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/cca8f710-1e56-40c2-b405-ca06189d73de.png)

验证服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/08cfbc9b-808a-40ad-a3a2-6932e15e82b3.png)

## 部署有状态应用

创建有状态副本集。

![](https://pek3b.qingstor.com/kubesphere-community/images/499b9863-ea8e-4244-b092-21a728833fe1.png)

添加自定义名称。

![](https://pek3b.qingstor.com/kubesphere-community/images/9cf28790-d656-4ced-a6fd-e1a7f8d3ea8b.png)

添加容器镜像。

![](https://pek3b.qingstor.com/kubesphere-community/images/679cfa7a-054e-401e-8470-f85ed54e805b.png)

```
sh,-c,while true; do echo $(date -u) >> /data/out.txt; sleep 5; done
```

![](https://pek3b.qingstor.com/kubesphere-community/images/98129318-2906-461e-b86d-cb9fe486eea7.png)

添加存储卷模板。

![](https://pek3b.qingstor.com/kubesphere-community/images/ae2c0266-0b34-493d-bd31-80a7332e3238.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/98e4cbaf-e252-4605-b60a-34518128fbbc.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/e0fa1604-6e8d-460e-b357-30c308972bd1.png)

检查状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/55144d0e-1be3-4cfd-a00a-aa2e00946e88.png)

## 验证存储卷

首先验证创建的 PVC 绑定状态。

```
kubectl get pvc -n kubesphere
```

![](https://pek3b.qingstor.com/kubesphere-community/images/2ce0de69-c590-4d4a-b4b9-cec9e692c816.png)

进入有状态应用检查挂载状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/eef27646-6521-43fc-a456-7e9444827368.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/182aae69-5f2b-4aa1-aa5a-0d6972c2ce28.png)

登录 OBS 查看文件同步状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/58287121-07f9-4a3e-ba3b-78be61a3eeee.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/e3d4bf02-db34-4c37-a537-cb1a692d071e.png)

## 注意事项

1. JuiceFS CSI Driver 安装完成任何 namespace 都可以使用；
2. PVC 所属的 pod 归属在 JuiceFS CSI Driver 的 namespace 中；
3. 创建完应用必须进入所声明挂载的文件夹存放数据，远端存储才会同步显示。
