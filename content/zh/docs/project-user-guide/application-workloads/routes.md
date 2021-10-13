---
title: "应用路由"
keywords: "KubeSphere, Kubernetes, 路由, 应用路由"
description: "了解应用路由（即 Ingress）的基本概念以及如何在 KubeSphere 中创建应用路由。"
weight: 10270
---

本文档介绍了如何在 KubeSphere 上创建、使用和编辑应用路由。

KubeSphere 上的应用路由和 Kubernetes 上的 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#what-is-ingress) 相同，您可以使用应用路由和单个 IP 地址来聚合和暴露多个服务。

## 准备工作

- 您需要创建一个企业空间、一个项目以及两个帐户（例如，`project-admin` 和 `project-regular`）。在此项目中，`project-admin` 必须具有 `admin` 角色，`project-regular` 必须具有 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 若要以 HTTPS 模式访问应用路由，则需要[创建密钥](../../../project-user-guide/configuration/secrets/)用于加密，密钥中需要包含 `tls.crt`（TLS 证书）和 `tls.key`（TLS 私钥）。
- 您需要[创建至少一个服务](../../../project-user-guide/application-workloads/services/)。本文档使用演示服务作为示例，该服务会将 Pod 名称返回给外部请求。

## 配置应用路由访问方式

1. 以 `project-admin` 身份登录 KubeSphere 的 Web 控制台，然后访问您的项目。

2. 在左侧导航栏中选择**项目设置**下的**高级设置**，点击右侧的**设置网关**。

   {{< notice note >}}

   若已设置访问方式，则可以点击**编辑**，然后选择**编辑网关**以更改访问方式。

   {{</ notice >}}

   ![set-gateway](/images/docs/zh-cn/project-user-guide/application-workloads/routes/set-gateway.png)

3. 在出现的**设置网关**对话框中，将**访问方式**设置为 **NodePort** 或 **LoadBalancer**，然后点击**保存**。

   {{< notice note >}}

   若将**访问方式**设置为 **LoadBalancer**，则可能需要根据插件用户指南在您的环境中启用负载均衡器插件。

   {{</ notice >}}

   ![access-method-nodeport](/images/docs/zh-cn/project-user-guide/application-workloads/routes/access-method-nodeport.png)

   ![access-method-loadbalancer](/images/docs/zh-cn/project-user-guide/application-workloads/routes/access-method-loadbalancer.png)

## 创建应用路由

### 步骤 1：配置基本信息

1. 登出 KubeSphere 的 Web 控制台，以  `project-regular` 身份登录，并访问同一个项目。

2. 选择左侧导航栏**应用负载**中的**应用路由**，点击右侧的**创建**。

   ![create-route](/images/docs/zh-cn/project-user-guide/application-workloads/routes/create-route.png)

3. 在**基本信息**选项卡中，配置应用路由的基本信息，并点击**下一步**。
   * **名称**：应用路由的名称，用作此应用路由的唯一标识符。
   * **别名**：应用路由的别名。
   * **描述信息**：应用路由的描述信息。

   ![basic-info](/images/docs/zh-cn/project-user-guide/application-workloads/routes/basic-info.png)

### 步骤 2：配置路由规则

1. 在**路由规则**选项卡中，点击**添加路由规则**。

