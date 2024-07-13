---
title: "自定义 Jenkins Agent"
keywords: "KubeSphere, Kubernetes, DevOps, Jenkins, Agent"
description: "了解如何在 KubeSphere 上自定义 Jenkins Agent。"
linkTitle: "自定义 Jenkins Agent"
Weight: 112191
version: "v3.3"
---

如果您需要使用运行特定环境（例如 JDK 11）的 Jenkins Agent，您可以在 KubeSphere 上自定义 Jenkins Agent。

本文档描述如何在 KubeSphere 上自定义 Jenkins Agent。

## 准备工作

- 您需要启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。

## 自定义 Jenkins Agent

1. 以 `admin` 用户登录 KubeSphere Web 控制台。

2. 点击左上角的**平台管理**，选择**集群管理**，然后在左侧导航栏点击**配置**下的**配置字典**。

3. 在**配置字典**页面的搜索框中输入 `jenkins-casc-config` 并按**回车键**。

4. 点击 `jenkins-casc-config` 进入其详情页面，点击**更多操作**，选择**编辑 YAML**。

5. 在弹出的对话框中，搜寻至 `data.jenkins_user.yaml:jenkins.clouds.kubernetes.templates` 下方并输入以下代码，点击**确定**。

   ```yaml
   - name: "maven-jdk11" # 自定义 Jenkins Agent 的名称。
     label: "maven jdk11" # 自定义 Jenkins Agent 的标签。若要指定多个标签，请用空格来分隔标签。
     inheritFrom: "maven" # 该自定义 Jenkins Agent 所继承的现有容器组模板的名称。
     containers:
     - name: "maven" # 该自定义 Jenkins Agent 所继承的现有容器组模板中指定的容器名称。
       image: "kubespheredev/builder-maven:v3.2.0jdk11" # 此镜像只用于测试。您可以使用自己的镜像。
   ```

   {{< notice note >}}

   请确保遵守 YAML 文件中的缩进。

   {{</ notice >}}

6. 请至少等待 70 秒，您的改动会自动重新加载。

7. 要使用自定义 Jenkins Agent，请参考下方的示例 Jenkinsfile，在创建流水线时指定自定义 Jenkins Agent 对应的标签和容器名。

   ```groovy
   pipeline {
     agent {
       node {
         label 'maven && jdk11'
       }
     }
     stages {
       stage('Print Maven and JDK version') {
         steps {
           container('maven') {
             sh '''
             mvn -v
             java -version
             '''
           }
         }
       }
     }
   }
   ```

   
