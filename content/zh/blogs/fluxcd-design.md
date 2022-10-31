---
title: 'FluxCD 多集群应用的设计与实现'
tag: 'KubeSphere, FluxCD, GitOps'
keywords: 'KubeSphere, Kubernetes, FluxCD, GitOps, DevOps'
description: '本文对 FluxCD 项目的设计与实现进行了详细解读。'
createTime: '2022-10-31'
author: '程乐齐'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202210312135934.jpg'
---

> 作者：程乐齐，西电通院研二，方向是图像工程，目前专注于云原生领域。

## 前言

FluxCD 是 CNCF 的孵化项目，可以让我们以 GitOps 的方式轻松地交付应用。和另一个同类的 CNCF 孵化项目 ArgoCD 不同，FluxCD 是许多 toolkit 的集合，天然松耦合并且有良好的扩展性，用户可按需取用。我们希望通过集成 FluxCD 这样一个优秀的 GitOps 项目来为用户提供更多的选择。

我们综合考虑了以下三大要素：

+ 为还没有接触过 GitOps 的用户提供易上手的体验；
+ 为使用过 FluxCD 的用户提供无缝切换的体验；
+ 为已经使用过 KubeSphere GitOps 功能的用户提供熟悉感的同时突出 FluxCD 的优势和特性。

多次重新设计了前端界面和后端实现，最终完成了一个还算比较满意的版本。

## ks-devops

### 设计

- **模板复用**：FluxCD 提供了 [HelmChart](https://fluxcd.io/flux/components/source/helmcharts/) 类型的 CRD，但是 HelmRelease 无法直接引用 HelmChart，我们希望添加模板的功能，这样许多配置就可以复用。
- **多集群**：我们希望 FluxApplication 是一个多集群应用，这样我们就可以用一套模板配置然后添加不同的配置去部署到多个集群中。

### CRD

现有的 gitops.kubesphere.io/applications CRD 已经包含了 ArgoApplication。为了集成 FluxCD，我们将 FluxCD 中的 `HelmRelease` 和 `Kustomization` 组合抽象成一个 `FluxApplication` 的概念放入 `Application` 里并且 `kind` 来标识用户启用了哪种 GitOps Engine。

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211729793.png)

一个完整的 GitOps 应用可以拆分成三大部分：
1. **源**：存放制品的仓库，制品包括是 Kubernetes Manifests、Kustomize 和 Helm，仓库的类型有 GitRepository、HelmRepository 以及 Bucket 等。
2. **应用配置**：对 Kustomize 可以是 [path](https://github.com/fluxcd/kustomize-controller/blob/52be7c873d25122f9578e1daaa11283d449d5a25/api/v1beta2/kustomization_types.go#L77) 和 [patches](https://github.com/fluxcd/kustomize-controller/blob/52be7c873d25122f9578e1daaa11283d449d5a25/api/v1beta2/kustomization_types.go#L95)，对 Helm 可以是 [valuesFrom](https://github.com/fluxcd/helm-controller/blob/0fc4d0f1c09bf7ab7c5990aefe480ca4648eeedd/api/v2beta1/helmrelease_types.go#L162) 和 [values](https://github.com/fluxcd/helm-controller/blob/0fc4d0f1c09bf7ab7c5990aefe480ca4648eeedd/api/v2beta1/helmrelease_types.go#L166)。
3. **部署目标**：制品的部署位置，是集群和相应名称空间的组合。

所以 `FluxApplication` 的具体实现如下，包含了 `Source` 和 `Config`，由于 FluxCD 是一个多集群应用，一个部署目标对应一个应用配置，所以部署目标被包含在应用配置中。
```go
type FluxApplicationSpec struct {  
   // Source represents the ground truth of the FluxCD Application  
   Source *FluxApplicationSource `json:"source,omitempty"`  
   // Config represents the Config of the FluxCD Application  
   Config *FluxApplicationConfig `json:"config"`  
}
```

### Controller

`application-controller` 和 `status-controller` 是管理 FluxCD 多集群应用的具体实现。以下是 FluxCD Helm 应用的示意图：

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211728027.png)

