---
title: "使用 Jenkinsfile 在多集群项目中部署应用"
keywords: 'Kubernetes, KubeSphere, docker, devops, jenkins, 多集群'
description: '本教程演示如何使用 Jenkinsfile 在多集群项目中部署应用。'
linkTitle: "使用 Jenkinsfile 在多集群项目中部署应用"
weight: 11420
---

## 准备工作

- 您需要[启用多集群功能](../../../../docs/multicluster-management/)。
- 您需要有一个 [Docker Hub](https://hub.docker.com/) 帐户。
- 您需要[启用 KubeSphere DevOps 系统](../../../../docs/pluggable-components/devops/)。
- 您需要创建一个多集群企业空间，在 **Host** 集群上创建一个 DevOps 工程，创建一个多集群项目（本教程中，该多集群项目创建于 Host 集群和一个 Member 集群上），并创建一个帐户 (`project-regular`)，需要邀请该帐户至 DevOps 工程和多集群项目中，并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)、[多集群管理](../../../multicluster-management/)和[多集群项目](../../../project-administration/project-and-multicluster-project/#多集群项目)。

## 创建 Docker Hub 访问令牌 (Token)

1. 登录 [Docker Hub](https://hub.docker.com/) 并在右上角的菜单中选择 **Account Settings**。

   ![dockerhub 设置](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/dockerhub-settings.PNG)

2. 在左侧点击 **Security**，然后点击 **New Access Token**。

   ![dockerhub 创建令牌](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/dockerhub-create-token.PNG)

3. 输入令牌名称，点击 **Create**。

   ![dockerhub 令牌创建完成](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/dockerhub-token-ok.PNG)

4. 点击 **Copy and Close** 并务必保存该访问令牌。

   ![dockerhub 复制令牌](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/dockerhub-token-copy.PNG)

## 创建凭证

您需要在 KubeSphere 中为已创建的访问令牌创建凭证，以便流水线能够向 Docker Hub 推送镜像。此外，您还需要创建 kubeconfig 凭证，用于访问 Kubernetes 集群。

1. 以 `project-regular` 身份登录 KubeSphere Web 控制台，转到您的 DevOps 工程，在**凭证**页面点击**创建**。

   ![创建 dockerhub ID](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/create-dockerhub-id.PNG)

2. 在弹出对话框中，设置**凭证 ID**，稍后会用于 Jenkinsfile 中，**类型**选择**帐户凭证**。**用户名**输入您的 Docker Hub 帐户名称，**token / 密码**中输入刚刚创建的访问令牌。操作完成后，点击**确定**。

   ![创建 Docker 凭证](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/credential-docker-create.PNG)

   {{< notice tip >}}

   有关如何创建凭证的更多信息，请参见[凭证管理](../../../devops-user-guide/how-to-use/credential-management/)。

   {{</ notice >}} 

3. 再次点击**创建**，**类型**选择 **kubeconfig**。KubeSphere 会自动填充 **Content** 字段，即当前用户帐户的 kubeconfig。设置**凭证 ID**，然后点击**确定**。

   ![创建 kubeconfig](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/create-kubeconfig.PNG)

## 创建流水线

创建完上述凭证后，您可以按照以下步骤使用示例 Jenkinsfile 创建流水线。

1. 要创建流水线，请在**流水线**页面点击**创建**。

   ![创建流水线](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/create-pipeline.PNG)

2. 在弹出窗口中设置名称，然后点击**下一步**。

   ![设置流水线名称](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/set-pipeline-name.PNG)

3. 在本教程中，您可以为所有字段使用默认值。在**高级设置**页面，直接点击**创建**。

   ![创建流水线-2](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/create-pipeline-2.PNG)

## 编辑 Jenkinsfile

1. 在流水线列表中，点击该流水线进入其详情页面。点击**编辑 Jenkinsfile** 定义一个 Jenkinsfile，流水线会基于它来运行。

   ![编辑 jenkinsfile](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/edit-jenkinsfile.PNG)

2. 将以下所有内容复制并粘贴到弹出窗口中，用作流水线的示例 Jenkinsfile。您必须将 `DOCKERHUB_USERNAME`、`DOCKERHUB_CREDENTIAL`、`KUBECONFIG_CREDENTIAL_ID`、`MULTI_CLUSTER_PROJECT_NAME` 和 `MEMBER_CLUSTER_NAME` 的值替换成您自己的值。操作完成后，点击**确定**。

   ```
   pipeline {
     agent {
       node {
         label 'maven'
       }
   
     }
     
     environment {
       REGISTRY = 'docker.io'
       // username of dockerhub
       DOCKERHUB_USERNAME = 'yuswift'
       APP_NAME = 'devops-go-sample'
       // ‘dockerhubid’ is the dockerhub credential id you created on ks console
       DOCKERHUB_CREDENTIAL = credentials('dockerhubid')
       // the kubeconfig credential id you created on ks console
       KUBECONFIG_CREDENTIAL_ID = 'multi-cluster'
       // mutli-cluster project name under your own workspace
       MULTI_CLUSTER_PROJECT_NAME = 'devops-with-go'
       // the member cluster name you want to deploy app on
       // in this tutorial, you are assumed to deploy app on host and only one member cluster
       // for more member clusters, please edit manifest/multi-cluster-deploy.yaml
       MEMBER_CLUSTER_NAME = 'c9'
     }  
     
     stages {
       stage('docker login') {
         steps {
           container('maven') {
             sh 'echo $DOCKERHUB_CREDENTIAL_PSW  | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
           }
   
         }
       }
       
       stage('build & push') {
         steps {
           container('maven') {
             sh 'git clone https://github.com/yuswift/devops-go-sample.git'
             sh 'cd devops-go-sample && docker build -t $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME .'
             sh 'docker push $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME'
           }
         }
       }
       
       stage('deploy app to multi cluster') {
         steps {
           container('maven') {
             script {
               withCredentials([
                 kubeconfigFile(
                   credentialsId: 'multi-cluster',
                   variable: 'KUBECONFIG')
                 ]) {
                 sh 'envsubst < devops-go-sample/manifest/multi-cluster-deploy.yaml | kubectl apply -f -'
                 }
               }
             }
           }
         }
       }
     }
   ```

   {{< notice note >}}

   如果您的流水线成功运行，将会推送镜像至 Docker Hub。如果您使用 Harbor，则无法通过 Jenkins 凭证使用环境变量将参数传送到 `docker login -u`。这是因为每个 Harbor Robot 帐户的用户名都包含一个 `$` 字符，当用于环境变量时，Jenkins 会将其转换为 `$$`。[了解更多信息](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/)。

   {{</ notice >}} 

## 运行流水线

保存 Jenkinsfile 后，点击**运行**。如果一切顺利，您会在您的多集群项目中看到部署 (Deployment) 工作负载。

![Deployment](/images/docs/zh-cn/devops-user-guide/examples/deploy-apps-in-multicluster-project-using-jenkinsfile/multi-cluster-ok.PNG)