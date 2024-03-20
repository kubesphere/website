---
title: 'KubeSphere DevOps 基于 Jenkins + Argo 实现单集群的持续交付实践'
tag: 'KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, Jenkins, Argo, DevOps'
description: '这篇文章主要介绍了如何通过 KubeSphere 3.4.0 内置的 Argo CD 实现持续交付。'
createTime: '2024-3-19'
author: '周靖峰'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/jenkins+argo-single-cluster-cd.png'
---

> 作者：周靖峰，青云科技容器顾问，云原生爱好者，目前专注于 DevOps，云原生领域技术涉及 Kubernetes、KubeSphere、Argo。

## 背景

KubeSphere v3.3.0 引入了 Argo CD，可以直接通过内置的方式实现 GitOps，不需要额外安装，并且在 UI 上也适配了基本功能。

今天就来介绍下如何通过 KubeSphere 3.4.0 内置的 Argo CD 实现持续交付。

## 文章涉及内容

- 通过 KubeSphere DevOps Jenkins 实现 CI 能力
- 通过 KubeSphere DevOps Argo CD 实现 CD 能力
- Jenkins + Argo CD 的持续交付

## Jenkins 配置

准备一个 git 仓库信息，这里提供的示例 demo 为：https://github.com/Feeeenng/devops-maven-sample。

项目目录信息：

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-1.png)

项目目录信息包含 Jenkinsfile-argo，Dockerfile 等构建信息。

这里主要介绍一下 Jenkinsfile-argo 文件的 pipeline 重要步骤。

### agent 部分

由于内置的 agent 镜像版本没有加入 `kustomize` 部署工具，并且我们在整个 CI/CD 的构建流水线当中，使用了此工具，所以引入了一个自己的定制版本。

```
agent {
    kubernetes {
          inheritFrom 'maven'
          containerTemplate {
            name 'maven'
            image 'feeeng/builder-maven:v3.4.0'
          }
        }

  }
```

### CI 更新部分

```bash
 stage('update mainfast') {
          when{
            branch 'master'
          }
          steps {
            // input(id: 'deploy-to-dev', message: 'deploy to dev?')
            script {
              container ('maven') {
                  withCredentials([usernamePassword(credentialsId: "$GITHUB_CREDENTIAL_ID", passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                      def encodedPassword = URLEncoder.encode("$GIT_PASSWORD",'UTF-8')
                      def encodedUsername = URLEncoder.encode("$GIT_USERNAME",'UTF-8')
                      sh """
                        git config --global user.email "kubesphere-cd@yunify.com"
                        git config --global user.name "kubesphere-cd"
                        git config --local credential.helper "!f() { echo username=\\$GIT_USERNAME; echo password=\\$GIT_PASSWORD; }; f"

                        cd deploy/dev/
                        kustomize edit set image $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest=$REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER

                        git add .
                        git commit -m "images update for dev $BUILD_NUMBER"
                        git push  origin HEAD:master

                        """
                    }

              }
            }
      }
  }
```

这里引入了 git 的配置信息，通过 step3 当中更新了镜像 tag 以后，通过 `kustomize` 工具进行镜像文件 tag 的替换，并且自动更新 git 信息。从而实现后面让 Argo CD 监听 git 变化做准备。

## KubeSphere 配置

### 凭证配置

在 DevOps 流水线凭证界面当中，配置好对应的流水线所需要的凭证信息包含：

- dockerhub-id 镜像仓库信息
- github-id git 仓库信息
- demo-kubeconfig 发布集群配置

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-2.png)

### Jenkins 配置

创建一条多分支流水线，配置对应的分支跟流水线文件。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-3.png)

通过 Jenkins 发现流水线的文件就会自动运行我们的 CI 步骤。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-4.png)

并且这里也自动使用我们刚才配置的 git 信息动态的更新了镜像 tag。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-5.png)

至此，Jenkins 配置部分完毕。整个流程全部是通过 pipeline 来完成。

### Argo CD 配置

选择 DevOps 项目中的持续发布，配置集群跟项目界面。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-6.png)

下一步以后配置我们的代码仓库，部署的分支，部署文件的清单目录。

- 代码仓库

如果代码仓库下拉没有选择的话，需要在代码仓库界面中进行添加。

- 部署分支

选择我们需要部署的分支代码，这里我选择 master。

- 清单文件

这里是我们部署文件路径，因为采用 `kustomize` 进行部署，这里我们选择对应的路径即可。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-7.png)

Argo CD 同步策略配置。

> 这里跟 Argo CD 同步策略一样，只是做了中文翻译跟可视化，所以看起来也比较顺手。

这里我们选择自动同步策略，选择对应的同步资源策列，然后 Argo CD 就会自动进行同步触发。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-8.png)

创建完毕以后，展现的效果图。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-9.png)

点击详情以后，就会发现应用已经开始自动进行同步。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-10.png)

然后通过找到我们对应部署的项目，就会发现已经自动进行部署成功。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20240319-11.png)

通过上述的配置完成以后，我们就实现了基于 Jenkins + ArgoCD 的持续化交付。

CI 方面交由给 Jenkins 来处理，而 CD 就采用 GitOps 的方式实现。

## 后续规划

### 多集群发布

目前我们完成了基于 Jenkins + Argo CD 的单集群持续发布，未来面对环境较多且复杂场景，需要考虑如何实现多集群的发布。

### 可观测性

目前 KubeSphere 的链路追踪主要是通过 Istio 方式实现，而本身的普通应用无法进行链路追踪，后续可以通过 SkyWalking 来进行链路追踪的观测性。

### 容器调试

目前的构建体系，需要每次等待容器构建完毕，跑完整个流水线才能开始测试代码，并且在此期间也无法对代码进行调试，出了问题也只能重新在花费一段时间构建在进行测试。未来也会考虑如何在流水线中进行本地的容器调试能力。
