---
title: "如何将 Harbor 集成到流水线"
keywords: 'kubernetes, docker, devops, jenkins, harbor'
description: ''
linkTitle: "将 Harbor 集成到流水线"
weight: 11320
---

## 先决条件

- 您需要[启用 KubeSphere DevOps 系统](../../../../docs/pluggable-components/devops/)。
- 您需要创建一个企业空间，一个 DevOps 项目和一个项目**常规帐户（project-regular）**，并且需要将此帐户邀请到 DevOps 项目中。 请参阅创建[企业空间和项目](../../../../docs/quick-start/create-workspace-and-project)。
- 您已经安装 **Harbor**。

## 安装 Harbor

强烈建议您通过应用程序商店安装 Harbor。你也可以通过 helm3 手动安装 Harbor。

```bash
helm repo add harbor https://helm.goharbor.io
# for qucik taste, you can expose harbor by nodeport and disable tls.
# set externalURL as one of your node ip and make sure it can be accessed by jenkins.
helm install harbor-release harbor/harbor --set expose.type=nodePort,externalURL=http://$ip:30002,expose.tls.enabled=false
```

几分钟后，打开浏览器并访问 `http://$node_ip:30003`  输入 **admin** 和 **Harbor12345**，然后单击 **log in** 登录。

![harbor-login](/images/devops-zh/harbor-login.png)

单击**新建项目**，输入项目名称，然后单击**确定**。

## 获取 Harbor 凭证

![harbor-new-project](/images/devops-zh/harbor-new-project.png)

![harbor-project-ok](/images/devops-zh/harbor-project-ok.png)

单击您刚刚创建的项目名称，找到**机器人帐户**选项卡，然后单击**添加机器人帐户**。

![harbor-robot-account](/images/devops-zh/harbor-robot-account.png)

输入机器人帐户的名称，然后保存。

![harbor-robot-account-ok](/images/devops-zh/harbor-robot-account-ok.png)

单击**导出到文件中**以保存凭证。

![harbor-robot-account-save](/images/devops-zh/harbor-robot-account-save.png)

### 创建凭证

登录到 KubeSphere，进入创建的 DevOps 项目，并在**工程管理**→**凭证**下创建以下**凭证**：

![ks-console-create-credential](/images/devops-zh/ks-console-create-credential.png)

用户名是您刚刚保存的 json 文件的 `name` 字段内容。 密码使用 `token` 字段内容。

![ks-console-credential-ok](/images/devops-zh/ks-console-credential-ok.png)

## 创建流水线

![ks-console-create-pipline](/images/devops-zh/ks-console-create-pipline.png)

在弹出窗口中填写流水线的基本信息，输入流水线的名称，然后将其他名称设置为默认值。

![create-pipline-2](/images/devops-zh/create-pipline-2.png)

![create-pipline-3](/images/devops-zh/create-pipline-3.png)

## 编辑 Jenkinsfile

单击流水线下的**编辑 Jenkinsfile** 按钮，然后将以下文本粘贴到弹出窗口中。 您需要替换环境变量 REGISTRY，HARBOR_NAMESPACE，APP_NAME，HARBOR_CREDENTIAL。

![editJenkinsfile](/images/devops-zh/edit-Jenkinsfile.png)

```pipeline {
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
          // replace the username behind -u and do not forget
          sh '''echo $HARBOR_CREDENTIAL | docker login $REGISTRY -u 'robot$yuswift2018' --password-stdin'''
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

您可以通过带有环境变量的 jenkins 凭证将参数传递给 docker login -u。但是，每个 harbor-robot-account 用户名都包含一个 “$” 字符，当被环境变量使用时，jenkins 将其转换为 “$$”。查看更多[相关信息](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/)。

   {{</ notice >}}

## 运行流水线

保存完 jenkinsfile 后，单击**运行**按钮。 如果一切顺利，您会看到 jenkins 将镜像推送到 Harbor 仓库中。

![run-pipline](/images/devops-zh/run-pipline.png)
