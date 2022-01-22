---
title: 'KubeSphere + Argo CD，实现真正的 GitOps！'
tag: 'KubeSphere, Argo CD,  GitOps'
keywords: 'KubeSphere,  Kubernetes, Argo CD, GitOps'
description: '使用 KubeSphere DevOps 实现 CI 部分, CD 部分由 Argo CD 完成；Argo CD 持续监测 Git 仓库某个目录下 yaml 文件变动，自动将 yaml 文件部署到 K8s 集群；Argo CD 持续监测 Harbor 镜像仓库某个镜像 tag 变动，自动将最新镜像部署到 K8s 集群。'
createTime: '2021-07-08'
author: 'willqy'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-ArgoCD.png'
---


> 来自社区用户 willqy 的分享。

## Argo CD 简介

Argo CD 是用于 Kubernetes 的声明性 GitOps 持续交付工具，应用程序定义，配置和环境应为声明性的，并应受版本控制，应用程序部署和生命周期管理应该是自动化、可审核且易于理解。

Argo CD 遵循 GitOps 模式，该模式使用 Git 仓库作为定义所需应用程序状态的真实来源。

Argo CD 可在指定的目标环境中自动部署所需的应用程序状态，应用程序部署可以在 Git 提交时跟踪对分支，标签的更新，或固定到清单的特定版本。

官网：[https://argoproj.github.io/](https://argoproj.github.io/)

Argo CD 架构图：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112717301714.png)

Argo CD 被实现为 Kubernetes 控制器，该控制器持续监视正在运行的应用程序，并将当前的活动状态与所需的目标状态（在 Git 存储库中指定）进行比较。当已部署应用程序的运行状态偏离目标状态时将被 Argo CD 视为 OutOfSync。

Argo CD 报告并可视化差异，同时提供了自动或手动将实时状态同步回所需目标状态的功能。在 Git 存储库中对所需目标状态所做的任何修改都可以自动应用并同步到指定的目标环境中。

Argo CD 支持的 Kubernetes 配置清单包括 helm charts、kustomize 或纯 YAML/json 文件等。

**本篇文章涉及内容：**

- 使用 KubeSphere DevOps 实现 CI 部分, CD 部分由 Argo CD 完成；
- Argo CD 持续监测 Git 仓库某个目录下 yaml 文件变动，自动将 yaml 文件部署到 K8s 集群；
- Argo CD 持续监测 Harbor 镜像仓库某个镜像 tag 变动，自动将最新镜像部署到 K8s 集群。

基本原理图：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112917263483.png)

## 准备 Git 代码仓库

准备 2 个 Git 仓库，一个源码仓库，一个 yaml 文件仓库，源码和 yaml 文件分离。

