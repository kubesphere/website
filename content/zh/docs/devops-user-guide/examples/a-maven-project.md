---
title: "构建和部署 Maven 工程"
keywords: 'Kubernetes, Docker, DevOps, Jenkins, Maven'
description: '学习如何使用 KubeSphere 流水线构建并部署 Maven 工程。'
linkTitle: "构建和部署 Maven 工程"
weight: 11430
---

## 准备工作

- 您需要[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要有一个 [Docker Hub](http://www.dockerhub.com/) 帐户。
- 您需要创建一个企业空间、一个 DevOps 项目和一个用户，并需要邀请该用户至 DevOps 项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## Maven 工程的工作流

KubeSphere DevOps 中有针对 Maven 工程的工作流，如下图所示，它使用 Jenkins 流水线来构建和部署 Maven 工程。所有步骤均在流水线中进行定义。

![maven-project-jenkins](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-maven-project/maven-project-jenkins.png)

首先，Jenkins Master 创建一个 Pod 来运行流水线。Kubernetes 创建 Pod 作为 Jenkins Master 的 Agent，该 Pod 会在流水线完成之后销毁。主要流程包括克隆代码、构建和推送镜像以及部署工作负载。

## Jenkins 中的默认配置

### Maven 版本

在 Maven 构建器 (Builder) 容器中执行以下命令获取版本信息。

```bash
mvn --version

Apache Maven 3.5.3 (3383c37e1f9e9b3bc3df5050c29c8aff9f295297; 2018-02-24T19:49:05Z)
Maven home: /opt/apache-maven-3.5.3
Java version: 1.8.0_232, vendor: Oracle Corporation
Java home: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.i386/jre
Default locale: en_US, platform encoding: UTF-8
```

### Maven 缓存

Jenkins Agent 通过节点上的 Docker 存储卷 (Volume) 挂载目录。流水线可以缓存一些特殊目录，例如 `/root/.m2`，这些特殊目录用于 Maven 构建并在 KubeSphere DevOps 中用作 Maven 工具的默认缓存目录，以便依赖项包下载和缓存到节点上。

### Jenkins Agent 中的全局 Maven 设置

Maven 设置的默认文件路径是 `maven`，配置文件路径是 `/opt/apache-maven-3.5.3/conf/settings.xml`。执行以下命令获取 Maven 的设置内容。

```bash
kubectl get cm -n kubesphere-devops-system ks-devops-agent -o yaml
```

### Maven Pod 的网络

具有 `maven` 标签的 Pod 使用 docker-in-docker 网络来运行流水线，即节点中的 `/var/run/docker.sock` 被挂载至该 Maven 容器。

## Maven 流水线示例

### Maven 工程准备工作

- 确保您在开发设备上成功构建 Maven 工程。
- 添加 Dockerfile 至工程仓库以构建镜像。有关更多信息，请参考 <https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online>。
- 添加 YAML 文件至工程仓库以部署工作负载。有关更多信息，请参考 <https://github.com/kubesphere/devops-java-sample/tree/master/deploy/dev-ol>。如果有多个不同环境，您需要准备多个部署文件。

### 创建凭证

| 凭证 ID         | 类型       | 用途                  |
| --------------- | ---------- | --------------------- |
| dockerhub-id    | 用户名和密码   | 仓库，例如 Docker Hub |
| demo-kubeconfig | kubeconfig | 部署工作负载          |

有关详细信息，请参考[凭证管理](../../how-to-use/credential-management/)。

### 为工作负载创建一个项目

在本示例中，所有工作负载都部署在 `kubesphere-sample-dev` 项目中。您必须事先创建 `kubesphere-sample-dev` 项目。

### 为 Maven 工程创建一个流水线

1. 在您的 DevOps 项目中，转到**流水线**页面并点击**创建**，创建一个名为 `maven` 的流水线。有关更多信息，请参见[使用图形编辑面板创建流水线](../../how-to-use/create-a-pipeline-using-graphical-editing-panel)。

2. 转到该流水线的详情页面，点击**编辑 Jenkinsfile**。

3. 复制粘贴以下内容至弹出窗口。您必须将 `DOCKERHUB_NAMESPACE` 的值替换为您自己的值，编辑完成后点击**确定**保存 Jenkinsfile。

   ```groovy
   pipeline {
       agent {
           label 'maven'
       }
   
       parameters {
           string(name:'TAG_NAME',defaultValue: '',description:'')
       }
   
       environment {
           DOCKER_CREDENTIAL_ID = 'dockerhub-id'
           KUBECONFIG_CREDENTIAL_ID = 'demo-kubeconfig'
           REGISTRY = 'docker.io'
           // 需要更改为您自己的 Docker Hub Namespace
           DOCKERHUB_NAMESPACE = 'Docker Hub Namespace'
           APP_NAME = 'devops-java-sample'
           BRANCH_NAME = 'dev'
           PROJECT_NAME = 'kubesphere-sample-dev'
       }
   
       stages {
           stage ('checkout scm') {
               steps {
                   // 下面的项目是为了大家方便体验功能的示例项目，请大家避免把自己的测试性的修改提交 PR 到该仓库
                   git branch: 'master', url: "https://github.com/kubesphere/devops-maven-sample.git"
               }
           }
   
           stage ('unit test') {
               steps {
                   container ('maven') {
                       sh 'mvn clean test'
                   }
               }
           }
   
           stage ('build & push') {
               steps {
                   container ('maven') {
                       sh 'mvn -Dmaven.test.skip=true clean package'
                       sh 'docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
                       withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
                           sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
                           sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
                       }
                   }
               }
           }
   
           stage('deploy to dev') {
             steps {
                withCredentials([
                    kubeconfigFile(
                    credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
                    variable: 'KUBECONFIG')
                    ]) {
                    sh 'envsubst < deploy/all-in-one/devops-sample.yaml | kubectl apply -f -'
                }
             }
           }
       }
   }
   ```

4. 您可以看到图形编辑面板上已自动创建阶段和步骤。

### 运行和测试

1. 点击**运行**并在弹出对话框的 **TAG_NAME** 中输入 `v1`，然后点击**确定**运行流水线。

2. 待流水线成功运行，您可以前往**运行记录**选项卡查看其详情。

3. 在 `kubesphere-sample-dev` 项目中，已创建新的工作负载。

4. 在**服务**页面，查看服务 (Service) 的外部访问信息。

