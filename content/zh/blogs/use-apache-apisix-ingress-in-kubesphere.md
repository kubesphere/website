---
title: '在 Kubernetes 中安装和使用 Apache APISIX Ingress 网关'
tag: 'KubeSphere, APISIX'
keyword: 'Kubernetes, KubeSphere, APISIX, Ingress, 网关, Service Monitor'
description: '本文以 Apache APISIX Ingress Controller 为例介绍如何通过 KubeSphere 快速为 Kubernetes 集群使用两种不同类型的网关，同时对它们的使用状态进行监控。'
createTime: '2021-11-25'
author: '张海立'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202111301254175.png'
---

[KubeSphere 3.2.0 发布了！](https://kubesphere.com.cn/blogs/kubesphere-3.2.0-ga-announcement/)为项目网关增配了整套监控及管理页面，同时引入了集群网关来提供集群层面全局的 Ingress 网关能力。当然，我们还是可以部署使用第三方 Ingress Controller，本文将以 [Apache APISIX Ingress Controller](https://apisix.apache.org/docs/ingress-controller/getting-started/) 为例介绍如何通过 KubeSphere 快速为 Kubernetes 集群使用两种不同类型的网关，同时对它们的使用状态进行监控。

本文将分为一下几部分展开：

- KubeSphere 项目网关的新管理界面的应用展示
- 通过 KubeSphere 的应用管理能力快速使用 Apache APISIX Ingress Controller
- 利用 KubeSphere 的自定义监控能力获取 Apache APISIX 网关的运行指标

## 准备工作

### 安装 KubeSphere

安装 KubeSphere 有两种方法。一是在 Linux 上直接安装，可以参考文档：[在 Linux 安装 KubeSphere](https://kubesphere.com.cn/docs/quick-start/all-in-one-on-linux/)； 二是在已有 Kubernetes 中安装，可以参考文档：[在 Kubernetes 安装 KubeSphere](https://kubesphere.com.cn/docs/quick-start/minimal-kubesphere-on-k8s/)。

KubeSphere 最小化安装版本已经包含了监控模块，因此不需要额外启用，可以通过「系统组件」页面中的「监控」标签页确认安装状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251132484.png)

### 部署 httpbin 演示应用

由于需要演示网关的访问控制能力，我们必须要先有一个可以访问的应用作为网关的后台服务。这里我们使用 [httpbin.org](http://httpbin.org/) 提供的 [kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) 容器应用作为演示应用。

在 KubeSphere 中，我们可以先创建新的项目或使用已有的项目，进入项目页面后，选择「应用负载」下的「服务」直接创建无状态工作负载并生成配套的服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251132702.png)

使用 [kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) 容器默认的 `80` 端口作为服务端口，创建完成后确保在「工作负载」和「服务」页面下都可以看到 `httpbin` 的对应条目，如下图所示。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251133444.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251133780.png)


## 项目网关的新面貌

[项目网关](https://kubesphere.com.cn/docs/project-administration/project-gateway/) 是 KubeSphere 3.0 以来就有的功能：“KubeSphere 项目中的网关是一个 [NGINX Ingress 控制器](https://www.nginx.com/products/nginx-ingress-controller/)。KubeSphere 内置的用于 HTTP 负载均衡的机制称为 [应用路由](https://kubesphere.com.cn/docs/project-user-guide/application-workloads/routes/)，它定义了从外部到集群服务的连接规则。如需允许从外部访问服务，用户可创建路由资源来定义 URI 路径、后端服务名称等信息。”

下面我们首先进入已部署了 httpbin 服务的项目，在「项目设置」中打开「网关设置」页面，然后执行「开启网关」操作。方便起见，直接选择 `NodePort` 作为「访问方式」即可。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251135346.png)

确定后回到网关页面，稍等片刻后刷新页面，可以得到如下图这样的部署完成状态，可以看到 NodePort 默认被赋予了两个节点端口。下面我们通过右上角的「管理」按钮「查看详情」。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251135390.png)

