---
title: "Create a Multi-branch Pipeline with GitLab"
keywords: 'KubeSphere, Kubernetes, GitLab, Jenkins, Pipelines'
description: 'Learn how to create a multi-branch pipeline with GitLab on KubeSphere.'
linkTitle: "Create a Multi-branch Pipeline with GitLab"
weight: 11291
---

[GitLab](https://about.gitlab.com/) is an open source code repository platform that provides public and private repositories. It is a complete DevOps platform that enables professionals to perform their tasks in a project.

In KubeSphere v3.1, you can create a multi-branch pipeline with GitLab in your DevOps project. This tutorial demonstrates how to create a multi-branch pipeline with GitLab.

## Prerequisites

- You need to have a [GitLab](https://gitlab.com/users/sign_in) account and a [Docker Hub](https://hub.docker.com/) account.
- You need to [enable the KubeSphere DevOps system](../../../pluggable-components/devops/).
- You need to create a workspace, a DevOps project and a user (`project-regular`). This account must be invited to the DevOps project with the `operator` role. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Create credentials

1. Log in to the KubeSphere console as `project-regular`. Go to your DevOps project and create the following credentials in **Credentials** under **Project Management**. For more information about how to create credentials, see [Credential Management](../../../devops-user-guide/how-to-use/credential-management/).

   {{< notice note >}}

   If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.

   {{</ notice >}} 

   | Credential ID   | Type                | Where to use |
   | --------------- | ------------------- | ------------ |
   | dockerhub-id    | Account Credentials | Docker Hub   |
   | gitlab-id       | Account Credentials | GitLab       |
   | demo-kubeconfig | kubeconfig          | Kubernetes   |

2. After creation, you can see the credentials in the list.

   ![credential-created](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/credential-created.png)

### Step 2: Modify the Jenkinsfile in your GitLab repository

1. Log in to GitLab and create a public project. Click **Import project/repository**, select **Repo by URL** to enter the URL of [devops-java-sample](https://github.com/kubesphere/devops-java-sample), select **Public** for **Visibility Level**, and then click **Create project**.

   ![click-import-project](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/click-import-project.png)

   ![use-git-url](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/use-git-url.png)

2. In the project just created, create a new branch from the master branch and name it `gitlab-demo`.

   ![new-branch](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/new-branch.png)

3. In the `gitlab-demo` branch, click the file `Jenkinsfile-online` in the root directory.

   ![click-jenkinsfile](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/click-jenkinsfile.png)

4. Click **Edit**, change `GITHUB_CREDENTIAL_ID`, `GITHUB_ACCOUNT`, and `@github.com` to `GITLAB_CREDENTIAL_ID`, `GITLAB_ACCOUNT`, and `@gitlab.com` respectively, and then edit the following items. You also need to change the value of `branch` in the `push latest` and `deploy to dev` stages to `gitlab-demo`.

   | Item                 | Value     | Description                                                  |
   | -------------------- | --------- | ------------------------------------------------------------ |
   | GITLAB_CREDENTIAL_ID | gitlab-id | The **Credential ID** you set in KubeSphere for your GitLab account. It is used to push tags to your GitLab repository. |
   | DOCKERHUB_NAMESPACE  | felixnoo  | Replace it with your Docker Hub’s account name. It can be the Organization name under the account. |
   | GITLAB_ACCOUNT       | felixnoo  | Replace it with your GitLab account name. It can also be the account’s Group name. |

   {{< notice note >}}

   For more information about the environment variables in the Jenkinsfile, refer to [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/#step-2-modify-the-jenkinsfile-in-your-github-repository).

   {{</ notice >}}

5. Click **Commit changes** to update this file.

   ![commit-changes](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/commit-changes.png)

### Step 3: Create projects

You need to create two projects, such as `kubesphere-sample-dev` and `kubesphere-sample-prod`, which represent the development environment and the production environment respectively. For more information, refer to [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/#step-3-create-projects).

### Step 4: Create a pipeline

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click **Create** to create a new pipeline.

2. Provide the basic information in the dialog that appears. Name it `gitlab-multi-branch` and select a code repository.

   ![create-pipeline](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/create-pipeline.png)

3. In the **GitLab** tab, select the default option `https://gitlab.com` for GitLab Server, enter the username of the GitLab project owner for **Owner**, and then select the `devops-java-sample` repository from the drop-down list for **Repository Name**. Click the tick icon in the bottom-right corner and then click **Next**.

   ![select-gitlab](/images/docs/devops-user-guide/using-devops/gitlab-multibranch-pipeline/select-gitlab.png)

   {{< notice note >}}

   If you want to use a private repository from GitLab, you need to create an access token with API and read_repository permissions on GitLab, create a credential for accessing GitLab on the Jenkins dashboard, and then add the credential in **GitLab Server** under **Configure System**. For more information about how to log in to Jenkins, refer to [Jenkins System Settings](../jenkins-setting/#log-in-to-jenkins-to-reload-configurations).

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

1. In the **Task Status** tab, you can see how a pipeline is running. Check the pipeline running logs by clicking **Show Logs** in the top-right corner.

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

