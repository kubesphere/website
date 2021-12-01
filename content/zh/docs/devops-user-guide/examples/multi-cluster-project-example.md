---
title: "使用 Jenkinsfile 在多集群项目中部署应用"
keywords: 'Kubernetes, KubeSphere, Docker, DevOps, Jenkins, 多集群'
description: '学习如何使用基于 Jenkinsfile 的流水线在多集群项目中部署应用。'
linkTitle: "使用 Jenkinsfile 在多集群项目中部署应用"
weight: 11420
---

## 准备工作

- 您需要[启用多集群功能](../../../../docs/multicluster-management/)并创建一个多集群企业空间。
- 您需要有一个 [Docker Hub](https://hub.docker.com/) 帐户。
- 您需要在主集群上[启用 KubeSphere DevOps 系统](../../../../docs/pluggable-components/devops/)。
- 您需要使用具有 `workspace-self-provisioner` 角色的用户（例如 `project-admin`）创建一个多集群项目，并在主集群上创建一个 DevOps 项目。本教程中的多集群项目创建于主集群和一个成员集群上。
- 您需要邀请一个用户（例如 `project-regular`）至 DevOps 项目中，赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)、[多集群管理](../../../multicluster-management/)和[多集群项目](../../../project-administration/project-and-multicluster-project/#多集群项目)。

## 创建 Docker Hub 访问令牌 (Token)

1. 登录 [Docker Hub](https://hub.docker.com/)，点击右上角的帐户，并从菜单中选择 **Account Settings**。

2. 在左侧导航栏点击 **Security**，然后点击 **New Access Token**。

3. 在弹出的对话框中，输入令牌名称（`go-project-token`），点击 **Create**。

4. 点击 **Copy and Close** 并务必保存该访问令牌。

## 创建凭证

您需要在 KubeSphere 中为已创建的访问令牌创建凭证，以便流水线能够向 Docker Hub 推送镜像。此外，您还需要创建 kubeconfig 凭证，用于访问 Kubernetes 集群。

1. 以 `project-regular` 身份登录 KubeSphere Web 控制台。在您的 DevOps 项目中点击 **DevOps 项目设置**下的**凭证**，然后在**凭证**页面点击**创建**。

2. 在弹出的对话框中，设置**名称**，稍后会用于 Jenkinsfile 中，**类型**选择**用户名和密码**。**用户名**输入您的 Docker Hub 帐户名称，**密码/令牌**中输入刚刚创建的访问令牌。操作完成后，点击**确定**。

   {{< notice tip >}}

   有关如何创建凭证的更多信息，请参见[凭证管理](../../../devops-user-guide/how-to-use/credential-management/)。

   {{</ notice >}} 

3. 登出 KubeSphere Web 控制台，再以 `project-admin` 身份登录。前往您的 DevOps 项目，在**凭证**页面点击**创建**。**类型**选择 **kubeconfig**，KubeSphere 会自动填充**内容**字段，即当前帐户的 kubeconfig。设置**名称**，然后点击**确定**。
   
   {{< notice note >}}
   
   在未来版本中，您可以邀请 `project-regular` 帐户至您的多集群项目中，并赋予必要角色，以使用此帐户创建 kubeconfig 凭证。
   
   {{</ notice >}}

## 创建流水线

创建完上述凭证后，您可以使用 `project-regular` 帐户按照以下步骤使用示例 Jenkinsfile 创建流水线。

1. 要创建流水线，请在**流水线**页面点击**创建**。

2. 在弹出窗口中设置名称，然后点击**下一步**。

3. 在本教程中，您可以为所有字段使用默认值。在**高级设置**页面，点击**创建**。

## 编辑 Jenkinsfile

1. 在流水线列表中，点击该流水线进入其详情页面。点击**编辑 Jenkinsfile** 定义一个 Jenkinsfile，流水线会基于它来运行。

2. 将以下所有内容复制并粘贴到弹出窗口中，用作流水线的示例 Jenkinsfile。您必须将 `DOCKERHUB_USERNAME`、`DOCKERHUB_CREDENTIAL`、`KUBECONFIG_CREDENTIAL_ID`、`MULTI_CLUSTER_PROJECT_NAME` 和 `MEMBER_CLUSTER_NAME` 的值替换成您自己的值。操作完成后，点击**确定**。

   ```groovy
   pipeline {
     agent {
       label 'go'
     }
     
     environment {
       REGISTRY = 'docker.io'
       // Docker Hub 用户名
       DOCKERHUB_USERNAME = 'Your Docker Hub username'
       APP_NAME = 'devops-go-sample'
       // ‘dockerhub’ 即您在 KubeSphere 控制台上创建的 Docker Hub 凭证 ID
       DOCKERHUB_CREDENTIAL = credentials('dockerhub')
       // 您在 KubeSphere 控制台上创建的 kubeconfig 凭证 ID
       KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'
       // 您企业空间中的多集群项目名称
       MULTI_CLUSTER_PROJECT_NAME = 'demo-multi-cluster'
       // 您用来部署应用的成员集群名称
       // 本教程中，应用部署在主集群和一个成员集群上
       // 若需要部署在多个成员集群上, 请编辑 manifest/multi-cluster-deploy.yaml
       MEMBER_CLUSTER_NAME = 'Your Member Cluster name'
     }  
     
     stages {
       stage('docker login') {
         steps {
           container('go') {
             sh 'echo $DOCKERHUB_CREDENTIAL_PSW  | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
           }
         }
       }
       
       stage('build & push') {
         steps {
           container('go') {
             sh 'git clone https://github.com/yuswift/devops-go-sample.git'
             sh 'cd devops-go-sample && docker build -t $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME .'
             sh 'docker push $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME'
           }
         }
       }
       
       stage('deploy app to multi cluster') {
         steps {
            container('go') {
               withCredentials([
                 kubeconfigFile(
                   credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
                   variable: 'KUBECONFIG')
                 ]) {
                 sh 'envsubst < devops-go-sample/manifest/multi-cluster-deploy.yaml | kubectl apply -f -'
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
