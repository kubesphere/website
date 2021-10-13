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
- 您需要创建一个企业空间、一个 DevOps 工程、一个项目和一个用户 (`project-regular`)，需要邀请该帐户至 DevOps 工程和项目中并赋予 `operator` 角色，以部署工作负载。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建 Docker Hub 访问令牌 (Token)

1. 登录 [Docker Hub](https://hub.docker.com/) 并在右上角的菜单中选择 **Account Settings**。

   ![DockerHub 设置](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/dockerhub-settings.PNG)

2. 在左侧点击 **Security**，然后点击 **New Access Token**。

   ![DockerHub 创建令牌](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/dockerhub-create-token.PNG)

3. 输入令牌名称，点击 **Create**。

   ![DockerHub 令牌创建完成](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/dockerhub-token-ok.PNG)

4. 点击 **Copy and Close** 并务必保存该访问令牌。

   ![复制 DockerHub 令牌](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/dockerhub-token-copy.PNG)

## 创建凭证

您需要在 KubeSphere 中为已创建的访问令牌创建凭证，以便流水线能够向 Docker Hub 推送镜像。此外，您还需要创建 kubeconfig 凭证，用于访问 Kubernetes 集群。

1. 以 `project-regular` 身份登录 KubeSphere Web 控制台，转到您的 DevOps 工程，在**凭证**页面点击**创建**。

   ![创建 DockerHub ID](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/create-dockerhub_id.png)

2. 在弹出对话框中，设置**凭证 ID**，稍后会用于 Jenkinsfile 中，**类型**选择**帐户凭证**。**用户名**输入您的 Docker Hub 帐户名称，**token / 密码**中输入刚刚创建的访问令牌。操作完成后，点击**确定**。

   ![创建 Docker 凭证](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/credential-docker_create.png)

   {{< notice tip >}}

有关如何创建凭证的更多信息，请参见[凭证管理](../../../devops-user-guide/how-to-use/credential-management/)。

   {{</ notice >}}

3. 再次点击**创建**，**类型**选择 **kubeconfig**。KubeSphere 会自动填充 **Content** 字段，即当前用户帐户的 kubeconfig。设置**凭证 ID**，然后点击**确定**。

   ![创建 kubeconfig](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/create-kubeconfig.PNG)

## 创建流水线

创建完上述凭证后，您可以按照以下步骤使用示例 Jenkinsfile 创建流水线。

1. 要创建流水线，请在**流水线**页面点击**创建**。

   ![创建流水线](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/create-pipeline.PNG)

2. 在弹出窗口中设置名称，然后点击**下一步**。

   ![设置流水线名称](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/set-pipeline-name.PNG)

3. 在本教程中，您可以为所有字段使用默认值。在**高级设置**页面，直接点击**创建**。

   ![创建流水线-2](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/create-pipeline-2.PNG)

## 编辑 Jenkinsfile

1. 在流水线列表中，点击该流水线进入其详情页面。点击**编辑 Jenkinsfile** 定义一个 Jenkinsfile，流水线会基于它来运行。

   ![编辑 jenkinsfile](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/edit_jenkinsfile.png)

2. 将以下所有内容复制并粘贴到弹出窗口中，用作流水线的示例 Jenkinsfile。您必须将 `DOCKERHUB_USERNAME`、`DOCKERHUB_CREDENTIAL`、`KUBECONFIG_CREDENTIAL_ID` 和 `PROJECT_NAME` 的值替换成您自己的值。操作完成后，点击**确定**。

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
       // 您在 KubeSphere 创建的项目名称，不是 DevOps 工程名称
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

   ![运行流水线](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/run_pipeline.png)

2. 在**活动**选项卡中，您可以查看流水线的状态。稍等片刻，流水线便会成功运行。

   ![流水线成功运行](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/pipeline_running.png)


## 验证结果

1. 如果流水线成功运行，则会在 Jenkinsfile 中指定的项目中创建一个**部署 (Deployment)**。

   ![查看部署](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/view_deployment.png)

2. 查看镜像是否已推送至 Docker Hub，如下所示：

   ![Docker 镜像-1](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/docker-image-1.PNG)

   ![Docker 镜像-2](/images/docs/zh-cn/devops-user-guide/examples/build-and-deploy-a-go-project/docker-image-2.PNG)
   
   