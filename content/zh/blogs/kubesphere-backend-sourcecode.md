---
title: 'KubeSphere 后端源码深度解析'
tag: 'KubeSphere'
keywords: 'KubeSphere, 后端源码, Kubernetes'
description: '这篇文章我们将学习在 vscode 上的 ssh remote 插件基础上，尝试 debug 和学习 KubeSphere 后端模块架构。'
createTime: '2022-01-19'
author: '朱含'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-backend-sourcecode.png'
---

这篇文章我们将学习在 vscode 上的 ssh remote 插件基础上，尝试 debug 和学习 KubeSphere 后端模块架构。

## 前提

- 安装好 vscode 以及 ssh remote container 插件；
- 在远程主机上安装好 kubenertes 容器 " 操作系统 " 和 KubeSphere >= v3.1.0 云“控制面板”；
- 安装 go >=1.16;
- 在 KubeSphere 上安装了需要 debug 的 KubeSphere 组件，如 devops、kubeedge 或者 whatever, 如果是默认激活的组件，像 monitoring，不需要去激活。

## 配置 launch 文件

```json
$ cat .vscode/launch.json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "ks-apiserver",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${workspaceFolder}/cmd/ks-apiserver/apiserver.go"
        }
        
    ]
}
```

## ks-apiserver 调试依赖文件

在相对路径 cmd/ks-apiserver/ 下配置 kubesphere.yaml。

首先，查看集群之中的 cm 配置文件 :

```bash
$ kubectl -n kubesphere-system get cm kubesphere-config -oyaml
```

因为上述 configmap 中差少 kubeconfig 相关配置，所以需要将上述 yaml 文件拷贝出来整合以下。

为啥要用添加 kubeconfig 文件？

主要是因为 K8s 在创建 client 时需要这么一个文件 , 而容器中会用到 inclusterconfig 就不需要添加了。

感兴趣可以看下 client-go 的例子：

> https://github.com/kubernetes/client-go/blob/master/examples/in-cluster-client-configuration/main.go#L41
>
> https://github.com/kubernetes/client-go/blob/master/examples/out-of-cluster-client-configuration/main.go#L53

所以完整的配置启动文件如下：

```yaml
$ cat ./cmd/ks-apiserver/kubesphere.yaml
kubernetes:
  kubeconfig: "/root/.kube/config"
  master: https://192.168.88.6:6443
  $qps: 1e+06
  burst: 1000000
authentication:
  authenticateRateLimiterMaxTries: 10
  authenticateRateLimiterDuration: 10m0s
  loginHistoryRetentionPeriod: 168h
  maximumClockSkew: 10s
  multipleLogin: True
  kubectlImage: kubesphere/kubectl:v1.20.0
  jwtSecret: "Xtc8ZWUf9f3cJN89bglrTJhfUPMZR87d"
  oauthOptions:
    clients:
    - name: kubesphere
      secret: kubesphere
      redirectURIs:
      - '*'
network:
  ippoolType: none
monitoring:
  endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
  enableGPUMonitoring: false
gpu:
  kinds:
  - resourceName: nvidia.com/gpu
    resourceType: GPU
    default: True
notification:
  endpoint: http://notification-manager-svc.kubesphere-monitoring-system.svc:19093
  
kubeedge:
  endpoint: http://edge-watcher.kubeedge.svc/api/

gateway:
  watchesPath: /var/helm-charts/watches.yaml
  namespace: kubesphere-controls-system
```

除了 kubernetes, 第一层的 key 表示我们集群中已经按照或者默认激活的 KubeSphere 组件，现在就可以通过 F5 来启动 debug 了。

在 debug 之前，你可能会问，这个配置文件为啥要放在 /cmd/ks-apiserver/kubesphere.yaml?

我们先来探索一波 ks-apiserver 的运行逻辑。

## 启动 ks-apiserver

查看 cmd/ks-apiserver/app/server.go 的逻辑 :

```go
// Load configuration from file
conf, err := apiserverconfig.TryLoadFromDisk()
```

TryLoadFromDisk 的逻辑如下：

