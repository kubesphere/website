---
title: '如何创建跨 Kubernetes 集群的流水线'
tag: 'DevOps,Kubernetes,KubeSphere,Jenkins,Pipeline,MultiCluster'
createTime: '2020-09-28'
author: 'Shaowen Chen'
snapshot: 'https://kubesphere-docs.pek3b.qingstor.com/svg/multicluster-devops.svg'
---

随着 Kubernetes 被广泛的作为基础设施，各大云厂商都相继推出了各自的 Kubernetes 集群服务。那么在多个集群上，如何跨集群实践 DevOps 流水线呢？本文将主要以示例的形式给出回答。

> 提示，本文需要对 KubeSphere 和 DevOps 相关的知识具有一定了解，具体包括 Kubernetes 资源创建、生成 Sonarqube Token、获取集群 kubeconfig 等。

## KubeSphere DevOps 跨集群架构概览

### 集群角色说明

在多集群架构中，我们对集群进行了角色定义。每个集群的角色，在安装的配置文件中指定。具体详情，可以参考文档: [kubefed-in-kubesphere](../../docs/multicluster-management/introduction/kubefed-in-kubesphere/) 。一共有三种角色，host、member、none 。

- host

安装完整的 KubeSphere 核心组件，通过前端页面可以对各个集群进行管理。

- member

没有安装 KubeSpher Console 前端组件，不提供独立的页面管理入口，可以通过 host 集群的前端入口进行管理。

- none

没有定义角色，主要是为了兼容单集群模式。

### 多集群下 DevOps 的部署架构

![MultiCluster DevOps](/images/blogs/create-pipeline-across-multi-clusters/multicluster-devops.svg)

上图，是 KubeSphere DevOps 在多集群上的部署架构。在每一个集群上，我们都可以选择性安装 DevOps 组件。具体安装步骤，与单集群开启 DevOps 组件没有区别。

在创建 DevOps 工程时，前端会对可选集群进行标记，仅开启 DevOps 组件的集群能够被选择。

## 用户场景描述

![Use Case for MultiCluster](/images/blogs/create-pipeline-across-multi-clusters/use-case-for-multicluster.svg)

上图是一个 Demo 场景，通过多集群隔离不同的部署环境。一共有三个集群，开发集群、测试集群、生成集群。

开发人员在提交代码之后，可以触发流水线执行，依次完成，单元测试、代码检测、构建和推送镜像，然后直接部署到开发集群。开发集群交给开发人员自主管控，作为他们的自测验证环境。经过审批之后，可以发布到测试环境，进行更严格的验证。最后，经过授权之后，发布到正式环境，用于对外提供服务。

## 创建一条跨集群的流水线

### 准备集群

这里准备了三个集群，分别为：

- shire, 正式环境部署集群，角色: memeber
- gondor, 测试环境部署集群，角色: host, 需要开启 DevOps 组件
- rohan, 开发环境部署集群，角色: member

集群可以部署在不同的云厂商，也可以使用不同的 Kubernetes 版本。

### 创建 workspaces

创建一个名为 devops-multicluster 的 workspaces，将上述的三个集群添加其中。如下图，勾选集群列表。

![](/images/blogs/create-pipeline-across-multi-clusters/create-ws.png)

以下全部操作，都是在 devops-multicluster 这个 workspaces 下进行的。

### 创建 DevOps 工程

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-project.png)

如上图，在 gondor 集群，新建一个 DevOps 工程 multicluster-demo, 点击 **OK** 提交。

### 在各个集群上创建部署用的项目

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-deploy-project.png)

在使用流水线进行部署时，需要提前创建 Namespace ，否则会提示错误。根据下面的列表信息进行创建项目(对应同名 Namespace)：

- 在 shire 正式环境部署集群，创建项目 **kubesphere-sample-prod**
- 在 gondor 测试环境部署集群，创建项目 **kubesphere-sample-prod**
- 在 rohan 开发环境部署集群，创建项目 **kubesphere-sample-dev**

### 创建凭证

![](/images/blogs/create-pipeline-across-multi-clusters/credential-list.png)

这里使用的凭证主要有五个：

- rohan，kubeconfig 类型，集群部署凭证
- shire，kubeconfig 类型，集群部署凭证
- gondor，kubeconfig 类型，集群部署凭证
- dockerhub-id，账户类型，推送镜像到 Dockerhub 的凭证
- sonar-token，秘钥文本类型，Sonarqube 代码扫描凭证

具体的步骤，在此不详细表述，可以查看快速入门文档。

### 创建 Pipeline

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-pipeline.png)

