---
title: "创建多集群流水线"
keywords: 'KubeSphere, Kubernetes, 多集群, 流水线, DevOps'
description: '学习如何在 Kubesphere 上创建多集群流水线。'
linkTitle: "创建多集群流水线"
weight: 11440
---

由于云提供商提供不同的托管 Kubernetes 服务，DevOps 流水线必须处理涉及多个 Kubernetes 集群实例。

本教程将演示如何在 KubeSphere 创建一个多集群流水线。

## 准备工作

- 安装三个已安装 KubeSphere 的 Kubernetes 集群，选择一个集群作为 Host 集群，其余两个作为 Member 集群。更多关于集群角色与如何在 KubeSphere 上启动多集群环境，请参见[多集群管理](../../../multicluster-management/)。
- 将 Member 集群设置为[公开集群](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#make-a-cluster-public)。或者，您可以[在工作空间创建之后设置集群可见性](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#set-cluster-visibility-after-a-workspace-is-created)。
- 在 Host 集群上[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 整合 SonarQube 进入流水线。有关更多信息，请参见[将 SonarQube 集成到流水线](../../how-to-integrate/sonarqube/)。
- 在 Host 集群创建四个帐户： `ws-manager`, `ws-admin`, `project-admin` 和 `project-regular`，然后授予他们不同的角色。有关详细信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/#step-1-create-an-account).

## 工作流程概述

本教程使用三个集群作为工作流中三个独立的环境。如下图所示：

![use-case-for-multi-cluster](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/use-case-for-multi-cluster.png)

三个集群分别用于开发，测试和生产。当代码被提交至 Git 仓库，就会触发流水线并执行以下几个阶段 — `单元测试`，`SonarQube 分析`，`构建 & 推送` 和 `部署到开发集群`。开发者使用开发集群进行自我测试和验证。当开发者批准后，流水线就会进入到下一个步骤 `部署到测试集群` 进行更严格的验证。最后，流水线在获得必要的批准之后，将会进入下一个阶段 `部署到生产集群`，并向外提供服务。

## 动手实验室

### 步骤 1：准备集群

下图展示每个集群对应的角色

| 集群名称 | 集群角色    | 使用 |
| -------- | ----------- | ---- |
| host     | Host 集群   | 测试 |
| shire    | Member 集群 | 生产 |
| rohan    | Member 集群 | 开发 |

{{< notice note >}}

这些 Kubernetes 集群可以被托管至不同的云提供商，同时支持不同 Kubernetes 版本。针对 KubeSphere  v3.1.0 推荐 Kubernetes 版本： v1.17.9, v1.18.8, v1.19.8 和 v1.20.4。

{{</ notice >}}

### 步骤 2：创建企业空间

1. 使用 `ws-manager` 帐户登录 Host 集群的 web 控制台。在**企业空间**页面中，点击**创建**。

2. 在**基本信息**页面中，将工作空间命名为 `devops-multicluster`，选择 `ws-admin` 为**管理员**，然后点击**下一步**。

   ![create-workspace](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/create-workspace.png)

3. 在**集群选择**页面，选择所有集群（总共三个集群），然后点击**创建**。

   ![select-all-clusters](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/select-all-clusters.png)

4. 创建的企业空间会显示在列表。您需要登出控制台并以 `ws-admin` 身份重新登录，以邀请 `project-admin` 与 `project-regular` 至企业空间，然后分别授予他们 `work-space-self-provisioner` 和 `workspace-viwer` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/#step-2-create-a-workspace)。

   ![workspace-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/workspace-created.png)

### 步骤 3：创建 DevOps 工程

1. 您需要登出控制台，并以 `project-admin` 身份重新登录。转到 **DevOps 工程**页面并点击**创建**。

2. 在出现的对话框中，输入 `mulicluster-demo` 作为**名称**，在**集群设置**中选择 **host**，然后点击**确定**。

   ![devops-project](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/devops-project.png)

   {{< notice note >}}

   下拉列表中只有启用 DevOps 组件的集群可用。

   {{</ notice >}}

3. 创建的 DevOps 工程将显示在列表中。请确保邀请帐户 `project-regular` 至这个项目，并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/#step-1-create-an-account)。

   ![devops-project-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/devops-project-created.png)

### 步骤 4：在集群上创建项目

提前创建如下图所示的项目。请确保邀请 `project-regular` 帐户到这些项目中，并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/#step-1-create-an-account)。

| 集群名 | 使用 | 项目名                 |
| ------ | ---- | ---------------------- |
| host   | 测试 | kubesphere-sample-prod |
| shire  | 生产 | kubesphere-sample-prod |
| rohan  | 开发 | kubesphere-sample-dev  |

### 步骤 5：创建凭证

1. 登出控制台，以 `project-regular` 身份重新登录。在 **DevOps 工程**页面，点击 DevOps 工程 `multicluster-demo`。

2. 在 DevOps 凭证页面，您需要创建如下图所示的凭证。有关如何创建的凭证的更多信息，请参见[凭证管理](../../how-to-use/credential-management/#create-credentials)和[使用 Jenkinsfile 创建流水线](../../how-to-use/create-a-pipeline-using-jenkinsfile/#step-1-create-credentials)。

| 凭证 ID      | 类型       | 应用场所             |
| ------------ | ---------- | -------------------- |
| host         | kubeconfig | 用于 Host 集群测试   |
| shire        | kubeconfig | 用于 Member 集群生产 |
| rohan        | kubeconfig | 用于 Member 集群开发 |
| dockerhub-id | 帐户凭证   | Docker Hub           |
| sonar-token  | 秘密文本   | SonarQube            |

{{< notice note >}}

在创建 kubeconfig 凭证 `shire` 和 `rohan` 时，必须手动的输入 Member 集群的 kubeconfig。确保 Host 集群可以访问 Member 集群的 APIServer 地址。

{{</ notice >}}

3. 您会拥有五个凭证。

![credentials-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/credentials-created.png)

### 步骤 6：创建流水线

1. 在**流水线**页面点击**创建**。在显示的对话框中，输入 `build-and-deploy-application` 作为**名称**然后点击**下一步**。

   ![pipeline-name](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-name.png)

2. 在**高级设置中**选项卡中，点击**创建**即使用默认配置。

3. 列表会展示被创建的流水线，点击流水线进入详细页面。

   ![pipeline-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-created.png)

4. 点击**编辑 Jenkinsfile**，复制和粘贴以下内容。确保 `DOCKERHUB_NAMESPACE` 值被您自己的内容覆盖，然后点击**确认**。

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
           APP_NAME = 'devops-java-sample'
           SONAR_CREDENTIAL_ID = 'sonar-token'
           TAG_NAME = "SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
       }
     stages {
       stage('checkout') {
         steps {
           container('maven') {
             git branch: 'master', url: 'https://github.com/kubesphere/devops-java-sample.git'
           }
         }
       }
       stage('unit test') {
         steps {
           container('maven') {
             sh 'mvn clean -o -gs `pwd`/configuration/settings.xml test'
           }
   
         }
       }
       stage('sonarqube analysis') {
         steps {
           container('maven') {
             withCredentials([string(credentialsId: "$SONAR_CREDENTIAL_ID", variable: 'SONAR_TOKEN')]) {
               withSonarQubeEnv('sonar') {
                 sh "mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.login=$SONAR_TOKEN"
               }
   
             }
           }
   
         }
       }
       stage('build & push') {
         steps {
           container('maven') {
             sh 'mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package'
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
           kubernetesDeploy(configs: 'deploy/dev-ol/**', enableConfigSubstitution: true, kubeconfigId: "$DEV_KUBECONFIG_CREDENTIAL_ID")
         }
       }
       stage('deploy to staging') {
         steps {
           input(id: 'deploy-to-staging', message: 'deploy to staging?')
           kubernetesDeploy(configs: 'deploy/prod-ol/**', enableConfigSubstitution: true, kubeconfigId: "$TEST_KUBECONFIG_CREDENTIAL_ID")
         }
       }
       stage('deploy to production') {
         steps {
           input(id: 'deploy-to-production', message: 'deploy to production?')
           kubernetesDeploy(configs: 'deploy/prod-ol/**', enableConfigSubstitution: true, kubeconfigId: "$PROD_KUBECONFIG_CREDENTIAL_ID")
         }
       }
     }
   }
   
   ```

   {{< notice note >}}

   `mvn` 命令中的标志 `-o` 表示启用脱机模式。如果您在本地准备好了相关的 maven 依赖和缓存，可以保持脱机模式以节约时间。

   {{</ notice >}}

5. 流水线创建之后，可以在图形编辑面板上查看流水线的阶段和步骤。

   ![pipeline-panel](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-panel.png)

### 步骤7：运行流水线并查看结果

1. 点击**运行**按钮运行流水线。当流水线运行达到**部署到暂存**的阶段，将会暂停，因为资源已经被部署到集群进行开发。您需要手动点击**继续**两次，以将资源部署到测试集群 `host` 和生产集群 `shire`。

   ![deploy-to-staging](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/deploy-to-staging.png)

2. 一段时间过后，您可以看见流水线的状态展示为**成功**。

   ![pipeline-success](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-success.png)

3. 在右上角点击**查看日志**，查看流水线运行日志。对于每个阶段，您可以点击显示日志以检查日志，同时日志可以被下载到本地进行进一步的分析。

   ![pipeline-logs](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-logs.png)

4. 当流水线运行成功时，点击**代码质量**，通过 SonarQube 检查结果。

   ![sonarqube-result](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/sonarqube-result.png)

5. 转到**项目**页面，您可以通过从下拉列表中选择特定集群，来查看部署在集群中不同项目中的资源。

   ![host-pods](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/host-pods.png)

   ![shire-pods](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/shire-pods.png)

   ![rohan-pods](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/rohan-pods.png)

   



