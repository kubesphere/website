---
title: '深入浅出 Kubernetes 项目网关与应用路由'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, Gateway, 网关, Spring Cloud'
description: '本篇内容简述了应用路由的基本架构，并与 Kubernetes Service 及其他应用网关分别做了对比。最后通过 SockShop 这个案例讲解的应用路由的配置方法。'
createTime: '2021-07-28'
author: '马岩'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202109071715557.png'
---

KubeSphere 项目网关与应用路由提供了一种聚合服务的方式，将集群的内部服务通过一个外部可访问的 IP 地址以 HTTP 或 HTTPs 暴露给集群外部。应用路由定义了这些服务的访问规则，用户可以定义基于 host 主机名称和 URL 匹配的规则。同时还可以配置 HTTPs offloading 等选项。项目网关则是应用路由的具体实现，它承载了流量的入口并根据应用路由规则将匹配到的请求转发至集群内的服务。

## 整体架构

用户的服务和应用路由的架构密不可分，因此我们需要结合用户服务来理解项目网关的整体架构。一个典型生产环境中，项目网关架构如下图所示：

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627370451-193428-kubernetes-ingress.png)

图中组件共分为四个部分:

1. `Nginx Ingress Controller` 是应用网关的核心组件。KubeSphere 项目网关基于 `Nginx Ingress Controller` 实现，它通过获 `Ingress` 对象生成 Nginx 反向代理规则配置并配置应用于 Nginx 服务。应用路由是一个 `Ingress` 对象。应用网关依赖于 `Service` 对外暴露 Nginx 服务，因此 `Service` 在生产环境中一般设置为 `LoadBalancer` 类型，由云服务商配置其公有云 IP 地址及外部负载均衡器，用以保障服务的高可用性。
2. 外部负载均衡器，应用网关的 `Service` 生成的外部负载均衡器，一般由各个云服务商提供。因此每种负载均衡器的特性有很多差别，比如 SLA、带宽、IP 配置等等。我们一般可以通过服务商提供的注解对其进行配置，在设置网关时，我们通常需要了解这些特性。
3. DNS 域名解析服务， 一般由域名服务商提供服务，我们可以配置域名解析纪录将域名指向 `LoadBalancer` 的公网 IP。如果子域名也指向同一 IP，我们可以可使用泛域名解析方式。
4. 用户服务与应用路由，用户需要为应用程序创建 `Service` 用于暴露集群内的服务，然后创建应用路由对外暴露服务。注，`Nginx Ingress Controller` 并不通过 `Kube-proxy` 访问服务 IP。它通过服务查找与之关联 `POD` 的 `EndPoint`，并将其设置为 `Nginx` 的 `Upstream`。Nginx 直接连接 `POD` 可以避免由 `Service` 带来的额外网络开销。

### 应用路由 vs Service(type=LoadBalancer)

在实践过程中，应用路由与 `Service` 的应用场景常常令人混淆。它们都可以向集群外暴露集群内服务，并提供负载均衡功能。并且应用路由看起来也是*依赖*于服务的，那么他们究竟有何区别呢？这个问题我们需要从以下几个角度理解。

1. `Service` 最初的设计动机是将某个服务的后端(Pod)进行抽象并公开为网络服务。它通常是以一个服务为单位的，所有后端均运行相同的服务端。而`应用路由`的设计目标是对 API 对象进行管理。它虽然也可以暴露一个服务，但是它更强大的功能在于其可以将一系列服务进行聚合，对外提供统一的访问 IP、域名、URL 等。
2. `Service` 工作在 TCP/IP 协议的第四层，因此它使用 `IP+端口+协议` 三元组作为服务的唯一标识。因此当我们需要暴露一个服务时，它不能与其他已存在的服务冲突。例如，我们暴露基于 HTTP/HTTPs 的服务时，通常这类服务都会占用 80、443 端口，为了避免端口冲突，就需要为每个暴露的服务申请一个独立的 IP 地址，导致资源浪费。`应用路由`工作在七层，所有通过应用路由暴露的服务都可以共享项目网关的 IP 地址和 80、443 端口。每个`应用路由`使用 `Host+URL` 作为服务的唯一标识,将 HTTP 请求转发到后端服务中。
3. `Service` 支持 TCP 与 UDP 协议并且对上层协议没有限制，而应用路由目前只支持 HTTP/HTTPs 或 HTTP2 协议，无法转发基于 TCP 或 UDP 的其他协议。