2. 选择一种模式来配置路由规则，点击 **√**，然后点击**下一步**。

   * **自动生成**：KubeSphere 自动以`<服务名称>.<项目名称>.<网关地址>.nip.io` 格式生成域名，该域名由 [nip.io](https://nip.io/) 自动解析为网关地址。该模式仅支持 HTTP。
     
     * **路径**：将每个服务映射到一条路径。您可以点击**添加 Path** 来添加多条路径。
     
     ![auto-generate](/images/docs/zh-cn/project-user-guide/application-workloads/routes/auto-generate.png)
     
   * **指定域名**：使用用户定义的域名。此模式同时支持 HTTP 和 HTTPS。
     
     * **域名**：为应用路由设置域名。
     * **协议**：选择 `http` 或 `https`。如果选择了 `https`，则需要选择包含 `tls.crt`（TLS 证书）和 `tls.key`（TLS 私钥）的密钥用于加密。
     * **路径**：将每个服务映射到一条路径。您可以点击**添加 Path** 来添加多条路径。
   
     ![specify-domain](/images/docs/zh-cn/project-user-guide/application-workloads/routes/specify-domain.png)

### （可选）步骤 3：配置高级设置

1. 在**高级设置**选项卡，选择**添加元数据**。

   为应用路由配置注解和标签，并点击**创建**。

   {{< notice note >}}

   您可以使用注解来自定义应用路由的行为。有关更多信息，请参见 [Nginx Ingress controller 官方文档](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)。

   {{</ notice >}}

   ![add-metadata](/images/docs/zh-cn/project-user-guide/application-workloads/routes/add-metadata.png)

### 步骤 4：获取域名、服务路径和网关地址

1. 在左侧导航栏中选择**应用负载**中的**应用路由**，点击右侧的应用路由名称。

   ![route-list](/images/docs/zh-cn/project-user-guide/application-workloads/routes/route-list.png)

2. 在**规则**区域获取域名和服务路径，在**详情**区域获取网关地址。

   * 如果[应用路由访问方式](#配置应用路由访问方式)设置为 NodePort，则会使用 Kubernetes 集群节点的 IP 地址作为网关地址，NodePort 位于域名之后。

     ![obtain-address-nodeport](/images/docs/zh-cn/project-user-guide/application-workloads/routes/obtain-address-nodeport.png)

   * 如果[应用路由访问方式](#配置应用路由访问方式)设置为 LoadBalancer，则网关地址由负载均衡器插件指定。

     ![obtain-address-loadbalancer](/images/docs/zh-cn/project-user-guide/application-workloads/routes/obtain-address-loadbalancer.png)

## 配置域名解析

若在[配置路由规则](#步骤-2配置路由规则)中选择**自动生成**，则不需要配置域名解析，域名会自动由 [nip.io](https://nip.io/) 解析为网关地址。

若在[配置路由规则](#步骤-2配置路由规则)中选择**指定域名**，则需要在 DNS 服务器配置域名解析，或者在客户端机器上将`<路由网关地址> <路由域名>`添加到  `etc/hosts` 文件。

## 访问应用路由

### NodePort 访问方式

1. 登录连接到应用路由网关地址的客户端机器。

2. 使用`<路由域名>:<NodePort>/<服务路径>`地址访问应用路由的后端服务。

   ![access-route-nodeport](/images/docs/zh-cn/project-user-guide/application-workloads/routes/access-route-nodeport.png)

### LoadBalancer 访问方式

1. 登录连接到应用路由网关地址的客户端机器。

2. 使用`<路由域名>/<服务路径>`地址访问应用路由的后端服务。

   ![access-route-loadbalancer](/images/docs/zh-cn/project-user-guide/application-workloads/routes/access-route-loadbalancer.png)

{{< notice note >}}

如果您需要使用 NodePort 或 LoadBalancer 从私有网络外部访问应用路由，具体取决于您的网络环境：

* 您可能需要在基础设施环境中配置流量转发和防火墙规则，以便访问应用路由的网关地址和端口号。
* 若在[配置路由规则](#步骤-2配置路由规则)中选择**自动生成**，则可能需要手动[编辑路由规则](#编辑路由规则)将路由域名中的网关地址改为您私有网络的外部 IP 地址。
* 若在[配置路由规则](#步骤-2配置路由规则)中选择**指定域名**，则可能需要改变 DNS 服务器上或者客户端机器 `etc/hosts` 文件中的配置，以便将域名解析为您私有网络的外部 IP 地址。

{{</ notice >}}

## 查看应用路由详情

### 操作

1. 在左侧导航栏中选择**工作负载**中的**应用路由**，点击右侧的应用路由名称。

   ![route-list](/images/docs/zh-cn/project-user-guide/application-workloads/routes/route-list.png)

2. 点击**编辑信息**，或点击**更多操作**，从下拉菜单中选择一项操作。
   * **编辑信息**：编辑应用路由的基本信息，但无法编辑路由名称。
   * **编辑配置文件**：编辑应用路由的 YAML 配置文件。
   * **编辑规则**：编辑应用路由的规则。
   * **编辑注解**：编辑应用路由的注解。有关更多信息，请参见 [Nginx Ingress controller 官方文档](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)。
   * **删除**：删除应用路由并返回应用路由列表页面。

   ![edit-route](/images/docs/zh-cn/project-user-guide/application-workloads/routes/edit-route.png)

### 资源状态

点击**资源状态**选项卡查看应用路由规则。

![resource-status](/images/docs/zh-cn/project-user-guide/application-workloads/routes/resource-status.png)

### 元数据

点击**元数据**选项卡查看应用路由的标签和注解。

![metadata](/images/docs/zh-cn/project-user-guide/application-workloads/routes/metadata.png)

### 事件

点击**事件**选项卡查看应用路由的事件。

![events](/images/docs/zh-cn/project-user-guide/application-workloads/routes/events.png)