此时我们看到的便是 3.2.0 新带来的项目/集群网关的新监控页面！但是现在显然是没有数据的，因为我们还没有任何流量从网关产生。那么下面我们就需要为 httpbin 服务创建应用路由。

从「应用负载」进入「应用路由」页面，开始「创建」路由。为路由取名为 `httpbin` 后，我们指定一个方便测试的域名，并设置「路径」为 `/`, 选择「服务」`httpbin` 和「端口」`80`。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251135908.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251135500.png)


直接下一步跳过高级设置后完成路由创建，可以得到如下图这样的一条新的 `httpbin` 应用路由项。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251136488.png)

下面我们可以通过项目网关的 NodePort 地址及指定的域名（如这里是 `http://httpbin.ui:32516`）来访问 httpbin 应用服务，随意刷新或操作一下页面的请求生成功能，再进入网关的详情页面，便可以看到在「监控」面板上已经出现了网关的一些内置的监控指标展示。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251136470.png)


### 为网关指定 NodePort 节点端口

对于公有云环境，如果使用 NodePort 方式向外暴露访问能力，开放端口通常是有限且受控的，因此对于网关所使用的 NodePort 我们需要能够对它进行修改。

由于网关是被 KubeSphere 统一管理的，要修改网关服务的 NodePort，需要具备访问 `kubesphere-controls-system` 项目的权限。进入改项目后，通过「应用负载」的「服务」页面即可找到命名为 `kubesphere-router-<project-namespace>` 形式且外部访问已开放 NodePort 的网关服务。NodePort 服务端口需要通过「编辑 YAML」来直接修改。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251136481.png)


## 开始使用集群网关

> 在 KubeSphere 3.1 中只支持项目级别的网关，如果用户的项目过多，势必会造成资源的浪费。而且不同的企业空间中的网关都是相互独立的。
> 
> KubeSphere 3.2.0 开始支持集群级别的全局网关，所有项目可共用同一个网关，之前已创建的项目网关也不会受到集群网关的影响。也可以统一纳管所有项目的网关，对其进行集中管理和配置，管理员用户再也不需要切换到不同的企业空间中去配置网关了。

进入 KubeSphere 3.2.0 版本之后，我们更推荐大家使用集群网关的功能来统一整个集群的应用路由。要启用集群网关其实也非常简单：使用具备集群管理权限的账号，进入其可管理的某个集群（如我们这里以 `default` 集群为例），在「集群设置」的「网关设置」中即可「开启网关」，同时查看「项目网关」。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251136424.png)

集群网关开启的方式以及对齐 NodePort 访问端口的修改和之前项目网关的操作基本上是完全一样的，所以这里对过程就不做过多赘述了。

**⚠️ 有一点需要特别注意的是**：集群网关开启后，已经开启的项目网关还会保留；但尚未创建网关的项目是无法再创建单独的网关的，会直接使用集群网关。

下图展示了已创建网关的项目，在同时拥有项目及集群网关后，在「网关设置」页面所呈现的所有网关概览。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251137447.png)


## 快速使用 Apache APISIX Ingress Controller

> Apache APISIX 是一款开源的高性能、动态云原生网关，由深圳支流科技有限公司于 2019 年捐赠给 Apache 基金会，当前已经成为 Apache 基金会的顶级开源项目，也是 GitHub 上最活跃的网关项目。Apache APISIX 当前已经覆盖了 API 网关，LB，Kubernetes Ingress，Service Mesh 等多种场景。

社区之前也介绍过如何 [使用 Apache APISIX 作为 Kubernetes 的 Ingress Controller](https://kubesphere.com.cn/blogs/kubesphere-apacheapisix/)，本文讲更多侧重介绍前文未涉及之细节，并结合 KubeSphere 的一些新功能加以具像化。


### 部署 Apache APISIX Ingress Controller

首先还是先要添加 Apache APISIX Helm Chart 仓库，推荐用这种自管理的方式来保障仓库内容是得到及时同步的。我们选定一个企业空间后，通过「应用管理」下面的「应用仓库」来添加如下一个 Apache APISIX 的仓库（仓库 URL：`https://charts.apiseven.com`）。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251137442.png)


