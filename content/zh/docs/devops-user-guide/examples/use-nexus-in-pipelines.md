---
title: "在流水线中使用 Nexus"
keywords: 'KubeSphere, Kubernetes, 流水线, Nexus, Jenkins'
description: '学习如何在 KubeSphere 流水线中使用 Nexus。'
linkTitle: "在流水线中使用 Nexus"
weight: 11450


---

[Nexus](https://www.sonatype.com/products/repository-oss) 是存储、组织和分发制品的存储管理器。使用 Nexus 的开发者可以更好的控制开发过程中所需的工件。

本教程演示如何在 KubeSphere 流水线中使用 Nexus。

## 准备工作

- 准备一个[启用 KuberSphere DevOps 系统](../../../../docs/pluggable-components/devops/)。

- 准备一个 [Nexus 实例](https://help.sonatype.com/repomanager3/installation)。

- 准备一个[GitHub](https://github.com/) 帐户。

- 创建一个企业空间、一个 DevOps 项目（例如，`demo-devops`）和一个用户（例如，`project-regular`）。`project-regular` 需要被邀请至 DevOps 项目中并赋予 `operator` 角色。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：获得 Nexus 上的仓库 URL

1. 用 `admin` 帐户登录 Nexus 控制台，然后在顶部导航栏点击 <img src="/images/docs/devops-user-guide/examples/use-nexus-in-pipeline/gear.png" height="18px" />。

2. 转到**仓库**页面，您可以看到 Nexus 提供了三种仓库类型。

   - `proxy`：远程仓库代理，用于下载资源并将其作为缓存存储在 Nexus 上。

   - `hosted`：在 Nexus 上存储制品的仓库。

   - `group`：一组已配置好的 Nexus 仓库。

3. 点击仓库查看它的详细信息。例如：点击 **maven-public** 进去详情页面，并且查看它的 **URL**。

### 步骤 2：在 GitHub 仓库修改 `pom.xml`

1. 登录 GitHub，Fork [示例仓库](https://github.com/devops-ws/learn-pipeline-java)到您的 GitHub 帐户。

2. 在您的 **learn-pipline-java** GitHub 仓库中，点击根目录下的文件 `pom.xml`。

3. 在文件中点击 <img src="/images/docs/zh-cn/devops-user-guide/examples/use-nexus-in-pipeline/github-edit-icon.png" height="18px" /> 以修改 `<distributionManagement>` 代码片段。设置 `<id>` 并使用您的 Nexus 仓库的 URL。

   ![modify-pom](/images/docs/zh-cn/devops-user-guide/examples/use-nexus-in-pipeline/modify-pom.png)

4. 当您完成以上步骤，点击页面下方的 **Commit changes**。

### 步骤 3：修改 ConfigMap

1. 使用 `admin` 帐户登录 KubeSphere Web 控制台，点击左上角的**平台管理**，选择**集群管理**。

2. 在**配置**下面选择 **配置**。在 **配置** 页面上的下拉列表中选择 `kubesphere-devops-worker` ，然后点击 `ks-devops-agent`。

3. 在详情页面，点击下拉菜单**更多操作**中的**编辑 YAML**。

4. 在弹出的对话框中，向下滚动，找到 `<servers>` 代码片段，输入下列代码：

   ```yaml
   <servers>
     <server>
       <id>nexus</id>
       <username>admin</username>
       <password>admin</password>
     </server>
   </servers>
   ```

   ![enter-server-code](/images/docs/zh-cn/devops-user-guide/examples/use-nexus-in-pipeline/enter-server-code.png)

   {{< notice note >}}

   `<id>` 是您在步骤 2 设置给 Nexus 的唯一标识符。 `<username>` 是您的 Nexus 用户名。 `<password>` 是您的 Nexus 的密码。您也可以在 Nexus 上面配置  `NuGet API Key`，以获得更高的安全性。

   {{</ notice >}}

5. 继续找到 `<mirrors>` 代码片段，然后输入一下代码：

   ```yaml
   <mirrors>
     <mirror>
       <id>nexus</id>
       <name>maven-public</name>
       <url>http://135.68.37.85:8081/repository/maven-public/</url>
       <mirrorOf>*</mirrorOf>
     </mirror>
   </mirrors>
   ```

   ![enter-mirror-code](/images/docs/zh-cn/devops-user-guide/examples/use-nexus-in-pipeline/enter-mirror-code.png)

   {{< notice note >}}

   `<id>` 是您在步骤 2 设置给 Nexus 唯一标识符。 `<name>` 是 Nexus 仓库的名称。 `<url>` 是您 Nexus 仓库的 URL。 `<mirrorOf>` 是要镜像的 Maven 仓库。在本教程，输入 `*` 镜像所有 Maven 仓库。有关更多信息请参考[为仓库使用镜像](http://maven.apache.org/guides/mini/guide-mirror-settings.html)。

   {{</ notice >}}

6. 当您完成，点击**确定**。

### 步骤 4：创建流水线

1. 登出 KubeSphere Web 控制台，使用帐户 `project-regular` 登录。转到 DevOps 项目，然后在**流水线**页面点击**创建**。

2. 在**基础信息**选项卡中，为流水线设置名称（例如，`nexus-pipeline`），然后点击**下一步**。

3. 在**高级设置**选项卡中，点击**创建**以使用默认配置。

4. 点击流水线名称进入它的详情页面，然后点击**编辑 Jenkinsfile**。

5. 在弹出的对话框中，输入以下 Jenkinsfile。完成后，点击**确定**。

   ```groovy
   pipeline {
       agent {
           label 'maven'
       }
       stages {
           stage ('clone') {
               steps {
                   git 'https://github.com/YANGMAO-ZHANG/learn-pipeline-java.git'
               }
           }
           
           stage ('build') {
               steps {
                   container ('maven') {
                       sh 'mvn clean package'
                   }
               }  
           }
           
           stage ('deploy to Nexus') {
               steps {
                   container ('maven') {
                       sh 'mvn deploy -DaltDeploymentRepository=nexus::default::http://135.68.37.85:8081/repository/maven-snapshots/'
                   }   
               }
           }
           stage ('upload') {
               steps {
                   archiveArtifacts artifacts: 'target/*.jar', followSymlinks: false
               }
           }
       }
   }
   ```
   {{< notice note >}}

   您需要用您自己的 GitHub 仓库地址替换原有的仓库地址。在 `deploy to Nexus` 阶段的步骤中的命令中，`nexus` 是您在 ConfigMap 上设置在 `<id>` 上的名称，同时 `http://135.68.37.85:8081/repository/maven-snapshots/` 是您 Nexus 仓库的 URL。

   {{</ notice >}}

### 步骤 5：运行流水线查看结果

1. 您可以在图形编辑面板中看到所有的阶段和步骤，点击**运行**去运行流水线。

2. 一段时间过后，你可以看到流水线的状态显示**成功**。点击**成功**的记录查看细节。 

3. 您可以点击**查看日志**查看更详细的日志。

4. 登录 Nexus 点击**浏览**。点击 **maven-public**，可以看到已经下载所有依赖。

   ![maven-public](/images/docs/zh-cn/devops-user-guide/examples/use-nexus-in-pipeline/maven-public.png)

5. 回到 **Browse** 页面，点击 **maven-sanpshots**。可以看到所有 JAR 包已经上传至仓库。

   ![maven-snapshots](/images/docs/zh-cn/devops-user-guide/examples/use-nexus-in-pipeline/maven-snapshots.png)