如上图，在 DevOps 项目下创建流水线 build-and-deploy-application 。

点击编辑 Jenkinsfile, 将如下内容粘贴保存。

```groovy
pipeline {
  agent {
    node {
      label 'maven'
    }

  }
  parameters {
        string(name:'BRANCH_NAME',defaultValue: 'master',description:'')
    }
  environment {
        DOCKER_CREDENTIAL_ID = 'dockerhub-id'
        PROD_KUBECONFIG_CREDENTIAL_ID = 'shire'
        TEST_KUBECONFIG_CREDENTIAL_ID = 'gondor'
        DEV_KUBECONFIG_CREDENTIAL_ID = 'rohan'

        REGISTRY = 'docker.io'
        DOCKERHUB_NAMESPACE = 'shaowenchen'
        APP_NAME = 'devops-maven-sample'
        SONAR_CREDENTIAL_ID = 'sonar-token'
        TAG_NAME = "SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
    }
  stages {
    stage('checkout') {
      steps {
        container('maven') {
          git branch: 'master', url: 'https://github.com/kubesphere/devops-maven-sample.git'
        }
      }
    }
    stage('unit test') {
      steps {
        container('maven') {
          sh 'mvn clean test'
        }
      }
    }
    stage('sonarqube analysis') {
      steps {
        container('maven') {
          withCredentials([string(credentialsId: "$SONAR_CREDENTIAL_ID", variable: 'SONAR_TOKEN')]) {
            withSonarQubeEnv('sonar') {
              sh "mvn sonar:sonar -Dsonar.login=$SONAR_TOKEN"
            }

          }
        }

      }
    }
    stage('build & push') {
      steps {
        container('maven') {
          sh 'mvn -Dmaven.test.skip=true clean package'
          sh 'docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
          withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
            sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
          }

        }

      }
    }
    stage('push latest') {
      steps {
        container('maven') {
          sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
          sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
        }

      }
    }
    stage('deploy to dev') {
      steps {
        withCredentials([
            kubeconfigFile(
            credentialsId: env.DEV_KUBECONFIG_CREDENTIAL_ID,
            variable: 'KUBECONFIG')
            ]) {
            sh 'envsubst < deploy/dev-all-in-one/devops-sample.yaml | kubectl apply -f -'
        }
      }
    }
    stage('deploy to staging') {
      steps {
        input(id: 'deploy-to-staging', message: 'deploy to staging?')
        withCredentials([
            kubeconfigFile(
            credentialsId: env.TEST_KUBECONFIG_CREDENTIAL_ID,
            variable: 'KUBECONFIG')
            ]) {
            sh 'envsubst < deploy/prod-all-in-one/devops-sample.yaml | kubectl apply -f -'
        }
      }
    }
    stage('deploy to production') {
      steps {
        input(id: 'deploy-to-production', message: 'deploy to production?')
        withCredentials([
            kubeconfigFile(
            credentialsId: env.PROD_KUBECONFIG_CREDENTIAL_ID,
            variable: 'KUBECONFIG')
            ]) {
            sh 'envsubst < deploy/prod-all-in-one/devops-sample.yaml | kubectl apply -f -'
        }
      }
    }
  }
}
```

在前端页面上，可以查看生成的图形化流水线展示。

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-pipeline-display.png)

### 执行并查看结果

- 执行流水线，审批部署到测试集群、正式集群

点击 **Run** 按钮，运行流水线。等待流水线执行，直至下图。

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-pipeline-apply.png)

此时，服务已经部署到开发环境集群，等待审批部署到测试环境集群中。依次审批两次，将服务部署到测试环境集群、正式环境集群。

- 查看执行 Stage 的日志

在 **Activity** 标签页中，点击执行的编号，继续点击 *View Logs* , 可以查看到流水线详细的执行日志。如下图，在左侧是 Stage 维度的拆分，右侧则是每个 Step 的详细日志信息。

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-pipeline-log.png)

- 查看 Sonarqube 报告

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-sonarqube-display.png)

点击流水线中 **Code Quality** 标签页，可以查看详细的 Sonarqube 分析报告。

- 查看创建之后的负载

最后在执行流水线运行之前，创建的项目中，可以看到最新构建的负载，每个项目下都有两个 Pod。

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-deploy-rohan.png)

通过下拉框选择，可以切换查看不同集群。下面查看的是测试环境集群和正式环境集群的负载信息:

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-deploy-gondor.png)

![](/images/blogs/create-pipeline-across-multi-clusters/create-devops-deploy-shire.png)


