---
title: "使用 Jenkinsfile 创建流水线"
keywords: 'KubeSphere, Kubernetes, Docker, Spring Boot, Jenkins, DevOps, CI/CD, 流水线'
description: "学习如何使用示例 Jenkinsfile 创建并运行流水线。"
linkTitle: "使用 Jenkinsfile 创建流水线"
weight: 11210
---

Jenkinsfile 是一个文本文件，它包含 Jenkins 流水线的定义，并被检入源代码控制仓库。Jenkinsfile 将整个工作流存储为代码，因此它是代码审查和流水线迭代过程的基础。有关更多信息，请参见 [Jenkins 官方文档](https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/)。

本教程演示如何基于 GitHub 仓库中的 Jenkinsfile 创建流水线。您可以使用该流水线将示例应用程序分别部署到可从外部访问的开发环境和生产环境。

{{< notice note >}}

KubeSphere 中可以创建两种类型的流水线：一种是本教程中介绍的基于 SCM 中 Jenkinsfile 创建的流水线，另一种是[通过图形编辑面板创建的流水线](../create-a-pipeline-using-graphical-editing-panel/)。Jenkinsfile in SCM 需要源代码管理 (SCM) 中有内置 Jenkinsfile，换句话说，Jenkinsfile 作为 SCM 的一部分。KubeSphere DevOps 系统会根据代码仓库的现有 Jenkinsfile 自动构建 CI/CD 流水线。您可以定义工作流，例如 `stage` 和 `step`。

{{</ notice >}} 

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P015C202111_%E4%BD%BF%E7%94%A8%20Jenkinsfile%20%E5%88%9B%E5%BB%BA%E6%B5%81%E6%B0%B4%E7%BA%BF.mp4">
</video>

## 准备工作

