---
title: "使用 GitLab 创建多分支流水线"
keywords: 'KubeSphere, Kubernetes, GitLab, Jenkins, 流水线'
description: '了解如何使用 GitLab 在 KubeSphere 上创建多分支流水线。'
linkTitle: "使用 GitLab 创建多分支流水线"
weight: 11291
---

[GitLab](https://about.gitlab.com/) is an open source code repository platform that provides public and private repositories. It is a complete DevOps platform that enables professionals to perform their tasks in a project.

[GitLab](https://about.gitlab.com/) 是一个提供公有和私有仓库的开源代码仓库平台，也是一个完整的 DevOps 平台，专业人士能够使用 GitLab 在项目中执行任务。

In KubeSphere v3.1, you can create a multi-branch pipeline with GitLab in your DevOps project. This tutorial demonstrates how to create a multi-branch pipeline with GitLab.

在 KubeSphere v3.1 种，您可以使用 GitLab 在您的 DevOps 工程中创建多分支流水线。本教程介绍如何使用 GitLab 创建多分支流水线。

## 准备工作

- 您需要准备一个 [GitLab](https://gitlab.com/users/sign_in) 帐户以及一个 [Docker Hub](https://hub.docker.com/) 帐户。
- 您需要[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要创建一个企业空间、一个 DevOps 项目以及一个帐户 (`project-regular`)，该帐户必须被邀请至该 DevOps 工程中并赋予 `operator` 角色。有关更多信息，请参考[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

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

2. 创建完成后，您可以在列表中看到所有凭证。

   ![credential-created](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/credential-created.png)

### 步骤 2：在 GitLab 仓库中编辑 Jenkinsfile

1. Log in to GitLab and create a public project. Click **Import project/repository**, select **Repo by URL** to enter the URL of [devops-java-sample](https://github.com/kubesphere/devops-java-sample), select **Public** for **Visibility Level**, and then click **Create project**.登录 GitLab 并创建一个公有项目。点击

   ![click-import-project](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/click-import-project.png)

   ![use-git-url](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/use-git-url.png)

2. In the project just created, create a new branch from the master branch and name it `gitlab-demo`.在刚刚创建的项目中，从 master 分支创建一个新分支，命名为 `gitlab-demo`。

   ![new-branch](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/new-branch.png)

3. In the `gitlab-demo` branch, click the file `Jenkinsfile-online` in the root directory.在 `gitlab-demo` 分支中，点击根目录中的 `Jenkinsfile-online` 文件。

   ![click-jenkinsfile](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/click-jenkinsfile.png)

4. Click **Edit**, change `GITHUB_CREDENTIAL_ID`, `GITHUB_ACCOUNT`, and `@github.com` to `GITLAB_CREDENTIAL_ID`, `GITLAB_ACCOUNT`, and `@gitlab.com` respectively, and then edit the following items. You also need to change the value of `branch` in the `push latest` and `deploy to dev` stages to `gitlab-demo`.点击**编辑**，分别将 `GITHUB_CREDENTIAL_ID`、`GITHUB_ACCOUNT` 以及 `@github.com` 更改为 `GITLAB_CREDENTIAL_ID`、`GITLAB_ACCOUNT` 以及 `@gitlab.com`，然后编辑以下条目。您还需要将 `push latest` 和 `deploy to dev` 中 `branch` 的值更改为 `gitlab-demo`。

   | 条目                 | 值        | 描述信息                                                     |
   | -------------------- | --------- | ------------------------------------------------------------ |
   | GITLAB_CREDENTIAL_ID | gitlab-id | The **Credential ID** you set in KubeSphere for your GitLab account. It is used to push tags to your GitLab repository. |
   | DOCKERHUB_NAMESPACE  | felixnoo  | Replace it with your Docker Hub’s account name. It can be the Organization name under the account. |
   | GITLAB_ACCOUNT       | felixnoo  | Replace it with your GitLab account name. It can also be the account’s Group name. |

   {{< notice note >}}

   有关 Jenkinsfile 中环境变量的更多信息，请参考[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/#step-2-modify-the-jenkinsfile-in-your-github-repository)。

   {{</ notice >}}

5. Click **Commit changes** to update this file.点击 **Commit changes** 更新该文件。

   ![commit-changes](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/commit-changes.png)

### 步骤 3：创建项目

You need to create two projects, such as `kubesphere-sample-dev` and `kubesphere-sample-prod`, which represent the development environment and the production environment respectively. For more information, refer to [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/#step-3-create-projects).

您需要创建两个项目，例如 `kubesphere-sample-dev` 和 `kubesphere-sample-prod`，这两个项目分别代表开发环境和测试环境。有关更多信息，请参考[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/#step-2-modify-the-jenkinsfile-in-your-github-repository)。

### 步骤 4：创建流水线

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click **Create** to create a new pipeline.

2. Provide the basic information in the dialog that appears. Name it `gitlab-multi-branch` and select a code repository.

   ![create-pipeline](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/create-pipeline.png)

3. In the **GitLab** tab, select the default option `https://gitlab.com` for GitLab Server, enter the username of the GitLab project owner for **Owner**, and then select the `devops-java-sample` repository from the drop-down list for **Repository Name**. Click the tick icon in the bottom right corner and then click **Next**.

   ![select-gitlab](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/select-gitlab.png)

   {{< notice note >}}

   If you want to use a private repository from GitLab, you need to create an access token with API and read_repository permissions on GitLab, create a credential for accessing GitLab on the Jenkins dashboard, and then add the credential in **GitLab Server** under **Configure System**. For more information about how to log in to Jenkins, refer to [Jenkins System Settings](../how-to-integrate/sonarqube/#step-5-add-the-sonarqube-server-to-jenkins).

   {{</ notice >}}

4. In the **Advanced Settings** tab, scroll down to **Script Path**. Change it to `Jenkinsfile-online` and then click **Create**. 

   ![jenkinsfile-online](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/jenkinsfile-online.png)

   {{< notice note >}}

   The field specifies the Jenkinsfile path in the code repository. It indicates the repository’s root directory. If the file location changes, the script path also needs to be changed. 

   {{</ notice >}}

### Step 5: Run a pipeline

1. After a pipeline is created, it displays in the list. Click it to go to its detail page.

2. Click **Run** on the right. In the dialog that appears, select **gitlab-demo** from the drop-down list and add a tag number such as `v0.0.2`. Click **OK** to trigger a new activity.

   ![click-run](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/click-run.png)

   ![select-branch](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/select-branch.png)

   {{< notice note >}}

   The pipeline pauses at the stage `deploy to dev`. You need to click **Proceed** manually. Note that the pipeline will be reviewed three times as `deploy to dev`, `push with tag`, and `deploy to production` are defined in the Jenkinsfile respectively.

   {{</ notice >}}

### Step 6: Check the pipeline status

1. In the **Task Status** tab, you can see how a pipeline is running. Check the pipeline running logs by clicking **Show Logs** in the top right corner.

   ![check-log](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/check-log.png)

2. You can see the dynamic log output of the pipeline, including any errors that may stop the pipeline from running. For each stage, you can click it to inspect logs, which can also be downloaded to your local machine for further analysis.

   ![pipeline-logs](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/pipeline-logs.png)

### Step 7: Verify results

1. The Docker image built through the pipeline has been successfully pushed to Docker Hub, as it is defined in the Jenkinsfile. In Docker Hub, you will find the image with the tag `v0.0.2` that is specified before the pipeline runs.

   ![docker-image](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/docker-image.png)

2. At the same time, a new tag has been generated in GitLab.

   ![gitlab-result](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/gitlab-result.png)

3. The sample application will be deployed to `kubesphere-sample-dev` and `kubesphere-sample-prod` with corresponding Deployments and Services created.

   | Environment | URL                         | Namespace              | Deployment    | Service       |
   | ----------- | --------------------------- | ---------------------- | ------------- | ------------- |
   | Development | `http://{$NodeIP}:{$30861}` | kubesphere-sample-dev  | ks-sample-dev | ks-sample-dev |
   | Production  | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample     | ks-sample     |

   ![deployment](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/deployment.png)

   ![service](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/service.png)

   {{< notice note >}}

   You may need to open the port in your security groups so that you can access the app with the URL. For more information, refer to [Access the example Service](../create-a-pipeline-using-jenkinsfile/#step-8-access-the-example-service).

   {{</ notice >}}

