---
title: '基于Jenkins + Argo 实现多集群的持续交付'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, Jenkins, Argo, DevOps'
description: '这篇文章主要介绍了如何使用 Jenkins 完成通过 Argo CD 来部署多集群的应用发布。'
createTime: '2024-03-20'
author: '周靖峰'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/jenkins+argo-multi-cluster-cd.png'
---

> 作者：周靖峰，青云科技容器顾问，云原生爱好者，目前专注于 DevOps，云原生领域技术涉及 Kubernetes、KubeSphere、Argo。

## 前文概述

前面我们已经掌握了如何通过 Jenkins + Argo CD 的方式实现单集群的持续交付，明白了整个 CI/CD 过程中不同工具在流水线中的关系。所以接下来我们将更深入的了解 Argo CD 的特性。

前文链接：[KubeSphere DevOps 基于 Jenkins + Argo 实现单集群的持续交付实践](https://www.kubesphere.io/zh/blogs/jenkins+argo-for-single-cluster-cd/)。

## KubeSphere 配置

### 集群配置

这里我们需要准备至少 2 个集群，并且需要开启多集群组件、DevOps 组件。

因为 KubeSphere 已经内置了 Argo，所以只要被 KubeSphere 所管理的集群会自动注册上 Argo。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-1.png)

### DevOps 配置

这里我们依旧要准备一个 Git 仓库， 这里仍然是使用我们之前的仓库例子。

```
https://github.com/Feeeenng/devops-maven-sample.git
```

不过需要注意，这次我们需要选择 `multi-cluster` 分支。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-2.png)

## Argo CD 部分

### ApplicationSet

这里主要介绍 ArgoCD 的一个控制器 `ApplicationSet controller`。

此控制器追加了对跨多集群以及 `monorepos` 的支持。该项目以前是一个独立项目，后在 Argo CD v2.3 版本中合入主分支。

ApplicationSet 控制器主要应用场景：

- 通过 Argo CD 单一 Kubernetes 资源管理应用发布多集群；
- 单一 Kubernetes 资源发布一个 Git 或者多个 Git 仓库来部署多个应用；
- 增加了 monorepos 的支持；
- 多租户集群模式下，提高了单个集群租户使用 Argo CD 部署能力。

### Generators

ApplicationSet 主要通过 `generators` 来实现对资源的定义， 通过 `template` 来实现参数值的替换。目前主要支持以下几种：

- List generator：基于集群名/URL 值的固定列；
- Cluster generator：基于 Argo CD 自定义方式；
- Git generator：基于 Git 存储中包含的文件或文件夹；
- Matrix generator：基于上述两种生成器的组合方式。

更多的方式参考地址：
[https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators/](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators/)

## 实践操作

这次我们使用 List generator 的方式生成配置模版。

代码目录 deploy 下包含一个文件 `applicationset.yaml` 。

```
# 采用 List generator 方式进行生成
# 集群信息都注入在配置里面
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: devops-maven-sample
spec:
generators:
  - list:
      elements:
      - cluster: dev
        url: https://kubernetes.default.svc
      - cluster: test
        url: https://172.31.73.92:6443
```

### 开启 OnDeletion 配置

`preserveResourcesOnDeletion` 参数表示删除 ApplicationSet 资源以后，通过模版自动生成出来的 Application 一并删除。

> 请注意，生产环境不建议开启这个参数！

```
  syncPolicy:
    preserveResourcesOnDeletion: true
```

更多模版配置参考：
[https://argo-cd.readthedocs.io/en/stable/user-guide/application-specification/](https://argo-cd.readthedocs.io/en/stable/user-guide/application-specification/)

### 配置同步策略

配置 Application CRD 同步策略。

CreateNamespace 自动创建 namespace。

PrunePropagationPolicy 删除采用友好删除方式策略。

prune 默认情况下，Argo CD 考虑安全机制不会自动同步 Git 资源变更操作，这里手动开启。确保当我们 Git 进行变更以后，Argo 会自动进行 Git 修改部署资源。

```
      syncPolicy:
        syncOptions:
        - CreateNamespace=true
        - PrunePropagationPolicy=foreground
        automated:
          prune: true
```

更多描述查看地址：
[https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/)

### 模版定义

通过上述 List generator 的定义参数，对应好模版，这种类型都属于 Key/Values 类型。

```
      source:
        repoURL: https://github.com/Feeeenng/devops-maven-sample.git
        targetRevision: multi-cluster
        path: deploy/{{cluster}}
      destination:
        server: '{{url}}'
        namespace: multi-demo
```

最后运行流水行以后，等待流水线执行完毕。Argo 自动进行 GitOps 触发管理同步。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-3.png)

然后进入 KubeSphere 界面，配置 Argo 设置为 NodePort 类型 观察 web 界面。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-4.png)

打开 Argo CD UI 界面，这里我配置了 Argo CD 对接 KubeSphere 的 LDAP。

所以可以通过 KubeSphere 的账号密码进行登录。如果没有配置的话，默认密码需要执行下面命令进行查看。

```
kubectl get secret -n argocd argocd-initial-admin-secret
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-5.png)

这个时候我们能够看到，我们刚才通过 Jenkins pipeline 运行的流水线已经成功。并且 Argo CD 也已经自动同步发布应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-6.png)

回到 KubeSphere 界面上观察应用部署情况能够看到，我们所发布的 2 个集群也已经正常部署完成。

Dev 集群：
![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-7.png)

Test 集群：
![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240320-8.png)

至此，我们通过 Jenkins 完成了通过 Argo CD 来部署多集群的应用发布。

## 后续

当前例子使用的是简单的列表生成器的方式，但 ApplicationSet 的控制器其实也支持更多复杂的场景。比如通过 Git Generator 的方式只定义一个配置参数，满足多个应用的发布支持。这样也能够把应用代码跟配置代码进行分离。从而开发跟运维互不影响。

## 参考文档：

- [https://argo-cd.readthedocs.io/en/stable/](https://argo-cd.readthedocs.io/en/stable/)
- [https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/)
- [https://argo-cd.readthedocs.io/en/stable/user-guide/application-specification/](https://argo-cd.readthedocs.io/en/stable/user-guide/application-specification/)
- [https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators/](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators/)
- [https://github.com/Feeeenng/devops-maven-sample](https://github.com/Feeeenng/devops-maven-sample)
