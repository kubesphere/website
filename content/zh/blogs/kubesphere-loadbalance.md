---
title: 'Kubernetes 集群中流量暴露的几种方案'
tag: 'KubeSphere'
keywords: 'KubeSphere, loadbalance, LB, Ingress'
description: '在业务使用 Kubernetes 进行编排管理时，针对业务的南北流量的接入，在 Kuberentes 中通常有几种方案，本文就接入的方案进行简单介绍。'
createTime: '2022-06-23'
author: '薛磊'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-loadbalancer-ingress-cover.png'
---

> 作者：KaliArch（薛磊），某 Cloud MSP 服务商产品负责人，熟悉企业级高可用 / 高并发架构，包括混合云架构、异地灾备，熟练企业 DevOps 改造优化，熟悉 Shell/Python/Go 等开发语言，熟悉 Kubernetes、 Docker、云原生、微服务架构等。

## 背景

在业务使用 Kubernetes 进行编排管理时，针对业务的南北流量的接入，在 Kuberentes 中通常有几种方案，本文就接入的方案进行简单介绍。

## 流量接入方案

Kuberentes 社区通过为集群增设入口点的方案，解决对外流量的管理。

### 通过 kube-proxy 进行代理

通常在最简单的测试或个人开发环境，可以通过 `kubectl port-forward` 来启动一个 kube-proxy 进程代理内部的服务至该命令执行的宿主机节点，如果该宿主机具备公网 IP，且转发监听端口为 `0.0.0.0` 就可以实现公网访问该服务，该方式可以代理单个 Pod，或者 Deployment，或者 Servcie。

```bash
$ kubectl port-forward -h
Forward one or more local ports to a pod. This command requires the node to have 'socat' installed.

 Use resource type/name such as deployment/mydeployment to select a pod. Resource type defaults to 'pod' if omitted.

 If there are multiple pods matching the criteria, a pod will be selected automatically. The forwarding session ends
when the selected pod terminates, and rerun of the command is needed to resume forwarding.

Examples:
  # Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in the pod
  kubectl port-forward pod/mypod 5000 6000

  # Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in a pod selected by the
deployment
  kubectl port-forward deployment/mydeployment 5000 6000

  # Listen on port 8443 locally, forwarding to the targetPort of the service's port named "https" in a pod selected by
the service
  kubectl port-forward service/myservice 8443:https

  # Listen on port 8888 locally, forwarding to 5000 in the pod
  kubectl port-forward pod/mypod 8888:5000

  # Listen on port 8888 on all addresses, forwarding to 5000 in the pod
  kubectl port-forward --address 0.0.0.0 pod/mypod 8888:5000

  # Listen on port 8888 on localhost and selected IP, forwarding to 5000 in the pod
  kubectl port-forward --address localhost,10.19.21.23 pod/mypod 8888:5000

  # Listen on a random port locally, forwarding to 5000 in the pod
  kubectl port-forward pod/mypod :5000
```

### NodePort 方式

其次较常用的为 NodePort 方式，将 K8s 中 service 的类型修改为 NodePort 方式，会得到一个端口范围在 30000-32767 端口范围内的宿主机端口，同样改宿主机具有公网 IP 就可以实现对服务的暴露，但是 NodePort 会占用宿主机端口，一个 Service 对应一个 NodePort，该方式仅为四层，无法实现 SSL 证书的卸载，如果将服务转发到单个 Node 节点的 NodePort 也无法实现高可用，一般需要在 NodePort 前搭配负载均衡来添加多个后端 NodePort 已实现高可用。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220507225416.png)

### LoadBalancer

**四层**

四层流量转发一个 LB 的端口只能对应一个 Service，Servcie 的 Type 为 NodePort，例如如下图，LoadBalancer 上的 88 端口对应转发到后端 NodePort 的 32111 端口，对应到 servcieA；LB 上的 8080 端口对应转发到后端 NodePort32001 端口；该方案可以通过添加多个 NodePort 方式实现高可用，但是由于为四层无法实现对 SSL 的卸载，对应 NodePort 需要在 LB 占用一个端口。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220508200534.png)

**七层**

七层可以借助 LB 的域名转发，实现一个域名端口对应多个 Service，如图可以根据 path 路径，/cmp 对应 NodePort 的 32111，/gateway 对应 NodePort 的 32000 端口，不仅可以实现高可用，而且七层可以实现 SSL 卸载。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220508200822.png)

