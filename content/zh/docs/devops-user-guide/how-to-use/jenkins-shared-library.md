---
title: "在流水线中使用 Jenkins 共享库"
keywords: 'KubeSphere, Kubernetes, Jenkins, 共享库, 流水线'
description: '学习如何在流水线中使用 Jenkins 共享库'
linkTitle: "在流水线中使用 Jenkins 共享库"
weight: 11292
---

对于包含相同阶段或步骤的 Jenkins 流水线，在 Jenkins 文件中使用 Jenkins 共享库避免流水线代码重复。

本教程演示如何在 KubeSphere DevOps 流水线中使用 Jenkins 共享库。

## 准备工作

- [启用 KubeSphere DevOps 系统](https://kubesphere.io/zh/docs/pluggable-components/devops/)。
- 您需要创建一个企业空间、一个 DevOps 工程和一个帐户 (``project-regular``)。这个帐户必须被 DevOps 工程邀请，并且授予 ``operator`` 角色。有关详细信息，请参阅[创建企业空间、项目、帐户和角色](https://kubesphere.io/zh/docs/quick-start/create-workspace-and-project/)。
- 您需要一个可用 Jenkins 共享库。本教程以 [GitHub 仓库](https://github.com/devops-ws/jenkins-shared-library)中的 Jenkins 共享库为例。

## 在 Jenkins 仪表盘配置共享库

1. [登录 Jenkins 仪表板](https://kubesphere.io/zh/docs/devops-user-guide/how-to-use/jenkins-setting/#log-in-to-jenkins-to-reload-configurations)并点击左侧导航栏中的**系统管理**

2. 向下滚动并点击**系统配置**。

   ![click_configure](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/click-configure.png)

3. 向下滚动到 **Global Pipeline Libraries**，然后点击**新增**。

   ![click-add](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/click-add.png)

4. 配置字段如下所示。

   - **Name：** 从为共享库设置名称（例如，``demo-shared-library``），以便可以通过在 Jenkinsfile 中引用此名称来导入共享库。

   - **Default version：** 从将共享库放在其中的仓库中设置分支名称，作为导入共享库的默认仓库分支。本教程将使用 master。

   - 在 **Retrieval method** 下，选择 **Modern SCM**。

   - 在 **Source Code Management** 下，选择 **Git** 并为项目仓库输入**示例仓库**的 URL 。如果您使用自己的仓库则需要配置**访问凭据**。

     ![configure-shared-library](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/configure-shared-library.png)

5. 当您结束编辑，点击**应用**

   {{< notice note >}}

   您还可以配置[文件夹级别的共享库](https://www.jenkins.io/zh/doc/book/pipeline/shared-libraries/#folder-level-shared-libraries)。

   {{</ notice >}}

## 在流水线中使用共享库


### 步骤 1： 创建流水线

1. 用 ``project-regular`` 帐户登录 KubeSphere web 控制台。进入 DevOps 工程并点击**流水线**页面上的**创建**。

2. 在弹出窗口中设置名称（例如，``demo-shared-library``），点击**下一步**。

   ![set-name](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/set-name.png)

3. 在**高级设置**中，直接点击**创建**，以默认设置创建流水线。

   ![click-create](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/click-create.png)

### 步骤 2：编辑流水线

1. 在流水线列表中，点击流水线以转到其详细信息页面，然后点击**编辑 Jenkinsfile**。

   ![edit-jenkinsfile](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/edit-jenkinsfile.png)

2. 在显示的对话框中，输入以下示例文件。完成编辑后，点击**确定**。

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

   您可以根据需要为 ``label`` 指定 ``agent``。

   {{</ notice >}}

3. 或者，您可以使用以 ``@Library('<the configured name of shared library>') _ ``，开头的 Jenkinsfile。如果使用这种类型的 Jenkinsfile，则需要提前在 Jenkins 仪表板上配置共享库。在本教程中，您可以使用以下示例文件。

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

   您可以使用 `@Library(‘demo-shared-library@<branch name>') _` 来指定特定的分支。

   {{</ notice >}}

### 步骤 3：运行流水线

1. 您可以在**流水线**选项卡下查看该阶段。点击**运行**运行它。

   ![click-run](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/click-run.png)

2. 在一段时间后，流水线将成功运行。

   ![run-successfully](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/run-successfully.png)

3. 您可以点击**状态栏**下的**成功**记录，然后点击**查看日志**查看日志详细信息。

   ![log-details](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-shared-library/log-details.png)
