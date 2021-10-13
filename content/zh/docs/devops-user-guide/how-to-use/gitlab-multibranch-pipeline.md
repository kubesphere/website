---
title: "使用 GitLab 创建多分支流水线"
keywords: 'KubeSphere, Kubernetes, GitLab, Jenkins, 流水线'
description: '了解如何使用 GitLab 在 KubeSphere 上创建多分支流水线。'
linkTitle: "使用 GitLab 创建多分支流水线"
weight: 11291
---

[GitLab](https://about.gitlab.com/) 是一个提供公开和私有仓库的开源代码仓库平台。它也是一个完整的 DevOps 平台，专业人士能够使用 GitLab 在项目中执行任务。

在 KubeSphere v3.1 中，您可以使用 GitLab 在 DevOps 工程中创建多分支流水线。本教程介绍如何使用 GitLab 创建多分支流水线。

## 准备工作

- 您需要准备一个 [GitLab](https://gitlab.com/users/sign_in) 帐户以及一个 [Docker Hub](https://hub.docker.com/) 帐户。
- 您需要[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要创建一个企业空间、一个 DevOps 项目以及一个用户 (`project-regular`)，该用户必须被邀请至该 DevOps 工程中并赋予 `operator` 角色。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：创建凭证

1. 使用 `project-regular` 用户登录 KubeSphere 控制台。转到您的 DevOps 工程，在**工程管理**下的**凭证**中创建以下凭证。有关更多如何创建凭证的信息，请参见[凭证管理](../../../devops-user-guide/how-to-use/credential-management/)。

   {{< notice note >}}

   如果您的帐户或密码中包含任何特殊字符，例如 `@` 和 `$`，则可能会因为无法识别而在流水线运行时导致错误。在此情况下，您需要先在第三方网站（例如 [urlencoder](https://www.urlencoder.org/)）上对帐户或密码进行编码，然后将输出结果复制粘贴作为您的凭证信息。

   {{</ notice >}} 

   | 凭证 ID         | 类型       | 用途       |
   | --------------- | ---------- | ---------- |
   | dockerhub-id    | 帐户凭证   | Docker Hub |
   | gitlab-id       | 帐户凭证   | GitLab     |
   | demo-kubeconfig | kubeconfig | Kubernetes |

2. 创建完成后，您可以在列表中看到创建的凭证。

   ![credential-created](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/credential-created.png)

### 步骤 2：在 GitLab 仓库中编辑 Jenkinsfile

1. 登录 GitLab 并创建一个公开项目。点击**导入项目**，选择**从 URL 导入仓库**，然后输入 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) 的 URL。可见性级别选择**公开**，然后点击**新建项目**。

   ![click-import-project](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/click-import-project.png)

   ![use-git-url](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/use-git-url.png)

2. 在刚刚创建的项目中，从 master 分支中创建一个新分支，命名为 `gitlab-demo`。

   ![new-branch](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/new-branch.png)

3. 在 `gitlab-demo` 分支中，点击根目录中的 `Jenkinsfile-online` 文件。

   ![gitlab-demo](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/gitlab-demo.png)

4. 点击**编辑**，分别将 `GITHUB_CREDENTIAL_ID`、`GITHUB_ACCOUNT` 以及 `@github.com` 更改为 `GITLAB_CREDENTIAL_ID`、`GITLAB_ACCOUNT` 以及 `@gitlab.com`，然后编辑下表所列条目。您还需要将 `push latest` 和 `deploy to dev` 中 `branch` 的值更改为 `gitlab-demo`。

   | 条目                 | 值        | 描述信息                                                     |
   | -------------------- | --------- | ------------------------------------------------------------ |
   | GITLAB_CREDENTIAL_ID | gitlab-id | 您在 KubeSphere 中为自己的 GitLab 帐户设置的**凭证 ID**，用于推送标签至您的 GitLab 仓库。 |
   | DOCKERHUB_NAMESPACE  | felixnoo  | 请将其替换为您自己的 Docker Hub 帐户名称，也可以使用该帐户下的组织名称。 |
   | GITLAB_ACCOUNT       | felixnoo  | 请将其替换为您自己的 GitLab 帐户名称，也可以使用该帐户的用户组名称。 |

   {{< notice note >}}

   有关 Jenkinsfile 中环境变量的更多信息，请参考[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/#步骤-2在-github-仓库中修改-jenkinsfile)。

   {{</ notice >}}

5. 点击 **Commit changes** 更新该文件。

   ![commit-changes](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/commit-changes.png)

### 步骤 3：创建项目

您需要创建两个项目，例如 `kubesphere-sample-dev` 和 `kubesphere-sample-prod`，这两个项目分别代表开发环境和测试环境。有关更多信息，请参考[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/#步骤-3创建项目)。

### 步骤 4：创建流水线

1. 使用 `project-regular` 用户登录 KubeSphere Web 控制台。转到您的 DevOps 工程，点击**创建**来创建新流水线。

2. 在出现的对话框中填写基本信息。将流水线的名称设置为 `gitlab-multi-branch` 并选择一个代码仓库。

   ![create-pipeline](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/create-pipeline.png)

3. 在 **GitLab** 选项卡下的 **GitLab 服务**中选择默认选项 `https://gitlab.com`，在**项目所属组**中输入该 GitLab 项目所属组的名称，然后从**仓库名称**的下拉菜单中选择 `devops-java-sample` 仓库。点击右下角的对号图标，然后点击**下一步**。

   ![select-gitlab](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/select-gitlab.png)

   {{< notice note >}}

   如需使用 GitLab 私有仓库，则须在 GitLab 上创建拥有 API 和 read_repository 权限的个人访问令牌，在 Jenkins 面板上创建访问 GitLab 的凭证，然后在**系统配置**下的 **GitLab 服务**中添加该凭证。有关如何登录 Jenkins 的更多信息，请参考 [Jenkins 系统设置](../jenkins-setting/#登录-jenkins-重新加载配置)。

   {{</ notice >}}

4. 在**高级设置**选项卡中，下滑到**脚本路径**。将其更改为 `Jenkinsfile-online` 然后点击**创建**。

   ![jenkinsfile-online](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/jenkinsfile-online.png)

   {{< notice note >}}

   该字段指定代码仓库中的 Jenkinsfile 路径，它表示该仓库的根目录。如果文件位置变更，则脚本路径也需要更改。

   {{</ notice >}}

### 步骤 5：运行流水线

1. 流水线创建后，会展示在列表中。点击流水线查看其详情页。

2. 点击右侧的**运行**。在出现的对话框中，从下拉菜单中选择 **gitlab-demo** 并添加一个标签号，比如 `v0.0.2`。点击**确定**来触发一个新活动。

   ![click-run](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/click-run.png)

   ![select-branch](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/select-branch.png)

   {{< notice note >}}

   流水线在 `deploy to dev` 阶段暂停，您需要手动点击**继续**。请注意，在 Jenkinsfile 中分别定义了三个阶段 `deploy to dev`、`push with tag` 和 `deploy to production`，因此将对流水线进行三次审核。

   {{</ notice >}}

### 步骤 6：检查流水线状态

1. 在**运行状态**选项卡，您可以看到流水线的运行过程。点击右上角的**查看日志**来查看流水线运行日志。

   ![check-log](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/check-log.png)

2. 您可以看到流水线的动态日志输出，包括可能导致流水线无法运行的错误。对于每个阶段，您都可以点击该阶段来查看日志，而且可以将日志下载到本地计算机进行进一步分析。

   ![pipeline-logs](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/pipeline-logs.png)

### 步骤 7：验证结果

1. 如在 Jenkinsfile 中定义的那样，通过流水线构建的 Docker 镜像已成功推送到 Docker Hub。在 Docker Hub 中，您将看到在流水线运行前指定的带有标签 `v0.0.2` 的镜像。

   ![docker-image](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/docker-image.png)

2. 同时，GitLab 中也已生成一个新标签。

   ![gitlab-result](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/gitlab-result.png)

3. 示例应用程序将会被部署至 `kubesphere-sample-dev` 和 `kubesphere-sample-prod` 中，也会创建相应的部署和服务。

   | 环境     | URL                         | 命名空间               | 部署          | 服务          |
   | -------- | --------------------------- | ---------------------- | ------------- | ------------- |
   | 开发环境 | `http://{$NodeIP}:{$30861}` | kubesphere-sample-dev  | ks-sample-dev | ks-sample-dev |
   | 生产环境 | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample     | ks-sample     |

   ![deployment](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/deployment.png)

   ![service](/images/docs/zh-cn/devops-user-guide/use-devops/gitlab-multibranch-pipeline/service.png)

   {{< notice note >}}

   您可能需要在安全组中打开端口，以便使用 URL 访问该应用。有关更多信息，请参考[访问示例服务](../create-a-pipeline-using-jenkinsfile/#步骤-8访问示例服务)。

   {{</ notice >}}

