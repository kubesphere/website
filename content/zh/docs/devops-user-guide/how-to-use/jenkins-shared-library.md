---
title: "在流水线中使用 Jenkins 共享库"
keywords: 'KubeSphere, Kubernetes, Jenkins, 共享库, 流水线'
description: '学习如何在流水线中使用 Jenkins 共享库。'
linkTitle: "在流水线中使用 Jenkins 共享库"
weight: 11292
---

对于包含相同阶段或步骤的 Jenkins 流水线，在 Jenkinsfile 中使用 Jenkins 共享库避免流水线代码重复。

本教程演示如何在 KubeSphere DevOps 流水线中使用 Jenkins 共享库。

## 准备工作

- [启用 KubeSphere DevOps 系统](https://kubesphere.io/zh/docs/pluggable-components/devops/)。
- 您需要创建一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)。必须邀请此帐户至 DevOps 项目中，并且授予 `operator` 角色。有关详细信息，请参阅[创建企业空间、项目、用户和角色](https://kubesphere.io/zh/docs/quick-start/create-workspace-and-project/)。
- 您需要一个可用 Jenkins 共享库。本教程以 [GitHub 仓库](https://github.com/devops-ws/jenkins-shared-library)中的 Jenkins 共享库为例。

## 在 Jenkins 仪表盘配置共享库

1. [登录 Jenkins 仪表板](../../how-to-integrate/sonarqube/#步骤-5将-sonarqube-服务器添加至-jenkins)并点击左侧导航栏中的**系统管理**。

2. 向下滚动并点击**系统配置**。

3. 向下滚动到 **Global Pipeline Libraries**，然后点击**新增**。

4. 配置字段如下所示。

   - **Name：** 为共享库设置名称（例如，``demo-shared-library``），以便在 Jenkinsfile 中引用此名称来导入共享库。

   - **Default version：** 设置共享库所在仓库的一个分支名称，将其作为导入共享库的默认分支。本教程将使用 master。

   - 在 **Retrieval method** 下，选择 **Modern SCM**。

   - 在 **Source Code Management** 下，选择 **Git** 并为**项目仓库**输入示例仓库的 URL 。如果您使用自己的仓库且访问此仓库需要凭据，则需要配置**凭据**。

5. 当您结束编辑，请点击**应用**。

   {{< notice note >}}

   您还可以配置[文件夹级别的共享库](https://www.jenkins.io/zh/doc/book/pipeline/shared-libraries/#folder-level-shared-libraries)。

   {{</ notice >}}

## 在流水线中使用共享库


### 步骤 1： 创建流水线

1. 用 `project-regular` 帐户登录 KubeSphere web 控制台。进入 DevOps 项目并点击**流水线**页面上的**创建**。

2. 在弹出窗口中设置名称（例如，``demo-shared-library``），点击**下一步**。

3. 在**高级设置**中，直接点击**创建**，使用默认设置创建流水线。

### 步骤 2：编辑流水线

1. 在流水线列表中，点击流水线以转到其详细信息页面，然后点击**编辑 Jenkinsfile**。

2. 在显示的对话框中，输入以下示例  Jenkinsfile。完成编辑后，点击**确定**。

   ```groovy
   library identifier: 'devops-ws-demo@master', retriever: modernSCM([
       $class: 'GitSCMSource',
       remote: 'https://github.com/devops-ws/jenkins-shared-library',
       traits: [[$class: 'jenkins.plugins.git.traits.BranchDiscoveryTrait']]
   ])
   
   pipeline {
       agent any
   
       stages {
           stage('Demo') {
               steps {
                   script {
                       mvn.fake()
                   }
               }
           }
       }
   }
   ```

   {{< notice note >}}

   您可以根据需要为 `agent` 指定 `label`。

   {{</ notice >}}

3. 或者，您可以使用以 `@Library('<配置好的共享库名称>') _ ` 开头的 Jenkinsfile。如果使用这种类型的 Jenkinsfile，则需要提前在 Jenkins 仪表板上配置共享库。在本教程中，您可以使用以下示例 Jenkinsfile。

   ```groovy
   @Library('demo-shared-library') _
   
   pipeline {
       agent any
   
       stages {
           stage('Demo') {
               steps {
                   script {
                       mvn.fake()
                   }
               }
           }
       }
   }
   ```

   {{< notice note >}}

   您可以使用 `@Library('demo-shared-library@<分支名称>') _` 来指定特定的分支。

   {{</ notice >}}

### 步骤 3：运行流水线

1. 您可以在**任务状态**选项卡下查看该阶段。点击**运行**运行它。

2. 在一段时间后，流水线将成功运行。

3. 您可以点击**运行记录**下的**成功**记录，然后点击**查看日志**查看日志详细信息。
