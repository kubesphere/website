---
title: "使用 Jenkinsfile 创建流水线"
keywords: 'KubeSphere, Kubernetes, docker, spring boot, Jenkins, devops, ci/cd, pipeline'
description: "如何使用 Jenkinsfile 创建流水线。"
linkTitle: "使用 Jenkinsfile 创建流水线"
weight: 200
---

Jenkinsfile 是一个文本文件，它包含了 Jenkins 流水线的定义并被检入源代码控制仓库。由于将整个工作流存储为代码，因此它是代码审查和流水线迭代过程的基础。有关更多信息，请参阅 [Jenkins官方文档](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)。

本教程演示了如何基于 GitHub 仓库中的 Jenkinsfile 创建流水线。 使用流水线，您可以将示例应用程序分别部署到可从外部访问的开发环境和生产环境。

{{< notice note >}}

在 KubeSphere 中可以创建两种类型的流水线： 本教程中介绍了基于 SCM 中的 Jenkinsfile 创建的流水线和通过[图形编辑面板创建的流水线](../create-a-pipeline-using-graphical-editing-panel)。Jenkinsfile in SCM 意为将 Jenkinsfile 文件本身作为源代码管理 (Source Control Management) 的一部分，KubeSphere 根据该文件内的流水线配置信息快速构建工程内的 CI/CD 功能模块，比如阶段 (Stage)，步骤 (Step) 和任务 (Job)。因此，在代码仓库中应包含 Jenkinsfile。
{{</ notice >}}

## 先决条件

