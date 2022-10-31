---
title: 'KubeSphere 3.3.1 发布：权限控制修改'
tag: '产品动态'
keyword: '社区, 开源, 贡献, KubeSphere, release, 权限控制       '
description: 'KubeSphere 3.3.1 权限控制有非常大的变化。'
createTime: '2022-10-28'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KS-3.3.1-GA.png'
---

从 4 年前发布第一个版本开始，KubeSphere 已经经历了 10 多个版本的迭代，如今 KubeSphere 已经收获了 **320+** 位开源贡献者，KubeSphere 主仓库 GitHub Star **11300+**，Fork **1700+**，在全球下载次数超过**百万**。

自今年 **6** 月份 v3.3.0 发布以来，社区用户就一直比较关心 v3.3.1 版本的发布时间，如今 v3.3.1 已正式发布！

此版本历时 **4** 个月左右的时间，由 **36** 位贡献者进行贡献，感谢各位贡献者对 KubeSphere 项目的支持与贡献！

接下来将会详细介绍 KubeSphere 3.3.1 的主要变化。

## 权限控制修改

和之前的版本相比，KubeSphere 3.3.1 权限控制有非常大的变化，移除了两个平台级内置角色 `users-manager`(用户管理员)和 `workspace-manager`（企业空间管理员），如果已有用户绑定了 `users-manager` 或 `workspace-manager`则升级至该版本后会对相关权限进行降级，他们的角色将会在升级之后变更为 `platform-regular`。同时还增加了一个平台级内置角色 `platform-self-provisioner`用于管理企业空间。

![](https://pek3b.qingstor.com/kubesphere-community/images/202210281343186.png)

角色 `platform-self-provisioner` 可以创建企业空间并成为所创建企业空间的管理员，即**可以管理自己创建的企业空间内的所有资源**。这个角色的设计主要考虑到了多集群的场景：

+ 对于集群可见性设置为公开的集群，platform-self-provisioner 创建的企业空间，可以使用该集群部署资源。
+ 对于集群可见性设置为非公开的集群，platform-self-provisioner 创建的企业空间，需要向（platform-admin）平台管理员或集群管理员（cluster-admin）申请这个集群的资源部署授权。

除此之外，自定义角色的授权项也有些许调整：

-   移除平台层级自定义角色授权项：用户管理，角色管理，企业空间管理。
-   移除企业空间层级自定义角色授权项：成员管理，角色管理，用户组管理。
-   移除命名空间层级自定义角色授权项：成员管理，角色管理。
-   升级到 KubeSphere 3.3.1 后，自定义角色会被保留，但是其包含的已被移除的授权项会被删除。

## DevOps 优化

DevOps 模块针对于流水线做了部分优化：

-   对于带有 build parameters 的流水线，页面保存后不再依靠每隔 10s 的元数据同步，而是立即触发一次源数据更新，确保下次运行时正确加载参数。
-   将 CI/CD 流水线模板中，部署阶段使用 kubeconfig 绑定的方式，替换掉不可用的 kubernetesDeploy 函数方式。
-   流水线 UI 界面支持编辑带有 kubeconfig 绑定到文件步骤的 Jenkinsfile。
-   优化流水线定时构建 CRON 表达式校验正则。


## 更多细节

除了上述提到的新特性和功能增强，该版本中还有很多细节改进，例如：

+ 修复 IPv4/IPv6 双栈模式下用户创建路由规则失败的问题。
+ 当用户使用 hostpath 作为持久化存储时，必须填写主机路径。
+ 支持修改每页列表的展示数量。
+ 支持批量停止工作负载。

可以访问下方链接来查看完整的 Realese note：

**https://github.com/kubesphere/kubesphere/releases/tag/v3.3.1**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
