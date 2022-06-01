---
title: '使用 KubeSphere 和极狐GitLab 打造云原生持续交付系统'
tag: 'KubeSphere, DevOps, GitLab, 极狐GitLab'
keywords: 'KubeSphere, GitLab, DevOps'
description: '本文给大家介绍了 KubeSphere 和极狐GitLab 以及各自的优势，并探讨了如何结合 KubeSphere 和极狐GitLab 来打造一个云原生时代的持续交付系统。'
createTime: '2022-05-20'
author: '米开朗基杨'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202206011511539.jpg'
---

## KubeSphere 简介

Kubernetes 是一个非常复杂的容器编排平台，学习成本非常高，KubeSphere 所做的事情就是高度产品化和抽象了底层 Kubernetes，是一个面向云原生的操作系统。讲得再通俗一点，**Kubernetes 屏蔽了底层容器运行时的差异，而 KubeSphere 则屏蔽了底层 Kubernetes 集群的差异，它解决了 K8s 使用门槛高和云原生生态工具庞杂的痛点**。你可以在可视化界面上点几下鼠标即可将 Pod 调度到集群的不同节点中，无需编写 YAML。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201209062.png)

上面是 KubeSphere 的功能架构，可以看到 KubeSphere 包含了非常多的应用场景，比如微服务、DevOps、应用管理、可观测性和安全等，每一个场景生态下面都包含了很多对研发和运维人员比较友好的组件，而且所有的组件都是可插拔的，用户可以根据自己的意愿自由选择启用哪个组件。

从 v4.0 开始，KubeSphere 会提供前后端可插拔的架构和框架，**任何第三方合作伙办和 ISV 都可以基于 KubeSphere 4.0 开放框架，开发扩展自己想要的功能插件，这些功能插件与 KubeSphere 有完全一致的 UI 体验，形成更强大的应用生态**。这就好比 Mac OS 和 App Store 之间的关系一样，任何企业或团队都可以发布自己开发的插件到应用商店，灵活满足各类用户的需求，在社区与 KubeSphere 合作互利共赢。

## 极狐GitLab 简介

极狐GitLab 是一个一体化的 DevOps 平台，可以简单理解为 GitLab 在国内的“发行版”。是由极狐(GitLab)公司推出的产品（极狐(GitLab)公司是以“中外合资3.0”模式成立的公司，在国内独立运营，为国内用户提供适合本土化的 DevOps 平台以及支持服务）。

极狐GitLab 是开源的，任何人都可以参与开源共建，代码托管在极狐GitLab SaaS 上：https://jihulab.com/gitlab-cn/gitlab。其提供的一体化 DevOps 能力覆盖软件开发全生命周期（从计划到运维），同时内置了安全功能，能够利用开箱即用的安全能力构建 DevSecOps 体系。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201727215.png)

更重要的一点是，极狐GitLab 支持自建（私有部署）和 SaaS 两种服务。在私有部署的时候，支持多种安装方式，其中就包括云原生的安装方式，因此，结合 KubeSphere 和极狐GitLab，可以打造出一个适应云原生时代的持续交付系统。

## 在 KubeSphere 上安装极狐GitLab 和 Runner 

目前在 KubeSphere 上部署极狐GitLab 非常便利，只需要利用 KubeSphere 的**应用商店**即可一键部署。

[应用商店](https://kubesphere.com.cn/docs/application-store/)与应用全生命周期管理是 KubeSphere 独有的特色，KubeSphere 为用户提供了一个基于 Helm 的应用商店，用于应用生命周期管理。而且从 3.2.0 版本开始，KubeSphere 新增了 **“动态加载应用商店”** 的功能，**合作伙伴可[申请将应用的 Helm Chart 集成到 KubeSphere 应用商店](https://github.com/kubesphere/helm-charts)，相关的 Pull Request 被合并后，KubeSphere 应用商店即可动态加载应用，不再受到 KubeSphere 版本的限制**。目前极狐 Gitlab 就是通过动态加载的方式将其 Helm Chart 上架到了 KubeSphere 的应用商店。

### 安装极狐GitLab

直接选择下图红色方框中的 jh-gitlab 即可开始部署。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201223468.png)

下一步需要修改一些参数，即 Helm Chart 中的 values。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201226202.png)

大家需要根据自己的实际情况修改，我的私有环境不需要 Ingress，可以通过 Cluster IP 直连，所以才将域名全部设置成了 Service Name。除此之外，还需要取消安装 Runner，后续再单独安装。其他参数可以自己酌情修改，比如我取消了 Certmanager 和 Ingress-Nginx。

查看创建好的工作负载：

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201452487.png)

部署完成后，就可以通过设置好的域名访问极狐GitLab。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201454748.png)

默认用户名是 root，初始密码可以通过以下命令获取：

```bash
$ kubectl -n jh-gitlab get secret jh-gitlab-gitlab-initial-root-password -o go-template --template='{{.data.password}}' | base64 -D
```