接下来我们创建一个名为 `apisix-system` 的项目。进入项目页面后，选择在「应用负载」中创建「应用」的方式来部署 Apache APISIX，并选择 `apisix` 应用模版开始进行部署。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251137587.png)

> 为何是部署 Apache APISIX 应用的 Helm Chart，而不是直接部署 Apache APISIX Ingress Controller?<br />
> 
> 这是因为 Apache APISIX Ingress Controller 目前和 Apache APISIX 网关是强关联的（如下图所示），且目前通过 Apache APISIX Helm Charts 同时部署 Apache APISIX Gateway + Dashboard + Ingress Controller 是最方便的，因此本文推荐直接使用 Apache APISIX 的 Helm Chart 进行整套组件的部署。
> 
> ![](https://pek3b.qingstor.com/kubesphere-community/images/202111251137250.png)

将应用命名为 `apisix` 以避免多个组件（Gateway, Dashboard, Ingress Controller）的工作负载及服务名称产生不匹配的情况；在安装步骤中编辑的「应用设置」的部分，请参照以下配置进行填写（**请特别注意带有【注意】标记的注释部分的说明，其余可以按需自行编辑修改**）。

```yaml
global:
  imagePullSecrets: []
  
apisix:
  enabled: true
  customLuaSharedDicts: []
  image:
    repository: apache/apisix
    pullPolicy: IfNotPresent
    tag: 2.10.1-alpine
  replicaCount: 1
  podAnnotations: {}
  podSecurityContext: {}
  securityContext: {}
  resources: {}
  nodeSelector: {}
  tolerations: []
  affinity: {}
  podAntiAffinity:
    enabled: false
    
nameOverride: ''
fullnameOverride: ''

gateway:
  type: NodePort
  externalTrafficPolicy: Cluster
  http:
    enabled: true
    servicePort: 80
    containerPort: 9080
  tls:
    enabled: false
    servicePort: 443
    containerPort: 9443
    existingCASecret: ''
    certCAFilename: ''
    http2:
      enabled: true
  stream:
    enabled: false
    only: false
    tcp: []
    udp: []
  ingress:
    enabled: false
    annotations: {}
    hosts:
      - host: apisix.local
        paths: []
    tls: []
    
admin:
  enabled: true
  type: ClusterIP
  externalIPs: []
  port: 9180
  servicePort: 9180
  cors: true
  credentials:
    admin: edd1c9f034335f136f87ad84b625c8f1
    viewer: 4054f7cf07e344346cd3f287985e76a2
  allow:
    ipList:
      - 0.0.0.0/0
      
plugins:
  - api-breaker
  - authz-keycloak
  - basic-auth
  - batch-requests
  - consumer-restriction
  - cors
  - echo
  - fault-injection
  - grpc-transcode
  - hmac-auth
  - http-logger
  - ip-restriction
  - ua-restriction
  - jwt-auth
  - kafka-logger
  - key-auth
  - limit-conn
  - limit-count
  - limit-req
  - node-status
  - openid-connect
  - authz-casbin
  - prometheus
  - proxy-cache
  - proxy-mirror
  - proxy-rewrite
  - redirect
  - referer-restriction
  - request-id
  - request-validation
  - response-rewrite
  - serverless-post-function
  - serverless-pre-function
  - sls-logger
  - syslog
  - tcp-logger
  - udp-logger
  - uri-blocker
  - wolf-rbac
  - zipkin
  - traffic-split
  - gzip
  - real-ip
  #【注意】添加此插件以配合 Dashboard 展示服务信息
  - server-info

stream_plugins:
  - mqtt-proxy
  - ip-restriction
  - limit-conn

customPlugins:
  enabled: true
  luaPath: /opts/custom_plugins/?.lua
  #【注意】如下配置保障 Prometheus 插件可对外暴露指标
  plugins:
  	- name: prometheus
    	attrs:
      	export_addr:
        	ip: 0.0.0.0
          port: 9091
      configMap:
      	name: prometheus
        mounts: []

dns:
  resolvers:
    - 127.0.0.1
    - 172.20.0.10
    - 114.114.114.114
    - 223.5.5.5
    - 1.1.1.1
    - 8.8.8.8
  validity: 30
  timeout: 5

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80

configurationSnippet:
  main: ''
  httpStart: ''
  httpEnd: ''
  httpSrv: ''
  httpAdmin: ''
  stream: ''

etcd:
  enabled: true
  host:
    - 'http://etcd.host:2379'
  prefix: /apisix
  timeout: 30
  auth:
    rbac:
      enabled: false
      user: ''
      password: ''
    tls:
      enabled: false
      existingSecret: ''
      certFilename: ''
      certKeyFilename: ''
      verify: true
  service:
    port: 2379
  replicaCount: 3

dashboard:
  enabled: true
  #【注意】为 Dashboard 开启 NodePort 方便后续使用
  service:
  	type: NodePort

ingress-controller:
  enabled: true
  config:
    apisix:
    	#【注意】一定要设置 gateway 所在的 namespace
      serviceNamespace: apisix-system
  serviceMonitor:
    enabled: true
    namespace: 'apisix-system'
    interval: 15s
```

部署成功后，点击应用名称进入详情页面，可以在「资源状态」标签页下看到如下的服务部署和工作状态运行状态展示。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251139749.png)

