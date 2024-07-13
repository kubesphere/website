---
title: "将 Harbor 集成到流水线"
keywords: 'Kubernetes, Docker, DevOps, Jenkins, Harbor'
description: '将 Harbor 集成到流水线中并向您的 Harbor 仓库推送镜像。'
linkTitle: "将 Harbor 集成到流水线"
weight: 11320
version: "v3.3"
---

本教程演示如何将 Harbor 集成到 KubeSphere 流水线。

## 准备工作

- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要创建一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)。需要邀请该用户至 DevOps 项目并赋予 `operator` 角色。如果尚未创建，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 安装 Harbor

强烈建议您通过 [KubeSphere 应用商店](../../../application-store/built-in-apps/harbor-app/)安装 Harbor。或者，您可以使用 Helm3 手动安装 Harbor。

```bash
helm repo add harbor https://helm.goharbor.io
# 如需快速安装，您可以通过 NodePort 暴露 Harbor 并禁用 tls。
# 请将 externalURL 设置为您的一个节点 IP，并确保 Jenkins 能够访问它。
helm install harbor-release harbor/harbor --set expose.type=nodePort,externalURL=http://$ip:30002,expose.tls.enabled=false
```

## 获取 Harbor 凭证

1. 安装 Harbor 后，请访问 `<NodeIP>:30002` 并使用默认帐户和密码 (`admin/Harbor12345`) 登录控制台。在左侧导航栏中点击**项目**并在**项目**页面点击**新建项目**。

2. 在弹出的对话框中，设置项目名称 (`ks-devops-harbor`) 并点击**确定**。

3. 点击刚刚创建的项目，在**机器人帐户**选项卡下点击**添加机器人帐户**。

4. 在弹出的对话框中，为机器人帐户设置名称 (`robot-test`) 并点击**添加**。请确保在**权限**中勾选推送制品的权限选框。

5. 在弹出的对话框中，点击**导出到文件中**，保存该令牌。

## 启用 Insecure Registry

您需要配置 Docker，使其忽略您 Harbor 仓库的安全性。

1. 在您的主机上运行 `vim /etc/docker/daemon.json` 命令以编辑 `daemon.json` 文件，输入以下内容并保存更改。

   ```json
   {
     "insecure-registries" : ["103.61.38.55:30002"]
   }
   ```

   {{< notice note >}}

   请确保将 `103.61.38.55:30002` 替换为您自己的 Harbor 仓库地址。对于 Linux，`daemon.json` 文件的路径为 `/etc/docker/daemon.json`；对于 Windows，该文件的路径为 `C:\ProgramData\docker\config\daemon.json`。

   {{</ notice >}}

2. 运行以下命令重启 Docker，使更改生效。

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```

   {{< notice note >}}

   建议您在隔离的测试环境或者严格控制的离线环境中使用该方案。有关更多信息，请参考 [Deploy a plain HTTP registry](https://docs.docker.com/registry/insecure/#deploy-a-plain-http-registry)。完成上述操作后，即可在项目中部署工作负载时使用您 Harbor 仓库中的镜像。您需要为自己的 Harbor 仓库创建一个镜像密钥，然后在**容器镜像**选项卡下的**容器设置**中，选择您的 Harbor 仓库并输入镜像的绝对路径以搜索您的镜像。

   {{</ notice >}}

## 创建凭证

1. 以 `project-regular` 身份登录 KubeSphere 控制台，转到您的 DevOps 项目，在 **DevOps 项目设置**下的**凭证**页面为 Harbor 创建凭证。

2. 在**创建凭证**页面，设置凭证 ID (`robot-test`)，**类型**选择**用户名和密码**。**用户名**字段必须和您刚刚下载的 JSON 文件中 `name` 的值相同，并在**密码/令牌**中输入该文件中 `token` 的值。

3. 点击**确定**以保存。

## 创建流水线

1. 转到**流水线**页面，点击**创建**。在**基本信息**选项卡，输入名称 (`demo-pipeline`)，然后点击**下一步**。

2. **高级设置**中使用默认值，点击**创建**。

## 编辑 Jenkinsfile

1. 点击该流水线进入其详情页面，然后点击**编辑 Jenkinsfile**。

2. 将以下内容复制粘贴至 Jenkinsfile。请注意，您必须将 `REGISTRY`、`HARBOR_NAMESPACE`、`APP_NAME` 和 `HARBOR_CREDENTIAL` 替换为您自己的值。

   ```groovy
   pipeline {  
     agent {
       node {
         label 'maven'
       }
     }
     
     environment {
       // 您 Harbor 仓库的地址。
       REGISTRY = '103.61.38.55:30002'
       // 项目名称。
       // 请确保您的机器人帐户具有足够的项目访问权限。
       HARBOR_NAMESPACE = 'ks-devops-harbor'
       // Docker 镜像名称。
       APP_NAME = 'docker-example'
       // ‘robot-test’是您在 KubeSphere 控制台上创建的凭证 ID。
       HARBOR_CREDENTIAL = credentials('robot-test')
     }
     
     stages {
       stage('docker login') {
         steps{
           container ('maven') {
             // 请替换 -u 后面的 Docker Hub 用户名，不要忘记加上 ''。您也可以使用 Docker Hub 令牌。
             sh '''echo $HARBOR_CREDENTIAL_PSW | docker login $REGISTRY -u 'robot$robot-test' --password-stdin'''
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

   您可以通过带有环境变量的 Jenkins 凭证来传送参数至 `docker login -u`。但是，每个 Harbor 机器人帐户的用户名都包含一个 `$` 字符，当用于环境变量时，Jenkins 会将其转换为 `$$`。(Harbor v2.2以后可以自定义机器人后缀，避免此类问题)[了解更多](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/)。

   {{</ notice >}} 

## 运行流水线

保存该 Jenkinsfile，KubeSphere 会自动在图形编辑面板上创建所有阶段和步骤。点击**运行**来运行该流水线。如果一切运行正常，Jenkins 将推送镜像至您的 Harbor 仓库。
