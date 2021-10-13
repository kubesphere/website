---
title: "流水线设置"
keywords: 'KubeSphere, Kubernetes, Docker, Jenkins, 流水线'
description: '了解 DevOps 工程中流水线的各个属性。'
linkTitle: "流水线设置"
weight: 11280
---

创建流水线时，可以通过各种设置来自定义流水线配置。本文档对这些设置进行详细阐述。

## 准备工作

- 您需要创建一个企业空间、一个 DevOps 工程以及一个用户 (`project-regular`)，必须邀请该帐户至该 DevOps 工程中并赋予 `operator` 角色。有关更多信息，请参考[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 您需要[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。

## 流水线设置

### 基本信息

![basic-info-tab1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/basic-info-tab1.png)

在**基本信息**选项卡，您可以自定义以下信息：

- **名称**：流水线的名称，同一个 DevOps 工程内的流水线不能重名。

- **项目**：项目将根据工程资源进行分组，可以按工程对资源进行查看管理。

- **描述信息**：描述流水线的附加信息，描述信息不超过 256 个字符。

- **代码仓库（选填）**：您可以选择一个代码仓库作为流水线的代码源。在 KubeSphere v3.1 中，您可以选择 GitHub、GitLab、Bitbucket、Git 以及 SVN 作为代码源。

  {{< tabs >}}

  {{< tab "GitHub" >}}

  ![code-source-github1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/code-source-github1.png)

  如果选择 **GitHub**，则必须指定用于访问 GitHub 的令牌 (Token)。如果您已预先使用您的 GitHub 令牌创建了凭证，则可以从下拉菜单中选择已有凭证，或者点击**新建凭证**来创建新凭证。选择令牌后，点击**确认**，即可在右侧查看您的仓库。完成所有操作后，记得点击 **√** 图标。

  {{</ tab >}}

  {{< tab "GitLab" >}}

  ![code-source-gitlab1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/code-source-gitlab1.png)

  如果选择 **GitLab**，则必须指定 GitLab 服务、项目所属组和仓库名称。如果获取仓库代码需要凭证，则需要指定一个凭证。完成所有操作后，记得点击 **√** 图标。

  {{</ tab >}}

  {{< tab "Bitbucket" >}}

  ![code-source-bitbucket1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/code-source-bitbucket1.png)

  如果选择 **Bitbucket**，则需要输入您的 Bitbucket Server。您可以预先使用您的 Bitbucket 用户名和密码创建一个凭证，或者点击**创建凭证**来创建一个新凭证。输入信息后点击**确认**，即可在右侧看到您的仓库。完成所有操作后，记得点击 **√** 图标。

  {{</ tab >}}

  {{< tab "Git" >}}

  ![code-source-git1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/code-source-git1.png)

  如果选择 **Git**，则需要指定仓库 URL。如果获取仓库代码需要凭证，则需要指定一个凭证。您也可以点击**新建凭证**来添加新凭证。完成所有操作后，记得点击 **√** 图标。

  {{</ tab >}}

  {{< tab "SVN" >}}

  ![code-source-svn1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/code-source-svn1.png)

  如果选择 **SVN**，则需要指定远程仓库地址和凭证。您也可以按需指定包括分支和排除分支。完成所有操作后，记得点击 **√** 图标。

  {{</ tab >}}

  {{</ tabs >}}

### 选择代码仓库后进行高级设置

如果您已选择一个代码仓库，则可以在**高级设置**选项卡上自定义以下配置：

**分支设置**

![branch-settings1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/branch-settings1.png)

**丢弃旧的分支**意味着分支记录将一起被丢弃。分支记录包括控制台输出、存档制品以及与特定分支相关的其他元数据。保留较少的分支可以节省 Jenkins 所使用的磁盘空间。KubeSphere 提供两个选项来确定何时丢弃旧的分支：

- **保留分支的天数**：如果分支达到保留的天数，将进行删除。

- **保留分支的最大个数**：如果分支达到保留的个数，将删除最旧的分支。

  {{< notice note >}}

  **保留分支的天数**和**保留分支的最大个数**同时适用于分支。只要分支满足任一字段的条件，则将被丢弃。例如，如果将保留分支的天数指定为 2，将保留分支的最大个数指定为 3，那么超过任一数目的分支将被丢弃。KubeSphere 默认用 -1 预先填充这两个字段，这意味着删除的分支将被丢弃。

  {{</ notice >}}

**行为策略**

![behavioral-strategy1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/behavioral-strategy1.png)

在**行为策略**中，KubeSphere 默认提供四种策略。Jenkins 流水线运行时，开发者提交的 PR (Pull Request) 也将被视为单独的分支。

**发现分支**

- **排除也作为 PR 提交的分支**：不像扫描原仓库 master 分支那样扫描源分支，这些分支需要合并。
- **只有被提交为 PR 的分支**：只扫描 PR 分支。
- **所有分支**：从原仓库中拉取所有分支。

**发现 Tag 分支**

- **启用发现 Tag 分支**：拥有指定标签 (Tag) 的分支将会被扫描。
- **停用发现 Tag 分支**：拥有指定标签的分支将不会被扫描。

**从原仓库中发现 PR**

- **PR 与目标分支合并后的源代码版本**：PR 合并到目标分支后，将基于源代码创建并运行流水线。
- **PR 本身的源代码版本**：根据 PR 本身的源代码创建并运行流水线。
- **当 PR 被发现时会创建两个流水线**：KubeSphere 会创建两个流水线，一个流水线使用 PR 本身的源代码版本，一个流水线使用 PR 与目标分支合并后的源代码版本。

**从 Fork 仓库中发现 PR**

- **PR 与目标分支合并后的源代码版本**：PR 合并到目标分支后，将基于源代码创建并运行流水线。
- **PR 本身的源代码版本**：根据 PR 本身的源代码创建并运行流水线。
- **当 PR 被发现时会创建两个流水线**：KubeSphere 会创建两个流水线，一个流水线使用 PR 本身的源代码版本，一个流水线使用 PR 与目标分支合并后的源代码版本。
- **贡献者**：对 PR 做出贡献的用户。
- **所有人**：每个可以访问 PR 的用户。
- **管理员或有编辑权限的用户**：仅限于对 PR 具有管理员或编辑权限的用户。
- **无**：如果选择此选项，那么无论在**拉取策略**中选择了哪个选项，都不会发现 PR。

**脚本路径**

![script-path1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/script-path1.png)

**脚本路径**字段指定代码仓库中的 Jenkinsfile 路径，它指代仓库的根目录。如果文件位置发生更改，则脚本路径也需要更改。

**扫描 Repo Trigger**

![scan-repo-trigger1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/scan-repo-trigger1.png)

您可以勾选**启用正则表达式，将忽略与提供的正则表达式不匹配的名称（包括分支与 PR 等）**，指定一个正则表达式作为扫描分支的触发器。

您也可以勾选**如果没有扫描出发，则定期扫描**，并从下拉列表中设置扫描时间间隔。

**构建触发器**

![build-trigger1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/build-trigger1.png)

您可以从**当创建流水线**和**当删除流水线**的下拉列表中选择一个流水线，以便在创建新的流水线或删除流水线时自动触发指定流水线中的任务。

**Git 克隆参数**

![git-clone-options1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/git-clone-options1.png)

- **克隆深度**：克隆时需要提取的 commit 数量。
- **流水线 clone 超时时间（单位：分钟）**：完成克隆过程所需要的时长（以分钟为单位）。
- **是否开启浅克隆**：如果您开启浅克隆，则克隆的代码不会包含标签。

**Webhook 推送**

![webhook-push1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/webhook-push1.png)

**Webhook 推送**能有效地让流水线发现远程代码仓库中的更改，并自动触发新一轮运行。Webhook 应成为触发 Jenkins 自动扫描 GitHub 和 Git（例如 GitLab）的主要方法。

### 不选择代码仓库后进行高级设置

如果不选择代码仓库，则可以在**高级设置**选项卡上自定义以下配置：

**构建设置**

![build-settings1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/build-settings1.png)

**丢弃旧的构建**确定何时应丢弃分支下的构建记录。构建记录包括控制台输出、存档制品以及与特定构建相关的其他元数据。保留较少的构建可以节省 Jenkins 所使用的磁盘空间。KubeSphere 提供两个选项来确定应何时丢弃旧的构建：

- **保留构建的天数**：如果构建达到保留的天数，将进行删除。

- **保留构建的最大个数**：如果构建超过一定的数量，将丢弃最旧的构建。

  {{< notice note >}}

  这两个条件同时适用于构建。如果首先满足任一条件，构建将会被删除。

  {{</ notice >}}

- **不允许并发构建**：如果勾选此选项，则不能并发运行多个构建。

**参数化构建**

![parametric-build1](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/parametric-build1.png)

参数化的构建过程允许您在开始运行流水线时传入一个或多个参数。KubeSphere 默认提供五种参数类型，包括**字符串参数 (String)**、**文本 (Text)**、**布尔值 (Boolean)**、**选项参数 (Choice)** 以及**密码参数 (Password)**。当参数化项目时，构建会被替换为参数化构建，其中将提示用户为每个定义的参数输入值。

**构建触发器**

![build-trigger--2](/images/docs/zh-cn/devops-user-guide/use-devops/pipeline-settings/build-trigger--2.png)

- **定时构建**：允许定期执行构建。您可以点击 **CRON** 来参照详细的 cron 语法。
- **触发远程构建（例如，使用脚本）**：如果您需要访问预定义的 URL 来远程触发构建，则必须勾选该选项并提供身份验证令牌，这样只有拥有令牌的用户才能远程触发构建。







