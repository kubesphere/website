---
title: "构建和部署 Go 工程"
keywords: 'Kubernetes, docker, devops, jenkins, go, KubeSphere'
description: '学习如何使用 KubeSphere 流水线构建并部署 Go 工程。'
linkTitle: "构建和部署 Go 工程"
weight: 11410
---

## 准备工作

- 您需要[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要有一个 [Docker Hub](https://hub.docker.com/) 帐户。
- 您需要创建一个企业空间、一个 DevOps 项目、一个项目和一个用户 (`project-regular`)，需要邀请该用户至 DevOps 项目和项目中并赋予 `operator` 角色，以部署工作负载。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

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

3. 再次点击**创建**，**类型**选择 **kubeconfig**。KubeSphere 会自动填充**内容**字段，即当前用户帐户的 kubeconfig。设置**名称**，然后点击**确定**。

## 创建流水线

创建完上述凭证后，您可以按照以下步骤使用示例 Jenkinsfile 创建流水线。

1. 要创建流水线，请在**流水线**页面点击**创建**。

2. 在弹出窗口中设置名称，然后点击**下一步**。

3. 在本教程中，您可以为所有字段使用默认值。在**高级设置**页面，点击**创建**。

## 编辑 Jenkinsfile

1. 在流水线列表中，点击该流水线名称进入其详情页面。点击**编辑 Jenkinsfile** 定义一个 Jenkinsfile，流水线会基于它来运行。

2. 将以下所有内容复制并粘贴到弹出的对话框中，用作流水线的示例 Jenkinsfile。您必须将 `DOCKERHUB_USERNAME`、`DOCKERHUB_CREDENTIAL`、`KUBECONFIG_CREDENTIAL_ID` 和 `PROJECT_NAME` 的值替换成您自己的值。操作完成后，点击**确定**。

   ```groovy
   pipeline {  
     agent {
       node {
         label 'maven'
       }
     }
   
     environment {
       // 您 Docker Hub 仓库的地址
       REGISTRY = 'docker.io'
       // 您的 Docker Hub 用户名
       DOCKERHUB_USERNAME = 'Docker Hub Username'
       // Docker 镜像名称
       APP_NAME = 'devops-go-sample'
       // ‘dockerhubid’ 是您在 KubeSphere 用 Docker Hub 访问令牌创建的凭证 ID
       DOCKERHUB_CREDENTIAL = credentials('dockerhubid')
       // 您在 KubeSphere 创建的 kubeconfig 凭证 ID
       KUBECONFIG_CREDENTIAL_ID = 'go'
       // 您在 KubeSphere 创建的项目名称，不是 DevOps 项目名称
       PROJECT_NAME = 'devops-go'
     }
   
     stages {
       stage('docker login') {
         steps{
           container ('maven') {
             sh 'echo $DOCKERHUB_CREDENTIAL_PSW  | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
               }
             }  
           }
   
       stage('build & push') {
         steps {
           container ('maven') {
             sh 'git clone https://github.com/yuswift/devops-go-sample.git'
             sh 'cd devops-go-sample && docker build -t $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME .'
             sh 'docker push $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME'
             }
           }
         }
       stage ('deploy app') {
         steps {
           container('maven') {
             kubernetesDeploy(configs: 'devops-go-sample/manifest/deploy.yaml', kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
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

1. Jenkinsfile 设置完成后，您可以在仪表板上查看图形面板。点击**运行**来运行流水线。

2. 在**运行记录**选项卡中，您可以查看流水线的状态。稍等片刻，流水线便会成功运行。


## 验证结果

1. 如果流水线成功运行，则会在 Jenkinsfile 中指定的项目中创建一个**部署 (Deployment)**。

2. 查看已推送至 Docker Hub 的镜像。

   
   