---
title: 'KubeSphere 核心架构浅析'
tag: 'Kubernetes,KubeSphere'
keywords: 'Kubernetes, KubeSphere, 核心架构'
description: 'KubeSphere 为用户提供构建企业级 Kubernetes 环境所需的多项功能，例如多云与多集群管理、Kubernetes 资源管理、DevOps、应用生命周期管理、微服务治理（服务网格）、日志查询与收集、服务与网络、多租户管理、监控告警、事件与审计查询、存储管理、访问权限控制、GPU 支持、网络策略、镜像仓库管理以及安全管理等。得益于 Kubernetes 优秀的架构与设计，KubeSphere 取长补短采用了更为轻量的架构模式，灵活的整合资源，进一步丰富了 K8s 生态。'
createTime: '2021-08-25'
author: '万宏明'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-core-architecture-cover.png'
---

KubeSphere 是在 Kubernetes 之上构建的面向云原生应用的容器混合云管理系统。支持多云与多集群管理，提供全栈的自动化运维能力，帮助企业用户简化 DevOps 工作流，提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。

KubeSphere 为用户提供构建企业级 Kubernetes 环境所需的多项功能，例如多云与多集群管理、Kubernetes 资源管理、DevOps、应用生命周期管理、微服务治理（服务网格）、日志查询与收集、服务与网络、多租户管理、监控告警、事件与审计查询、存储管理、访问权限控制、GPU 支持、网络策略、镜像仓库管理以及安全管理等。

得益于 Kubernetes 优秀的架构与设计，KubeSphere 取长补短采用了更为轻量的架构模式，灵活的整合资源，进一步丰富了 K8s 生态。

## KubeSphere 核心架构

KubeSphere 的核心架构如下图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/1629366117-239933-image.png)

核心组件主要有三个：

- ks-console 前端服务组件
- ks-apiserver 后端服务组件
- ks-controller-manager 资源状态维护组件