> 💡 Apache APISIX 项目另有的两个 Helm Chart 对应的默认配置参数可以分别参考：[Dashboard](https://github.com/apache/apisix-helm-chart/blob/master/charts/apisix-dashboard/values.yaml) 和 [Ingress Controller](https://github.com/apache/apisix-helm-chart/blob/master/charts/apisix-ingress-controller/values.yaml) 的 `values.yaml`。

### 使用 Apache APISIX Dashboard 了解系统信息

Apache APISIX 应用部署完成后，首先我们通过 Apache APISIX Dashboard 来检验一下 Apache APISIX 网关的当前状态。从「应用负载」的「服务」页面，我们可以找到 `apisix-dashboard` 的服务，由于我们在应用配置中已经为 Dashboard 开启了 NodePort，所以这里我们可以直接通过 NodePort 端口来访问 Dashboard。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251139717.png)


使用默认的用户名及密码 `admin` 登录 Apache APISIX Dashboard，可以进入「系统信息」页面即可查看到我们当前连接管理的「Apache APISIX 节点」的信息。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251139089.png)

### 使用 Apache APISIX Ingress Controller

让我们回到「应用路由」页面，另外新建一个路由（如 `apisix-httpbin`），设置路径为 `/*` `httpbin` `80` 并为其添加 `kubernetes.io/ingress.class`: `apisix` 的键值。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251139013.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251140083.png)

创建完成后如何验证应用路由生效呢？首先，我们可以回到 Apache APISIX Dashboard，进入「路由」页面，可以看到新建的应用路由已经被 Apache APISIX Ingress Controller 识别之后自动添加到了 Apache APISIX 网关中，在「上游」页面也可以看到自动创建的一个上游条目。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251140841.png)


然后我们回到 `apisix-system` 项目的「服务」页面，找到 `apisix-gateway` 服务对应的端口，由此访问 `<apisix-httpbin 应用路由指定的域名>:<apisix-gateway 外部访问端口>`（例如此处为 `httpbin.ui:30408`）即可访问到 `apisix-httpbin` 应用路由所关联的后台服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251140229.png)


## 自定义监控 Apache APISIX 网关

Apache APISIX 网关可用之后其实是缺少像原生集群或项目网关这样自带的状态监控能力的，但这个我们也可以通过 Apache APISIX 的 Prometheus 插件以及 KubeSphere 自带的自定义监控能力来弥补。

### 暴露 Apache APISIX 网关的 Prometheus 监控指标