![](https://pek3b.qingstor.com/kubesphere-community/images/202011281830155.png)

源码仓库可参考以下链接，离线环境原因，这里选择第二个示例 spring-demo：

+ [https://github.com/KubeSphere/devops-maven-sample](https://github.com/KubeSphere/devops-maven-sample)
+ [https://github.com/willzhang/spring-demo](https://github.com/willzhang/spring-demo)

yaml 文件仓库可参考以下链接，这里命名为 argocd-gitops：

+ [https://github.com/argoproj/argocd-example-apps](https://github.com/argoproj/argocd-example-apps)

yaml 仓库下创建 javademo 目录，并创建 2 个简单的 yaml 文件：

```bash
[root@jenkins git]# tree argocd-gitops/
argocd-gitops/
├── javademo
│   ├── javademo-deployment.yaml
│   └── javademo-svc.yaml
```

javademo-deployment.yaml 示例，当前镜像 tag 可随意指定，执行 CI 时会实时替换该参数：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: javademo
spec:
  replicas: 1
  revisionHistoryLimit: 3
  selector:
    matchLabels:
      app: javademo
  template:
    metadata:
      labels:
        app: javademo
    spec:
      containers:
      - image: 10.39.140.196:8081/apps/javademo:replace
        name: javademo
        ports:
        - containerPort: 8080
```

javademo-svc.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: javademo
spec:
  type: NodePort
  ports:
  - port: 8012
    targetPort: 8080
  selector:
    app: javademo
```

## 部署 Argo CD

Argo CD 有多种部署方式，可以直接部署 yaml 文件.

```bash
kubectl create namespace Argo CD
kubectl apply -n Argo CD -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

这里使用 helm 方式部署，可直接指定 Argo CD server service 类型 nodePort:

```bash
helm repo add argo https://argoproj.github.io/argo-helm

helm install Argo CD \
  --namespace=Argo CD --create-namespace \
  --set server.service.type=NodePort \
  argo/argo-cd
```

查看运行的 Pod:

```bash
[root@master ~]# kubectl -n Argo CD get pods
NAME                                             READY   STATUS    RESTARTS   AGE
argocd-application-controller-5db8c6f8f9-qnmtr   1/1     Running   0          8h
argocd-dex-server-84b5cbfbc9-fc7rf               1/1     Running   0          8h
argocd-redis-7c7c79dcd9-hjhgr                    1/1     Running   0          8h
argocd-repo-server-5fb9cbb945-9xmc7              1/1     Running   0          8h
argocd-server-8d8cb6488-pjwt4                    1/1     Running   0          8h
```

如果使用 KubeSphere 部署 Argo CD，首先需要配置 Argo CD helm 仓库，进入企业空间，选择应用模板上传离线 helm chart 包，或在应用仓库配置公网 helm repo 地址。

完成后进入项目，点击部署新应用，选择 Argo CD helm chart 进行部署即可：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112819134135.png)

## 安装 Argo CD CLI

要与 Argo CD API Server 进行交互，我们需要安装 CLI 命令：

```bash
wget https://github.com/argoproj/argo-cd/releases/download/v1.7.10/argocd-linux-amd64
cp argocd-linux-amd64 /usr/local/bin/Argo CD
chmod +x /usr/local/bin/Argo CD

Argo CD version：
```

如果上面 Argo CD 使用 yaml 方式部署，修改 serivce 类型为 nodeport，以便访问 Argo CD API Server

```bash
kubectl patch svc argocd-server -n Argo CD -p '{"spec": {"type": "NodePort"}}'
```

查看 Argo CD server service，记录 nodeport 信息：

```bash
[root@master ~ ]# kubectl -n Argo CD get svc
NAME                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
argocd-dex-server       ClusterIP   10.99.232.27     <none>        5556/TCP,5557/TCP,5558/TCP   5d
argocd-metrics          ClusterIP   10.107.37.4      <none>        8082/TCP                     5d
argocd-redis            ClusterIP   10.106.160.6     <none>        6379/TCP                     5d
argocd-repo-server      ClusterIP   10.100.101.100   <none>        8081/TCP,8084/TCP            5d
argocd-server           NodePort    10.106.141.243   <none>        80:31195/TCP,443:32079/TCP   5d
argocd-server-metrics   ClusterIP   10.109.81.234    <none>        8083/TCP                     5d
```

Argo CD 默认登录用户为 admin，初始密码为 argocd-server Pod 名称，获取 Pod 名称：

```bash
podName=`kubectl get pods -n Argo CD -l app.kubernetes.io/name=argocd-server -o name | cut -d'/' -f 2`
```

使用 Argo CD CLI 登录，以 nodeIP 和 nodePort 作为 Argo CD server 登录地址：

```bash
Argo CD login 10.39.140.248:31195 --username admin --password $podName
```

修改默认密码:

```sehll
Argo CD account update-password \
  --current-password $podName \
  --new-password Argo CD@123
```

浏览器登录 Argo CD UI:

```bash
https://10.39.140.248:31195
```

## 部署 Argo CD 应用

登陆 Argo CD UI 后，选择 NEW APP 创建 application，选择 EDIT AS AYML:

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112818461811.png)

粘贴以下内容，SAVE 后点击左上 CREATE，当然也可以直接使用 kubectl apply 命令执行以下内容，效果相同。

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: javademo
  namespace: Argo CD
  finalizers:
    - resources-finalizer.Argo CD.argoproj.io
spec:
  project: default
  source:
    path: javademo
    repoURL: http://10.39.140.196:10080/gogs/argocd-gitops.git
    targetRevision: HEAD
  destination:
    namespace: apps
    server: https://kubernetes.default.svc
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - Validate=false
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

参数说明：

- metadata 字段：指定了应用名称，命名空间必须指定 Argo CD，添加 finalizers 字段可在删除应用时级联删除相关 k8s 资源；
- source 字段：指定了 yaml 文件所在 git 仓库 URL，及要监测的 yaml 文件存放目录，该目录下文件有任何变更 Argo CD 都会自动将其更新部署到 k8s 集群；
- destination 字段：指定监测的 yaml 文件要部署到哪个 k8s 集群及哪个命名空间下；
- syncPolicy 字段：指定自动同步策略和频率，不配置时需要手动触发同步。

另外如果使用私有 Git 仓库，需要创建凭证，这里的凭证是 Argo CD 访问 yaml 文件 Git 仓库的凭证：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112916162887.png)

等效的 Argo CD cli 命令：

```bash
Argo CD repo add http://10.39.140.196:10080/gogs/argocd-gitops --username gogs --password xxxxxx
```

创建后 Argo CD 会自动将 Git 仓库 javademo 目录下的 yaml 文件部署到 K8s 集群，此时应用无法正常启动，因为 yaml 文件中的镜像 tag 还不存在，拉取镜像会失败：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112819204058.png)

也可以使用 Argo CD CLI 查看部署的应用:

```bash
[root@master ~]# Argo CD app get javademo
Name:               javademo
Project:            default
Server:             https://kubernetes.default.svc
Namespace:          apps
URL:                https://10.39.140.248:31195/applications/javademo
Repo:               http://10.39.140.196:10080/gogs/argocd-gitops.git
Target:             HEAD
Path:               javademo
SyncWindow:         Sync Allowed
Sync Policy:        Automated (Prune)
Sync Status:        Synced to HEAD (1b96380)
Health Status:      Progressing

GROUP  KIND        NAMESPACE  NAME      STATUS  HEALTH       HOOK  MESSAGE
       Service     apps       javademo  Synced  Healthy            service/javademo unchanged
apps   Deployment  apps       javademo  Synced  Progressing        deployment.apps/javademo unchanged
```

在 KubeSphere UI 查看 Pod 状态，一直在重试拉取镜像：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112819304671.png)

使用 kubectl 命令查看，状态为 ImagePullBackOff ：

```bash
[root@master ~]# kubectl -n apps get pods
NAME                       READY   STATUS             RESTARTS   AGE
javademo-64d46bff8-6dgjn   0/1     ImagePullBackOff   0          13m

[root@master ~]# kubectl -n apps get svc
NAME       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
javademo   ClusterIP   10.111.56.180   <none>        8012/TCP   33m
```

## KubeSphere 创建流水线

创建 CI 流水线，使用 KubeSphere DevOps 完成源码编译、镜像构建并推送到 Harbor 仓库，最后以 git commit 方式更新 yaml 仓库中 image 字段。

由于此时 Argo CD 持续监测 yaml 仓库配置文件变动，当 CI 部分执行 git push 时便会触发 Argo CD 更新 yaml 文件到 K8s 集群。

在 KubeSphere DevOps 工程下创建一条空流水线，命名为 javademo，进入流水线，选择编辑 Jenkinsfile，复制以下内容：

```groovy
pipeline {

    environment {
        GIT_URL='http://10.39.140.196:10080/gogs/spring-demo.git'
        GIT_CREDENTIAL_ID = 'git-id'
        GIT_BRANCH = 'master'
        REGISTRY = '10.39.140.196:8081/apps/javademo'
        REGISTRY_CREDENTIAL_ID = 'harbor-id'
    }

    agent {
        node {
            label 'maven'
        }
    }

    stages {

        stage('SCM Checkout') {
            steps {
                git branch: "${GIT_BRANCH}", credentialsId: "${GIT_CREDENTIAL_ID}", url: "${GIT_URL}"
            }
        }

        stage('source build') {
            steps {
                container('maven') {
                    sh 'mvn clean package'

                }
            }
        }

        stage('docker build & push') {
            steps {
                script {
                    env.COMMIT_ID = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
                    env.TIMESTRAP = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                    env.DOCKER_TAG = "dev_${TIMESTRAP}_${COMMIT_ID}_${BUILD_NUMBER}"
                }
                container('maven') {
                    withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$REGISTRY_CREDENTIAL_ID" ,)]) {
                        sh 'docker build -t $REGISTRY:$DOCKER_TAG .'
                        sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
                        sh 'docker push $REGISTRY:$DOCKER_TAG'
                    }
                }
            }
        }

        stage('update docker tag') {
            environment {
                BUILD_USER = 'admin'
                BUILD_USER_EMAIL = 'admin@Argo CD.com'
                YAML_REPO_URL='http://${username}:${password}@10.39.140.196:10080/gogs/argocd-gitops.git'
            }

            steps {
                withCredentials([usernamePassword(passwordVariable : 'password' ,usernameVariable : 'username' ,credentialsId : "$GIT_CREDENTIAL_ID" ,)]) {
                    sh """
                        git config --global user.name "$BUILD_USER"
                        git config --global user.email "$BUILD_USER_EMAIL"
                        git clone ${YAML_REPO_URL} && cd argocd-gitops
                        sed -i "s#$REGISTRY.*#${REGISTRY}:${DOCKER_TAG}#g" javademo/javademo-deployment.yaml
                        git add -A && git commit -m "update tag: ${DOCKER_TAG}" && git push ${YAML_REPO_URL}
                    """
                }
            }
        }
    }
}
```

注意修改相关参数，流水线中引用了 2 个凭证:

- GIT_CREDENTIAL_ID 为内网 gogs git 仓库账号密码
- REGISTRY_CREDENTIAL_ID 为 Harbor 仓库账号密码

运行流水线前需要在 DevOps 工程下提前创建好相关凭证，后续需要在 Jenkinsfile 中引用。

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112820033740.png)

最终流水线如下，点击运行，等待流水线执行完成，查看状态为成功：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112820010249.png)

查看流水线构建日志，可以看到执行了以下过程，其中最后 update docker tag 步骤，执行了 2 个关键操作，sed 命令替换镜像 tag，然后执行 git push 更新 yaml 仓库。

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112820171738.png)

查看推送到 Harbor 仓库的镜像：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112913370958.png)

Argo CD 监测到 yaml 文件变更后更新至 K8s 集群：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112820232531.png)

Argo CD UI 查看使用的镜像：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112820240368.png)

登录 KubeSphere UI 查看应用状态为运行中：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112820384668.png)

在 Git 仓库直接修改 yaml 文件配置,同样能够触发 Argo CD 同步，例如将 service 类型改为 nodePort：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112913222891.png)

等待 Argo CD 自动同步配置更新到 K8s 集群，浏览器以 nodeport 方式访问 java web 应用：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112913244468.png)

## 部署 Argo CD Image Updater

上面演示了基于 Git 仓库变更作为应用部署的事实来源，下面演示另一种方式，以镜像 tag 变更作为应用部署的事实来源。Argo CD 提供了 `Argo CD Image Updater` 小工具，用于实现该操作。

Argo CD image updater 是一种自动更新由 [Argo CD](https://github.com/argoproj/argo-cd) 管理的 Kubernetes 工作负载容器镜像的工具。

该工具目前还在开发中，并且有以下特性和局限性:

- 只能更新由 Argo CD 管理并由 Helm 或 Kustomize 工具生成的应用程序的镜像；
- 对广泛使用的容器仓库的默认支持：Dockerhub、Harbor 私有镜像仓库等；
- 能够使用匹配器功能过滤镜像仓库返回的标签列表；
- 镜像拉取 secrets 必须存在于 Argo CD Image Updater 在其中运行（或可以访问）的同一 Kubernetes 群集中。当前不可能从其他集群中获取这些 secrets。
- 在当前版本中，Argo CD Image Updater 不会将任何更改写回到 Git 存储库。

官方文档：

[https://argocd-image-updater.readthedocs.io/en/stable/](https://argocd-image-updater.readthedocs.io/en/stable/)

Argo CD Image Updater 部署略显繁琐，部署操作如下：

1、在 Argo CD 中创建本地用户

创建 Argo CD 镜像更新程序需要访问 Argo CD API Server 的凭据，使用一个 image-updater 具有适当 API 权限的用户，将以下用户定义添加到 argocd-cm：

```bash
# kubectl -n Argo CD edit cm argocd-cm
data:
  accounts.image-updater: apiKey
```

为用户创建访问令牌，将令牌的值复制到某个地方，稍后将需要它。

```bash
Argo CD account generate-token --account image-updater --id image-updater
```

2、在 Argo CD 中授予 RBAC 权限
 
为 `image-updater` 用户配置适当的 RBAC 权限，Argo CD Image Updater 需要应用程序的 `update` 和 `get` 权限。

```yaml
# kubectl -n Argo CD edit cm argocd-rbac-cm
data:
  policy.default: role:readonly
  policy.csv: |
    p, role:image-updater, applications, get, */*, allow
    p, role:image-updater, applications, update, */*, allow
    g, image-updater, role:image-updater
```

3、 安装 Argo CD Image Updater

yaml 文件下载：[https://github.com/argoproj-labs/argocd-image-updater/tree/master/manifests](https://github.com/argoproj-labs/argocd-image-updater/tree/master/manifests)

```bash
kubectl create ns argocd-image-updater
kubectl apply -n argocd-image-updater -f manifests/install.yaml
```

4、 配置镜像仓库

即使您不打算使用私有镜像仓库，您也需要至少配置一个 empty `registries.conf`：

```yaml
# kubectl -n argocd-image-updater edit cm argocd-image-updater-config
data:
  registries.conf: ""
```

没有此条目 `argocd-image-updater`， Pod 将无法启动。

如果使用私有镜像仓库可参考以下配置，以 Harbor 镜像仓库为例：

```yaml
data:
  Argo CD.insecure: "true"
  log.level: debug
  registries.conf: |
    registries:
    - name: harbor
      api_url: http://10.39.140.196:8081
      prefix: 10.39.140.196:8081
      ping: yes
      insecure: yes
```

5、 配置 API 访问令牌密钥

当从清单安装到 Kubernetes 集群时，Argo CD Image Updater 将从名为 `Argo CD_TOKEN` 的环境变量中读取访问 Argo CD API 所需的令牌，该环境变量是从名为 `Argo CD.token` 的 secret 字段中设置的 `argocd-image-updater-secret`。

`Argo CD.token` 的值应设置为您上面生成的访问令牌的 base64 编码值。作为一种捷径，您可以使用 `kubectl` 生成密钥，并将其应用于现有资源：

```bash
YOUR_TOKEN=xxx
kubectl create secret generic argocd-image-updater-secret \
  --from-literal Argo CD.token=$YOUR_TOKEN --dry-run -o yaml |
  kubectl -n argocd-image-updater apply -f -
```

更改后，必须重新启动 `argocd-image-updater` Pod，即运行

```bash
kubectl -n argocd-image-updater rollout restart deployment argocd-image-updater
```

**新建 yaml 仓库 Kustomize 文件**

由于 image updater 仅支持 helm 或 Kustomize 类型 yaml，这里新建一个基于 Kustomize 的 yaml 目录，修改 yaml 中的参数不要与之前的冲突即可：

```bash
[root@jenkins git]# tree argocd-gitops/kustomize-javademo/
argocd-gitops/kustomize-javademo/
├── javademo-deployment.yaml
├── javademo-svc.yaml
└── kustomization.yaml
```

javademo-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: javademo-tag
spec:
  replicas: 1
  revisionHistoryLimit: 3
  selector:
    matchLabels:
      app: javademo-tag
  template:
    metadata:
      labels:
        app: javademo-tag
    spec:
      containers:
      - image: 10.39.140.196:8081/apps/javademo:replace
        name: javademo-tag
        ports:
        - containerPort: 8080
```

javademo-svc.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: javademo-tag
spec:
  ports:
  - port: 8012
    targetPort: 8080
  selector:
    app: javademo-tag
```

kustomization.yaml

```yaml
amePrefix: kustomize-

resources:
- javademo-deployment.yaml
- javademo-svc.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
```

登录 Argo CD UI 新建一个 Argo CD 应用，和之前相比增加了 annotations 参数，指定要监测的镜像地址，更新策略为 latest，另外修改了 source path:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  annotations:
    argocd-image-updater.argoproj.io/image-list: javademo=10.39.140.196:8081/apps/javademo
    argocd-image-updater.argoproj.io/javademo.update-strategy: latest
  name: javademo-tag
  namespace: Argo CD
  finalizers:
    - resources-finalizer.Argo CD.argoproj.io
spec:
  destination:
    namespace: apps
    server: https://kubernetes.default.svc
  project: default
  source:
    path: kustomize-javademo
    repoURL: http://10.39.140.196:10080/gogs/argocd-gitops.git
    targetRevision: HEAD
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - Validate=false
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

登录 KubeSphere UI 重新创建一条 CI 流水线，删除 update docker tag 步骤即可，已经不需要基于 git push 来触发应用部署了：

```groovy
pipeline {

    environment {
        GIT_URL='http://10.39.140.196:10080/gogs/spring-demo.git'
        GIT_CREDENTIAL_ID = 'git-id'
        GIT_BRANCH = 'master'
        REGISTRY = '10.39.140.196:8081/apps/javademo'
        REGISTRY_CREDENTIAL_ID = 'harbor-id'
    }

    agent {
        node {
            label 'maven'
        }
    }

    stages {

        stage('SCM Checkout') {
            steps {
                git branch: "${GIT_BRANCH}", credentialsId: "${GIT_CREDENTIAL_ID}", url: "${GIT_URL}"
            }
        }

        stage('source build') {
            steps {
                container('maven') {
                    sh 'mvn clean package'

                }
            }
        }

        stage('docker build & push') {
            steps {
                script {
                    env.COMMIT_ID = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
                    env.TIMESTRAP = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                    env.DOCKER_TAG = "dev_${TIMESTRAP}_${COMMIT_ID}_${BUILD_NUMBER}"
                }
                container('maven') {
                    withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$REGISTRY_CREDENTIAL_ID" ,)]) {
                        sh 'docker build -t $REGISTRY:$DOCKER_TAG .'
                        sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
                        sh 'docker push $REGISTRY:$DOCKER_TAG'
                    }
                }
            }
        }
    }
}
```

查看流水线日志，镜像成功推送到 Harbor 仓库：

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112916525730.png)

Harbor 仓库镜像 tag 更新，Argo CD image updater 自动将最新 tag 更新到 K8s 集群。

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112916463983.png)

查看镜像 tag:

![](https://pek3b.qingstor.com/kubesphere-community/images/2020112916522616.png)

以后每次 Harbor 仓库生成最新镜像，Argo CD 都会自动将其更新到 K8s 集群。