```go
viper.SetConfigName(defaultConfigurationName) // kubesphere
viper.AddConfigPath(defaultConfigurationPath) // /etc/kubesphere

// Load from current working directory, only used for debugging
viper.AddConfigPath(".")

// Load from Environment variables
viper.SetEnvPrefix("kubesphere")
viper.AutomaticEnv()
viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

// 上面一顿配置之后，单步调试，ReadInConfig这一步读取的文件路径是	
// v.configPaths：["/etc/kubesphere","/root/go/src/kubesphere.io/kubesphere/cmd/ks-apiserver"]
if err := viper.ReadInConfig(); err != nil {
	if _, ok := err.(viper.ConfigFileNotFoundError); ok {
		return nil, err
	} else {
		return nil, fmt.Errorf("error parsing configuration file %s", err)
	}
}

conf := New() // 初始化各组件配置

// 从读取的实际路径配置文件来反序列化到conf这个struct
if err := viper.Unmarshal(conf); err != nil {
	return nil, err
}

return conf, n
```

上面的注释，解释了需要在指定路径下添加 kubesphere.yaml 启动 ks-apiserver 命令行。

我们接着往下撸，这里使用 cobra.Command 这个 package 来做命令行的集成：

```go
func Run(s *options.ServerRunOptions, ctx context.Context) error {
	// NewAPIServer 通过给定的配置启动apiserver实例，绑定实例化的各组件的client
	// 这一步还通过AddToScheme来注册一些自定义的GVK到k8s，最终暴露为apis API
	// 借助rest.Config和scheme 初始化runtimecache和runtimeClient 
	apiserver, err := s.NewAPIServer(ctx.Done())
	if err != nil {
		return err
	}
	
	// PrepareRun 主要是使用resful-go集成kapis API
	// 上一步绑定了各组件的client，这一步就可以调用各组件的client来访问对应组件的server端了
	// 猜猜4.0后端可插拔架构会是什么样子的？
	err = apiserver.PrepareRun(ctx.Done())
	if err != nil {
		return nil
	}
	
	// 运行各种informers同步资源，并开始ks-apiserver监听请求
	return apiserver.Run(ctx)
}
```

 s.NewAPIServer(ctx.Done()) 主要是创建一个 apiserver 实例。创建 apiserver 实例这一步，还通过 scheme 注册 ks 自定义的 GVK 到 K8s,  暴露为 apis 请求路径的 API。

PrepareRun 主要是使用 resful-go 框架集成了各子模块代理请求或集成服务， 暴露为 kapis 请求路径的 API 功能 。

apiserver.Run(ctx) 则是做了资源同步，并启动 server 监听。

下面分开阐述说明。

### NewAPIServer

首先是绑定各种 client 和 informers:

```go
// 调用各组件的NewForConfig方法整合clientset
kubernetesClient, err := k8s.NewKubernetesClient(s.KubernetesOptions)
if err != nil {
	return nil, err
}
apiServer.KubernetesClient = kubernetesClient
informerFactory := informers.NewInformerFactories(kubernetesClient.Kubernetes(), kubernetesClient.KubeSphere(),kubernetesClient.Istio(), kubernetesClient.Snapshot(), kubernetesClient.ApiExtensions(), kubernetesClient.Prometheus())
apiServer.InformerFactory = informerFactory
...
// 根据kubesphere.yaml或者kubesphere-config configmap的配置来绑定ks组件的client
...
```

初始化绑定完毕后 , 会启动一个 server 来响应请求 , 所以这里会做一个 addr 绑定 :

```go
...
server := &http.Server{
	Addr: fmt.Sprintf(":%d", s.GenericServerRunOptions.InsecurePort),
}

if s.GenericServerRunOptions.SecurePort != 0 {
	certificate, err := tls.LoadX509KeyPair(s.GenericServerRunOptions.TlsCertFile, s.GenericServerRunOptions.TlsPrivateKey)
	if err != nil {
		return nil, err
	}

	server.TLSConfig = &tls.Config{
		Certificates: []tls.Certificate{certificate},
	}
	server.Addr = fmt.Sprintf(":%d", s.GenericServerRunOptions.SecurePort)
}

sch := scheme.Scheme
if err := apis.AddToScheme(sch); err != nil {
	klog.Fatalf("unable add APIs to scheme: %v", err)
}
...
```