目前一般公有云的 LB 级别都具备四层和七层的功能，配合使用可以实现灵活的业务流量暴露。

### Ingress

在 K8s 中，存在有 Ingress 资源来实现单个域名转发根据不同的路径或其他配置规则转发到 K8s 集群内部不同的 Service，但是用户请求需要访问 Ingress 实现控制器的 NodePort 例如 Ingress-nginx 的 Controller 的 Service 的 NodePort，针对具体的业务域名一般不会带端口，所以一般前面还需要一层 80/443 的端口转发。

一般 Ingress 的 Controller 实现业界也有不少解决方案，例如比较知名的 Ingress—nginx/Ingress-traefik 等。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220508205644.png)

### LoadBalancer + Ingress

如下图所示在最前面有一个四层 LB 实现端口 80/443 转发至 ingress-provider 的 Service 的 NodePort，K8s 集群内部配置有多个 service。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220508195018.png)

## Ingress-nginx 详解

在上面的几种方案中，均有用到 Ingress，Nginx-ingress 为 Nginx 官方提供的实现 K8s ingress 资源的方案，同时 Kubernetes 官方也提供了基于 Nginx 实现的 Ingress 方案。 

Nginx Ingress 由资源对象 Ingress、Ingress 控制器、Nginx 三部分组成，Ingress 控制器的目标是构建完成一个配置文件（nginx.conf），主要通过检测配置文件发生改变后重载 Nginx 实现，但并不是仅在 Upstream 更改时重载 Nginx（部署应用程序时修改 Endpoints），使用 lua-nginx-module 实现。

根据下图可以更好的理解 Ingress-nginx 的使用场景。

![](https://pek3b.qingstor.com/kubesphere-community/images/20220529220206.png)

图中展示如下信息：

- 一个 K8s 集群
- 集群用户管理、用户A和用户 B，它们通过 Kubernetes API 使用集群。
- 客户端 A 和客户端 B，它们连接到相应用户部署的应用程序 A 和 B。
- IC，由 Admin 部署在名称空间 nginx-ingress 中的 pod 中，并通过 ConfigMap nginx-ingress 进行配置。Admin 通常部署至少两个 pod 以实现冗余。IC 使用 Kubernetes API 获取集群中创建的最新入口资源，然后根据这些资源配置 NGINX。
- 应用程序 A 由用户 A 在命名空间 A 中部署了两个吊舱。为了通过主机 A.example.com 向其客户机（客户机 A）公开应用程序，用户 A 创建入口 A。
- 用户 B 在命名空间 B 中部署了一个 pod 的应用程序 B。为了通过主机 B.example.com 向其客户机（客户机 B）公开应用程序，用户 B 创建 VirtualServer B。
- 公共端点，它位于 IC 吊舱前面。这通常是一个 TCP 负载均衡器（云、软件或硬件），或者这种负载均衡器与 NodePort 服务的组合。客户端 A 和 B 通过公共端点连接到他们的应用程序。

黄色和紫色箭头表示与客户端通信量相关的连接，黑色箭头表示对 Kubernetes API 的访问。

为了简单，没有显示许多必要的 Kubernetes 资源，如部署和服务，管理员和用户也需要创建这些资源。

## 其他

在 K8s 中，通常云厂商的 LB 一般云厂商提供适配 CNI，会在创建 K8s 集群时会自动创建 LB 类型的 servcie，例如阿里的 ACK，腾讯的 TKE，华为的 CCE等，但是在我们自建或个人测试场景，开源的 [Metallb](https://github.com/metallb/metallb)是一个不错的选择，其作用通过 K8s 原生的方式提供 LB 类型的 Service 支持，开箱即用，当然还有青云科技 KubeSphere 团队开源的负载均衡器插件 [OpenELB](https://openelb.io/)，是为物理机（Bare-metal）、边缘（Edge）和私有化环境设计的负载均衡器插件，可作为 Kubernetes、K3s、KubeSphere 的 LB 插件对集群外暴露 “LoadBalancer” 类型的服务。在 2021 年 11 月已进入 CNCF 沙箱（Sandbox）托管，也是解决用户将 Kubernetes 集群部署在裸机上，或是私有化环境特别是物理机或边缘集群，Kubernetes 并不提供 LoadBalancer 的痛点，提供与基于云的负载均衡器相同的用户体验。