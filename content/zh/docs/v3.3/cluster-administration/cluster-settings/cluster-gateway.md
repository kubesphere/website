---
title: "集群网关"
keywords: 'KubeSphere, Kubernetes, 集群, 网关, NodePort, LoadBalancer'
description: '学习如何在 KubeSphere 中创建集群级别的网关。'
linkTitle: "集群网关"
weight: 8630

---

KubeSphere 3.3 提供集群级别的网关，使所有项目共用一个全局网关。本文档介绍如何在 KubeSphere 设置集群网关。

## 准备工作

您需要创建一个拥有 `platform-admin` 角色的用户，例如：`admin`。有关更多信息，请参见[创建企业空间、项目、用户和平台角色](../../../quick-start/create-workspace-and-project/).

## 创建集群网关

1. 以 `admin` 身份登录 web 控制台，点击左上角的**平台管理**并选择**集群管理**。

2. 点击导航面板中**集群设置**下的**网关设置**，选择**集群网关**选项卡，并点击**启用网关**。

3. 在显示的对话框中，从以下的两个选项中选择网关的访问模式：

   - **NodePort**：通过网关使用对应节点端口来访问服务。NodePort 访问模式提供以下配置：
     - **链路追踪**：打开**链路追踪**开关以启用 KubeSphere 的链路追踪功能。功能开启后，如应用路由不可访问，请检查是否为应用路由是否添加注解（`nginx.ingress.kubernetes.io/service-upstream: true`）。如注解没有添加，则添加注解至您的应用路由中。
     - **配置选项**：在集群网关中加入键值对。
   - **LoadBalancer**：通过网关使用单个 IP 地址访问服务。LoadBalancer 访问模式提供以下配置：
     - **链路追踪**：打开**链路追踪**开关以启用 KubeSphere 的链路追踪功能。功能开启后，如应用路由不可访问，请检查是否为应用路由是否添加注解（`nginx.ingress.kubernetes.io/service-upstream: true`）。如注解没有添加，则添加注解至您的应用路由中。
     - **负载均衡器提供商**：从下拉列表中选择负载均衡器提供商。
     - **注解**：添加注解至集群网关。
     - **配置选项**: 添加键值对至集群网关。

   {{< notice info >}}

   - 为了使用链路追踪功能，请在创建自制应用时打开**应用治理**。 
   - 有关如何使用配置选项的更多信息，请参见 [Configuration options](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#configuration-options)。

   {{</ notice >}}

4. 点击**确定**创建集群网关。

5. 在这个页面中会展示创建的集群网关和该网关的基本信息。

   {{< notice note >}}

   同时还创建了名为 kubesphere-router-kubesphere-system 的网关，作为集群中所有项目的全局网关。

   {{</ notice >}}

6. 点击**管理**，从下拉菜单中选择一项操作：

   - **查看详情**：转至集群网关详情页面。
   - **编辑**：编辑集群网关配置。
   - **关闭**：关闭集群网关。

7. 创建集群网关后，有关如何创建应用路由的更多信息，请参见[应用路由](../../../project-user-guide/application-workloads/routes/#create-a-route)。

## 集群网关详情页面

1. 在**集群网关**选项卡下，点击集群网关右侧的**管理**，选择**查看详情**以打开其详情页面。
2. 在详情页面，点击**编辑**以配置集群网关，或点击**关闭**以关闭网关。
3. 点击**监控**选项卡，查看集群网关的监控指标。
4. 点击**配置选项**选项卡以查看集群网关的配置选项。
5. 点击**网关日志**选项卡以查看集群网关日志。
6. 点击**资源状态**选项卡，以查看集群网关的负载状态。点击 <img src="/images/docs/v3.3/common-icons/replica-plus-icon.png" width="15" alt="icon" /> 或 <img src="/images/docs/v3.3/common-icons/replica-minus-icon.png" width="15" alt="icon" /> 按钮，以增加或减少副本数量。
7. 点击**元数据**选项卡，以查看集群网关的注解。

## 查看项目网关

在**网关设置**页面，点击**项目网关**选项卡，以查看项目网关。

点击项目网关右侧的 <img src="/images/docs/v3.3/project-administration/role-and-member-management/three-dots.png" width="20px" alt="icon" > ，从下拉菜单中选择操作：

- **编辑**：编辑项目网关的配置。
- **关闭**：关闭项目网关。

{{< notice note >}}

如果在创建集群网关之前存在项目网关，则项目网关地址可能会在集群网关地址和项目网关地址之间切换。建议您只使用集群网关或项目网关。

{{</ notice >}}

关于如何创建项目网关的更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