注意这一步 apis.AddToScheme(sch), 将我们定义的 GVK 注册到 k8s 中。

顺带一提，GVK 指的是 Group,Version, Kind, 举个栗子：

```go
{Group: "", Version: "v1", Resource: "namespaces"}
{Group: "", Version: "v1", Resource: "nodes"}
{Group: "", Version: "v1", Resource: "resourcequotas"}
...
{Group: "tenant.kubesphere.io", Version: "v1alpha1", Resource: "workspaces"}
{Group: "cluster.kubesphere.io", Version: "v1alpha1", Resource: "clusters"}
...
```

Scheme 管理 GVK 和 Type 的关系 ,  一个 GVK 只能对应一个 reflect.Type, 一个 reflect.Type 可能对应多个 GVK；此外，Scheme 还聚合了 converter 及 cloner, 用来转换不同版本的结构体和获取结构体值的拷贝；限于篇幅有限，感兴趣的童鞋可以深入探索下。

回归正文，下面我们看下怎么注入 scheme 的：

```go
// AddToSchemes may be used to add all resources defined in the project to a Schemevar AddToSchemes runtime.SchemeBuilder
// AddToScheme adds all Resources to the Schemefunc 
AddToScheme(s *runtime.Scheme) error {	return AddToSchemes.AddToScheme(s)}
```

而 AddToSchemes 这个类型的是`[]func(*Scheme) error` 的别名，只需要在 package apis 下的接口文件中实现相应的 init() 方法来导入实现的版本 API，就可以注入 Scheme 中。

举个例子：

```bash
$ cat pkg/apis/addtoscheme_dashboard_v1alpha2.go
package apis
import monitoringdashboardv1alpha2 "kubesphere.io/monitoring-dashboard/api/v1alpha2"
func init() {	
  AddToSchemes = append(AddToSchemes, monitoringdashboardv1alpha2.SchemeBuilder.AddToScheme)
}
```

也就是，我们开发的插件集成的版本化资源，必须实现 xxx.SchemeBuilder.AddToScheme 功能，才能注册到 scheme 中，最终暴露为 apis 访问 API 服务。

至此，所有子模块对应的 client 已经与这个 apiserver 绑定。

### PrepareRun

下面，我们探讨下 PrepareRun 是怎么注册 kapis 以及绑定 handler 的。

主要是通过 restful-go 框架来实现的。

restful-go 框架使用 container 来 hold 住拥有特定 GVR 的 webservice, 一个 webserver 可以绑定多个 router，允许 container 或者 webserver 添加自定义拦截器，也就是调用 filter 方法。

```go
func (s *APIServer) PrepareRun(stopCh <-chan struct{}) error {
  // container来hold住拥有特定GVR的webservice
	s.container = restful.NewContainer()
	// 添加请求Request日志拦截器
	s.container.Filter(logRequestAndResponse)
	s.container.Router(restful.CurlyRouter{})
	
	// 发生Recover时，绑定一个日志handler
	s.container.RecoverHandler(func(panicReason interface{}, httpWriter http.ResponseWriter) {
		logStackOnRecover(panicReason, httpWriter)
	})
	
	// 每个API组都构建一个webservice，然后根据路由规则来并绑定回调函数
  // 通过AddToContainer来完成绑定
	s.installKubeSphereAPIs()
	
	// 注册metrics指标: ks_server_request_total、ks_server_request_duration_seconds
	// 绑定metrics handler
	s.installMetricsAPI()
	
	// 为有效请求增加监控计数
	s.container.Filter(monitorRequest)

	for _, ws := range s.container.RegisteredWebServices() {
		klog.V(2).Infof("%s", ws.RootPath())
	}
	
	s.Server.Handler = s.container
	
	// 添加各个调用链的拦截器, 用于验证和路由分发
	s.buildHandlerChain(stopCh)

	return nil
}
```

上面主要使用 restful-go 框架给 s.Server.handler 绑定了一个 container, 添加了各种拦截器。

在 s.installKubeSphereAPIS() 这一步安装 GVR 绑定了 kapis 代理，具体是这样实现的：

