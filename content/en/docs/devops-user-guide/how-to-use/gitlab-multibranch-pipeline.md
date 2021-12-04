---
title: "Create a Multi-branch Pipeline with GitLab"
keywords: 'KubeSphere, Kubernetes, GitLab, Jenkins, Pipelines'
description: 'Learn how to create a multi-branch pipeline with GitLab on KubeSphere.'
linkTitle: "Create a Multi-branch Pipeline with GitLab"
weight: 11291
---

[GitLab](https://about.gitlab.com/) is an open source code repository platform that provides public and private repositories. It is a complete DevOps platform that enables professionals to perform their tasks in a project.

In KubeSphere 3.1.x and later, you can create a multi-branch pipeline with GitLab in your DevOps project. This tutorial demonstrates how to create a multi-branch pipeline with GitLab.

## Prerequisites

- You need to have a [GitLab](https://gitlab.com/users/sign_in) account and a [Docker Hub](https://hub.docker.com/) account.
- You need to [enable the KubeSphere DevOps system](../../../pluggable-components/devops/).
- You need to create a workspace, a DevOps project and a user (`project-regular`). This user must be invited to the DevOps project with the `operator` role. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Create credentials

1. Log in to the KubeSphere console as `project-regular`. Go to your DevOps project and create the following credentials in **Credentials** under **DevOps Project Settings**. For more information about how to create credentials, see [Credential Management](../../../devops-user-guide/how-to-use/credential-management/).

   {{< notice note >}}

   If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.

   {{</ notice >}} 

   | Credential ID   | Type                | Where to use |
   | --------------- | ------------------- | ------------ |
   | dockerhub-id    | Account Credentials | Docker Hub   |
   | gitlab-id       | Account Credentials | GitLab       |
   | demo-kubeconfig | kubeconfig          | Kubernetes   |

2. After creation, you can see the credentials in the list.

### Step 2: Modify the Jenkinsfile in your GitLab repository

1. Log in to GitLab and create a public project. Click **Import project/repository**, select **Repo by URL** to enter the URL of [devops-maven-sample](https://github.com/kubesphere/devops-maven-sample), select **Public** for **Visibility Level**, and then click **Create project**.

2. In the project just created, create a new branch from the master branch and name it `gitlab-demo`.

3. In the `gitlab-demo` branch, click the file `Jenkinsfile-online` in the root directory.

4. Click **Edit**, change `GITHUB_CREDENTIAL_ID`, `GITHUB_ACCOUNT`, and `@github.com` to `GITLAB_CREDENTIAL_ID`, `GITLAB_ACCOUNT`, and `@gitlab.com` respectively, and then edit the following items. You also need to change the value of `branch` in the `push latest` and `deploy to dev` stages to `gitlab-demo`.

   | Item                 | Value     | Description                                                  |
   | -------------------- | --------- | ------------------------------------------------------------ |
   | GITLAB_CREDENTIAL_ID | gitlab-id | The **Name** you set in KubeSphere for your GitLab account. It is used to push tags to your GitLab repository. |
   | DOCKERHUB_NAMESPACE  | felixnoo  | Replace it with your Docker Hub’s account name. It can be the Organization name under the account. |
   | GITLAB_ACCOUNT       | felixnoo  | Replace it with your GitLab account name. It can also be the account’s Group name. |

   {{< notice note >}}

   For more information about the environment variables in the Jenkinsfile, refer to [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/#step-2-modify-the-jenkinsfile-in-your-github-repository).

   {{</ notice >}}

5. Click **Commit changes** to update this file.

### Step 3: Create projects

You need to create two projects, such as `kubesphere-sample-dev` and `kubesphere-sample-prod`, which represent the development environment and the production environment respectively. For more information, refer to [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/#step-3-create-projects).

### Step 4: Create a pipeline

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click **Create** to create a new pipeline.

2. Provide the basic information in the displayed dialog box. Name it `gitlab-multi-branch` and select a code repository.

3. On the **GitLab** tab, select the default option `https://gitlab.com` for **GitLab Server Address**, enter the username of the GitLab project owner for **Project Group/Owner**, and then select the `devops-maven-sample` repository from the drop-down list for **Code Repository**. Click **√** in the lower-right corner and then click **Next**.

   {{< notice note >}}

   If you want to use a private repository from GitLab, refer to the following steps:

   - Go to **User Settings > Access Tokens** on GitLab to create an access token with API and read_repository permissions.
   - [Log in to the Jenkins dashboard](../../how-to-integrate/sonarqube/#step-5-add-the-sonarqube-server-to-jenkins), go to **Manage Jenkins > Manage Credentials** to use your GitLab token to create a Jenkins credential for accessing GitLab, and go to **Manage Jenkins > Configure System** to add the credential in **GitLab Server**.
   - In your DevOps project, select **DevOps Project Settings > Credentials** to use your GitLab token to create a credential. You have to specify the credential for **Credential** on the **GitLab** tab when creating a pipeline so that the pipeline can pull code from your private GitLab repository.

   {{</ notice >}}

4. On the **Advanced Settings** tab, scroll down to **Script Path**. Change it to `Jenkinsfile-online` and then click **Create**.

   {{< notice note >}}

   The field specifies the Jenkinsfile path in the code repository. It indicates the repository’s root directory. If the file location changes, the script path also needs to be changed. 

   {{</ notice >}}

### Step 5: Run a pipeline

1. After a pipeline is created, it is displayed in the list. Click its name to go to its details page.

2. Click **Run** on the right. In the displayed dialog box, select **gitlab-demo** from the drop-down list and add a tag number such as `v0.0.2`. Click **OK** to trigger a new run.

   {{< notice note >}}

   The pipeline pauses at the stage `deploy to dev`. You need to click **Proceed** manually. Note that the pipeline will be reviewed three times as `deploy to dev`, `push with tag`, and `deploy to production` are defined in the Jenkinsfile respectively.

   {{</ notice >}}

### Step 6: Check the pipeline status

1. In the **Task Status** tab, you can see how a pipeline is running. Check the pipeline running logs by clicking **View Logs** in the upper-right corner.

2. You can see the dynamic log output of the pipeline, including any errors that may stop the pipeline from running. For each stage, you can click it to inspect logs, which can also be downloaded to your local machine for further analysis.

### Step 7: Verify results

1. The Docker image built through the pipeline has been successfully pushed to Docker Hub, as it is defined in the Jenkinsfile. In Docker Hub, you will find the image with the tag `v0.0.2` that is specified before the pipeline runs.

2. At the same time, a new tag is generated in GitLab.

3. The sample application will be deployed to `kubesphere-sample-dev` and `kubesphere-sample-prod` with corresponding Deployments and Services created.

   | Environment | URL                         | Namespace              | Deployment    | Service       |
   | ----------- | --------------------------- | ---------------------- | ------------- | ------------- |
   | Development | `http://{$NodeIP}:{$30861}` | kubesphere-sample-dev  | ks-sample-dev | ks-sample-dev |
   | Production  | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample     | ks-sample     |

   {{< notice note >}}

   You may need to open the port in your security groups so that you can access the app with the URL. For more information, refer to [Access the example Service](../create-a-pipeline-using-jenkinsfile/#step-8-access-the-example-service).

   {{</ notice >}}

