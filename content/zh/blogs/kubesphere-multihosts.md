---
title: 'KubeSphere 的异地多活方案探索'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, 异地多活, 多集群'
description: '遇到这样一个场景，在同一套环境中需要存在多个 Host 控制面集群，因此想探索下 KubeSphere 的异地多活混合容器云管理方案。'
createTime: '2022-06-05'
author: '许小平'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-multihosts-cover.png'
---

遇到这样一个场景，在同一套环境中需要存在多个 Host 控制面集群，因此想探索下 KubeSphere 的异地多活混合容器云管理方案。

## 集群角色介绍

一个兼容原生的 K8s 集群，可通过 `ks-installer` 来初始化完成安装，成为一个 QKE 集群。QKE 集群分为多种角色，默认是 None 角色（standalone 模式），开启多集群功能时，可以设置为 Host 或者 Member 角色。

![](https://pek3b.qingstor.com/kubesphere-community/images/kcp-multicluster.png)

- None 角色，是最小化安装的默认模式，会安装必要的 ks-apiserver, ks-controller-manager, ks-console 和其他组件
  - ks-apiserver, kcp 的 API 网关，包含审计、认证、权限校验等功能
  - ks-controller, 各类自定义 CRD 的控制器和平台管理逻辑的实现
  - ks-console, 前端界面 UI
  - ks-installer, 初始化安装和变更 QKE 集群的工具，由 shell-operator 触发 ansible-playbooks 来工作。
- Member 角色，承载工作负载的业务集群，和 None 模式的组件安装情况一致
- Host 角色，整个混合云管理平台的控制面，会在 None 的基础上，再额外安装 tower，kubefed-controller-manager， kubefed-admission-webhook 等组件
  - tower，代理业务集群通信的 server 端，常用于不能直连 Member 集群 api-server 的情况
  - kubefed-controller-manager，社区的 [Kubefed](https://github.com/kubernetes-sigs/kubefed) 联邦资源的控制器
  - kubefed-admission-webhook， 社区的 Kubefed 联邦资源的动态准入校验器

## 多集群管理原理

上段提到 QKE 有 3 种角色，可通过修改 `cc` 配置文件的 `clusterRole` 来使能, ks-installer 监听到配置变化的事件，会初始化对应集群角色的功能。
```bash
kubectl edit cc ks-installer -n kubesphere-system
```
> 角色不要改来改去，会出现莫名问题，主要是背后 Ansible 维护的逻辑有疏漏，没闭环

### Host 集群

Host 角色的主集群会被创建 25 种联邦资源类型 Kind，如下命令可查看，还会额外安装 Kubefed stack 组件。
``` bash
➜  kubectl get FederatedTypeConfig  -A
```

此外 api-server 被重启后，会根据配置内容的变化，做两件事，注册多集群相关的路由和缓存同步部分联邦资源。
 - 添加 URL 里包含 `clusters/{cluster}` 路径的 Agent 路由和转发的功能，要访问业务集群的信息，这样可以直接转发过去。
 - cacheSync，缓存同步联邦资源，这里是个同步的操作。

controller-manager 被重启后，同样会根据配置的变化，把部分资源类型自动转化成联邦资源的逻辑，也就是说，在 Host 集群创建的这部分资源会自动同步到所有成员集群，实际的多集群同步靠 kubefed-controller-manager 来执行。以下资源会被自动创建联邦资源下发：
  - users.iam.kubesphere.io -> federatedusers.types.kubefed.io
  - workspacetemplates.tenant.kubesphere.io -> federatedworkspaces.types.kubefed.io
  - workspaceroles.iam.kubesphere.io -> federatedworkspaceroles.types.kubefed.io
  - workspacerolebindings.iam.kubesphere.io -> federatedworkspacerolebindings.types.kubefed.io

此外还会启动 cluster、group 和一些 globalRole* 相关资源的控制器逻辑，同上也会通过 Kubefed 自动下发到所有集群，`clusters.cluster.kubesphere.io` 资源除外。

> 如果以上资源包含了 `kubefed.io/managed: false` 标签，Kubefed 就不会再做下发同步，而 Host 集群下发完以上资源后，都会自动加上该标签，防止进入死循环

### Member集群

修改为 Member 集群时，需要 cc 中 **jwtSecret** 与 Host 集群的保持一致 (若该值为空的话，ks-installer 默认会随机生成)，提取 Host 集群的该值时，需要去 cm 里找，如下：
```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
```
> jwtSecret 要保持一致，主要是为了在 Host 集群**签发**的用户 token，在用户访问业务集群时 token **校验**能通过。

### 添加集群

本文只关注`直接连接`这种情况，当填好成员集群的 kubeconfig 信息，点击`添加`集群后,会做如下校验：
- 通过 kubeconfig 信息先校验下是否会添加已存在的重复集群
- 校验成员集群的网络连通性
- 校验成员集群是否安装了 ks-apiserver
- 校验成员集群的 `jwtSecret` 是否和主集群的一致

> 写稿时，此处有个问题，需要修复，如果 kubeconfig 使用了 `insecure-skip-tls-verify: true` 会导致该集群添加失败，经定位主要是 Kubefed 空指针 panic 了，后续有时间我会去 fix 一下，已提 [issue](https://github.com/kubesphere/kubesphere/issues/4891)。

校验完必要信息后，就执行实质动作 `joinFederation` 加入联邦，KubeSphere 多集群纳管，实质上是先组成联邦集群:
- 在成员集群创建 ns kube-federation-system
- 在上面的命名空间中创建 serviceAccount [clusterName]-kubesphere, 并绑定最高权限
- 在主集群的 kube-federation-system 的命名空间创建 `kubefedclusters.core.kubefed.io`，由kubefed stack驱动联邦的建立
- 加入联邦后，主集群的联邦资源会通过 Kubefed stack 同步过去
> 上述一顿操作，等效于 `kubefedctl join member-cluster --cluster-context member-cluster  --host-cluster-context host-cluster`


## 异地多活方案设计

异地多活的方案主要是多个主集群能同时存在，且保证数据双向同步，经过上面的原理分析，可知多个主集群是可以同时存在的，也就是一个成员集群可以和多个主集群组成联邦。整体方案示意图设计如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/kcp-multi-hostclusters.png)

> 以下操作假设本地已具备三个QKE集群，如果不具备的可按照[此处](/docs/4-cloud/kubesphere/kind-multicluster-dev/)快速搭建 `host、host2、member` 3 个集群

大致实现逻辑的前提介绍：

1. 三个集群的 `jwtSecret` 得保持一致
2. 两个主集群都去`添加`纳管同一个member集群
3. 利用 `etcdctl make-mirror` 实现双向同步

### 验证下可行性

实操双活前，先验证下可行性

**实验 1：**

在两边创建一个同名用户，用户所有信息一致，可以添加成功，然后再修改一边的用户信息，使两边不一致

可以看到 Member 集群的用户 xxp，一直会被两边不断的更新...
```bash
root@member-control-plane:/# kubectl get user xxp -w
NAME   EMAIL         STATUS
xxp    xxp@163.com   Active
xxp    xxp-2@163.com   Active
xxp    xxp@163.com    Active
xxp    xxp-2@163.com   Active

... 周而复始 ...
```
这个实验，即使在创建用户时，页面表单上两边信息填的都一样，也会出现互相刷新覆盖的情况，因为 yaml 里的 uid 和 time 信息不一致。

**实验 2：**

在两边添加一个同名用户，但两边用户信息（用户角色）不一致，可以创建成功，但后创建者的 kube-federa 会同步失败, 到这里还能接受，毕竟有冲突直接就同步失败了。

但 Member 集群上该用户的关联角色会出现上文的情况，被两边的主集群持续反复地修改...


**实验 3：**

在一侧的主集群上尝试修复冲突资源，即删除有冲突的用户资源，可以删除成功，但对应的联邦资源会出现删失败的情况。
```
➜  ~ kubectl get users.iam.kubesphere.io
NAME    EMAIL                 STATUS
admin   admin@kubesphere.io   Active
xxp3    xxp3@163.com          Active
➜  ~
➜  ~ kubectl get federatedusers.types.kubefed.io
NAME    AGE
admin   5h33m
xxp     65m #这里是个删不掉的资源，fed controller 会重复做失败尝试
xxp3    61m
```

这样就会出现，两个主集群：一个要删，一个要同步，Member 集群上：持续上演“一会儿消失，一会儿又出现了”的奇观。

### 总结

两个主集群可以同时工作，一旦出现同名冲突资源，处理起来会非常麻烦，尤其是背后的 Dependent 附属资源出现冲突时，往往问题点隐藏的更深，修复起来也棘手...

后来调研也发现：目前的社区方案 make-mirror 只支持单向同步，适合用来做灾备方案。

所以容器云平台的双活，除非具备跨 AZ 的 Etcd 集群，否则需要二次开发改造类 make-mirror 方案来支持了。我最开始要考虑的问题答案也就显而易见了：如果要多个 Host 集群共存，必须考虑通过行政管理手段，来尽量避免同名资源冲突。