```go
// 调用各api组的AddToContainer方法来向container注册kapi:
urlruntime.Must(monitoringv1alpha3.AddToContainer(s.container, s.KubernetesClient.Kubernetes(), s.MonitoringClient, s.MetricsClient, s.InformerFactory, s.KubernetesClient.KubeSphere(), s.Config.OpenPitrixOptions))

// 详细来说，各个组件实现的AddToContainer方法
// 为带有GroupVersion信息的webserver添加route，不同路由路径绑定不同的handler
ws := runtime.NewWebService(GroupVersion)
// 给子路由绑定回调函数
ws.Route(ws.GET("/kubesphere").
    To(h.handleKubeSphereMetricsQuery).
    Doc("Get platform-level metric data.").
    Metadata(restfulspec.KeyOpenAPITags, []string{constants.KubeSphereMetricsTag}).
    Writes(model.Metrics{}).
    Returns(http.StatusOK, respOK, model.Metrics{})).
    Produces(restful.MIME_JSON)
```

我们知道 apis 对应 K8s 的请求，而在 ks 中 kapis 对应子组件的代理请求，由 ks-apiserver 自身或者转发目标组件 server 来提供响应，那么 ks-apiserver 是怎么区分这些请求的？

答案是通过 buildHandlerChain 来进行分发的。

### buildHandlerChain

上面说到 buildHandlerChain 构建了各种服务的拦截器，按序排列如下。

```go
handler = filters.WithKubeAPIServer(handler, s.KubernetesClient.Config(), &errorResponder{})

if s.Config.AuditingOptions.Enable {
	handler = filters.WithAuditing(handler,
		audit.NewAuditing(s.InformerFactory, s.Config.AuditingOptions, stopCh))
}

handler = filters.WithAuthorization(handler, authorizers)
if s.Config.MultiClusterOptions.Enable {
	clusterDispatcher := dispatch.NewClusterDispatch(s.InformerFactory.KubeSphereSharedInformerFactory().Cluster().V1alpha1().Clusters())
	handler = filters.WithMultipleClusterDispatcher(handler, clusterDispatcher)
}

handler = filters.WithAuthentication(handler, authn)
handler = filters.WithRequestInfo(handler, requestInfoResolver)
```

WithRequestInfo 这个 filter 定义了如下逻辑：

```go
info, err := resolver.NewRequestInfo(req)
---
func (r *RequestInfoFactory) NewRequestInfo(req *http.Request) (*RequestInfo, error) {
   ...
   defer func() {
		prefix := requestInfo.APIPrefix
		if prefix == "" {
			currentParts := splitPath(requestInfo.Path)
			//Proxy discovery API
			if len(currentParts) > 0 && len(currentParts) < 3 {
				prefix = currentParts[0]
			}
		}
    // 通过api路由路径中的携带apis还是kapis就可以区分
		if kubernetesAPIPrefixes.Has(prefix) {
			requestInfo.IsKubernetesRequest = true
		}
	}()
	
	...
	// URL forms: /clusters/{cluster}/*
	if currentParts[0] == "clusters" {
		if len(currentParts) > 1 {
			requestInfo.Cluster = currentParts[1]
		}
		if len(currentParts) > 2 {
			currentParts = currentParts[2:]
		}
	}
	...
}
```

代码很多，我就不一一截图了，大概意思可以从注释看到：

```go
// NewRequestInfo returns the information from the http request.  If error is not nil, RequestInfo holds the information as best it is known before the failure
// It handles both resource and non-resource requests and fills in all the pertinent information for each.
// Valid Inputs:
//
// /apis/{api-group}/{version}/namespaces
// /api/{version}/namespaces
// /api/{version}/namespaces/{namespace}
// /api/{version}/namespaces/{namespace}/{resource}
// /api/{version}/namespaces/{namespace}/{resource}/{resourceName}
// /api/{version}/{resource}
// /api/{version}/{resource}/{resourceName}
//
// Special verbs without subresources:
// /api/{version}/proxy/{resource}/{resourceName}
// /api/{version}/proxy/namespaces/{namespace}/{resource}/{resourceName}
//
// Special verbs with subresources:
// /api/{version}/watch/{resource}
// /api/{version}/watch/namespaces/{namespace}/{resource}
//
// /kapis/{api-group}/{version}/workspaces/{workspace}/{resource}/{resourceName}
// /
// /kapis/{api-group}/{version}/namespaces/{namespace}/{resource}
// /kapis/{api-group}/{version}/namespaces/{namespace}/{resource}/{resourceName}
// With workspaces:
// /kapis/clusters/{cluster}/{api-group}/{version}/namespaces/{namespace}/{resource}
// /kapis/clusters/{cluster}/{api-group}/{version}/namespaces/{namespace}/{resource}/{resourceName}
```