由于我们在部署 Apache APISIX 应用时已经开启了 [Prometheus 插件](https://apisix.apache.org/docs/apisix/plugins/prometheus)，所以这里我们只需要把 Prometheus 监控指标的接口暴露出来即可。进入 `apisix-system` 项目，在「工作负载」页面找到 `apisix` 并进入部署详情页面，随后在左侧操作面板的「更多操作」中选择「编辑设置」。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251140256.png)


在弹出的「编辑设置」面板中，进入到 `apisix` 容器的编辑界面，找到「端口设置」，添加一个新的名为 `prom` 的端口映射到容器的 `9091` 端口，保存后 `apisix` 工作负载会重启。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251141636.png)


### 为 Apache APISIX 网关监控指标创建 ServiceMonitor

下面我们需要将已暴露的指标接口接入到 KubeSphere 自带的 Prometheus 中使之可被访问（被抓取指标数据），由于 KubeSphere 是通过 [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) 来维护内部的 Prometheus 系统的，所以最方便的方式自然是直接创建一个 ServiceMonitor 资源来实现指标接口的接入。

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: apisix
  namespace: apisix-system
spec:
  endpoints:
    - scheme: http
    	#【注意】使用上一步中工作负载暴露的容器端口名称
    	targetPort: prom
    	#【注意】需要正确绑定 apisix 对应的指标接口路径
    	path: /apisix/prometheus/metrics
      interval: 15s
  namespaceSelector:
    matchNames:
      - apisix-system
  selector:
    matchLabels:
      app.kubernetes.io/name: apisix
      app.kubernetes.io/version: 2.10.0
      helm.sh/chart: apisix-0.7.2

```

使用 `kubectl apply -f your_service_monitor.yaml` 创建这个 ServiceMonitor 资源。创建成功后，如果有集群管理权限，也可以在集群的 CRD 管理页面中搜索查看 ServiceMonitor 资源并找到名为 `apisix` 的自定义资源，也可以在这里做后续的 YAML 修改。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251141035.png)


### 将 Apache APISIX 网关指标接入自定义监控面板

下面我们在项目左侧菜单列表中找到「监控告警」中的「自定义监控」，开始「创建」自定义监控面板。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251141680.png)

在弹出窗口中填入「名称」，选择「自定义」监控模版，并进入「下一步」的监控面板创建。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251141043.png)


进入编辑页面后现在左侧点击 `+` 区域，在右侧的「数据」区域进行 Prometheus 监控指标的配置，例如这里我们可以用 `sum(apisix_nginx_http_current_connections)` 来统计 Apache APISIX 网关实时的连接总数。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251142792.png)


保存后在页面右下角找到「+ 添加监控项」，我们选择「折线图」来创建一个 `Nginx connection state` 指标：使用 `sum(apisix_nginx_http_current_connections) by (state)` 作为指标、`{{state}}` 用作图例名称、选择「图例类型」为堆叠图，即可得到类似如下的图表显示效果。保存模版后即可得到您的第一个自定义监控面板！

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251142266.png)

> Apache APISIX 网关目前提供的 Prometheus 指标可以参见官方文档的 [可有的指标](https://apisix.apache.org/zh/docs/apisix/plugins/prometheus/#%E5%8F%AF%E6%9C%89%E7%9A%84%E6%8C%87%E6%A0%87) 部分。


由于指标配置起来还是比较麻烦的，推荐在集群层面的「自定义监控」中直接导入 [Apache APISIX Grafana 模版](https://grafana.com/grafana/dashboards/11719)（下载 JSON 通过「本地上传」进行导入）。

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251142917.png)

创建完成后可以直接得到一个非常丰富的 Apache APISIX 网关监控面板。KubeSphere 也同时在 [积极推进](https://github.com/kubesphere/kubesphere/issues/4433) 将 Grafana 模版导入的功能引入到项目的自定义监控能力中去，敬请期待！

![](https://pek3b.qingstor.com/kubesphere-community/images/202111251142354.png)

至此，我们了解了 KubeSphere 3.2.0 中新的项目及集群网关的更丰富的状态信息展示能力；同时也完成了 Apache APISIX Ingress 网关接入 KubeSphere 并对其使用自定义监控。让我们开启 KubeSphere 应用网关的奇妙旅程吧～