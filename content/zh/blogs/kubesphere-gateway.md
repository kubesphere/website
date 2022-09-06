---
title: 'KubeSphere 网关的设计与实现'
tag: 'KubeSphere, Ingress'
keywords: 'KubeSphere, Ingress, 网关, Gateway'
description: '本文介绍了 KubeSphere 网关的设计和实现方式以及使用过程的注意事项。'
createTime: '2022-08-26'
author: '泓舟子'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202209061247416.jpg'
---

## KubeSphere 中为什么需要网关？

如果需要将 K8s 集群内的服务暴露到外部访问有那些方式呢？可以通过将 Service 设置成 NodePort 方式暴露出去或者通过 Ingress  方式。另外使用 Ingress 方式可以实现将请求分发到一个或多个 Service，可以同一个 IP 地址下暴露多个服务等优势。

但是对于 Ingress 方式而言，在 K8s 中只是内置了 Ingress CRD（可以创建 Ingress 资源），没有内置 Ingress  Controller，必须部署了 Ingress Controller 才能为 Ingress 资源提供外部访问集群内部服务的能力。而  KubeSphere 中的网关就是 Ingress Controller 。

## 网关的设计

KubeSphere v3.2 对网关进行了重构，在保留了原有网关功能的基础上增加了以下几点新功能：

1. 启用集群和项目级别的网关：可以根据业务上的需求灵活选择不同粒度的网关。
2. 增减网关副本数：灵活调整副本数达到更高的可用性。
3. 灵活配置 Ingress Controller 配置选项。
4. 可指定网关应用负载安装的位置：可选择将网关应用负载安装的位置指定某固定命名空间或分别让其位于各自项目命名空间下。结合 KubeSphere 中的权限管理，若让资源位于各个项目命名空间下，拥有该项目权限的用户也能查看到网关资源。
5. 网关日志：集中查询网关日志，将分布在各个副本的网关日志集中起来查询。
6. 网关监控指标：监控网关中的一些指标，包括请求总量/成功率/延迟 等指标。

## 网关的实现