结合以上三点，我们不难得看出：应用路由更适用于使用 HTTP 协议的微服务架构的场景中，而 `Service` 虽然对 HTTP 协议没有深度的支持，但是它可以支持更多其他协议。

### 应用路由 vs Spring Cloud Gateway 或 Ocelot

Java、.net Core 的开发人员对 `Spring Cloud Gateway` 或 `Ocelot` 一定不会感到陌生，他们是各自语言领域中最常用的 API 网关。那么到我们是否可以直接使用这些网关呢？理解这个问题，我们首先要知道什么是 API 网关，在 Wiki 百科中 `API Gateway` 并没有一个明确的定义，但我们从各个大厂的服务说明中可以得出一个基本的结论：

> API 网关作为用户与后端服务之间的唯一入口管理后端服务，即 API 网关提供了一个方向代理服务将后端服务进行聚合，将客户端请求路由到后端服务并将结果返回给客户端。同时,API 网关可提供身份认证、监控、负载均衡、HTTPS offloading 等高级功能。

因此，应用路由承担了 API 网关的职责，即它与 `Spring Cloud Gateway` 或 `Ocelot` 等 API 网关具有同等地位。诸如 `Spring Cloud Gateway` 类的 API 网关通过 `Service` 的方式暴露到集群外部也可替代部分应用路由功能。我们接下做一个简要的对比，并分析一下他们的优缺点:

1. 作为应用网关的基本职责，它们均具有路由转发功能。并且以上提到的网关均支持基于 HOST、URL 的路由转发规则设置。
2. 服务注册与发现，`Spring Cloud Gateway` 等全家桶式解决方案提供了非常丰富的支持选项，对于 java 开发者更为友好，网关上的服务均可通过注册中心服务无缝衔接。而 Ocelot 虽然未内置服务发现与注册方案，但是可以通过 Ocelot + Consul 的方式实现。对比之下 Kubernetes 集群中部署应用，一般采用基于 DNS 的服务发现方式，但并没有为客户端提供一个统一的服务注册发现方式。对外暴露的服务需要显示的创建 Ingress 规则。相比之下 `Spring Cloud Gateway` 类的 API 网关使用相同技术栈，这可以极大的简化开发人员的学习成本。
3. 通用性上，Ingress 是云原生背景下 Kubernetes 社区定义的 API 管理规范。KubeSphere 默认采用 `Nginx Ingress Controller`实现。同时我们可以使用任何兼容的第三方 Ingress 控制器进行替换。Ingress 中只定义了基本共性的功能，但网关通常会提供日志、监控、安全等更多通用的运维工具。相比之下，与语言紧密结合的 API 网关通常与开发平台进行绑定，语言相互替代性较差(不愿引入更多技术栈或无客户端集成支持)。功能相对固定，但大多提供了良好的插件机制，开发人员使用自己熟悉的语言进行拓展。
4. 性能方面，毋庸置疑，以基于 Nginx 的 Ingress Controller 为代表的通用型 API 网关，比 `Spring Cloud Gateway`、`Ocelot` 等有非常明显的性能优势。

总体来讲，每种网关都有其优缺点或局限性。在项目初期应首先考虑应用网关的架构。在基于云原生的场景下，应用路由会是一个不错的选择。而如果您的团队依赖于开发技术栈，那么常用技术栈中的 API 网关通常也会作为首选。但这并不意味着它们必须进行二选一，在一些复杂场景下我们可以结合二者的优势，开发人员使用自己熟知的 API 网关用于服务聚合、认证鉴权等功能，同时在其前方放置应用网关实现日志监控，负载均衡,HTTPs offloading 等工作。

微软官方微服务架构示例 [eShopOnContainers](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/introduce-eshoponcontainers-reference-app "eShopOnContainers") 即采用了该种混合架构。

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627370654-571190-eshoponcontainers-architecture-aggregator-services.png)

## 动手实战

理解以上应用场景和整体架构后，我们接下来演示如何在 KubeSphere 中配置项目网关和应用路由。以下内容将基于 Weaveworks 的微服务演示项目 SockShop 实现。SockShop 是一个典型的前后端分离架构，它由前端服务 `front-end` 和若干后端服务 `catalogue`、`carts`、`orders` 等组成。在当前架构下，`front-end` 除了承担静态页面服务的功能，还承担了后端 API 代理转发的任务。我们假设以下场景，即由 Nodejs 转发 API 造成服务异步阻塞，从而影响页面性能。因此我们决定使用 ingress 直接转发服务 `catalogue` 用以提升性能。下面我们看一下详细配置步骤。

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627370560-468146-socksshop.png)