- 您需要有一个 [Docker Hub](https://hub.docker.com/) 帐户和一个 [GitHub](https://github.com/) 帐户。
- 您需要[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要创建一个企业空间、一个 DevOps 工程和一个帐户 (`project-regular`)，需要邀请该帐户至 DevOps 工程中并赋予 `operator` 角色。如果尚未准备就绪，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要设置 CI 专用节点用于运行流水线。请参考[为依赖项缓存设置 CI 节点](../../how-to-use/set-ci-node/)。
- 您需要安装和配置 SonarQube。请参考[将 SonarQube 集成到流水线](../../../devops-user-guide/how-to-integrate/sonarqube/)。如果您跳过这一部分，则没有下面的 **SonarQube 分析**阶段。

## 流水线概述

本示例流水线包括以下八个阶段。

![流水线概览](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/pipeline-overview.png)

{{< notice note >}}

- **阶段 1：Checkout SCM**：从 GitHub 仓库检出源代码。
- **阶段 2：单元测试**：待该测试通过后才会进行下一阶段。
- **阶段 3：SonarQube 分析**：SonarQube 代码质量分析。
- **阶段 4：构建并推送快照镜像**：根据**行为策略**中选定的分支来构建镜像，并将 `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` 标签推送至 Docker Hub，其中 `$BUILD_NUMBER` 为流水线活动列表中的运行序号。
- **阶段 5：推送最新镜像**：将 SonarQube 分支标记为 `latest`，并推送至 Docker Hub。
- **阶段 6：部署至开发环境**：将 SonarQube 分支部署到开发环境，此阶段需要审核。
- **阶段 7：带标签推送**：生成标签并发布到 GitHub，该标签会推送到 Docker Hub。
- **阶段 8：部署至生产环境**：将已发布的标签部署到生产环境。

{{</ notice >}} 

## 动手实验

### 步骤 1：创建凭证

1. 以 `project-regular` 身份登录 KubeSphere 控制台。转到您的 DevOps 工程，在**工程管理**下的**凭证**页面创建以下凭证。有关如何创建凭证的更多信息，请参见[凭证管理](../../../devops-user-guide/how-to-use/credential-management/)。

   {{< notice note >}}

   如果您的帐户或密码中包含任何特殊字符，例如 `@` 和 `$`，可能会因为无法识别而在流水线运行时导致错误。在这种情况下，您需要先在一些第三方网站（例如 [urlencoder](https://www.urlencoder.org/)）上对帐户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。

   {{</ notice >}} 

   | 凭证 ID         | 类型       | 用途       |
   | --------------- | ---------- | ---------- |
   | dockerhub-id    | 帐户凭证   | Docker Hub |
   | github-id       | 帐户凭证   | GitHub     |
   | demo-kubeconfig | kubeconfig | Kubernetes |

2. 您还需要为 SonarQube 创建一个凭证 ID (`sonar-token`)，用于上述的阶段 3（SonarQube 分析）。请参考[为新工程创建 SonarQube 令牌 (Token)](../../../devops-user-guide/how-to-integrate/sonarqube/#为新工程创建-sonarqube-token)，在下图所示的**密钥**字段中输入令牌。点击**确定**完成操作。

   ![Sonar 令牌](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/sonar-token.PNG)

3. 您还需要创建具有如下图所示权限的 GitHub 个人访问令牌 (PAT)，然后在 DevOps 项目中，使用生成的令牌创建用于 GitHub 认证的帐户凭证（例如，`github-token`）。

   ![github-token-scope](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/github-token-scope.png)
   
   {{< notice note >}}
   
   如需创建 GitHub 个人访问令牌，请转到您 GitHub 帐户的 **Settings**，点击 **Developer settings**，选择 **Personal access tokens**，然后点击 **Generate new token**。
   
   {{</ notice >}}
   
4. 您可以在列表中看到已创建的五个凭证。

   ![credential-list1](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/credential-list1.png)

### 步骤 2：在 GitHub 仓库中修改 Jenkinsfile

1. 登录 GitHub 并 Fork GitHub 仓库 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) 至您的 GitHub 个人帐户。

   ![fork-github-repo1](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/fork-github-repo1.png)

2. 在您自己的 GitHub 仓库 **devops-java-sample** 中，点击根目录中的文件 `Jenkinsfile-online`。

   ![jenkins-edit--1](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/jenkins-edit--1.png)

3. 点击右侧的编辑图标，编辑环境变量。

   ![jenkins-edit--2](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/jenkins-edit--2.png)

   | 条目 | 值 | 描述信息 |
   | :--- | :--- | :--- |
   | DOCKER\_CREDENTIAL\_ID | dockerhub-id | 您在 KubeSphere 中为 Docker Hub 帐户设置的**凭证 ID**。 |
   | GITHUB\_CREDENTIAL\_ID | github-id | 您在 KubeSphere 中为 GitHub 帐户设置的**凭证 ID**，用于将标签推送至您的 GitHub 仓库。 |
   | KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig | 您在 KubeSphere 中为 kubeconfig 设置的**凭证 ID**，用于访问运行中的 Kubernetes 集群。 |
   | REGISTRY | docker.io | 默认为 `docker.io`，用作推送镜像的地址。 |
   | DOCKERHUB\_NAMESPACE | your-dockerhub-account | 请替换为您的 Docker Hub 帐户名，也可以替换为该帐户下的 Organization 名称。 |
   | GITHUB\_ACCOUNT | your-github-account | 请替换为您的 GitHub 帐户名。例如，如果您的 GitHub 地址是 `https://github.com/kubesphere/`，则您的 GitHub 帐户名为 `kubesphere`，也可以替换为该帐户下的 Organization 名称。 |
   | APP\_NAME | devops-java-sample | 应用名称。 |
   | SONAR\_CREDENTIAL\_ID | sonar-token | 您在 KubeSphere 中为 SonarQube 令牌设置的**凭证 ID**，用于代码质量检测。 |

   {{< notice note >}}
   
   Jenkinsfile 中 `mvn` 命令的参数 `-o` 表示开启离线模式。本教程中已下载相关依赖项，以节省时间并适应某些环境中的网络干扰。离线模式默认开启。
   
   {{</ notice >}} 

4. 编辑环境变量后，点击页面底部的 **Commit changes**，更新 SonarQube 分支中的文件。

   ![commit-changes1](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/commit-changes1.png)

### 步骤 3：创建项目

您需要创建两个项目，例如 `kubesphere-sample-dev` 和 `kubesphere-sample-prod`，分别代表开发环境和生产环境。待流水线成功运行，将在这两个项目中自动创建应用程序的相关部署 (Deployment) 和服务 (Service)。

{{< notice note >}}

您需要提前创建 `project-admin` 帐户，用作 CI/CD 流水线的审核者。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

{{</ notice >}}

1. 以 `project-admin` 身份登录 KubeSphere。在您创建 DevOps 工程的企业空间中创建以下两个项目。请确保邀请 `project-regular` 帐户至这两个项目中并赋予 `operator` 角色。

   | 项目名称               | 别名                    |
   | ---------------------- | ----------------------- |
   | kubesphere-sample-dev  | development environment |
   | kubesphere-sample-prod | production environment  |

2. 项目创建后，会显示在项目列表中，如下所示：

   ![项目列表](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/project-list.PNG)

### 步骤 4：创建流水线

1. 登出 KubeSphere，然后以 `project-regular` 身份重新登录，转到 DevOps 工程 `demo-devops`，点击**创建**构建新流水线。

   ![创建流水线](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/create-pipeline.PNG)

2. 在弹出对话框中填入基本信息，将其命名为 `jenkinsfile-in-scm` 并选择一个代码仓库。

   ![创建流水线-2](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/create-pipeline-2.PNG)

3. 在 **GitHub** 选项卡，从下拉菜单中选择 **github-token**，然后点击**确认**来选择您的仓库。

   ![select-token1](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/select-token1.png)

4. 选择您的 GitHub 帐户，与该令牌相关的所有仓库将在右侧列出。选择 **devops-java-sample** 并点击**选择此仓库**，点击**下一步**继续。

   ![选择仓库](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/select_repo.png)

5. 在**高级设置**中，选中**丢弃旧的分支**旁边的方框。本教程中，您可以为**保留分支的天数**和**保留分支的最大个数**使用默认值。

   ![分支设置](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/branch-settings.PNG)

   丢弃旧的分支意味着您将一并丢弃分支记录。分支记录包括控制台输出、已归档制品以及特定分支的其他相关元数据。更少的分支意味着您可以节省 Jenkins 正在使用的磁盘空间。KubeSphere 提供两个选项来确定何时丢弃旧分支：

   - 保留分支的天数：在一定天数之后，丢弃分支。

   - 保留分支的最大个数：分支达到一定数量后，丢弃最旧的分支。

   {{< notice note >}}
   
   **保留分支的天数**和**保留分支的最大个数**可以同时应用于分支。只要某个分支满足其中一个字段所设置的条件，则会丢弃该分支。例如，如果您将保留天数和最大分支数分别指定为 2 和 3，待某个分支的保留天数超过 2 或者分支保留数量超过 3，则会丢弃该分支。KubeSphere 默认用 -1 预填充这两个字段，表示已删除的分支将被丢弃。
   
   {{</ notice >}} 

6. 在**行为策略**中，KubeSphere 默认提供四种策略。本示例中不会使用**从 Fork 仓库中发现 PR** 这条策略，因此您可以删除该策略。您无需修改设置，可以直接使用默认值。

   ![remove-behavioral-strategy1](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/remove-behavioral-strategy1.png)

   Jenkins 流水线运行时，开发者提交的 Pull Request (PR) 也将被视为一个单独的分支。

   **发现分支**

   - **排除也作为 PR 提交的分支**：不扫描源分支，例如源仓库的 master 分支。需要合并这些分支。
   - **只有被提交为 PR 的分支**：仅扫描 PR 分支。
   - **所有分支**：拉取源仓库中的所有分支。

   **从原仓库中发现 PR**

   - **PR 与目标分支合并后的源代码版本**：PR 合并到目标分支后，基于源代码创建并运行流水线。
   - **PR 本身的源代码版本**：根据 PR 本身的源代码创建并运行流水线。
   - **发现 PR 时会创建两个流水线**：KubeSphere 创建两个流水线，一个流水线使用 PR 与目标分支合并后的源代码版本，另一个使用 PR 本身的源代码版本。

   {{< notice note >}}

   您需要选择 GitHub 作为代码仓库才能启用此处的**行为策略**设置。

   {{</ notice >}}

7. 向下滚动到**脚本路径**。该字段指定代码仓库中的 Jenkinsfile 路径。它表示仓库的根目录。如果文件位置变更，则脚本路径也需要更改。请将其更改为 `Jenkinsfile-online`，这是示例仓库中位于根目录下的 Jenkinsfile 的文件名。

   ![Jenkinsfile-online](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/jenkinsfile-online.PNG)

8. 在**扫描 Repo Trigger** 中，点击**如果没有扫描触发，则定期扫描**并设置时间间隔为 **5 分钟**。点击**创建**完成配置。

   ![高级设置](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/advanced-settings.PNG)

   {{< notice note >}}

   您可以设置特定的时间间隔让流水线扫描远程仓库，以便根据您在**行为策略**中设置的策略来检测代码更新或新的 PR。

   {{</ notice >}}

### 步骤 5：运行流水线

1. 流水线创建后，将显示在下图所示的列表中。点击该流水线进入其详情页面。

   ![流水线列表](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/pipeline-list.PNG)

   {{< notice note >}}

   - 您可以点击该流水线右侧的三个点，然后选择**复制流水线**来创建该流水线的副本。如需并发运行不包含多分支的多个流水线，您可以将这些流水线全选，然后点击**运行**来批量运行它们。
   - 流水线详情页显示**同步状态**，即 KubeSphere 和 Jenkins 的同步结果。若同步成功，您会看到**成功**图标中打上绿色的对号。

   {{</ notice >}} 

2. 在**活动**选项卡下，正在扫描三个分支。点击右侧的**运行**，流水线将根据您设置的行为策略来运行。从下拉列表中选择 **sonarqube**，然后添加标签号，例如 `v0.0.2`。点击**确定**触发新活动。

   ![流水线详情](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/pipeline-detail.PNG)

   ![标签名称](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/tag-name.PNG)

   {{< notice note >}} 

   - 如果您在此页面上未看到任何活动，则需要手动刷新浏览器或点击下拉菜单（**更多操作**按钮）中的**扫描远程分支**。
   - 标签名称用于在 GitHub 和 Docker Hub 中指代新生成的发布版本和镜像。现有标签名称不能再次用于字段 `TAG_NAME`。否则，流水线将无法成功运行。

   {{</ notice >}}

3. 稍等片刻，您会看到一些活动停止，一些活动失败。点击第一个活动查看其详细信息。

   ![活动失败](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/activity-failure.PNG)

   {{< notice note >}}

   活动失败可能由不同因素所引起。本示例中，在上述步骤中编辑分支环境变量时，仅更改了 sonarqube 分支的 Jenkinsfile。相反地，dependency 和 master 分支中的这些变量保持不变（使用了错误的 GitHub 和 Docker Hub 帐户），从而导致失败。您可以点击该活动，查看其日志中的详细信息。导致失败的其他原因可能是网络问题、Jenkinsfile 中的编码不正确等等。

   {{</ notice >}} 

4. 流水线在 `deploy to dev` 阶段暂停，您需要手动点击**继续**。请注意，在 Jenkinsfile 中分别定义了三个阶段 `deploy to dev`、`push with tag` 和 `deploy to production`，因此将对流水线进行三次审核。

   ![流水线继续](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/pipeline-proceed.PNG)

   在开发或生产环境中，可能需要具有更高权限的人员（例如版本管理员）来审核流水线、镜像以及代码分析结果。他们有权决定流水线是否能进入下一阶段。在 Jenkinsfile 中，您可以使用 `input` 来指定由谁审核流水线。如果您想指定一个用户（例如 `project-admin`）来审核，您可以在 Jenkinsfile 中添加一个字段。如果有多个用户，则需要通过逗号进行分隔，如下所示：

   ```groovy
   ···
   input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
   ···
   ```
   
   {{< notice note >}}
   
   在 KubeSphere 3.1 中，如果不指定审核员，那么能够运行流水线的帐户也能够继续或终止该流水线。流水线创建者、在该工程中具有 `admin` 角色的帐户或者您指定的帐户也有权限继续或终止流水线。
   
   {{</ notice >}}

### 步骤 6：检查流水线状态

1. 在**运行状态**中，您可以查看流水线的运行状态。请注意，流水线在刚创建后将继续初始化几分钟。示例流水线有八个阶段，它们已在 [Jenkinsfile-online](https://github.com/kubesphere/devops-java-sample/blob/sonarqube/Jenkinsfile-online) 中单独定义。

   ![查看流水线日志-1](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/inspect-pipeline-log-1.PNG)

2. 点击右上角的**查看日志**来查看流水线运行日志。您可以看到流水线的动态日志输出，包括可能导致流水线无法运行的错误。对于每个阶段，您都可以点击该阶段来查看其日志，而且可以将日志下载到本地计算机进行进一步分析。

   ![查看流水线日志-2](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/inspect-pipeline-log-2.PNG)

### 步骤 7：验证结果

1. 流水线成功运行后，点击**代码质量**通过 SonarQube 查看结果，如下所示。

   ![SonarQube 结果详情](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/sonarqube-result-detail-1.PNG)

   ![SonarQube 结果详情](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/sonarqube-result-detail.PNG)

2. 按照 Jenkinsfile 中的定义，通过流水线构建的 Docker 镜像也已成功推送到 Docker Hub。在 Docker Hub 中，您会看到带有标签 `v0.0.2` 的镜像，该标签在流水线运行之前已指定。

   ![Docker Hub 镜像](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/docker-hub-result.PNG)

3. 同时，GitHub 中已生成一个新标签和一个新发布版本。

   ![GitHub 结果](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/github-result.PNG)

4. 示例应用程序将部署到 `kubesphere-sample-dev` 和 `kubesphere-sample-prod`，并创建相应的部署和服务。转到这两个项目，预期结果如下所示：

   | 环境 | URL | 命名空间 | 部署 | 服务 |
   | :--- | :--- | :--- | :--- | :--- |
   | Development | `http://{$NodeIP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample-dev |
   | Production | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample | ks-sample |

   #### 部署

   ![流水线部署](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/pipeline-deployments.PNG)

   #### 服务

   ![流水线服务](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/devops-prod.PNG)

   {{< notice note >}}

   您可能需要在您的安全组中放行该端口，以便通过 URL 访问应用程序。

   {{</ notice >}} 

### 步骤 8：访问示例服务

1. 以 `admin` 身份登录 KubeSphere 并使用**工具箱**中的 **Web Kubectl** 访问该服务。转到 `kubesphere-sample-dev` 项目，然后在**应用负载**下的**服务**中选择 `ks-sample-dev`。Endpoint 可用于访问该服务。

   ![查看示例应用](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/sample-app-result-check.PNG)
   
   ![访问 Endpoint](/images/docs/zh-cn/devops-user-guide/use-devops/create-a-pipeline-using-a-jenkinsfile/access-endpoint.PNG)

2. 在右下角的**工具箱**中使用 **Web Kubectl** 执行以下命令：

   ```bash
   curl 10.233.120.230:8080
   ```

3. 预期输出:

   ```bash
   Really appreciate your star, that's the power of our life.
   ```

   {{< notice note >}} 

   使用 `curl` 访问 Endpoint，或者访问 {$Virtual IP}:{$Port} 或 {$Node IP}:{$NodePort}。

   {{</ notice >}} 

4. 同样地，您可以在项目 `kubesphere-sample-prod` 中测试服务，您将看到相同的输出结果。

   ```bash
   $ curl 10.233.120.236:8080
   Really appreciate your star, that's the power of our life.
   ```

