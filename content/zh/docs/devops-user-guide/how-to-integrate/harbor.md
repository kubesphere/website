---
title: "将 Harbor 集成到流水线"
keywords: 'Kubernetes, Docker, DevOps, Jenkins, Harbor'
description: '如何将 Harbor 集成到流水线'
linkTitle: "将 Harbor 集成到流水线"
weight: 11320
---

本教程演示如何将 Harbor 集成到 KubeSphere 流水线。

## 准备工作

- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要创建一个企业空间、一个 DevOps 工程和一个帐户 (`project-regular`)。需要邀请该帐户至 DevOps 工程并赋予 `operator` 角色。如果尚未创建，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 安装 Harbor

强烈建议您通过 [KubeSphere 应用商店](../../../application-store/built-in-apps/harbor-app/)安装 Harbor。或者，您可以使用 Helm3 手动安装 Harbor。

```bash
helm repo add harbor https://helm.goharbor.io
# For a qucik start, you can expose Harbor by nodeport and disable tls.
# Set externalURL to one of your node ip and make sure it can be accessed by jenkins.
helm install harbor-release harbor/harbor --set expose.type=nodePort,externalURL=http://$ip:30002,expose.tls.enabled=false
```

## 获取 Harbor 凭证

1. 安装 Harbor 后，请访问 `NodeIP:30002` 并使用默认帐户和密码 (`admin/Harbor12345`) 登录控制台。转到**项目**并点击**新建项目**。

   ![Harbor 项目](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/harbor-projects.png)

2. 设置名称并点击**确定**。

   ![设置名称](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/set-name.png)

3. 点击刚刚创建的项目，在**机器人帐户**选项卡下选择**添加机器人帐户**。

   ![机器人帐户](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/robot-account.png)

4. 输入机器人帐户的名称并保存。

   ![设置名称](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/robot-account-name.png)

5. 点击**导出到文件中**，保存该令牌。

   ![导出到文件](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/export-to-file.png)

## 创建凭证

1. 以 `project-regular` 身份登录 KubeSphere 控制台，转到您的 DevOps 工程，在**工程管理**下的**凭证**页面为 Harbor 创建凭证。

   ![创建凭证](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/create-credentials.PNG)

2. 在**创建凭证**页面，设置凭证 ID，**类型**选择**帐户凭证**。**用户名**字段必须和您刚刚下载的 Json 文件中 `name` 的值相同，并在 **token / 密码**中输入该文件中 `token` 的值。

   ![凭证页面](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/credentials-page.png)

3. 点击**确定**以保存。

## 创建流水线

1. 转到**流水线**页面，点击**创建**。在弹出对话框中输入基本信息，然后点击**下一步**。

   ![基本信息](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/basic-info.png)

2. **高级设置**中使用默认值，点击**创建**。

   ![高级设置](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/advanced-settings.PNG)

## 编辑 Jenkinsfile

1. 点击该流水线进入其详情页面，然后点击**编辑 Jenkinsfile**。

   ![编辑 jenkinsfile](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-harbor-into-pipelines/edit-jenkinsfile.PNG)

2. 将以下内容复制粘贴至 Jenkinsfile。请注意，您必须替换 `REGISTRY`、`HARBOR_NAMESPACE`、`APP_NAME` 和 `HARBOR_CREDENTIAL` 的值。

   ```groovy
   pipeline {  
     agent {
       node {
         label 'maven'
       }
     }
     
     environment {
       // the address of your harbor registry
       REGISTRY = '103.61.38.55:30002'
       // the project name
       // make sure your robot account have enough access to the project
       HARBOR_NAMESPACE = 'ks-devops-harbor'
       // docker image name
       APP_NAME = 'docker-example'
       // ‘yuswift’ is the credential id you created on ks console
       HARBOR_CREDENTIAL = credentials('yuswift')
     }
     
     stages {
       stage('docker login') {
         steps{
           container ('maven') {
             // replace the Docker Hub username behind -u and do not forget ''. You can also use a Docker Hub token. 
             sh '''echo $HARBOR_CREDENTIAL_PSW | docker login $REGISTRY -u 'robot$yuswift2018' --password-stdin'''
               }
             }  
           }
           
       stage('build & push') {
         steps {
           container ('maven') {
             sh 'git clone https://github.com/kstaken/dockerfile-examples.git'
             sh 'cd dockerfile-examples/rethinkdb && docker build -t $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:devops-test .'
             sh 'docker push  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:devops-test'
             }
           }
         }
       }
     }
   
   
   ```

   {{< notice note >}}

   您可以通过带有环境变量的 Jenkins 凭证来传送参数至 `docker login -u`。但是，每个 Harbor 机器人帐户的用户名都包含一个 `$` 字符，当用于环境变量时，Jenkins 会将其转换为 `$$`。[了解更多](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/)。

   {{</ notice >}} 

## 运行流水线

保存该 Jenkinsfile，KubeSphere 会自动在图形编辑面板上创建所有阶段和步骤。点击**运行**来执行该流水线。如果一切运行正常，Jenkins 将推送镜像至您的 Harbor 仓库。
