---
title: "Create a pipeline using jenkinsfile"
keywords: 'kubesphere, kubernetes, docker, spring boot, jenkins, devops, ci/cd, pipeline'
description: "Create a pipeline using jenkinsfile"
linkTitle: "Create a pipeline using jenkinsfile"
weight: 200
---

## Objective

In this tutorial, we will show you how to create a pipeline based on the Jenkinsfile from a GitHub repository. Using the pipeline, we will deploy a demo application to a development environment and a production environment respectively. Meanwhile, we will demo a branch that is used to test dependency caching capability. In this demo, it takes a relatively long time to finish the pipeline for the first time. However, it runs very faster since then. It proves the cache works well since this branch pulls lots of dependency from internet initially.

> Note:
> KubeSphere supports two kinds of pipeline, i.e., Jenkinsfile in SCM which is introduced in this document and [Create a Pipeline - using Graphical Editing Panel](../create-a-pipeline-using-graphical-editing-panel). Jenkinsfile in SCM requires an internal Jenkinsfile in Source Control Management (SCM). In another word, Jenkfinsfile serves as a part of SCM. KubeSphere DevOps system will automatically build a CI/CD pipeline depending on existing Jenkinsfile of the code repository. You can define workflow like Stage, Step and Job in the pipeline.

## Prerequisites

- You need to have a DokcerHub account and a GitHub account.
- You need to create a workspace, a DevOps project, and a **project-regular** user account, and this account needs to be invited into a DevOps project.
- Set CI dedicated node for building pipeline, please refer to [Set CI Node for Dependency Cache](../../how-to-use/set-ci-node/).
- You need to install and configure sonarqube, please refer to [How to integrate SonarQube in Pipeline
](../../../how-to-integrate/sonarqube/) . Or you can skip this part, There is no **Sonarqube Analysis** below.

## Pipeline Overview

There are eight stages as shown below in the pipeline that is going to demonstrate.