通过路由定义的信息，就可以区分这个请求是什么级别的，以及这个请求要分发到哪个 server 了。

我们给各个 filter 的回调函数加上断点， 然后做个小实验看下拦截器的拦截顺序是怎样的。

假设远程云主机的服务已经启动，服务端口在 9090，以及你为 anonymous 这个 globalrole 设定了 monitoring.kubesphere.io 这个组下资源类型为 ClusterDashboard 的访问权限。当然了，你也可以用有访问权限的账号来直接测试。

接下来，我们来发送一个 kapis 请求，看这个链路怎么跳跃的：

```bash
curl -d '{"grafanaDashboardUrl":"https://grafana.com/api/dashboards/7362/revisions/5/download", "description":"this is a test dashboard."}' -H "Content-Type: application/json" localhost:9090/kapis/monitoring.kubesphere.io/v1alpha3/clusterdashboards/test1/template
```

测试结果如下：

```bash
WithRequestInfo -> WithAuthentication -> WithAuthorization -> WithKubeAPIServer
```

### Run

这个方法主要干了两件事，一是启动 informers 同步资源 , 二是启动 ks apiserver。

```go
func (s *APIServer) Run(ctx context.Context) (err error) {
  // 启动informer工厂，包括k8s和ks的informers
	// 同步资源，包括k8s和ks的GVR
	// 检查GVR是否存在，不存在报错警告，存在就同步
	err = s.waitForResourceSync(ctx)
	if err != nil {
		return err
	}

	shutdownCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		<-ctx.Done()
		_ = s.Server.Shutdown(shutdownCtx)
	}()
	
	// 启动server
	klog.V(0).Infof("Start listening on %s", s.Server.Addr)
	if s.Server.TLSConfig != nil {
		err = s.Server.ListenAndServeTLS("", "")
	} else {
		err = s.Server.ListenAndServe()
	}

	return err
}
```

至此，调用完 Run 方法后，ks-apiserver 就启动了。

现在我们做一下简单总结：

- 根据配置文件创建 ks-apiserver 实例 , 该实例调用了三个关键方法，分别是 NewAPIServer、PrepareRun 以及 Run 方法；
- NewAPIServer 通过给定的配置，绑定各个模块的 client，将自定义的 GVK 注册到 Scheme，暴露 apis 路由服务；
- PrepareRun 通过 restful-go 框架来注册、绑定 kapi 路由和回调函数，用来自身响应或者下发组件 server 查询合并数据返回给客户端 ;
- 最后 , 调用 Run 方法，同步资源并启动 ks-apiserver 服务；

## GVK 探索实战

显然，我们只需要关注各模块的 AddToContainer 方法就行了。

### iam.kubesphere.io 

> pkg/kapis/iam/v1alpha2/register.go

从代码注释来看，这个模块管理着 users、clustermembers、globalroles、clusterroles、workspaceroles、roles、workspaces groups 、workspace members、devops members 等账号角色的 CRUD。

现在我们可以在 handler 中打上断点，去请求这些 api。

```bash
$ curl "localhost:9090/kapis/iam.kubesphere.io/v1alpha2/users"
$ curl "localhost:9090/kapis/iam.kubesphere.io/v1alpha2/clustermembers"
$ curl "localhost:9090/kapis/iam.kubesphere.io/v1alpha2/users/admin/globalroles"
...
```

### kubeedge.kubesphere.io

> pkg/kapis/kubeedge/v1alpha1/register.go

