---
title: 'Kubernetes 备份容灾服务产品体验教程'
tag: 'Kubernetes'
keywords: 'Kubernetes, 备份容灾, SaaS, KubeSphere'
description: 'KubeSphere Cloud 云原生备份容灾服务是 KubeSphere 团队针对混合云场景推出的 Kubernetes 备份容灾即服务产品。'
createTime: '2022-02-10'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-SaaS.png'
---

## 前言

Kubernetes 集群天生自带自愈功能，但是往往有些意外情况使自愈功能不起作用，比如：公司同事把某个 namespace 删除、存储对象被清理了、集群突然断电了、集群升级失败了等。如果没有好的备份工具及定时备份的习惯，不管对于开发环境还是生产环境来说无疑都是灾难性的，如果这个时候有一个可视化备份工具友好的帮助集群做定时备份，你的工作会事半功倍。下面就给大家推荐青云科技容器团队基于 Velero 开源备份工具研发的备份容灾服务。

## 云原生备份容灾服务简介

KubeSphere Cloud 云原生备份容灾服务是 KubeSphere 团队针对混合云场景推出的 Kubernetes 备份容灾即服务产品。用户无需构建备份容灾的基础架构，基于原生的 Kubernetes API，提供了可视化界面，能够覆盖云原生数据保护的绝大多数重要场景，而且能够跨集群、跨云服务商、跨存储区域，轻松实现基础设施间多地、按需的备份恢复。登录 [KubeSphere Cloud](https://kubesphere.cloud) 即可对 Kubernetes 集群中的容器进行备份和恢复。

## 注册平台账号

1. 登录 KubeSphere Cloud 平台

![](https://pek3b.qingstor.com/kubesphere-community/images/0b57b576-8697-4359-82a0-77da35a3e95e.png)

2. 创建账户

![](https://pek3b.qingstor.com/kubesphere-community/images/91fb46c3-8c89-49e3-8ede-ae2ab50b14e5.png)

## 准备集群

1. 进入首页找到【资源管理】选择【导入集群】

![](https://pek3b.qingstor.com/kubesphere-community/images/01936f12-55a3-4d56-bd99-3e2b9237d9eb.png)

2. 填写集群相关信息，选择【直接连接 Kubernetes 集群】方式

![](https://pek3b.qingstor.com/kubesphere-community/images/042fc864-a519-4f1a-aa4b-10a2cf17b8c9.png)

3. 获取 kubeconfig

方式一：托管 Kubernetes 集群

请参考对应云厂商产品文档进行获取，如：阿里云、华为云、腾讯云等。

方式二：自建 Kubernetes 集群

（一）master 节点上执行

```bash
cat $HOME/.kube/config
```

(二)请确保 kubeconfig 中 cluser.server 字段的地址可以通过公网进行访问，或者同时勾选跳过 TLS 验证进行导入

![](https://pek3b.qingstor.com/kubesphere-community/images/d35d7d70-994f-4d8f-8b98-8d962f79d2c7.png)

4. 验证集群连接状态

![](https://pek3b.qingstor.com/kubesphere-community/images/a913a41d-2cf5-4be0-8c75-a1d671473d8e.png)

## 添加对象存储仓库

1. 选择【新建仓库】

![](https://pek3b.qingstor.com/kubesphere-community/images/7d1ca132-8950-4d0a-9212-c50912b92c47.png)


![](https://pek3b.qingstor.com/kubesphere-community/images/8af1053c-dfe3-4d5c-9c04-2dc07693cc38.png)

2. 查看仓库是否可用

![](https://pek3b.qingstor.com/kubesphere-community/images/9484d663-ec32-414c-ab73-d897b9e39748.png)

## 创建备份计划

注意：备份的集群 namespace 里不能包含带有 error 的 PVC 或者 PV，否则无法恢复！！！

1. 选择【创建备份】

![](https://pek3b.qingstor.com/kubesphere-community/images/116b78d0-fa0f-4c84-a9eb-cd5b60464d58.png)

2. 查看备份计划状态

![](https://pek3b.qingstor.com/kubesphere-community/images/76c10b9f-57aa-4750-8e08-50970952935d.png)


## 创建恢复计划

1. 清除备份计划源集群中的服务

![](https://pek3b.qingstor.com/kubesphere-community/images/7ee99125-597a-497e-9e95-bb419375bde4.png)

2. 选择【恢复备份】

![](https://pek3b.qingstor.com/kubesphere-community/images/71b4995b-a51a-47ee-b811-9174781d4c7f.png)

3. 创建备份计划

![](https://pek3b.qingstor.com/kubesphere-community/images/3597f470-0872-4f0a-b4cf-7d39456dd3bc.png)

4. 查看恢复计划状态

![](https://pek3b.qingstor.com/kubesphere-community/images/2579b953-e3f9-4285-a5a9-141a3062987c.png)

5. 查看目标 namespace 恢复状态

![](https://pek3b.qingstor.com/kubesphere-community/images/f1f44b94-c09a-4bc7-8060-40a3194a3724.png)

## 总结

运行生产级别的 Kubernetes 集群，无论您的集群运行的多稳定，定期备份是未雨绸缪，一定要做的工作。
Kubernetes 集群的运行状态都保存在 ETCD 中，为了确保您生产环境的稳定性。建议您定期备份。

KubeSphere Cloud 云原生备份容灾服务的应用场景包括：

1. 系统或硬件设施发生故障

云原生备份容灾服务能够有效降低因故障而导致的业务中断风险，保障 Kubernetes 集群中核心业务的连续性。

2. 开发测试中出现环境变更

云原生备份容灾服务能够在开发、测试等过程出现环境变更、配置调整时，及时恢复任何时期、任意仓库中备份的数据。

3. 遭遇恶意破坏或不当操作

云原生备份容灾服务能够通过数据的备份和恢复，避免恶意破坏或不当操作造成的数据丢失，保障数据的完整可用。

4. 多集群、多存储协同保护

云原生备份容灾服务能够跨集群、跨云服务商、跨存储区域，轻松实现基础设施间多地、按需的备份恢复、容灾保护。

5. 容器应用数据的云上迁移

云原生备份容灾服务提供了一种便利的数据迁移方式，让企业灵活、自主地选择或更换云服务商，避免基础设施绑定。