登录之后可以先创建一个项目，下面安装 Runner 和演示 Demo 的章节都会用到。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201511040.png)

### 安装极狐GitLab Runner

极狐GitLab Runner 只是极狐GitLab 的其中一个组件，所以不能再通过应用商店来安装。KubeSphere 除了过应用商店之外，还可以通过应用仓库和应用模板来安装应用。**所谓应用仓库，就是一个宽松版的应用商店，应用商店是所有用户共用的，应用仓库只是个人版的应用商店，不需要审批，只会存在于你自己的集群中**。只需将相关应用 Helm Chart 的 URL 导入，即可变成应用仓库中的一个应用。这里我们选择导入极狐GitLab 的 Helm Chart。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201523644.png)

然后在『应用』中点击『创建』。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201525630.png)

然后选择『从应用模板』，在弹出面板的下拉框中选择 GitLab。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201526693.png)

选择 gitlab-runner，然后设置应用名称，继续点击下一步，开始修改部署参数。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201533753.png)

其中，`gitlabUrl` 的值为极狐GitLab 的可视化界面地址，`runnerRegistrationToken` 的值可以设置为想要使用该 Runner 的项目的 CI/CD Specific runners 的 registration token，例如：

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201536761.jpg)

同时还需要开启 RBAC：

```yaml
rbac:
  create: true
  rules: []
  clusterWideAccess: false
  podSecurityPolicy:
    enabled: false
    resourceNames:
      - gitlab-runner
```

其他参数可根据实际情况酌情修改，修改完成后点击下一步开始安装。安装完成后，可以进入 Pod 查看注册情况：

```bash
$ kubectl -n jh-gitlab get pod -l release=gitlab-runner
NAME                                          READY   STATUS        RESTARTS   AGE
gitlab-runner-gitlab-runner-c7c999dfc-wgg56   1/1     Running       0          61s

$ kubectl -n jh-gitlab exec -it gitlab-runner-gitlab-runner-c7c999dfc-wgg56 -- bash
Defaulted container "gitlab-runner-gitlab-runner" out of: gitlab-runner-gitlab-runner, configure (init)
bash-5.0$ gitlab-runner list
Runtime platform                                    arch=amd64 os=linux pid=106 revision=f761588f version=14.10.1
Listing configured runners                          ConfigFile=/home/gitlab-runner/.gitlab-runner/config.toml
gitlab-runner-gitlab-runner-c7c999dfc-wgg56         Executor=kubernetes Token=dSz6WoJzpD5bjkDhP5xN URL=https://jihulab.com/
bash-5.0$
```

可以看到 Pod 里面已经内置了 gitlab-runner 命令，且有注册成功的 Runner 实例 `gitlab-runner-gitlab-runner-c7c999dfc-wgg56`，而这就是刚刚用应用模板安装的 Runner。在极狐GitLab 的 Web 页面也可以看到注册成功的 Runner。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201547341.png)

## CI/CD Demo 演示

接下来我们通过一个简单的流水线示例来演示极狐GitLab 的 CI/CD 流水线工作原理。演示流水线之前，先来了解几个基本概念。

极狐GitLab 流水线包含两个核心组件：

+ **Job** : 描述需要执行的任务；
+ **Stage** : 定义 Job 执行的顺序。

而流水线（Pipeline）则是一组运行在各个 Stage 中的 Job 集合，可以包含多个流程：编译、测试、部署等等，任何提交或 Merge Request 都能触发流水线。

负责执行 Job 的就是 Runner，Runner 的本体，是运行在某台机器上的守护进程，类似于 Jenkins agent。在 Runner 自己看来，没有类型的区别，它只是根据 Token 和 URL，注册到指定的极狐GitLab 而已。

讲完了基础概念，直接来看示例仓库。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201632781.png)

这个示例应用是用 Go 写的 HTTP Server，代码很简单，我就不解释了。

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello this is kubesphere")
}

func main() {
    http.HandleFunc("/ks", handler)
    log.Fatal(http.ListenAndServe(":9999", nil))
}
```

流水线编排文件是 `.gitlab-ci.yml`，内容如下：

```yaml
stages:
  - build
  - deploy

build:
  image: 
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  stage: build
  tags: 
    - kubernetes
  script:
    - mkdir -p /kaniko/.docker
    - echo "{\"auths\":{\"${CI_REGISTRY}\":{\"auth\":\"$(printf "%s:%s" "${CI_REGISTRY_USER}" "${CI_REGISTRY_PASSWORD}" | base64 | tr -d '\n')\"}}}" > /kaniko/.docker/config.json
    - >-
      /kaniko/executor
      --context "${CI_PROJECT_DIR}"
      --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
      --destination "${CI_REGISTRY_IMAGE}:1.0.0"