代码里面使用的代理转发请求：

```go
func AddToContainer(container *restful.Container, endpoint string) error {
	proxy, err := generic.NewGenericProxy(endpoint, GroupVersion.Group, GroupVersion.Version)
	if err != nil {
		return nil
	}

	return proxy.AddToContainer(container)
}
```

也就是 kapis/kubeedge.kubesphere.io 的请求会转发到 http://edge-watcher.kubeedge.svc/api/，也就是 kubeedge 这个 namespace 下的 service，相关的接口集成在那里。

关于整合边缘计算平台的集成，除了需要做一个主流边缘框架的快速安装和集成外，还可以集成一个类似 edge-shim 的适配器，大概需要从一下几个方面考虑：

- 代理 endpoint: 现在的 kubeedge 就是使用代理模式转发；
- 健康检查接口：至少要确保云端的组件已经成功部署；
- 事件、长期日志、审计等可观测组件的支持；
- 其他边缘辅助功能，如文件或者配置下发等；

### notification.kubesphere.io

> pkg/kapis/notification/v2beta1/register.go

这个组下的 api 主要实现了 notification 的全局或租户级别的 config 和 receivers 资源的 CRUD。

config 资源

> 用于配置对接通知渠道相关参数的一些配置，分为全局的和租户级别的 config 资源；

reciever 资源

> 用于配置接收者的一些配置信息，区分全局的和租户级别的接收者；

 我们挑选一个回调函数进行剖析：

```go
ws.Route(ws.GET("/{resources}").
		To(h.ListResource).
		Doc("list the notification configs or receivers").
		Metadata(KeyOpenAPITags, []string{constants.NotificationTag}).
		Param(ws.PathParameter("resources", "known values include configs, receivers, secrets")).
		Param(ws.QueryParameter(query.ParameterName, "name used for filtering").Required(false)).
		Param(ws.QueryParameter(query.ParameterLabelSelector, "label selector used for filtering").Required(false)).
		Param(ws.QueryParameter("type", "config or receiver type, known values include dingtalk, email, slack, webhook, wechat").Required(false)).
		Param(ws.QueryParameter(query.ParameterPage, "page").Required(false).DataFormat("page=%d").DefaultValue("page=1")).
		Param(ws.QueryParameter(query.ParameterLimit, "limit").Required(false)).
		Param(ws.QueryParameter(query.ParameterAscending, "sort parameters, e.g. ascending=false").Required(false).DefaultValue("ascending=false")).
		Param(ws.QueryParameter(query.ParameterOrderBy, "sort parameters, e.g. orderBy=createTime")).
		Returns(http.StatusOK, api.StatusOK, api.ListResult{Items: []interface{}{}}))
		
func (h *handler) ListResource(req *restful.Request, resp *restful.Response) {
	// 租户或用户的名称
	user := req.PathParameter("user")
	// 资源类型，configs/recievers/secrets
	resource := req.PathParameter("resources")
	// 通知渠道 dingtalk/slack/email/webhook/wechat
	subresource := req.QueryParameter("type")
	q := query.ParseQueryParameter(req)

	if !h.operator.IsKnownResource(resource, subresource) {
		api.HandleBadRequest(resp, req, servererr.New("unknown resource type %s/%s", resource, subresource))
		return
	}

	objs, err := h.operator.List(user, resource, subresource, q)
	handleResponse(req, resp, objs, err)
}
```

我们看下 list object 的逻辑：

```go
// List objects.
func (o *operator) List(user, resource, subresource string, q *query.Query) (*api.ListResult, error) {
	if len(q.LabelSelector) > 0 {
		q.LabelSelector = q.LabelSelector + ","
	}

	filter := ""
	// 如果没有给定租户的名称，则获取全局的对象
	if user == "" {
		if isConfig(o.GetObject(resource)) {
		    // type=default对config资源来说是全局的
			filter = "type=default"
		} else {
		    // type=global对receiever资源来说是全局的
			filter = "type=global"
		}
	} else {
	// 否则就给过滤器绑定租户名称
		filter = "type=tenant,user=" + user
	}
	// 组装过滤标签
	q.LabelSelector = q.LabelSelector + filter
	...
	// 通过过滤标签获取cluster或者namespace下的指定资源
	res, err := o.resourceGetter.List(resource, ns, q)
	if err != nil {
		return nil, err
	}

	if subresource == "" || resource == Secret {
		return res, nil
	}

	results := &api.ListResult{}
    ...
}
```

