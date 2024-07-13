---
title: "项目网关"
keywords: 'KubeSphere, Kubernetes, 项目, 网关, NodePort, LoadBalancer'
description: '了解项目网关的概念以及如何进行管理。'
linkTitle: "项目网关"
weight: 13500
version: "v3.4"
---

KubeSphere 项目中的网关是一个[ NGINX Ingress 控制器](https://www.nginx.com/products/nginx-ingress-controller/)。KubeSphere 内置的用于 HTTP 负载均衡的机制称为[应用路由](../../project-user-guide/application-workloads/routes/)，它定义了从外部到集群服务的连接规则。如需允许从外部访问服务，用户可创建路由资源来定义 URI 路径、后端服务名称等信息。

KubeSphere 除了提供项目范围的网关外，还提供[集群范围的网关](../../cluster-administration/cluster-settings/cluster-gateway/)，使得所有项目都能共享全局网关。

本教程演示如何在 KubeSphere 中开启项目网关以从外部访问服务和路由。

## 准备工作

您需要创建一个企业空间、一个项目和一个用户 (`project-admin`)。该用户必须被邀请至项目，并且在项目中的角色为 `admin`。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)。

## 开启网关

1. 以 `project-admin` 用户登录 KubeSphere Web 控制台，进入您的项目，从左侧导航栏进入**项目设置**下的**网关设置**页面，然后点击**开启网关**。

2. 在弹出的对话框中选择网关的访问方式。

   **NodePort**：通过网关访问服务对应的节点端口。

   **LoadBalancer**：通过网关访问服务的单独 IP 地址。
   
3. 在**开启网关**对话框，您可以启用**链路追踪**。创建自制应用时，您必须开启**链路追踪**，以使用链路追踪功能和[不同的灰度发布策略](../../project-user-guide/grayscale-release/overview/)。如果启用**链路追踪**后无法访问路由，请在路由 (Ingress) 中添加注解（例如 `nginx.ingress.kubernetes.io/service-upstream: true`）。

3. 在**配置选项**中，添加键值对，为 NGINX Ingress 控制器的系统组件提供配置信息。有关更多信息，请参阅 [NGINX Ingress 控制器官方文档](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#configuration-options)。

4. 选择访问方式后点击**保存**。

## NodePort

如果您选择 **NodePort**，KubeSphere 将为 HTTP 请求和 HTTPS 请求分别设置一个端口。您可以用 `EIP:NodePort` 或 `Hostname:NodePort` 地址访问服务。

例如，如果您的服务配置了的弹性 IP 地址 (EIP)，请访问：

- `http://EIP:32734`
- `https://EIP:32471`

当创建[路由](../../project-user-guide/application-workloads/routes/) (Ingress) 时，您可以自定义主机名用于访问服务。例如，如果您的路由中配置了服务的主机名，请访问：

- `http://demo.kubesphere.io:32734`
- `https://demo.kubesphere.io:32471`

{{< notice note >}}

- 取决于您的环境，您可能需要在安全组中放行端口并配置相关的端口转发规则 。

- 如果使用主机名访问服务，请确保您设置的域名可以解析为对应的 IP 地址。
- 在生产环境中不建议使用 **NodePort**，请使用 **LoadBalancer**。

{{</ notice >}} 

## LoadBalancer

在选择 **LoadBalancer** 前，您必须先配置负载均衡器。负载均衡器的 IP 地址将与网关绑定以便内部的服务和路由可以访问。 
{{< notice note >}}
云厂商通常支持负载均衡器插件。如果在主流的 Kubernetes Engine 上安装 KubeSphere，您可能会发现环境中已有可用的负载均衡器。如果在裸金属环境中安装 KubeSphere，您可以使用 [OpenELB](https://github.com/kubesphere/openelb) 作为负载均衡器。

{{</ notice >}} 