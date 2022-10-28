---
title: "创建多集群流水线"
keywords: 'KubeSphere, Kubernetes, 多集群, 流水线, DevOps'
description: '学习如何在 Kubesphere 上创建多集群流水线。'
linkTitle: "创建多集群流水线"
weight: 11440
---

由于云场上提供不同的托管 Kubernetes 服务，DevOps 流水线必须处理涉及多个 Kubernetes 集群的使用场景。

本教程将演示如何在 KubeSphere 创建一个多集群流水线。

## 准备工作

- 准备三个已安装 KubeSphere 的 Kubernetes 集群，选择一个集群作为主集群，其余两个作为成员集群。更多关于集群角色与如何在 KubeSphere 上启用多集群环境，请参见[多集群管理](../../../multicluster-management/)。
- 将成员集群设置为[公开集群](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#将集群设置为公开集群)。或者，您可以[在创建企业空间之后设置集群可见性](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#在创建企业空间后设置集群可见性)。
- 在主集群上[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 整合 SonarQube 进入流水线。有关更多信息，请参见[将 SonarQube 集成到流水线](../../how-to-integrate/sonarqube/)。
- 在主集群创建四个帐户： `ws-manager`、`ws-admin`、`project-admin` 和 `project-regular`，然后授予他们不同的角色。有关详细信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/#step-1-create-an-account)。

## 工作流程概述

本教程使用三个集群作为工作流中三个独立的环境。如下图所示：

![use-case-for-multi-cluster](/images/docs/v3.3/devops-user-guide/examples/create-multi-cluster-pipeline/use-case-for-multi-cluster.png)

三个集群分别用于开发，测试和生产。当代码被提交至 Git 仓库，就会触发流水线并执行以下几个阶段 — `单元测试`，`SonarQube 分析`，`构建 & 推送` 和 `部署到开发集群`。开发者使用开发集群进行自我测试和验证。当开发者批准后，流水线就会进入到下一个阶段 `部署到测试集群` 进行更严格的验证。最后，流水线在获得必要的批准之后，将会进入下一个阶段 `部署到生产集群`，并向外提供服务。

## 动手实验

### 步骤 1：准备集群

下图展示每个集群对应的角色。

| 集群名称 | 集群角色    | 用途 |
| -------- | ----------- | ---- |
| host     | 主集群   | 测试 |
| shire    | 成员集群 | 生产 |
| rohan    | 成员集群 | 开发 |

{{< notice note >}}

这些 Kubernetes 集群可以被托管至不同的云厂商，也可以使用不同的 Kubernetes 版本。针对 KubeSphere 3.3 推荐的 Kubernetes 版本：v1.19.x、v1.20.x、v1.21.x 、v1.22.x 和 v1.23.x（实验性支持）。

{{</ notice >}}

### 步骤 2：创建企业空间

1. 使用 `ws-manager` 帐户登录主集群的 Web 控制台。在**企业空间**页面中，点击**创建**。

2. 在**基本信息**页面中，将企业空间命名为 `devops-multicluster`，选择 `ws-admin` 为**管理员**，然后点击**下一步**。

3. 在**集群设置**页面，选择所有集群（总共三个集群），然后点击**创建**。

4. 创建的企业空间会显示在列表。您需要登出控制台并以 `ws-admin` 身份重新登录，以邀请 `project-admin` 与 `project-regular` 至企业空间，然后分别授予他们 `work-space-self-provisioner` 和 `workspace-viwer` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/#step-2-create-a-workspace)。

### 步骤 3：创建 DevOps 项目

1. 您需要登出控制台，并以 `project-admin` 身份重新登录。转到 **DevOps 项目**页面并点击**创建**。

2. 在出现的对话框中，输入 `mulicluster-demo` 作为**名称**，在**集群设置**中选择 **host**，然后点击**确定**。

   {{< notice note >}}

   下拉列表中只有启用 DevOps 组件的集群可用。

   {{</ notice >}}

3. 创建的 DevOps 项目将显示在列表中。请确保邀请用户 `project-regular` 至这个项目，并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/#step-1-create-an-account)。

### 步骤 4：在集群上创建项目

提前创建如下表所示的项目。请确保邀请 `project-regular` 用户到这些项目中，并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/#step-1-create-an-account)。

| 集群名 | 用途 | 项目名                 |
| ------ | ---- | ---------------------- |
| host   | 测试 | kubesphere-sample-prod |
| shire  | 生产 | kubesphere-sample-prod |
| rohan  | 开发 | kubesphere-sample-dev  |

### 步骤 5：创建凭证

1. 登出控制台，以 `project-regular` 身份重新登录。在 **DevOps 项目**页面，点击 DevOps 项目 `multicluster-demo`。

2. 在**凭证**页面，您需要创建如下表所示的凭证。有关如何创建凭证的更多信息，请参见[凭证管理](../../how-to-use/devops-settings/credential-management/#create-credentials)和[使用 Jenkinsfile 创建流水线](../../how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/#step-1-create-credentials)。

| 凭证 ID      | 类型       | 应用场所             |
| ------------ | ---------- | -------------------- |
| host         | kubeconfig | 用于主集群测试   |
| shire        | kubeconfig | 用于成员集群生产 |
| rohan        | kubeconfig | 用于成员集群开发 |
| dockerhub-id | 用户名和密码 | Docker Hub           |
| sonar-token  | 访问令牌    | SonarQube            |

{{< notice note >}}

在创建 kubeconfig 凭证 `shire` 和 `rohan` 时，必须手动输入成员集群的 kubeconfig。确保主集群可以访问成员集群的 API Server 地址。

{{</ notice >}}

3. 共创建五个凭证。

### 步骤 6：创建流水线

1. 在**流水线**页面点击**创建**。在显示的对话框中，输入 `build-and-deploy-application` 作为**名称**然后点击**下一步**。

2. 在**高级设置中**选项卡中，点击**创建**即使用默认配置。

3. 列表会展示被创建的流水线，点击流水线名称进入详情页面。

4. 点击**编辑 Jenkinsfile**，复制和粘贴以下内容。请确保将 DOCKERHUB_NAMESPACE 的值替换为您自己的值，然后点击**确定**。

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
           TEST_KUBECONFIG_CREDENTIAL_ID = 'host'
           DEV_KUBECONFIG_CREDENTIAL_ID = 'rohan'
   
           REGISTRY = 'docker.io'
           DOCKERHUB_NAMESPACE = 'your Docker Hub account ID'
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
            container('maven') {
               withCredentials([
                   kubeconfigFile(
                   credentialsId: env.DEV_KUBECONFIG_CREDENTIAL_ID,
                   variable: 'KUBECONFIG')
                   ]) {
                   sh 'envsubst < deploy/dev-all-in-one/devops-sample.yaml | kubectl apply -f -'
               }
            }
         }
       }
       stage('deploy to staging') {
         steps {
            container('maven') {
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
       }
       stage('deploy to production') {
         steps {
            container('maven') {
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
   }
   ```

   {{< notice note >}}

   `mvn` 命令中的标志 `-o` 表示启用脱机模式。如果您在本地准备好了相关的 maven 依赖和缓存，可以保持脱机模式以节约时间。

   {{</ notice >}}

5. 流水线创建之后，可以在图形编辑面板上查看流水线的阶段和步骤。

### 步骤7：运行流水线并查看结果

1. 点击**运行**按钮运行流水线。当流水线运行达到**部署到暂存**的阶段，将会暂停，因为资源已经被部署到集群进行开发。您需要手动点击**继续**两次，以将资源部署到测试集群 `host` 和生产集群 `shire`。

2. 一段时间过后，您可以看见流水线的状态展示为**成功**。

3. 在右上角点击**查看日志**，查看流水线运行日志。对于每个阶段，您可以点击显示日志以检查日志，同时日志可以被下载到本地进行进一步的分析。

4. 当流水线运行成功时，点击**代码检查**，通过 SonarQube 检查结果。

5. 转到**项目**页面，您可以通过从下拉列表中选择特定集群，来查看部署在各集群不同项目中的资源。