这样一来，就实现了租户级别的通知告警 CR 配置的 CRUD，这些 CR 是这么分类的：

- config 分为全局 type = default, 租户 type = tenant 两种级别；
- reciever 分为全局 type = global, 租户 type = tenant 两种级别；

那么 config 和 reciever 怎么相互绑定、告警是如何通过渠道给租户发消息的？

> https://github.com/kubesphere/notification-manager/blob/master/pkg/webhook/v1/handler.go#L45
>
> https://github.com/kubesphere/notification-manager/blob/master/pkg/notify/notify.go#L66

notification-manager 简称 nm，我这里断章取义地简要回答一下。

功能方面：

- 全局配置 reciever 通过配置的渠道将所有的 alerts 发送给其定义好的接收者名单， 配置了租户信息的 reciever 只能通过渠道发送当前 ns 下的 alerts；
- reciever 中可以通过配置 alertSelector 参数来进一步过滤告警消息；
- 通过修改名为 notification-manager-template 的 confimap 来定制发送消息模板；

告警到通知的流程：

- nm 使用端口 19093 和 API 路径 /api/v2/alerts 接收从 Alertmanager  发送的告警 ;
- 回调函数接受 alerts 转换为 notification 模板数据，按照 namespace 区分告警数据；
- 遍历所有 Recievers，每个 ns 下启动一个协程来发送消息， 而这里每个 ns 对应着多个通知渠道，因此也使用 waitgroup 来并发编排完成任务；

### monitoring.kubesphere.io

> pkg/kapis/monitoring/v1alpha3/register.go

 将监控指标分为平台级、节点级、workspaces、namespaces、pods 等级别，不仅可以获取总的统计，还能获取 nodes/namespaces/workspaces 下的所有 pods/containers 等监控指标。

我们查看回调函数，以 handleNamedMetricsQuery 为例分析：

- 遍历给定指标级别下的合法 metric 指标，根据请求参数中 metricFilter 的来过滤指标名；
- 判断为范围查询还是实时查询，来调取 monitoring 包中相关方法，通过对应的 client 请求后端获取结果返回；

代码如下：

```go
func (h handler) handleNamedMetricsQuery(resp *restful.Response, q queryOptions) {
	var res model.Metrics

	var metrics []string
	// q.namedMetrics 是一组按照监控指标级别分类好的拥有promsql expr定义的完整指标名数组
	// 监控指标级别分类是根据 monitoring.Levelxxx在上一个栈里细分的，i.e: monitoring.LevelPod
	for _, metric := range q.namedMetrics {
		if strings.HasPrefix(metric, model.MetricMeterPrefix) {
			// skip meter metric
			continue
		}
		// 根据请求参数中的指标名来过滤
		ok, _ := regexp.MatchString(q.metricFilter, metric)
		if ok {
			metrics = append(metrics, metric)
		}
	}
	if len(metrics) == 0 {
		resp.WriteAsJson(res)
		return
	}
	
	// 判断是否是范围查询还是实时查询，继续调用相关函数
	// 主要还是用prometheus client去查询promsql, 边缘节点的指标目前通过metrics server来查询
	if q.isRangeQuery() {
		res = h.mo.GetNamedMetricsOverTime(metrics, q.start, q.end, q.step, q.option)
	} else {
		res = h.mo.GetNamedMetrics(metrics, q.time, q.option)
		if q.shouldSort() {
			res = *res.Sort(q.target, q.order, q.identifier).Page(q.page, q.limit)
		}
	}
	resp.WriteAsJson(res)
}
```

现在，我们将视角移植到 :

> pkg/models/monitoring/monitoring.go:156

以 GetNamedMetricsOverTime 为例，这里阐述了会合并 prometheus 和 metrics-server 的查询结果进行返回：