### 准备工作

1. 在部署 SockShop 之前，我们首先要配置一个用于演示的企业空间 `workspace-demo` 和项目 `sock-shop`。具体步骤请参考[《创建企业空间、项目、帐户和角色》](https://kubesphere.com.cn/docs/quick-start/create-workspace-and-project/ "《创建企业空间、项目、帐户和角色》")

2) 完成项目 `sock-shop` 的创建后，我们接下来使用 `kubectl` 部署 SockShop 的相关服务。您可以使用本地的控制台或 KubeSphere web 工具箱中的 `kubectl`执行以下命令。

```
kubectl -n sock-shop apply -f https://github.com/microservices-demo/microservices-demo/raw/master/deploy/kubernetes/complete-demo.yaml
```

执行过后可以进入 `sock-shop` 的`工作负载`页面查看部署的状态，等待所有的部署都正常运行后，我们再进行下一步操作。

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627371198-6886-workload.png)

### 项目网关配置

1. 进入 `sock-shop` 项目，从左侧导航栏进入项目设置下的高级设置页面，然后点击设置网关。

2. 在接下来弹出的对话框中，需要根据 KubeSphere 的安装环境进行设置。如果您使用的是本地开发环境或私有环境可以选择 `NodePort` 的方式暴露网关。如果是托管 Kubernetes 云服务，一般选择 LoadBalancer。

### 应用路由配置

1. 首先，我们选择左侧导航栏**应用负载**中的**应用路由**，点击右侧的创建。在基本信息中填写名称 `frontend`。在路由规则中，添加一条新的规则。由于是演示项目，我们使用自动生成模式。KubeSphere 自动以<服务名称>.<项目名称>.<网关地址>.nip.io 格式生成域名，该域名由 nip.io 自动解析为网关地址。在路径、服务、端口上依次选择 "/"、"front-end"、"80"。点击**下一步**后，继续点击**创建**。

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627371226-863229-router.png)

2. 路由创建完成后，可以在应用路由列表页面点击 `frontend` 进入详情。并在规则中可以点击**点击访问**访问按钮。在新的浏览器 tab 下，应该出现如下的网站：

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627371245-961841-sockshop.png)

3. 为了与下面的步骤进行对比，我们在 SockShop 的网站页面打开调试功能查看网络请求，以 Chrome 为例只需点击键盘的**F12**键。刷新一下页面后我们找到如下 `catalogue` API 请求：

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627371262-490907-f12.png)

该请求头中的 `X-Powered-By:Express` 表明了这条请求是由前端的 Nodejs 应用转发。

4. 接下来，在 `frontend` 的详情页面点击左侧的**更多操作**，并选择**编辑规则**。在弹出的编辑规则页面，选择刚刚增加的规则，并点击左侧的编辑图标。新增一条路径，在路径、服务、端口上依次选择"/catalogue"、"catalogue"、"80"。保存该设置。编辑后的规则如下：

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627371282-336585-router2.png)

5. 我们再次访问 SockShop 的网站页面，该页面并没有任何变化。我们使用浏览器调试器，再次查看网络请求，`catalogue` 的请求如下：

![](https://kubesphere.com.cn/forum/assets/files/2021-07-27/1627371313-315498-f12-after.png)

我们发现该请求已经没有了 `X-Powered-By:Express` 请求头，这说明了我们上面应用的规则已经生效，`catalogue`相关的 API 请求已经通过应用路由直接转发 `catalogue` 服务了，而不需要再通过 `fron-tend` 服务进行中转。以上的配置我们利用了路由规则的最长匹配规则。“/catalogue”比更路径具有更高的优先级。

更多配置内容可以参考[《应用路由》](https://kubesphere.com.cn/docs/project-user-guide/application-workloads/routes/ "《应用路由》")

## 总结

本篇内容简述了应用路由的基本架构，并与 Kubernetes Service 及其他应用网关分别做了对比。最后通过 SockShop 这个案例讲解的应用路由的配置方法。希望读者对应用路由能有进一步的理解，根据应用的特性选择合适的外部服务暴露方式。