deploy:
  image: bitnami/kubectl:latest
  stage: deploy
  tags: 
    - kubernetes
  variables:
    KUBERNETES_SERVICE_ACCOUNT_OVERWRITE: jh-gitlab
  only:
    - main
  script:
    - kubectl -n jh-gitlab apply -f deployment.yaml
```

由于最新版的 Kubernetes 无情地抛弃了 Docker，推荐使用 Containerd 作为运行时，所以就没法使用 Docker 来构建镜像啦，我们可以选择使用 Kaniko。Kaniko 是谷歌开源的一款用来构建容器镜像的工具。与 Docker 不同，Kaniko 并不依赖于 Docker Daemon 进程，完全是在用户空间根据 Dockerfile 的内容逐行执行命令来构建镜像，这就使得在一些无法获取 Docker Daemon 进程的环境下也能够构建镜像，比如在标准的 Kubernetes 集群上。

这个流水线总共包含两个阶段：构建和部署。部署阶段需要注意的是，默认情况下 Kubernetes 中的 Pod 是没有权限创建工作负载的，所以我们需要创建一个新的 ServiceAccount，将其绑定到具有权限的 ClusterRole 上面。

```yaml
# rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: jh-gitlab
  namespace: jh-gitlab
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: gitlab-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: jh-gitlab
    namespace: jh-gitlab
```

```bash
$ kubectl apply -f rbac.yaml
```

最后再让 Runner 使用这个新的 ServiceAccount，即：

```yaml
  variables:
    KUBERNETES_SERVICE_ACCOUNT_OVERWRITE: jh-gitlab
```

但是这样还不行，默认情况下流水线没有权限修改 Runner 的 ServiceAccount，需要修改 Runner 的部署清单，赋予其修改权限。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201653158.png)

注意图中右侧的高亮部分，表示允许 jh-gitlab 这个 namespace 下面的 Pod 更改其 ServiceAccount。修改完毕后点击更新即可。

这是我的完整配置，供大家参考：

```yaml
imagePullPolicy: IfNotPresent
gitlabUrl: 'https://jihulab.com/'
runnerRegistrationToken: GR1348941fycCAhY3_LnRFPqy3DL4
terminationGracePeriodSeconds: 3600
concurrent: 10
checkInterval: 30
sessionServer:
  enabled: false
rbac:
  create: true
  rules: []
  clusterWideAccess: false
  podSecurityPolicy:
    enabled: false
    resourceNames:
      - gitlab-runner
metrics:
  enabled: false
  portName: metrics
  port: 9252
  serviceMonitor:
    enabled: false
service:
  enabled: false
  type: ClusterIP
runners:
  config: |
    [[runners]]
      [runners.kubernetes]
        namespace = "{{.Release.Namespace}}"
        image = "ubuntu:16.04"
  privileged: true
  tags: "kubernetes"
  cache: {}
  builds: {}
  services: {}
  helpers: {}
securityContext:
  runAsUser: 100
  fsGroup: 65533
resources: {}
affinity: {}
nodeSelector: {}
tolerations: []
envVars:
  - name: KUBERNETES_SERVICE_ACCOUNT_OVERWRITE_ALLOWED
    value: jh-gitlab
hostAliases: []
podAnnotations: {}
podLabels: {}
secrets: []
configMaps: {}
```

现在随便修改仓库中的文件（比如 README）来触发流水线。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201715744.png)

可以看到流水线被成功触发并执行成功。最后我们来看看构建好的镜像有没有被成功部署。

![](https://pek3b.qingstor.com/kubesphere-community/images/202205201717523.png)

从 KubeSphere 可视化界面里可以看到应用被成功部署了。最后可以测试一下这个 HTTP Server 是否正常工作：

```bash
$ kubectl -n jh-gitlab get pod -l app=cicd-demo -owide
NAME                         READY   STATUS    RESTARTS   AGE     IP             NODE           NOMINATED NODE   READINESS GATES
cicd-demo-86d7fb797c-428xs   1/1     Running   0          4m40s   10.233.65.81   k3s-worker02   <none>           <none>

$ curl http://10.233.65.81:9999/ks
Hello this is kubesphere
```

## 总结

本文给大家介绍了 KubeSphere 和极狐GitLab 以及各自的优势，并探讨了如何结合 KubeSphere 和极狐GitLab 来打造一个云原生时代的持续交付系统，最后通过一个流水线示例来展示极狐 GiLab 流水线的工作原理。

从最后的示例可以看出，CD（即部署阶段）的过程还是比较麻烦的，比如需要安装配置额外工具（kubectl），还需要 Kubernetes 对其进行授权，如果 Kubernetes 部署在云平台中，还需要云平台对其授权。最重要的是，它无法感知部署的状态，部署完了之后无法获知该工作负载是否正常提供服务。

那么这个问题有没有解决办法呢？我将在下一篇文章中给大家介绍如何通过 GitOps 来解决这个问题。