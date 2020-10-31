---
title: "Create a Pipeline - using Graphical Editing Panel"
keywords: 'KubeSphere, kubernetes, docker, jenkins, cicd, graphical pipeline'
description: 'Create a Pipeline - using Graphical Editing Panel'

linkTitle: 'Create a Pipeline - using Graphical Editing Panel'
weight: 300
---

We are going to show how to create a CI/CD pipeline without Jenkinsfile by visually editing the workflow through KubeSphere console.

## Objective

We will use the graphical editing panel in KubeSphere console to create a pipeline, which automates the processes and release the sample project to Kubernetes development environment. If you have tried the Jenkinsfile-based pipeline, the build steps for this tutorial are easy to understand. The sample project in this tutorial is same to this [demo](https://github.com/kubesphere/devops-java-sample/tree/sonarqube).

## Prerequisites

- You need to [enable KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to create [DockerHub](http://www.dockerhub.com/) account.
- You need to create a workspace, a DevOps project, and a **project-regular** user account, and this account needs to be invited into the DevOps project as the role of maintainer.
- Configure email server for notification in pipeline, please refer to [Set Email Server for KubeSphere Pipeline](../../how-to-use/jenkins-email/).
- Set CI dedicated node for building pipeline, please refer to [Set CI Node for Dependency Cache](../../set-ci-node/).
- You need to install and configure sonarqube, please refer to [How to integrate SonarQube in Pipeline
](../../../how-to-integrate/sonarqube/) . Or you can skip this part, There is no **Code Analysis** below.

## Pipeline Overview

The sample pipeline includes the following six stages.

![Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20190516091714.png#align=left&display=inline&height=1278&originHeight=1278&originWidth=2190&search=&status=done&width=2190)

> To elaborate every stage：
>
> - **Stage 1. Checkout SCM:** Pull the GitHub repository code；
> - **Stage 2. Unit test**: The pipeline will continue running the next stage only if the unit test is passed；
> - **Stage 3. Code Analysis**: Configure SonarQube for static code quality check and analysis；
> - **Stage 4. Build and Push**: Build the image and push the it to DockerHub with tag `snapshot-$BUILD_NUMBER` where `$BUILD_NUMBER` is the serial number of the pipeline active list；
> - **Stage 5. Artifacts**: Generate the artifact (jar package) and save it；
> - **Stage 6. Deploy to DEV**: Deploy the project to the development environment. It requires an approval in this stage. An email will be sent after the deployment is successful.

## Hands-on Lab

### Step 1: Create Credentials

We need to create **three** credentials for DockerHub, Kubernetes and SonarQube respectively. If you have finished the last lab [Create a Jenkinsfile-based Pipeline for Spring Boot Project](../devops-online#step-1-create-credentials), you already have the credentials created. Otherwise, please refer to [create credentials](../devops-online#step-1-create-credentials) to create them that are used in the pipeline.

![Create Credentials](https://pek3b.qingstor.com/kubesphere-docs/png/20200221223754.png)

### Step 2: Create Project

The sample pipeline will deploy the [sample](https://github.com/kubesphere/devops-java-sample) to Kubernetes namespace, thus we need to create a project in KubeSphere. If you do not finish the last lab, please refer to the [step](../create-a-pipeline-using-jenkinsfile/#step-3-create-projects) to create a project named `kubesphere-sample-dev` by using `project-admin`, then invite the account `project-regular` into this project and assign the role of `operator` to this account.

### Step 3: Create Pipeline

Follow the steps below to create a pipeline using graphical editing panel.

#### Fill in the basic information

3.1. In the DevOps project, select the **Pipeline** on the left and click **Create**.

![Create Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200221225029.png)

3.2. In the pop-up window, name it `graphical-pipeline`, click **Next**.

#### Advanced Settings

3.3. Keep clicking **Add Parameter** to add **three** string parameters as follows. These parameters will be used in the Docker command of the pipeline. Click **Create** when you are done.

| Parameter Type | Name | Default Value | Description |
| --- | --- | --- | --- |
| String  | REGISTRY | The sample repository address is `docker.io`. | Image Registry |
| String  | DOCKERHUB_NAMESPACE | Fill in your  DockerHub account which can also be the Organization name under the account. | DockerHub Namespace |
| String | APP_NAME | Fill the application name with `devops-sample`. | Application Name |

![Advanced Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200222155944.png)

### Step 4: Editing pipeline

This pipeline consists of six stages. We will demonstrate the steps and tasks in each stage.

#### Stage I: Pull Source Code (Checkout SCM)

The graphical editing panel includes two areas, i.e., **canvas** on the left and **content** on the right. It will generate Jenkinsfile after creating a pipeline in the panel, which is much more user-friendly for developers.

> Note: Pipeline includes `scripted pipeline` and `declarative pipeline`, and the panel supports `declarative pipeline`. For pipeline syntax, see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/).

4.1.1. As follows, select **node** from the drop-down list of **agent type** in the content area, input `maven` in the label.

> Note: The agent is used to define execution environment. The agent directive tells Jenkins where and how to execute the pipeline or a specific stage. Please refer to [Jenkins Agent](https://jenkins.io/doc/pipeline/tour/agents/) for further information.

![Select Agent](https://pek3b.qingstor.com/kubesphere-docs/png/20200303174821.png)

4.1.2. In the canvas area, click the **+** button to add a stage. Click the box with title `No Name` that encloses the box **Add Step**, name it `Checkout SCM` in the content area on the right of the panel.

![Checkout SCM](https://pek3b.qingstor.com/kubesphere-docs/png/20200221234417.png)

4.1.3. Click **Add Step**. Select **git** from the content area. For now, fill in the pop-up window as follows:

- Url: Input GitHub repository URL `https://github.com/kubesphere/devops-java-sample.git` . Please replace the url with your own repository.
- Branch: Input `sonarqube` . If you want't to use Code Analysis, you can input `master` or ignore it.
- Credential ID: Leave it blank as it is for using a private repository.

When you are done, click **OK** to save it and you will see the first stage created.

![GitHub repository](/images/devops/checkout-scm-sonarqube.png)

#### Stage II: Unit Test

4.2.1. Click **+** on the right of the stage **Checkout SCM** to add another stage for performing a unit test in the container, name it `Unit Test`.

![Unit Test](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235115.png)

4.2.2. Click **Add Step** and select **container**, name it `maven`, then click **OK**.

![maven](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235323.png)

4.2.3. In the content area, click **Add nesting steps** in the `maven` container created above to add a nested step. Then select **shell** and enter the following command in the pop-up window:

```bash
mvn clean -o -gs `pwd`/configuration/settings.xml test
```

Click **OK** to save it.

![maven container](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235629.png)

#### Stage III: Code Analysis

4.3.1. Same as above, click **+** on the right of the stage **Unit Test** to continue adding a stage for configuring SonarQube, which is used to perform static code quality analysis in the container, name it `Code Analysis`.

![Code Analysis](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000007.png)

4.3.2. Click **Add Step** in **Code Analysis**, and select **container**，name it `maven`，then click **OK**.

![Code Analysis](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000204.png)

4.3.3. Click **Add nesting steps** in the `maven` container created above to add a nested step and select **withCredentials**, Select the previously created credential ID `sonar-token` and input `SONAR_TOKEN` in the text variable, then click **OK**.

![withCredentials](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000531.png)

4.3.4. In the task **withCredential** on the right, click **Add nesting steps** (the first one)，then select **withSonarQubeEnv**, leave the default name `sonar`, click **OK** to save it.

![Code Analysis](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000743.png)

![withSonarQubeEnv](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000936.png)

4.3.5. Click **Add nesting steps** (the first one) in the **withSonarQubeEnv**. Then select **shell** on the right, enter the following commands in the pop-up window for SonarQube branch and authentication, and click **OK** to save the information.

```shell
mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.branch=$BRANCH_NAME -Dsonar.login=$SONAR_TOKEN
```

![SonarQube branch](https://pek3b.qingstor.com/kubesphere-docs/png/20200222161853.png)

4.3.6. Click on the **Add nesting steps** (the third one) on the right, select **timeout**. Input `1` to time, and select `Hours` in unit.

Click **OK** to save it.

![SonarQube timeout](https://pek3b.qingstor.com/kubesphere-docs/png/20200222001544.png)

4.3.7. In the `timeout`, click **Add nesting steps** (the first one). Then select **waitforSonarQubeGate** and keep the default `Start the follow-up task after inspection` in the popup window.

Click **OK** to save it.

![waitforSonarQubeGate](https://pek3b.qingstor.com/kubesphere-docs/png/20200222001847.png)

#### Stage IV: Build and Push the Image

4.4.1. Similarly, click **+** on the right of the stage of **Code Analysis** to add another stage to build and push images to DockerHub, name it `Build and Push`.

4.4.2. Click **Add Step** and select **container**，name it `maven`，then click **OK**.

![maven container](https://pek3b.qingstor.com/kubesphere-docs/png/20200222112517.png)

4.16. Click **Add nesting steps** in the contain `maven`, and select **shell** on the right, enter the following command in the pop-up window:

```shell
mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
```

4.4.3. Then continue to click **Add nesting steps** on the right, select **shell** in the pop-up window, enter the following command to build a Docker image based on the [Dockerfile](https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online):

> Please DO NOT miss the dot `.` at the end of the command.

```shell
docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
```

![Build Docker image](https://pek3b.qingstor.com/kubesphere-docs/png/20200222113131.png)

Click **OK** to save it.

4.4.4. Similarly, click **Add nesting steps** again and select **withCredentials** on the right. Fill in the pop-up window as follows:

> Note: Considering the security, the account information are not allowed to be exposed in plaintext in the script.

- Credential ID：Select the DockerHub credentials you created, e.g. `dockerhub-id`
- Password variable：Enter `DOCKER_PASSWORD`
- Username variable：Enter `DOCKER_USERNAME`

Click **OK** to save the it.

![DockerHub credentials](https://pek3b.qingstor.com/kubesphere-docs/png/20200222113442.png)

4.4.5. Click **Add nesting steps** (the first one) in the **withCredentials** step created above, select **shell** and enter the following command in the pop-up window, which is used to log in Docker Hub:

```shell
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

Click **OK** to save the it.

![docker login](https://pek3b.qingstor.com/kubesphere-docs/png/20200222114937.png)

4.4.6. As above, click **Add nesting steps** in the **withCredentials** step again, choose **shell** and enter the following command to push the SNAPSHOT image to DockerHub:

```shell
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
```

![docker push](https://pek3b.qingstor.com/kubesphere-docs/png/20200222120214.png)

#### Stage V: Generate Artifact

4.5.1. Click **+** on the right of the **Build and Push** stage, here we add another stage to save artifacts. This example uses the jar package and name it `Artifacts`.

![Save Artifacts](https://pek3b.qingstor.com/kubesphere-docs/png/20200222120540.png)

4.5.2. Click **Add Step** in **Artifacts** stage, select **archiveArtifacts**. Enter `target/*.jar` in the pop-up window, which is used to set the archive path of artifact in Jenkins.

Click **OK** to save the it.

![Artifacts](https://pek3b.qingstor.com/kubesphere-docs/png/20200222121035.png)

#### Stage VI: Deploy to Dev

4.6.1. Click **+** on the right of the stage **Artifacts** to add the last stage, name it `Deploy to Dev`. This stage is used to deploy resources to development environment, namely, the project of `kubesphere-sample-dev`.

4.6.2. Click **Add Step** in **Deploy to Dev**, select **input** and enter `@project-admin` in the pop-up window, assigning account `project-admin` to review this pipeline.

Click **OK** to save the it.

4.6.3. Click **Add Step** on the right，select **kubernetesDeploy**. Fill in the pop-up window as below and click **Confirm** to save the information:

- Kubeconfig: select `demo-kubeconfig`
- Configuration file path: Enter `deploy/no-branch-dev/**` which is the related path of the Kubernetes [yaml](https://github.com/kubesphere/devops-java-sample/tree/master/deploy/no-branch-dev).

Click **OK** to save the it.

![Deploy to Kubernetes](https://pek3b.qingstor.com/kubesphere-docs/png/20200222153404.png)

4.6.4. Similarly, click **Add Step** to send an email notification to the user after the pipeline runs successfully, select **mail** and fill in the information.

> Note: Make sure you have [configured email server](../../devops/jenkins-email) in `ks-jenkins`. Please refer to Jenkins email configuration. If not yet, skip this step and you still can run this pipeline.

At this point, the total six stages of the pipeline have been edited completely, click **Confirm → Save**, it will generate Jenkinsfile as well.

![Complete Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200222154407.png)

### Step 5: Run Pipeline

5.1. The pipeline created by the graphical editing panel needs to be manually run. Click **Run**, you can see the three string parameters defined in the third step. Click **OK** to start this pipeline.

![Run Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200222160330.png)

5.2. You can see the status of the pipeline in the **Activity** list. Click **Activity** to view the detailed running status.

5.3. Enter the first activity to view detailed page.

![View detailed page](https://pek3b.qingstor.com/kubesphere-docs/png/20200222163341.png)

> Note: If the previous steps are running correctly, you can see that the pipeline has successfully run to the last stage in a few minutes. Since we set the review step and specify the account `project-admin` as the reviewer. Therefore, we need to switch to use `project-admin` to manually review and approve it.

5.4. Log out, and log in with account `project-admin`. Enter into the pipeline `graphical-pipeline` of the DevOps project that we used above. Drill into **Activity** to view the running status. You can see the pipeline has run to the **Deploy to DEV** stage. Click **Proceed** to approve it.

![Activity](https://pek3b.qingstor.com/kubesphere-docs/png/20200222170334.png)

### Step 6: View Pipeline

6.1. Log back the account `project-regular`. After a few minutes, the pipeline runs successfully. Click **Activity** list in the pipeline to view the current running pipeline serial number. This page shows the running status of each stage in the pipeline.

![View Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200222182230.png)

6.2. Click **Show Logs** on the top right of the current page to inspect the logs. The pop-up window shows the specific logs, running status and time of each stage. Click on a specific stage and expand its specific log on the right. You can debug any problems based on the logs which also can be downloaded to your local file for further analysis.

![Show Logs](https://pek3b.qingstor.com/kubesphere-docs/png/20200222171027.png)

### Step 7: Check Code Quality

Back to the **Activity** page, click **Code quality** to check the analysis of the code quality for the demo project, which is provided by the SonarQube. The sample code is simple and does not show bugs or vulnerabilities. Click on the SonarQube icon on the right to access SonarQube. Please refer to [Access SonarQube](./../../how-to-integrate/sonarqube/) to log in.

![Check Code Quality](https://pek3b.qingstor.com/kubesphere-docs/png/20200222171426.png)

#### View the Quality Report at SonarQube

![Quality report](https://pek3b.qingstor.com/kubesphere-docs/png/20200222171539.png)

### Step 8: Download Artifacts

Enter the first activity and select **Artifacts**. You can find the artifact of jar package generated by the pipeline, and you can download it by clicking the icon.

![Download Artifacts](https://pek3b.qingstor.com/kubesphere-docs/png/20200222172157.png)

### Step 9: Verify the Kubernetes Resource

If every stage of the pipeline runs successfully, the Docker image will be automatically built and pushed to your DockerHub account. Finally, the project is deployed to the Kubernetes with a deployment and a service automatically.

9.1. Enter the project `kubesphere-sample-dev`, click **Application Workloads → Workloads** to see that `ks-sample-dev` has been created successfully.

| Environment | Address | Namespace | Deployment | Service |
| --- | --- | --- | --- | --- |
| Dev | `http://{$Virtual IP}:{$8080}` or `http://{$Intranet/Public IP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample-dev |

#### View Deployment

![View Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173254.png)

9.2. Navigate to **Service** list, you can find the corresponding service has been created. The NodePort exposed by the service is`30861` in this example.

#### View Service

![View Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173213.png)

9.3. Now verify the images pushed to DockerHub. You can see that `devops-sample` is the value of **APP_NAME**, while the tag is the value of `SNAPSHOT-$BUILD_NUMBER`, and `$BUILD_NUMBER` is the serial number of the activity within pipeline. This tag has also been used in deployment `ks-sample-dev`.

![View DockerHub](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173907.png)

![View DockerHub](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173802.png)

9.4. Since we set an email notification in the pipeline, thus we can verify the email in the mailbox.

![Email notification](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173444.png)

### Step 10: Access the Sample Service

We can access the sample service using command or access in browser. For example, you can use the web kubectl by using account `admin` as follows:

```bash
# curl {$Virtual IP}:{$Port} or curl {$Node IP}:{$NodePort}
curl 10.233.4.154:8080
Really appreciate your star, that's the power of our life.
```

Congratulation! You have been familiar with using graphical editing panel to visualize your CI/CD workflow.