- `application-controller` 负责 reconcile 自定义的多集群应用，解析自定义的 CR 然后转换成底层 FluxCD 的 CR 去驱动 FluxCD 的 `kustomize-controller` 或 `helm-controller` 去应用的部署。
- 可以为同一个 `HelmTemplate` 添加不同的应用配置和部署配置然后部署到多个集群中，还可以使用 FluxCD 的 `pause` 和 `resume` 功能，单独控制某个集群内应用的启停。
- `status-controller` 使底层 FluxCD 应用状态透出到上层 gitops.kubesphere.io/application CR 中。

## 可视化界面

### 应用创建

为了使体验过 KubeSphere GitOps 功能的用户感到熟悉，我们在基础信息配置标签中选择和 ArgoCD 保持一致。虽然在应用配置和部署配置中 FluxCD 和 ArgoCD 存在相似之处，但是为了可维护性并且突出 FluxCD 的特点，我们重新设计了部署设置标签页，并且正在迭代之中。

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211728960.png)

1. 在类型这一栏中，可以选择 HelmRelease 或者 Kustomization。在以后模板 API 全部开发完成之后，用户可以在此处选择模板类型，然后就可以选择保存的模板并将该模板部署到任意集群。

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211728225.png)

2. 在配置这一栏里可以配置 Chart 和 ValuesFiles，现阶段如果需要配置 ValuesFiles 要使用分号将路径隔开，如：`./helm-chart/values.yaml;./helm-chart/aliyun-values.yaml`；并且可以选择是否将此配置保存为模板。
3. 在部署这一栏中，用户可以为每一个部署位置配置不同的 Values、ValuesFrom 以及高级设置。Values 可以是任意 json 类型，是 `helm install xxx --set` 后面加的参数，例如：`ports.traefik.expose=true`；而 ValuesFrom 是 FluxCD 特有的内容，是一个类型为 ConfigMap 或 Secret 的数组，可以让用户更灵活的注入参数，用户可以单击标签选择类型：

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211728454.png)

4. 为了满足高级用户的需求并且照顾到刚接触 GitOps 的用户，我们提供了高级设置。现阶段的高级设置包括：同步间隔、ReleaseName、StorageNamespace 以及原生的 Helm 操作参数。和 Helm 的原生操作类似，例如经常使用的安装命令 `helm install xxx --create-namespace` 中的`--create-namespace` 的 flag 就可以通过设置安装参数 `createNamespace=True` 来达到相同的效果，如果你熟悉 Helm，你一定能够在这里找到熟悉的感觉，因为 FluxCD 的 [helm-controller](https://github.com/fluxcd/helm-controller) 内部就是使用了原生的 helm 库来完成对应的操作。

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211728832.png)

### 应用管理

在创建好一个 FluxCD 应用之后，在持续部署的主页可以看到创建的应用的概要预览，其中包括应用的类型（HelmRelease｜Kustomization）、源（GitRepository｜HelmRepository｜Bucket）、版本以及就绪个数，就绪个数的意思是，当选择将应用部署至多个位置时应用的就绪情况，例如将应用部署至三个集群内，其中两个集群中的应用已经处于 `Ready` 状态，另外一个集群内的应用还处于 `Reconciling` 的状态时，就绪个数为 `2/3`。用户还可以对该应用进行信息编辑，Yaml 编辑以及删除等操作。

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211727169.png)

点击应用名称可以进入应用详情页，在应用详情页可以看到应用的状态、部署位置、以及消息等内容，该部分会持续完善。

![](https://pek3b.qingstor.com/kubesphere-community/images/202210211727099.png)

## Demo

> demo 视频的前端采用 [kubesphere/console PR-3761](https://github.com/kubesphere/console/pull/3761)；后端采用 [kubesphere/ks-devops master branch](https://github.com/kubesphere/ks-devops)。

[Demo Video](https://youtu.be/A4hKmgFGgAk)