KubeSphere 的后端设计中沿用了 K8s 声明式 API 的风格，所有可操作的资源都尽可能的抽象成为 [CustomResource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。与命令式 API 相比，声明性API的使用更加简洁，并且提供了更好的抽象性, 告诉程序最终的期望状态（做什么），而不关心怎么做。

典型地，在声明式 API 中：

1. 你的 API 包含相对而言为数不多的、尺寸较小的对象（资源）。
2. 对象定义了应用或者基础设施的配置信息。
3. 对象更新操作频率较低。
4. 通常需要人来读取或写入对象。
5. 对象的主要操作是 CRUD 风格的（创建、读取、更新和删除）。
6. 不需要跨对象的事务支持：API 对象代表的是期望状态而非确切实际状态。

命令式 API（Imperative API）与声明式有所不同。 以下迹象表明你的 API 可能不是声明式的：

1. 客户端发出“做这个操作”的指令，之后在该操作结束时获得同步响应。
2. 客户端发出“做这个操作”的指令，并获得一个操作 ID，之后需要判断请求是否成功完成。
3. 你会将你的 API 类比为RPC。
4. 直接存储大量数据。
5. 在对象上执行的常规操作并非 CRUD 风格。
6. API 不太容易用对象来建模。

借助 kube-apiserver、etcd 实现数据同步和数据持久化，通过 ks-controller-manager 维护这些资源的状态，以达到最终状态的一致性。如果你熟悉 K8s，可以很好的理解声明式 API 带来的好处，这也是 KubeSphere 最为核心的部分。

例如 KubeSphere 中的流水线、用户凭证、用户实体、告警通知的配置，都可以抽象为资源实体，借助 K8s 成熟的架构与工具链，可以方便的与 K8s 进行结合，降低各组件之间的耦合，降低系统的复杂度。

## ks-apiserver 的核心架构

ks-apiserver 是 KubeSphere 核心的后端组件，负责前后端数据的交互、请求的代理分发、认证与鉴权。下图是 ks-apiserver 的核心架构：

![](https://pek3b.qingstor.com/kubesphere-community/images/1629366193-930241-image.png)

ks-apiserver 的开发使用了 [go-restful](https://github.com/emicklei/go-restful) 框架，可以在请求链路中增加多个 Filter 用于动态的拦截请求和响应，实现认证、鉴权、审计逻辑转发和反向代理功能，KubeSphere 的 API 风格也尽可能的学习 [K8s 的模式](https://kubernetes.io/docs/reference/using-api/api-concepts/)，方便使用 [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) 进行权限控制。

借助 CRD + controller 的方式进行解耦，可以极大的简化与第三方工具、软件的集成方式。

K8s 社区也提供了丰富的工具链，借助 [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime) 和 [kubebuiler](https://github.com/kubernetes-sigs/kubebuilder) 可以迅速的搭建起开发脚手架。

## API 聚合与权限控制

可以通过拓展 ks-apiserver 实现 API 的聚合，进一步实现功能拓展、聚合查询等功能。在 API 的开发过程中中需要遵循以下规范，以便与 KubeSphere 的租户体系、资源体系进行整合。

- API 聚合
- 权限控制
- CRD + controller

### API 规范

```bash
# 通过 api group 进行分组
/apis/{api-group}/{version}/{resources}
# 示例
/apis/apps/v1/deployments
/kapis/iam.kubesphere.io/v1alpha2/users
# api core
/api/v1/namespaces

# 通过 path 区分不同的动作
/api/{version}/watch/{resources}
/api/{version}/proxy/{resources}/{resource}

# 通过 path 区分不同的资源层级
/kapis/{api-group}/{version}/workspaces/{workspace}/{resources}/{resource}
/api/{version}/namespaces/{namespace}/{resource}
```

规范 API 的目的：

1. 更好的对资源进行抽象，抽象为 Object 更适合声明式API
2. 更好的对 API 进行管理，版本、分组、分层，更方便 API 的拓展
3. 更好的与权限控制进行整合，可以方便的从请求中获取元数据，apigroup,scope,version,verb

### 权限控制

KubeSphere 权限控制的核心是 [RBAC](https://kubernetes.io/zh/docs/reference/access-authn-authz/rbac/) 基于角色的访问控制。

关键的对象有： Role、User、RoleBinding。

Role 定义了一个角色可以访问的资源。

> 角色是根据资源层级进行划分的，cluster role、workspace role、namespace role 不同层级的角色定义了该角色在当前层级可以访问的资源。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  # 忽略 resourceNames 意味着允许绑定任何 ClusterRole
  resourceNames: ["admin","edit","view"]
- nonResourceURLs: ["/healthz", "/healthz/*"] # nonResourceURL 中的 '*' 是一个全局通配符
  verbs: ["get", "post"]
```

RoleBinding 可绑定角色到某 *主体（Subject）*上。 主体可以是组，用户或者服务账户。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: role-grantor-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

### CRD + controller

自定义资源（Custom Resource） 是对 Kubernetes API 的扩展，可以通过动态注册的方式拓展 K8s API。用户可以使用 kubectl 来创建和访问其中的对象，就像操作内置资源一样。

通过 CRD 对资源进行抽象，再通过 controller 监听资源变化维护资源状态， controller 的核心是 Reconcile，与他的意思一样，通过被动、定时触发的方式对资源状态进行维护，直至达到声明的状态。

![](https://pek3b.qingstor.com/kubesphere-community/images/1629366219-620482-image.png)

以 User 资源为例，我们可以定义一下结构的 [CRD ](https://raw.githubusercontent.com/kubesphere/kubesphere/master/config/crds/iam.kubesphere.io_users.yaml) 对 User 进行抽象:

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: User
metadata:
  annotations:
    iam.kubesphere.io/last-password-change-time: "2021-05-12T05:50:07Z"
  name: admin
  resourceVersion: "478503717"
  selfLink: /apis/iam.kubesphere.io/v1alpha2/users/admin
  uid: 9e438fcc-f179-4254-b534-e913dfd7a727
spec:
  email: admin@kubesphere.io
  lang: zh
  description: 'description'
  password: $2a$10$w312tzLTvXObnfEYiIrk9u5Nu/reJpwQeI66vrM1XJETWtpjd1/q2
status:
  lastLoginTime: "2021-06-08T06:37:36Z"
  state: Active
```

对应的 API 为：

```bash
# 创建
POST /apis/iam.kubesphere.io/v1alpha2/users

# 删除
DELETE /apis/iam.kubesphere.io/v1alpha2/users/{username}

# 修改
PUT /apis/iam.kubesphere.io/v1alpha2/users/{username}
PATCH /apis/iam.kubesphere.io/v1alpha2/users/{username}

# 查询
GET /apis/iam.kubesphere.io/v1alpha2/users
GET /apis/iam.kubesphere.io/v1alpha2/users/{username}
```

ks-apiserver 负责将这些数据写入 K8s 再由 informer 同步到各个副本中。

ks-controller-manager 通过监听数据变化，对资源状态进行维护，以创建用户为例, 通过 `POST /apis/iam.kubesphere.io/v1alpha2/users` 创建用户之后,  user controller 会对用户资源状态进行同步。

```go
func (c *userController) reconcile(key string) error {
	// Get the user with this name
	user, err := c.userLister.Get(key)

        if err != nil {
            // The user may no longer exist, in which case we stop
            // processing.
            if errors.IsNotFound(err) {
                utilruntime.HandleError(fmt.Errorf("user '%s' in work queue no longer exists", key))
                return nil
            }
            klog.Error(err)
            return err
        }

	if user, err = c.encryptPassword(user); err != nil {
		klog.Error(err)
		return err
	}

	if user, err = c.syncUserStatus(user); err != nil {
		klog.Error(err)
		return err
	}

	// synchronization through kubefed-controller when multi cluster is enabled
	if c.multiClusterEnabled {
		if err = c.multiClusterSync(user); err != nil {
			c.recorder.Event(user, corev1.EventTypeWarning, controller.FailedSynced, fmt.Sprintf(syncFailMessage, err))
			return err
		}
	}

	c.recorder.Event(user, corev1.EventTypeNormal, successSynced, messageResourceSynced)
	return nil
}
```

通过声明式的 API 将复杂的逻辑放到 controller 进行处理，方便解耦。可以很方便的与其他系统、服务进行集成，例如：

```
/apis/devops.kubesphere.io/v1alpha2/namespaces/{namespace}/pipelines
/apis/devops.kubesphere.io/v1alpha2/namespaces/{namespace}/credentials
/apis/openpitrix.io/v1alpha2/namespaces/{namespace}/applications
/apis/notification.kubesphere.io/v1alpha2/configs
```

对应的权限控制策略：

定义一个可以增删改查 user 资源的角色。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: user-manager
rules:
- apiGroups: ["iam.kubesphere.io"]
  resources: ["users"]
  verbs: ["create","delete","patch","update","get","list"]
```

定义一个可以创建 pipeline 资源的角色。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: devops-manager
rules:
- apiGroups: ["devops.kubesphere.io"]
  resources: ["pipelines"]
  verbs: ["create","delete","patch","update","get","list"]
```