目前 K8s 支持和维护 [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme)、 [GCE](https://git.k8s.io/ingress-gce/README.md) 和 [Nginx](https://git.k8s.io/ingress-nginx/README.md#readme) Ingress 控制器，KubeSphere 使用  [Ingress Nginx Controller](https://github.com/kubernetes/ingress-nginx) 作为默认的网关实现，没有做任何代码修改。

### 各个功能点的实现思路

- 集群和项目级别的网关：这个通过传入参数覆盖默认的 Helm Chart Values  来实现并在代码逻辑里控制，如果启用了集群网关就不能启用项目网关了；若启用了项目网关又启用了集群网关，那么通过两个网关入口都可以访问，只是这样会有两个 Ingress Controller 同时 Watch 相同的 Ingress 对象。
- 增减网关副本数&配置 Ingress Controller 配置选项：这个通过传入参数覆盖默认的 Helm Chart Values 来实现，实现过程用到的 Helm Operator 将在后面重点介绍。
- 可指定网关应用负载安装的位置：可选择将网关应用负载安装的位置指定某固定命名空间或分别让其位于各自项目命名空间下。这个在代码逻辑中控制，并做成了配置项，默认将所有资源安装在 kubesphere-controls-system 下。
- 网关日志：使用到了 KubeSphere 中日志组件，日志组件会采集日志数据然后存储在 Elasticsearch 中，网关在查询日志过程就根据参数在 Elasticsearch 中查询日志。
- 网关监控指标：使用到了 KubeSphere 中监控组件，KubeSphere 内部配置了 Prometheus 相关的参数采集 Ingress 相关指标，查询监控信息过程就根据监控组件中的 API 查询相关数据。

下面重点介绍设计实现过程抽象出的 CRD 和如何巧妙地用 Helm Operator 集成。

### 抽象出 Gateway CRD 做适配

在设计上抽象了一个 Gateway CRD 来适配不同的 Ingress Controller，Gateway CRD 中包含设置 Ingress  Controller 所需的公共属性。KubeSphere API 和 UI 只与 Gateway CRD 交互。

```yaml
# Gateway sample
apiVersion: gateway.kubesphere.io/v1alpha1
kind: Gateway
metadata:
  name: kubesphere-router-proj1
  namespace: kubesphere-controls-system # all Gateway workload will be created in the kubesphere-controls-system namespace by default. However, it's configurable in kubesphere-config when calling KubeSphere API. 
spec:
  controller:
  # controlpanel replicas. For ingress Controler that has controlpanel and workers. *Reserved field. Changing on UI isn't supported yet. 
  replicas: 1
  # annotations of the controlpanel deployment. *Reserved field. Changing on UI isn't supported yet. 
  annotations: {}
  
  # Watching scope,
  # enabled =true, watching for the project only. The user needs to specify the watching namespace.
  # enabled =false, Global gateway, watching for all namespaces.
  scope:
    enabled: false
    namespace: ""  # defaults to .Release.Namespace

  # gateway configurations. only key-value pair supported currently.
  config:
    max-bucket: 1m

  # worker workload deployment configuration
  deployment:
    annotations: 
    "servicemesh.kubesphere.io/enabled": "false"
    replicas: 1

  # 
  service:
    # Cloud LoadBalancer configurations for service
    annotations: 
      "service.beta.kubernetes.io/qingcloud-load-balancer-eip-ids": "test-ip-id"
    # Service Type, only LoadBalancer and NodePort are supported
    type: LoadBalancer
```

### 集成 Nginx Ingress Controller

KubeSphere 使用 Nginx Ingress Controller 作为默认的网关实现。为了简化部署步骤，我们集成了 [Helm-operator-plugins](https://github.com/operator-framework/helm-operator-plugins) 作为 [Helm Operator](https://sdk.operatorframework.io/docs/building-operators/helm/) 。

#### 在 Helm Operator 中主要有以下关键点：

根据 watch.yaml 中配置的监听指定 CRD 下的 CR 来创建或更新 Chart 资源。其中可以根据 CR spec 中的值覆盖默认 Helm Chart 中的值，这是由 Helm Operator 中的机制决定的，[详见官方说明](https://sdk.operatorframework.io/docs/building-operators/helm/tutorial/#understanding-the-nginx-cr-spec)。

如下的含义是需要 Watch `gateway.kubesphere.io/v1alpha1` 的 Nginx CR，如果有变化就触发 Reconcile ，根据 chart 中配置的地址创建或更新对应的资源。

```yaml
- group: gateway.kubesphere.io
  version: v1alpha1
  kind: Nginx
  chart: /var/helm-charts/ingress-nginx
```

#### 在 KubeSphere 中的使用：

watchs.yaml 中就做了如下配置：

```yaml
- group: gateway.kubesphere.io
  version: v1alpha1
  kind: Nginx
  chart: /var/helm-charts/ingress-nginx
- group: gateway.kubesphere.io
  version: v1alpha1
  kind: Gateway
  chart: /var/helm-charts/gateway
```

其中对 chart 而言：

- Nginx 是用的官方的 Helm Chart，在打包 ks-controller-manager 时下载的官方 Helm Chart。详见：https://github.com/kubesphere/kubesphere/blob/v3.2.0/build/ks-controller-manager/Dockerfile#L34
- Gateway 是在 KubeSphere 中定制的 Helm Chart，里面主要就操作了 Nginx CR 资源。详见：https://github.com/kubesphere/kubesphere/blob/v3.2.0/config/gateway/templates/nginx-ingress.yaml

整体而言：

Helm Operator Watch 了 Gateway 和 Nginx 2 个 CRD 的资源，当前端发起创建或更新网关时是对 Gateway CR 发起创建或更新操作：

1. 发起请求创建或更新 Gateway CR ；
2. 根据 watchs.yaml 配置的 Gateway， Helm Operator 监听到有 Gateway CR 资源变化，将创建或更新 Nginx CR ；
3. 根据 watchs.yaml 配置的 Nginx，Helm Operator 监听到 Nginx CR 资源变化后就根据 Nginx CR 中的  spec 中的值来覆盖默认 Helm Chart 中的值来创建或更新 Nginx Ingress Contoller。

### 配置项的设计

为了方便更改网关的一些参数设计了如下配置项：

```yaml
gateway:
  watchesPath: /var/helm-charts/watches.yaml
  repository: kubesphere/nginx-ingress-controller
  tag: v1.1.0
  namespace: kubesphere-controls-system
```

- watchesPath：指定 Helm Operator Watch 的配置文件，如果需要禁用 Helm Operator 就可以删掉这个配置项。
- repository：指定 nginx-ingress-controller 的仓库。
- tag：指定 nginx-ingress-controller 的 tag。
- namespace：指定网关应用负载安装的位置位于指定的命名空间下，若删掉这个配置项就会安装在各个项目命名空间下。

## 使用过程注意事项

1. 如果启用了 servicemesh ，在原有的 Ingress 需要加上额外的注解 `nginx.ingress.kubernetes.io/upstream-vhost: [service-name].[service-namespace].svc.cluster.local` 流量拓扑/链路追踪可以正常工作，不然入口流量处会有异常。

2. 修改网关相关属性，比如：副本数、Nginx 配置项等，不能直接在相关的 deploy/configmap 等应用负载里面修改，需要在网关设置中修改（修改的是 Gateway  CR）。因为使用的是 Helm Operator 来管理控制网关相关资源的状态，所有值都会以 Gateway CR  中的配置为准，改了网关相关应用负载中的值最终都会被 Helm Operator 还原掉。

## 参考：

+ [https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)
+ [https://github.com/kubesphere/community/blob/master/sig-microservice/concepts-and-designs/KubeSphere-gateway-operator-design.md](https://github.com/kubesphere/community/blob/master/sig-microservice/concepts-and-designs/KubeSphere-gateway-operator-design.md)
+ [https://github.com/kubesphere/kubesphere](https://github.com/kubesphere/kubesphere)
+ [https://sdk.operatorframework.io/docs/building-operators/helm/](https://sdk.operatorframework.io/docs/building-operators/helm/)