- 您需要有一个 [Docker Hub](https://hub.docker.com/) 帐户和一个 [GitHub](https://github.com/)帐户。
- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要创建一个企业空间和一个具有项目管理 (`project-admin`) 权限的帐户，该账户必须是被赋予企业空间普通用户角色。如果还没准备好，请参考[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/) 。
- 您需要为运行流水线设置 CI 专用节点。请参阅[为缓存依赖项设置 CI 节点](../../how-to-use/set-ci-node/).
- 您需要安装和配置 SonarQube。 请参阅[将 SonarQube 集成到流水线](../../../devops-user-guide/how-to-integrate/sonarqube/)。 如果您跳过这一部分，则下面没有**SonarQube分析**。

## 流水线概览

在此示例流水线中，共有八个阶段，下面的流程图简单说明了流水线完整的工作过程：

![Pipeline Overview](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/Pipeline-Overview.png)

{{< notice note >}}

- **阶段 1. Checkout SCM**: 拉取 GitHub 仓库代码。
- **阶段 2. Unit test**: 单元测试，如果测试通过了才继续下面的任务。
- **阶段 3. SonarQube 质量检测**: sonarQube 代码质量检测。
- **阶段 4.** **Build & push snapshot image**: 根据行为策略中所选择分支来构建镜像，并将 tag 为 SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER 推送至 Harbor (其中 $BUILD_NUMBER 为 pipeline 活动列表的运行序号)。
- **阶段 5. Push the latest image**: 将 master 分支打上 tag 为 `latest`，并推送至 DockerHub。
- **阶段 6. Deploy to dev**: 将 master 分支部署到 Dev 环境，此阶段需要审核。
- **阶段 7. Push with tag**: 生成 tag 并 release 到 GitHub，并推送到 DockerHub。
- **阶段 8. Deploy to production**:  将发布的 tag 部署到 Production 环境。

{{</ notice >}}

## 动手实验

### 步骤 1: 创建凭证

1. 用项目普通用户 (`project-regular`) 登陆 KubeSphere 控制台。转到您的 DevOps 项目，然后在**工程管理**下的**凭证**中创建以下凭据。 有关如何创建凭证的更多信息，请参阅[凭证管理](../../../devops-user-guide/how-to-use/credential-management/).

   {{< notice note >}}

   如果您的帐户或密码中包含任何特殊字符，例如 `@` 和 `$`，它们可能会在流水线运行时导致错误，因为它们可能无法识别。 在这种情况下，您需要先在某些第三方网站（例如 [urlencoder](https://www.urlencoder.org/) ） 上对帐户或密码进行编码。 之后，复制并粘贴输出以获取您的凭证信息。

   {{</ notice >}}

   | 凭证 ID   | 类型              | 用途 |
   | --------------- | ------------------- | ------------ |
   | dockerhub-id    | 账户凭证 | Docker Hub   |
   | github-id       | 账户凭证 | GitHub       |
   | demo-kubeconfig | kubeconfig          | Kubernetes   |

2. 您需要为 SonarQube 创建一个附加的凭证 ID（`sonar-token`），该 ID 在上述第3阶段 （SonarQube 分析）中使用。 请参阅[为新项目创建 SonarQube Token](../../../devops-user-guide/how-to-integrate/sonarqube/#create-sonarqube-token-for-new-project)，以将Token 填入以下 `token/ 密码`字段。 单击**确定**完成。

   ![sonar-token](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/sonar-token.png)

3. 列表中总共有四个凭证。

   ![credential-list](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/credential-list.png)

### 步骤 2: 在 GitHub 仓库库中修改 Jenkinsfile

1. 登录GitHub。 从 GitHub 仓库中将 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) fork 到您自己的 GitHub 帐户。

   ![fork-github-repo](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/fork-github-repo.png)

2. 在您自己的GitHub 仓库 **devops-java-sample** 中，单击根目录中的文件 `Jenkinsfile-online`。

   ![jenkins-edit-1](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/jenkins-edit-1.png)

3. 单击右侧的编辑图标编辑环境变量。

   ![jenkins-edit-2](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/jenkins-edit-2.png)

   | 修改项 | 值 | 含义 |
   | :--- | :--- | :--- |
   | DOCKER\_CREDENTIAL\_ID | dockerhub-id | 填写创建凭证步骤中 DockerHub **凭证 ID**，用于登录您的 DockerHub |
   | GITHUB\_CREDENTIAL\_ID | github-id | 您在 KubeSphere 中为 GitHub 帐户设置的**凭证 ID**。 它用于将标签推送到您的 GitHub 仓库。 |
   | KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig | 您在 KubeSphere 中为 kubeconfig 设置的**凭证 ID**。 它用于访问运行中的 Kubernetes 集群。 |
   | REGISTRY | docker.io | 默认为 **docker.io**，用作推送镜像的地址。 |
   | DOCKERHUB\_NAMESPACE | your-dockerhub-account | 替换为您的 DockerHub 账号名(它也可以是账户下的 Organization 名称) |
   | GITHUB\_ACCOUNT | your-github-account | 替换为您的 GitHub 账号名，例如 地址是 `https://github.com/kubesphere/`则填写 `kubesphere` (它也可以是账户下的 Organization 名称) |
   | APP\_NAME | devops-java-sample | 应用名称 |
   | SONAR\_CREDENTIAL\_ID | sonar-token | 填写创建凭证步骤中的 SonarQube token **凭证 ID**，用于代码质量检测 |

   {{< notice note >}}

   Jenkinsfile 中 mvn 命令的参数 -o，表示开启离线模式。本教程中已经下载了相关的依存关系，以节省时间并适应某些环境中的网络干扰。 离线模式默认情况下处于启用状态。

   {{</ notice >}}

4. 编辑环境变量后，单击页面底部的 **Commit changes**，这将更新 SonarQube 分支中的文件。

   ![commit-changes](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/commit-changes.png)

### 步骤 3: 创建项目

您需要创建两个项目，例如`kubesphere-sample-dev` 和 `kubesphere-sample-prod`，分别代表开发环境和生产环境。 一旦流水线成功运行，将在这两个项目中自动创建应用程序的相关部署和服务。

{{< notice note >}}

帐户 `project-admin` 需要提前创建，因为它是 CI/CD 流水线的审核者。 有关更多信息，请参见[创建工作区，项目，帐户和角色](../../../quick-start/create-workspace-and-project/)。

{{</ notice >}}

1. 使用 `project-admin` 帐户登录KubeSphere。 在相同的企业空间 (workspace) 创建下两个 DevOps 项目。确保`project-regular`账户以`项目维护者`角色被邀请到该项目。

   | 项目名称          | 别名                   |
   | ---------------------- | ----------------------- |
   | kubesphere-sample-dev  | development environment |
   | kubesphere-sample-prod | production environment  |

2. 检查项目列表。 您有两个项目和一个DevOps项目，如下所示：

   ![project-list](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/project-list.png)

### 步骤 4: 创建流水线

1. 注销登陆 KubeSphere，然后用`project-regular`账户重新登录，跳转到 DevOps 工程 `demo-devops`，然后单击**创建**构建新流水线。

   ![create-pipeline](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/create-pipeline.png)

2. 在出现的对话框中填入基本信息。 将其命名为 `jenkinsfile-in-scm` 并选择一个代码存储库。

   ![create-pipeline-2](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/create-pipeline-2.png)

3. 如果您没有 GitHub Token ,在 **GitHub** 选项卡中，单击 **Get Token** 生成一个新的 GitHub Token。 将 Token 粘贴到框中，然后单击**确认**。

   ![generate-github-token-1](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/generate-github-token-1.png)

   ![generate-github-token-2](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/generate-github-token-2.png)

4. 选择您的 GitHub 帐户。 与该 token 相关的所有仓库将在右侧列出。 选择 **devops-java-sample** 并单击 **Select this repo**。 单击**下一步**继续。

   ![select-repo](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/select-repo.png)

5. 在**高级设置**中，选中**丢弃旧的分支**旁边的方框。 在本教程中，参数**值保留分支的天数**和**保留分支的最大个数**可以使用默认。

   ![branch-settings](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/branch-settings.png)

   丢弃旧分支意味着您将一起丢弃分支记录。 分支记录包括控制台输出，已归档工件以及特定分支的其他相关元数据。 更少的分支意味着您可以节省 Jenkins 正在使用的磁盘空间。 KubeSphere 提供了两个选项来确定何时丢弃旧分支：

   - 保留分支的天数：在一定天数之后，分支将被丢弃。

   - 保留分支的最大个数：分支达到一定数量后，最旧的分支将被丢弃。

   {{< notice note >}}

   **值保留分支的天数**和**保留分支的最大个数** 可以同时应用于分支。 只要某个分支的保留天数和个数不满足任何一个设置的条件，则将丢弃该分支。假设设置的保留天数和个数为 2 和 3，则分支的保留天数一旦超过 2 或者保留个数超过 3，则将丢弃该分支。默认两个值为 -1，表示将会丢弃已经被删除的分支。

   {{</ notice >}}

6. 在**行为策略**中，默认情况下，KubeSphere 提供三种策略。 由于本示例还未用到 **从 Fork 仓库中发现 PR** 这条策略，此处可以删除该策略，点击右侧删除按钮删除即可。

   ![remove-behavioral-strategy](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/remove-behavioral-strategy.png)

   在 Jenkins 流水线被触发时，开发者提交的 PR（Pull Request）也将被视为一个单独的分支。

   **发现分支**

   - **排除也作为 PR 提交的分支**. 选择此项表示 CI 将不会扫描源分支 (比如 Origin 的 master branch)，也就是需要被 merge 的分支。
   - **只有被提交为 PR 的分支**. 仅扫描 PR 分支。
   - **所有分支** 拉取的仓库 (origin) 中所有的分支。

   **从原仓库中发现 PR**

   - **PR 与目标分支合并后的源代码版本**. PR 合并到目标分支后，将基于源代码创建并运行流水线。
   - **PR 本身的源代码版本**. 根据 PR 本身的源代码创建并运行流水线。
   - **发现PR时会创建两个流水线**. KubeSphere 创建两个流水线，一个基于 PR 合并到目标分支后的源代码，另一个基于 PR 本身的源代码。

7. 向下滚动到**脚本路径**。 该字段指定代码仓库中的 Jenkinsfile 路径。 它指示存储库的根目录。 如果文件位置更改，则脚本路径也需要更改。 请将其更改为 Jenkinsfile-online，这是位于根目录中的示例仓库中 Jenkinsfile 的文件名。

   ![jenkinsfile-online](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/jenkinsfile-online.png)

8. 在 **扫描 Repo Trigger**, 单击 **如果没有扫描触发，则定期扫描**间隔 设置为 **5 分钟**。 单击**创建**完成配置。

   ![advanced-setting](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/advanced-setting.png)

   {{< notice note >}}

   您可以设置特定的时间间隔以允许流水线周期性地扫描远程仓库，这样就可以根据您在**行为策略**中设置的策略检测仓库有没有代码更新或新的 PR。

   {{</ notice >}}

### 步骤 5: 运行流水线

1. 创建流水线后，它将显示在下面的列表中。 单击它转到其详细信息页面。

   ![pipeline-list](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/pipeline-list.png)

2. 在**活动**选项卡下, 三个分支正在扫描中。 单击右侧的**运行**，流水线将根据您设置的行为策略运行。 从下拉列表中选择 **sonarqube**，然后添加标签号，例如 v0.0.2。 单击**确定**触发新活动。

   ![pipeline-detail](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/pipeline-detail.png)

   ![tag-name](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/tag-name.png)

   {{< notice note >}}

   - 如果确实需要在此页面上看到任何活动，则需要手动刷新浏览器或从下拉菜单中单击**扫描仓库**（**更多操作**按钮）。
   - 标签名称用于在 GitHub 和 Docker Hub 中使用标签生成发布和镜像。 现有标签名称不能再次用于字段 TAG_NAME。 否则，流水线将无法成功运行。

   {{</ notice >}}

3. 请稍等片刻，您会看到一些活动停止而某些失败。 单击第一个以查看详细信息。

   ![activity-failure](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/activity-failure.png)

   {{< notice note >}}

   队列失败可能是由不同的因素引起的。 在此示例中，在上述步骤中编辑分支环境变量时，仅更改了 sonarqube 分支的 Jenkinsfile。 相反，依赖项和 master 分支中的这些变量保持不变（即，错误的 GitHub 和 Docker Hub 帐户），从而导致失败。 您可以单击它并检查其日志以查看详细信息。 失败的其他原因可能是网络问题、Jenkinsfile 中的编码不正确等等。

   {{</ notice >}}

4. 流水线在 `deploy to dev` 阶段暂停,您需要手动单击**继续**。请注意，在 Jenkinsfile 中分别定义了三个阶段 `deploy to dev`、`push with tag` 和 `deploy to production` ，因此将对流水线进行三次审核。
   ![pipeline-proceed](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/pipeline-proceed.png)

   在实际开发或生产场景中，可能需要具有更高权限的管理员（例如版本管理员）来审核流水线、镜像以及代码分析结果， 他们有权决定流水线是否能进入下一阶段。在 Jenkinsfile 中， `input` 步骤可以指定用户审核流水线。如果您想指定一个用户(例如 `project-admin`) 来审核，您可以在 Jenkinsfile 的 input 函数中添加一个字段。如果是多个用户则通过逗号分隔，如下所示：

   ```groovy
   ···
   input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
   ···
   ```

### 步骤 6: 检查流水线状态

1. 在**运行状态**中，您可以查看流水线的运行方式。 请注意，流水线在刚创建后将继续初始化几分钟。 示例流水线有八个阶段，它们已在 [Jenkinsfile-online](https://github.com/kubesphere/devops-java-sample/blob/sonarqube/Jenkinsfile-online) 中单独定义。

   ![inspect-pipeline-log-1](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/inspect-pipeline-log-1.png)

2. 通过单击右上角的**查看日志**来检查流水线运行日志。 您可以看到流水线的动态日志输出，包括任何可能导致流水线无法运行的错误。对于每个阶段，您都可以单击它检查日志，而且可以将其下载到本地计算机以进行进一步分析。

   ![inspect-pipeline-log-2](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/inspect-pipeline-log-2.png)

### 步骤 7: 验证结果

1. 成功完成流水线后，单击**代码质量**通过 SonarQube 检查结果，如下所示。

   ![sonarqube-result-detail-1.png](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/sonarqube-result-detail-1.png)

   ![sonarqube-result-detail](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/sonarqube-result-detail.png)

2. 正如在 Jenkinsfile 中定义的那样，通过流水线构建的 Docker 镜像也已成功推送到 Docker Hub。 在 Docker Hub 中，您会找到带有标签 v0.0.2 的镜像，该镜像是在流水线运行之前指定的。

   ![docker-hub-result](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/docker-hub-result.png)

3. 同时，在 GitHub 中生成了一个新标签和一个新版本。

   ![github-result](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/github-result.png)

4. 示例应用程序将部署到 `kubesphere-sample-dev` 和 `kubesphere-sample-prod`，并创建相应的 Deployments 和 Services。 转到这两个项目，这是预期的结果：

   | 环境 | URL | Namespace | Deployment | Service |
   | :--- | :--- | :--- | :--- | :--- |
   | Development | `http://{$NodeIP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample-dev |
   | Production | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample | ks-sample |

#### Deployments

   ![pipeline-deployments](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/pipeline-deployments.png)

#### Services

   ![devops-prod](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/devops-prod.png)

   {{< notice note >}}

   您可能需要打开安全组中的端口，以便通过 URL 访问应用程序。

   {{</ notice >}}

### 步骤 8: 访问示例服务

1. 请以管理员（`admin`）身份登录 KubeSphere 并使用**工具箱**（Toolbox）中的 **web kubectl** 访问服务。转到项目 `kubesphere-sample-dev`，然后在**应用负载**下的**服务**中选择 `ks-sample-dev`。 Endpoint 可用于访问服务。

   ![sample-app-result-check](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/sample-app-result-check.png)

   ![access-endpoint](/images/docs/devops-user-guide-zh/using-devops-zh/create-a-pipeline-using-a-jenkinsfile-zh/access-endpoint.png)

2. 从右下角的**工具箱（Toolbox）** 中使用 **web kubectl** 执行以下命令：

   ```bash
   $curl 10.244.0.213:8000
   ```

3. 预期的输出:

   ```bash
   Really appreciate your star, that's the power of our life.
   ```

   {{< notice note >}}

   使用 `curl` 访问 endpoints 或者 {$Virtual IP}:{$Port} 再或者 {$Node IP}:{$NodePort}

   {{</ notice >}}

4. 同样，您可以在项目 `kubesphere-sample-prod` 中测试服务，您将看到相同的结果。

   ```bash

   $ curl 10.244.0.213:8000
   Really appreciate your star, that's the power of our life.
   ```