```go
func (mo monitoringOperator) GetNamedMetricsOverTime(metrics []string, start, end time.Time, step time.Duration, opt monitoring.QueryOption) Metrics {
    // 获取prometheus client查询结果，主要使用sync.WaitGroup并发查询，每个指标启动一个goroutine，最后将结果和并返回
	ress := mo.prometheus.GetNamedMetricsOverTime(metrics, start, end, step, opt)
	// 如果metrics-server激活了
	if mo.metricsserver != nil {

		//合并边缘节点数据
		edgeMetrics := make(map[string]monitoring.MetricData)

		for i, ressMetric := range ress {
			metricName := ressMetric.MetricName
			ressMetricValues := ressMetric.MetricData.MetricValues
			if len(ressMetricValues) == 0 {
				// this metric has no prometheus metrics data
				if len(edgeMetrics) == 0 {
					// start to request monintoring metricsApi data
					mr := mo.metricsserver.GetNamedMetricsOverTime(metrics, start, end, step, opt)
					for _, mrMetric := range mr {
						edgeMetrics[mrMetric.MetricName] = mrMetric.MetricData
					}
				}
				if val, ok := edgeMetrics[metricName]; ok {
					ress[i].MetricData.MetricValues = append(ress[i].MetricData.MetricValues, val.MetricValues...)
				}
			}
		}
	}

	return Metrics{Results: ress}
}
```

此外，monitoring 包还定义了各监控查询 client 的接口方法，可以按需探索：

- GetMetric(expr string, time time.Time) Metric

- GetMetricOverTime(expr string, start, end time.Time, step time.Duration) Metric

- `GetNamedMetrics(metrics []string, time time.Time, opt QueryOption) []Metric`

- `GetNamedMetricsOverTime(metrics []string, start, end time.Time, step time.Duration, opt QueryOption) []Metric`

- `GetMetadata(namespace string) []Metadata`

- `GetMetricLabelSet(expr string, start, end time.Time) []map[string]string`

### tenant.kubesphere.io

再聊 api 之前，顺带一提多租户在隔离的安全程度上，我们可以将其分为软隔离 (Soft Multi-tenancy) 和硬隔离 (Hard Multi-tenancy) 两种。

- 软隔离更多的是面向企业内部的多租需求；
- 硬隔离面向的更多是对外提供服务的服务供应商，需要更严格的隔离作为安全保障。

这个 group 下比较重要的部分是实现租户查询 logs/audits/events：

以查询日志为例：

```go
func (h *tenantHandler) QueryLogs(req *restful.Request, resp *restful.Response) {
    // 查询上下文中携带的租户信息
	user, ok := request.UserFrom(req.Request.Context())
	if !ok {
		err := fmt.Errorf("cannot obtain user info")
		klog.Errorln(err)
		api.HandleForbidden(resp, req, err)
		return
	}
	// 解析查询的参数，比如确定属于哪个ns/workload/pod/container的查询、时间段，是否为柱状查询等
	queryParam, err := loggingv1alpha2.ParseQueryParameter(req)
	if err != nil {
		klog.Errorln(err)
		api.HandleInternalError(resp, req, err)
		return
	}
	// 导出数据
	if queryParam.Operation == loggingv1alpha2.OperationExport {
		resp.Header().Set(restful.HEADER_ContentType, "text/plain")
		resp.Header().Set("Content-Disposition", "attachment")
		// 验证账号是否有权限
		// admin账号可以导出所有ns的日志，租户只能导出本ns的日志
		// 组装loggingclient进行日志导出
		err := h.tenant.ExportLogs(user, queryParam, resp)
		if err != nil {
			klog.Errorln(err)
			api.HandleInternalError(resp, req, err)
			return
		}
	} else {
		// 验证账号是否有权限
		// admin账号可以查看所有ns的日志，租户只能查看本ns的日志
		// 组装loggingclient进行日志返回
		result, err := h.tenant.QueryLogs(user, queryParam)
		if err != nil {
			klog.Errorln(err)
			api.HandleInternalError(resp, req, err)
			return
		}
		resp.WriteAsJson(result)
	}
}
```

由于篇幅有限，只对以上 GVR 进行了调试，感兴趣可以深入了解~