![Pipeline Overview](https://pek3b.qingstor.com/kubesphere-docs/png/20190512155453.png#align=left&display=inline&height=1302&originHeight=1302&originWidth=2180&search=&status=done&width=2180)

> Note：

> - **Stage 1. Checkout SCM**: Checkout source code from GitHub repository.
> - **Stage 2. Unit test**: It will continue to execute next stage after unit test passed.
> - **Stage 3. SonarQube analysis**：Process sonarQube code quality analysis.
> - **Stage 4.** **Build & push snapshot image**: Build the image based on selected branches in the behavioral strategy. Push the tag of `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` to DockerHub, among which, the `$BUILD_NUMBER` is the operation serial number in the pipeline's activity list.
> - **Stage 5. Push the latest image**: Tag the sonarqube branch as latest and push it to DockerHub.
> - **Stage 6. Deploy to dev**: Deploy sonarqube branch to Dev environment. verification is needed for this stage.
> - **Stage 7. Push with tag**: Generate tag and released to GitHub. Then push the tag to DockerHub.
> - **Stage 8. Deploy to production**: Deploy the released tag to the Production environment.

## Hands-on Lab

### Step 1: Create Credentials

> Note: If there are special characters in your account or password, please encode it using https://www.urlencoder.org/, then paste the encoded result into credentials below.

1.1. Log in KubeSphere with the account `project-regular`, enter into the created DevOps project and create the following three credentials under **Project Management → Credentials**:

|Credential ID| Type | Where to use |
| --- | --- | --- |
| dockerhub-id | Account Credentials | DockerHub |
| github-id | Account Credentials | GitHub |
| demo-kubeconfig | kubeconfig | Kubernetes |

1.2. We need to create an additional credential `sonar-token` for SonarQube token, which is used in stage 3 (SonarQube analysis) mentioned above. Refer to [Access SonarQube Console and Create Token](../../how-to-integrate/sonarqube/) to copy the token and paste here. Then press **OK** button.

![sonar-token](https://pek3b.qingstor.com/kubesphere-docs/png/20200226171101.png)

In total, we have created four credentials in this step.

![Credentials](https://pek3b.qingstor.com/kubesphere-docs/png/20200107105153.png)

### Step 2: Modify Jenkinsfile in Repository

#### Fork Project

Log in GitHub. Fork the [devops-java-sample](https://github.com/kubesphere/devops-java-sample) from  GitHub repository to your own GitHub.

![Fork Sample](/images/devops/jenkins-fork.png)

#### Edit Jenkinsfile

2.1. After forking the repository to your own GitHub, open the file **Jenkinsfile-online** under root directory.

![Open File](/images/devops/jenkins-edit-1.png)

2.2. Click the editing logo in GitHub UI to edit the values of environment variables.

![Jenkinsfile](/images/devops/jenkins-edit-2.png)

| Editing Items | Value | Description |
| :--- | :--- | :--- |
| DOCKER\_CREDENTIAL\_ID | dockerhub-id | Fill in DockerHub's credential ID to log in your DockerHub. |
| GITHUB\_CREDENTIAL\_ID | github-id | Fill in the GitHub credential ID to push the tag to GitHub repository. |
| KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig | kubeconfig credential ID is used to access to the running Kubernetes cluster. |
| REGISTRY | docker.io | Set the web name of docker.io by default for pushing images. |
| DOCKERHUB\_NAMESPACE | your-dockerhub-account | Replace it to your DockerHub's account name. (It can be the Organization name under the account.) |
| GITHUB\_ACCOUNT | your-github-account | Change your GitHub account name, such as `https://github.com/kubesphere/`. Fill in `kubesphere` which can also be the account's Organization name. |
| APP\_NAME | devops-java-sample | Application name |
| SONAR\_CREDENTIAL\_ID | sonar-token | Fill in the SonarQube token credential ID for code quality test. |

**Note: The command parameter `-o` of Jenkinsfile's `mvn` indicates that the offline mode is on. This tutorial has downloaded relevant dependencies to save time and to adapt to network interference in certain environments. The offline mode is on by default.**

2.3. After editing the environmental variables, click **Commit changes** at the top of GitHub page, then submit the updates to the sonarqube branch.

### Step 3: Create Projects

In this step, we will create two projects, i.e. `kubesphere-sample-dev` and `kubesphere-sample-prod`, which are development environment and production environment respectively.

#### Create The First Project

> Tip：The account `project-admin` should be created in advance since it is used as the reviewer of the CI/CD Pipeline.

3.1. Use the account `project-admin` to log in KubeSphere. Click **Create** button, then choose **Create a resource project**. Fill in basic information for the project. Click **Next** after complete.

- Name: `kubesphere-sample-dev`.
- Alias: `development environment`.


3.2. Leave the default values at Advanced Settings. Click **Create**.

3.3. Now invite  `project-regular` user into `kubesphere-sample-dev`. Choose **Project Settings → Project Members**. Click **Invite Member** to invite `project-regular` and grant this account the role of `operator`.

#### Create the Second Project

Similarly, create a project named `kubesphere-sample-prod` following the steps above. This project is the production environment. Then invite `project-regular` to the project of `kubesphere-sample-prod`, and grant it the role of `operator` as well.

> Note: When the CI/CD pipeline succeeded. You will see the demo application's Deployment and Service have been deployed to `kubesphere-sample-dev` and `kubesphere-sample-prod.` respectively.

![Project List](https://pek3b.qingstor.com/kubesphere-docs/png/20200107142252.png)

### Step 4: Create a Pipeline

#### Fill in Basic Information

4.1. Switch the login user to `project-regular`. Enter into the DevOps project `demo-devops`. click **Create** to build a new pipeline.

![Pipeline List](https://pek3b.qingstor.com/kubesphere-docs/png/20200107142659.png)

4.2. Fill in the pipeline's basic information in the pop-up window, name it `jenkinsfile-in-scm`, click **Code Repository**.

![New Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143247.png)

#### Add Repository

4.3. Click **Get Token** to generate a new GitHub token if you do not have one. Then paste the token to the edit box.

![Get Token](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143539.png)

![GitHub Token](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143648.png)

4.4. Click **Confirm**, choose your account. All the code repositories related to this token will be listed on the right. Select **devops-java-sample** and click **Select this repo**, then click **Next**.

![Select Repo](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143818.png)

#### Advanced Settings

Now we are on the advanced setting page.

<!--
> Note:
> The branches can be controlled by both of the preservation days and the branch number. If the branch has expired the preservation dates or exceeded the limitation number, the branch should be discarded. For example, if the preservation day is 2 and the branch number is  3, any branches that do not meet the requirements should be discarded. Set both of the limitation to -1 by default means not to delete branched automatically. 
>
> Discarding old branches means that you will discard the branch record all together. The branch record includes console output, archive artifacts and other relevant data. Keeping less branches saves Jenkins' disk space. We provide two options to determine when to discard old branches:
>
> - Days for preserving the branches: If branch reaches the days, it must be discarded.
> - Number of branches: If there is a significant number of branches, the oldest branches should be discarded. -->

4.5. In the behavioral strategy, KubeSphere pipeline has set three strategies by default. Since this demo has not applied the strategy of **Discover PR from Forks,**, this strategy can be deleted.

![Remove Behavioral Strategy](https://pek3b.qingstor.com/kubesphere-docs/png/20200107144107.png)

<!-- > Note：
> There types of discovering strategies are supported. When the Jenkins pipeline is activated, the Pull Request (PR) submitted by the developer will also be regarded as a separate branch.
> Discover the branch:
> - Exclude the branch as PR: Select this option means that CI will not scan the source branch as such Origin's master branch. These branches needs to be merged.
> - Only the branched submitted as PR: Only scan the PR branch.
> - All the branches: extract all the branches from the repository origin.
>
> Discover PR from the origin repository:
> - The source code after PR merges with the branch: Once discovery operation is based on the source codes derived from merging the PR and the target branch. It is also based on the running pipeline.
> - PR's source code edition: Once discovery operation is based on the pipeline build by PR's source codes.
> - There will be two pipelines when the PR is found. One pipeline applies PR's source code and the other one uses the source code from  merging the PR with the target branch: This is twice discovery operation.  -->

4.6. The path is **Jenkinsfile** by default. Please change it to `Jenkinsfile-online`, which is the file name of Jenkinsfile in the repository located in root directory.

> Note: Script path is the Jenkinsfile path in the code repository. It indicates the repository's root directory. If the file location changes, the script path should also be changed.

![Change Jenkinsfile Path](https://pek3b.qingstor.com/kubesphere-docs/png/20200107145113.png)

4.7. **Scan Repo Trigger** can be customized according to the team's development preference. We set it to `5 minutes`. Click **Create** when complete advanced settings.

<!-- > Note: Regular scaning is to set a cycle to require the pipeline scan remote repositories regularly. According to the **Behaviour Strategy **to check whether there is a code update or a new PR.
>
> Webhook Push:
> Webhook is a high-efficiency way to detect the changes in the remote repository and automatically activate new operations. Webhook should play the main role in scanning Jenkins for GitHub and Git (like Gitlab). Please refer to the cycle time setting in the previous step. In this sample, you can run the pipeline manually. If you need to set automatic scanning for remote branches and active the operation, please refer to Setting automatic scanning - GitHub SCM. 
> -->

![Advanced Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200107145528.png)

#### Run the Pipeline

Refresh browser manually or you may need to click `Scan Repository`, then you can find two activities triggered. Or you may want to trigger them manually as the following instructions.

4.8. Click **Run** on the right. According to the **Behavioral Strategy**, it will load the branches that have Jenkinsfile. Set the value of branch as `sonarqube`. Since there is no default value in the Jenkinsfile file, put in a tag number in the  **TAG_NAME** such as `v0.0.1`. Click **OK** to trigger a new activity.

> Note: TAG\_NAME is used to generate release and images with tag in GitHub and DockerHub. Please notice that `TAG_NAME` should not duplicate the existing `tag` name in the code repository. Otherwise the pipeline can not run.  

![Run Pipeline](/images/devops/20200107230822.png)

At this point, the pipeline for the sonarqube branch is running.

> Note: Click **Branch** to switch to the branch list and review which branches are running. The branch here is determined by the **Behavioral Strategy.**

![Tag Name](/images/devops/20200107232100.png)

#### Review Pipeline

When the pipeline runs to the step of `input`
it will pause. You need to click **Continue** manually. Please note that there are three stages defined in the Jenkinsfile-online. Therefore, the pipeline will be reviewed three times in the three stages of `deploy to dev, push with tag, deploy to production`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108001020.png)

> Note: In real development or production scenario, it requires someone who has higher authority (e.g. release manager) to review the pipeline and the image, as well as the code analysis result. They have the authority to determine whether to approve push and deploy. In Jenkinsfile, the `input` step supports you to specify who to review the pipeline. If you want to specify a user `project-admin` to review, you can add a field in the Jenkinsfile. If there are multiple users, you need to use commas to separate them as follows:

```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
···
```

### Step 5: Check Pipeline Status

5.1. Click into **Activity → sonarqube → Task Status**, you can see the pipeline running status. Please note that the pipeline will keep initializing for several minutes when the creation just completed. There are eight stages in the sample pipeline and they have been defined individually in [Jenkinsfile-online](https://github.com/kubesphere/devops-java-sample/blob/sonarqube/Jenkinsfile-online).

![Pipeline stages](https://pek3b.qingstor.com/kubesphere-docs/png/20200108002652.png)

5.2. Check the pipeline running logs by clicking **Show Logs** at the top right corner. The page shows dynamic logs outputs, operating status and time etc.

For each step, click specific stage on the left to inspect the logs. The logs can be downloaded to local for further analysis.

![Pipeline Logs](https://pek3b.qingstor.com/kubesphere-docs/png/20200108003016.png)

### Step 6: Verify Pipeline Running Results

6.1. Once you successfully executed the pipeline, click `Code Quality` to check the results through  SonarQube as the follows (reference only).

![SQ Results](https://pek3b.qingstor.com/kubesphere-docs/png/20200108003257.png)

6.2. The Docker image built by the pipeline has been successfully pushed to DockerHub, since we defined `push to DockerHub` stage in Jenkinsfile-online. In DockerHub you will find the image with tag v0.0.1 that we configured before running the pipeline, also you will find the images with tags`SNAPSHOT-sonarqube-6`(SNAPSHOT-branch-serial number) and `latest` have been pushed to DockerHub.

![DockerHub Images](/images/devops/20200108134653.png)

At the same time, a new tag and a new release have been generated in GitHub.

![GitHub Release](https://pek3b.qingstor.com/kubesphere-docs/png/20200108133933.png)

The sample application will be deployed to `kubesphere-sample-dev` and `kubesphere-sample-prod` as  deployment and service.

| Environment | URL | Namespace | Deployment | Service |
| :--- | :--- | :--- | :--- | :--- |
| Dev | `http://{NodeIP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample-dev |
| Production | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample | ks-sample |

6.3. Enter into these two projects, you can find the application's resources have been deployed to Kubernetes successully. For example, lets verify the Deployments and Services under project `kubesphere-sample-dev`:

#### Deployments

![Deployments](https://pek3b.qingstor.com/kubesphere-docs/png/20200108135508.png)

#### Services

![Services](https://pek3b.qingstor.com/kubesphere-docs/png/20200108135541.png)

### Step 7: Visit Sample Service

7.1. You can switch to use `admin` account to open **web kubectl** from **Toolbox**. Enter into project `kubesphere-sample-dev`, select **Application Workloads → Services** and click into `ks-sample-dev` service.

![Web Kubectl](/images/devops/service-view.png)

7.2. Open **web kubectl** from **Toolbox**, try to access as the following:

> Note: curl Endpoints or {$Virtual IP}:{$Port} or {$Node IP}:{$NodePort}

```bash
$ curl 10.233.102.188:8080
Really appreciate your star, that's the power of our life.
```

7.3. Similarly, you can test the service in project `kubesphere-sample-pro`

> Note: curl Endpoints or {$Virtual IP}:{$Port} or {$Node IP}:{$NodePort}

```bash
$ curl 10.233.102.188:8080
Really appreciate your star, that's the power of our life.
```

Configurations! You are familiar with KubeSphere DevOps pipeline, and you can continue to learn how to build CI/CD pipeline with a graphical panel and visualize your workflow in the next tutorial.