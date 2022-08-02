---
title: '基于 KubeSphere 流水线的 GitOps 最佳实践'
tag: 'KubeSphere, GitOps'
keywords: 'KubeSphere, GitOps, Kubernetes'
description: '本文基于 KubeSphere v3.1.1 的流水线，根据实际应用场景，实现了 GitOps 的服务发布流程。'
createTime: '2022-07-28'
author: '李亮'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-gitops-cover-1.png'
---

## 背景

`KubeSphere 3.3.0` 集成了 `ArgoCD`，但与笔者目前使用的 K8S 版本不兼容。再者，目前 `KubeSphere` 中持续集成和流水线打通还是不太友好，也缺少文档说明（可能是笔者没有找到）。

**目前遇到最主要的问题就是流水线制作完成的镜像如何更新到 Git 仓库，然后触发 Application 的同步。**

基于上述问题，目前有两种方法：

- ArgoCD 官方的 [argocd-image-updater](https://argocd-image-updater.readthedocs.io/en/stable/ "argocd-image-updater")（根据镜像仓库的镜像 Tag 变化，完成服务镜像更新）
- KubeSphere 提供了一个 [ks app update 工具](https://github.com/kubesphere-sigs/ks/blob/master/docs/app.md "ks app update 工具 ")（支持 KubeSphere v3.3.0 中 Application，不支持原生 ArgoCD Application）

**为此笔者基于 KubeSphere v3.1.1 的流水线，根据笔者的场景，实现了 GitOps 的服务发布流程，作此记录，暂且称之为最佳实践。**

## 目标

基于 KubeSphere 的流水线：

- 自动创建服务部署清单
- 自动创建服务 pipeline
- 提交到服务部署清单仓库
- 流水线风格统一
- 通过服务流水线发布版本之后在一段时间内可以回滚
- 实现 GitOps 方式管理服务部署清单和流水线清单，做到版本控制

## 设计

![](https://pek3b.qingstor.com/kubesphere-community/images/c0130af7-1a55-44ac-bce9-32af76e6162e.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/5a822de1-11cf-460d-8bf5-243c71d6fb06.png)

## GitLab 项目规划

- 服务源代码和部署清单仓库分离，方便做权限管理；
- 模板仓库 argocd-gitops-templates 是单独的 GitLab 仓库；
- 每个 DevOps 项目对应一个 GitLab 仓库。（仓库名称为 `argocd-gitops-{devops 项目名}`）；
- 所有 GitLab 仓库都放在同一个 GitLab Group 下；
- 每个仓库中包含了服务不同环境的清单，如：uat 和 prod；
- 一个服务包含一个 pipeline Application 和服务部署清单 Application。服务部署清单通过 Application CR 管理；服务 pipeline 清单通过 pipeline Application CR 管理。

## 模板仓库目录结构

`argocd-gitops-templates` 项目存储了生成服务流水线和部署清单、argocd Application 的模板。

```shell
.
|-- app-manifests-templates
|   |-- go
|   |   |-- base
|   |   |   |-- deployment.yaml
|   |   |   |-- kustomization.yaml
|   |   |   `-- service.yaml
|   |   |-- canary
|   |   |   |-- deployment_overlay.yaml
|   |   |   |-- kustomization.yaml
|   |   |   `-- service_overlay.yaml
|   |   |-- ga
|   |   |   `-- kustomization.yaml
|   |   |-- kustomization.yaml
|   |
|-- application-templates
|   |-- README.md
|   |-- application-pipeline.yaml
|   `-- application.yaml
|-- pipeline-templates
|   `-- pipeline
|       `-- ks-pipeline-jenkinsfile.yaml
|-- top-pipeline
|   |-- README.md
|   |-- dev
|   |   |-- application.yaml
|   |   |-- only-test-deploy-by-argo-top-pipeline.jenkinsfile
|   |   `-- pipeline
|   |       `-- deploy-by-argo-top-pipeline.yaml
|   |-- prod
|   |   |-- application.yaml
|   |   |-- only-test-deploy-by-argo-top-pipeline.jenkinsfile
|   |   `-- pipeline
|   |       `-- deploy-by-argo-top-pipeline.yaml
```

- app-manifests-templates：包含 go、java、nodejs 的服务部署清单模板，使用 overlay 的方式 和 base 文件夹中的配置进行合并（利用 kustomize 工具实现），生成最终的部署清单。
- application-templates：包含服务 argocd Application，服务 pipeline argocd Application 清单模板。
- top-pipeline：包含 dev、prod K8S 集群中的 top pipeline 清单和管理它的 argocd Application。
- pipeline-templates：包含了服务 pipeline 模板，整体用 `Groovy` 语法实现

> **注意：**
> app-manifests-templates、pipeline-templates、application-templates，在发布 GitOps 服务时，执行 Top pipeline 生成服务 pipeline，会自动拷贝，并根据运行 Top pipeline 时输入的参数生成清单，到服务对应的 GitLab 仓库中。

## 服务部署清单仓库目录结构

例如：devops1 项目的 GitLab 部署清单仓库目录结构如下：

```shell
.
|-- README.md
`-- appsmanifests
    |-- kubeinfo-svc1
    |   |-- prod
    |   |   |-- application-pipeline.yaml
    |   |   |-- application.yaml
    |   |   `-- manifests
    |   |       |-- base
    |   |       |   |-- deployment.yaml
    |   |       |   |-- kustomization.yaml
    |   |       |   `-- service.yaml
    |   |       |-- canary
    |   |       |   |-- deployment_overlay.yaml
    |   |       |   |-- kustomization.yaml
    |   |       |   `-- service_overlay.yaml
    |   |       |-- ga
    |   |       |   |-- deployment_overlay.yaml
    |   |       |   `-- kustomization.yaml
    |   |       |-- kustomization.yaml
    |   |       |-- pipeline
    |   |       |   `-- ks-pipeline-jenkinsfile.yaml
    |   `-- uat
    |       |-- application-pipeline.yaml
    |       |-- application.yaml
    |       `-- manifests
    |           |-- base
    |           |   |-- deployment.yaml
    |           |   |-- kustomization.yaml
    |           |   `-- service.yaml
    |           |-- canary
    |           |   |-- deployment_overlay.yaml
    |           |   |-- kustomization.yaml
    |           |   `-- service_overlay.yaml
    |           |-- ga
    |           |   |-- deployment_overlay.yaml
    |           |   `-- kustomization.yaml
    |           |-- kustomization.yaml
    |           |-- pipeline
    |           |   `-- ks-pipeline-jenkinsfile.yaml
```

- 服务清单在 `appsmanifests/{服务名}` 文件夹下。
- 每个服务根据环境（用 top pipeline 创建服务流水线的时候需要选择）又划分为不同的文件夹。
- 每个环境文件夹下有两个 Application 清单，分别去管理 manifests 中的部署清单和 pipeline 清单。
- canary、ga 文件夹根据 STAGE_LEVEL（用 top pipeline 创建服务流水线的时候需要选择）的值会自动在 kustomization.yaml 中进行管理。
  > **注意：**
  > 目前只提供最基本的部署清单：如果需要 Configmaps、Secrets、Ingress、增加环境变量、label 等，需要手动增加或修改。具体可以参考下面的实践说明文档：

## Top Pipeline 流程

Top Pipeline 用来自动化创建 GitOps 仓库，生成服务部署清单、pipeline CR 清单、Application CR 清单，将清单提交到 GitLab 仓库，并将 Application 创建到 K8S 集群中。整体用 `Groovy` 语法实现。

![流程](https://pek3b.qingstor.com/kubesphere-community/images/1374bfe4-b7a6-4af4-bb62-bfe4e8486a38.png)

**黄色部分为需要人为干预的，绿色为自动执行的。**

每个服务的发布，流水线都隶属于一个 DevOps 项目下，如果这个 DevOps 项目不存在，则需要手动新建。

如果存在，则需要手动点击运行 top pipeline。

- 输入服务配置参数，点击确定运行。
  ![](https://pek3b.qingstor.com/kubesphere-community/images/ed377146-dc6e-4e79-bd63-0302208855b2.png)

* 持久化参数信息：流水线运行时会将所填参数更新到 Pipeline CR 的 parameters 中（避免流水线执行失败后，重新运行时，需要重填参数）；
* 流水线会自动获取需要选择的动态参数，需要人为选择。

![](https://pek3b.qingstor.com/kubesphere-community/images/c66cc486-f2e2-4d86-8da7-9406cacbc71c.png)

- 检查 GitLab 中是否存在该 DevOps 项目的仓库，不存在会自动新建仓库；
- 自动克隆 模板仓库，生成服务部署清单、pipeline CR 清单、两个 Application CR 清单，提交到 GitLab
- 自动执行 `kubectl apply -f {两个 application yaml}` 创建 argocd Application CR；

## 服务 Pipeline 发布版本流程

![](https://pek3b.qingstor.com/kubesphere-community/images/36d37b8b-c728-4a7b-8e66-aa76372dddd3.png)

## 细节解析

### Application 怎么创建？

通过 kubectl 命令行直接创建到 ArgoCD 所在 K8S 集群。

### 每个服务对应几个 Application？

一个服务对应 2 个 Application，一个管理 pipeline CR，另一个管理 deployment 等部署清单。

### 流水线上编译的镜像 Tag 如何提交到 Git？

用 Git 命令行实现。

一个 DevOps 项目下的多个 Pipeline 同时运行，一定程度可能会提交失败。比如：
B 克隆代码到本地，此时 A 提交一次，B 提交时就失败，需要重新 pull 后再提交。所以需要加重试机制，失败重新 pull。

**容易提交冲突，所以需要先 pull 再 push，并增加失败之后重试**

### CI 更新镜像 Tag 到 GitLab 后，如何触发 CD 同步？

开启自动同步后，默认是 3~4 分钟 sync，时间较长。如何及时触发 CD 同步？

集成 argocd 命令行工具到 Agent 镜像中，新建一个 gitops 账号，并通过 RBAC 控制该账号的权限。

**执行 argocd sync 命令也可能失败，需要加失败之后重试**

**具体请参看：**
[ArgoCD 用户管理、RBAC 控制、命令行登录、App 同步](https://blog.csdn.net/ll837448792/article/details/125899955 "ArgoCD 用户管理、RBAC 控制、命令行登录、App 同步")

### Agent 镜像制作

kubesphere/builder-base:v3.2.2 镜像中包含了 kustomize 和 Git，更新镜像 Tag 时，用 base-3.2.2 作为 Pipeline Agent。

并将 argocd 命令行集成到上面镜像中，生成新的镜像：
harbor.kubeinfo.cn/library/kubesphere/builder-base:v3.2.2-argocd

### 如何回滚

审核阶段，如果点击“终止”，将回滚上一个阶段的镜像版本。

正式环境发布之后（即流水线最后一步），可以点击“终止”回滚到上一个镜像版本（一般在新版本测试不通过的情况下点击“终止”），如果 30 分钟内没有点击，或者点了继续，本次发布流程将结束。

回滚的时候，通过 git revert 命令回退某一次提交。

### 跨集群发布服务

没有启用 DevOps 系统的 K8S 集群中，不存在 pipeline CRD。

所以 pipeline 用单独的 Application 管理，其中的 destination cluster 只能为 ArgoCD 所在的集群。

只要加入到了 argocd 中的 k8s 集群（即使没有被 KubeSphere 纳管），都可以走这一套 GitOps 流程，将服务部署到这个 k8s 集群中。

### 清单管理

目前采用 Kustomize，kustomize 利用 overlay 机制覆盖某些配置，虽然在可定制化方面不如 helm，如：不支持模板语法和变量，但 helm 对于笔者来说太重。目前的场景采用 Kustomize，基本可以满足需求。

Kustomize 命令行用于更新 kustomization.yaml 中镜像 Tag，以及校验语法是否正确，避免语法不正确提交。

```shell
$ kustomize edit set image kubeinfo-svc=harbor-kubeinfo.cn/argocd/kubeinfo-svc:${DOCKER_TAG}
```

Kustomize 已经在上面的 Agent 镜像中包含。

### 实例数如何适配 HPA 自动伸缩

注释掉 deployment 中的 `spec.replicas`，argocd 将不管理 deployment 的实例数。

### 在 KubeSphere 中修改了清单，argocd 会还原吗？

argocd Application 中有个 `selfHeal` 配置，表示：指定当仅在目标 Kubernetes 集群中更改资源且未检测到 git 更改时 (默认为 false) ，是否应执行部分应用程序同步。

所以当 K8s 资源对象被修改时，Git 中清单没变化的情况下，不需要自愈修复，argocd 不会做还原；

但下一次流水线发布版本时，Git 上的清单会发生变化，此时 K8S 资源会被还原。

### 凭证统一

用 top pipeline 生成的流水线，有统一的格式，所以凭证必须统一。

**DevOps 项目有很多，维护凭证成本很高。如何统一、自动化创建管理？如：harbor、argocd 的 gitops 账户、GitLab 的账号凭证。**

通过 kubed + kyverno 实现：在 kubesphere-devops-system 下创建的源 secret，将会自动同步到所有 devops project 下。

参考：
[如何跨命名空间共享 Secret 和 ConfigMap？KubeSphere 凭证如何同步？](https://liabio.blog.csdn.net/article/details/124973387 "如何跨命名空间共享 Secret 和 ConfigMap？KubeSphere 凭证如何同步？")

## 展望

引入了 GitOps，发现要做的东西更多了，但也确实带来很多好处。本文旨在记录分享笔者的 GitOps 落地经验，有些方案细节可能只适用于笔者当前的场景，笔者也处于摸索阶段。欢迎大佬们拍砖。

同时也期待 `KubeSphere` 服务的发布可以和流水线一条龙创建，将 `GitOps` 做的更易用，而不用在`项目`和 `DevOps 项目`之间切换；同时将灰度发布集成到流水线、可以回滚。
