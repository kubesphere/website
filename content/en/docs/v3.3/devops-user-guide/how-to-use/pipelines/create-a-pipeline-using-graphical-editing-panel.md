---
title: "Create a Pipeline Using Graphical Editing Panels"
keywords: 'KubeSphere, Kubernetes, jenkins, cicd, graphical pipelines'
description: 'Learn how to create and run a pipeline by using the graphical editing panel of KubeSphere.'
linkTitle: 'Create a Pipeline Using Graphical Editing Panels'
weight: 11211
---

A graphical editing panel in KubeSphere contains all the necessary operations used in Jenkins [stages](https://www.jenkins.io/doc/book/pipeline/#stage) and [steps](https://www.jenkins.io/doc/book/pipeline/#step). You can directly define these stages and steps on the interactive panel without creating any Jenkinsfile.

This tutorial demonstrates how to create a pipeline through graphical editing panels in KubeSphere. During the whole process, you do not need to create any Jenkinsfile manually as KubeSphere will automatically generate one based on your settings on the editing panels. When the pipeline runs successfully, it creates a Deployment and a Service accordingly in your development environment and pushes an image to Docker Hub.

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../../pluggable-components/devops/).
- You need to have a [Docker Hub](https://www.dockerhub.com/) account.
- You need to create a workspace, a DevOps project, and a user (`project-regular`). This user must be invited to the DevOps project with the `operator` role. See [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/) if they are not ready.
- Set CI dedicated nodes to run the pipeline. For more information, see [Set CI Node for Dependency Cache](../../../../devops-user-guide/how-to-use/devops-settings/set-ci-node/).
- Configure your email server for pipeline notifications (optional). For more information, see [Set Email Server for KubeSphere Pipelines](../../../../devops-user-guide/how-to-use/pipelines/jenkins-email/).
- Configure SonarQube to include code analysis as part of the pipeline (optional). For more information, see [Integrate SonarQube into Pipelines](../../../../devops-user-guide/how-to-integrate/sonarqube/).

## Pipeline Overview

This example pipeline includes the following six stages.

![Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20190516091714.png#align=left&display=inline&height=1278&originHeight=1278&originWidth=2190&search=&status=done&width=2190)

{{< notice note >}} 

- **Stage 1. Checkout SCM**: Pull source code from a GitHub repository.
- **Stage 2. Unit test**: It will not proceed with the next stage until the test is passed.
- **Stage 3. Code analysis**: Configure SonarQube for static code analysis.
- **Stage 4. Build and push**: Build an image and push it to Docker Hub with the tag `snapshot-$BUILD_NUMBER`, the `$BUILD_NUMBER` of which is the record serial number in the pipeline’s activity list.
- **Stage 5. Artifacts**: Generate an artifact (JAR package) and save it.
- **Stage 6. Deploy to DEV**: Create a Deployment and a Service in the development environment. It requires review in this stage. An email notification will be sent after the Deployment is successful.

{{</ notice >}}

## Hands-on Lab

### Step 1: Create credentials

1. Log in to the KubeSphere console as `project-regular`. Go to your DevOps project and create the following credentials in **Credentials** under **DevOps Project Settings**. For more information about how to create credentials, see [Credential Management](../../../../devops-user-guide/how-to-use/devops-settings/credential-management/).

   {{< notice note >}} 

   If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.

   {{</ notice >}} 

   | Credential ID   | Type                  | Where to use |
   | --------------- | --------------------- | ------------ |
   | dockerhub-id    | Username and password | Docker Hub   |
   | demo-kubeconfig | kubeconfig            | Kubernetes   |

2. You need to create an additional credential ID (`sonar-token`) for SonarQube, which is used in stage 3 (Code analysis) mentioned above. Refer to [Create SonarQube Token for New Project](../../../../devops-user-guide/how-to-integrate/sonarqube/#create-sonarqube-token-for-new-project) to enter your SonarQube token in the **Token** field for a credential of the **Access token** type. Click **OK** to finish.

3. In total, you have three credentials in the list.

### Step 2: Create a project

In this tutorial, the example pipeline will deploy the [sample](https://github.com/kubesphere/devops-maven-sample/tree/sonarqube) app to a project. Hence, you must create the project (for example, `kubesphere-sample-dev`) in advance. The Deployment and Service of the app will be created automatically in the project once the pipeline runs successfully.

You can use the user `project-admin` to create the project. Besides, this user is also the reviewer of the CI/CD pipeline. Make sure the account `project-regular` is invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

### Step 3: Create a pipeline

1. Make sure you have logged in to KubeSphere as `project-regular`, and then go to your DevOps project. Click **Create** on the **Pipelines** page.

2. In the displayed dialog box, name it `graphical-pipeline` and click **Next**.

3. On the **Advanced Settings** page, click **Add** to add three string parameters as follows. These parameters will be used in the Docker command of the pipeline. Click **Create** when you finish adding.

   | Parameter Type | Name                | Value           | Description                                                  |
   | -------------- | ------------------- | --------------- | ------------------------------------------------------------ |
   | String         | REGISTRY            | `docker.io`     | This is the image registry address. This example uses `docker.io`. |
   | String         | DOCKERHUB_NAMESPACE | Docker ID       | You Docker Hub account or the organization name under the account. |
   | String         | APP_NAME            | `devops-sample` | The app name.                                                |

   {{< notice note >}}

   For other fields, use the default values directly or refer to [Pipeline Settings](../pipeline-settings/) to customize the configuration.

   {{</ notice >}} 

4. The pipeline created is displayed in the list.

### Step 4: Edit the pipeline

Click the pipeline to go to its details page. To use graphical editing panels, click **Edit Pipeline** under the tab **Task Status**. In the displayed dialog box, click **Custom Pipeline**. This pipeline consists of six stages. Follow the steps below to set each stage.

{{< notice note >}}

- The pipeline details page shows **Sync Status**. It reflects the synchronization result between KubeSphere and Jenkins, and you can see the **Successful** icon if the synchronization is successful. You can also click **Edit Jenkinsfile** to create a Jenkinsfile manually for your pipeline.

- You can also [use the built-in pipeline templates](../use-pipeline-templates/) provided by KubeSphere.

{{</ notice >}}

#### Stage 1: Pull source code (Checkout SCM)

A graphical editing panel includes two areas - **canvas** on the left and **content** on the right. It automatically generates a Jenkinsfile based on how you configure different stages and steps, which is much more user-friendly for developers.

{{< notice note >}}

Pipelines include [declarative pipelines](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) and [scripted pipelines](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline). Currently, you can create declarative pipelines through the panel. For more information about pipeline syntax, see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/).

{{</ notice >}}

1. On the graphical editing panel, select **node** from the **Type** drop-down list and select **maven** from the **Label** drop-down list.

   {{< notice note >}}

   `agent` is used to define the execution environment. The `agent` directive tells Jenkins where and how to execute the pipeline. For more information, see [Choose Jenkins Agent](../choose-jenkins-agent/).

   {{</ notice >}} 

   ![graphical-panel](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/graphical-panel.png)

2. To add a stage, click the plus icon on the left. Click the box above the **Add Step** area and set a name (for example, `Checkout SCM`) for the stage in the field **Name** on the right.

   ![edit-panel](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/edit-panel.png)

3. Click **Add Step**. Select **git** from the list as the example code is pulled from GitHub. In the displayed dialog box, fill in the required field. Click **OK** to finish.

   - **URL**. Enter the GitHub repository address `https://github.com/kubesphere/devops-maven-sample.git`. Note that this is an example and you need to use your own repository address.
   - **Name**. You do not need to enter the Credential ID for this tutorial. 
   - **Branch**. It defaults to the master branch if you leave it blank. Enter `sonarqube` or leave it blank if you do not need the code analysis stage.

   ![enter-repo-url](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/enter-repo-url.png)

4. The first stage is now set.

   ![first-stage-set](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/first-stage-set.png)

#### Stage 2: Unit test

1. Click the plus icon on the right of stage 1 to add a new stage to perform a unit test in the container. Name it `Unit Test`.

   ![unit-test](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/unit-test.png)

2. Click **Add Step** and select **container** from the list. Name it `maven` and then click **OK**.

   ![container](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/container.png)

3. Click **Add Nesting Steps** to add a nested step under the `maven` container. Select **shell** from the list and enter the following command in the command line. Click **OK** to save it.

   ```shell
   mvn clean -gs `pwd`/configuration/settings.xml test
   ```

   {{< notice note >}}

   You can specify a series of [steps](https://www.jenkins.io/doc/book/pipeline/syntax/#steps) to be executed in a given stage directive on the graphical editing panel.

   {{</ notice >}} 


#### Stage 3: Code analysis (optional)

This stage uses SonarQube to test your code. You can skip this stage if you do not need the analysis.

1. Click the plus icon on the right of the `Unit Test` stage to add a stage for SonarQube code analysis in the container. Name it `Code Analysis`.

   ![code-analysis-stage](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/code-analysis-stage.png)

2. Click **Add Step** under **Task** in **Code Analysis** and select **container**. Name it `maven` and click **OK**.

   ![maven-container](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/maven-container.png)

3. Click **Add Nesting Steps** under the `maven` container to add a nested step. Click **withCredentials** and select the SonarQube token (`sonar-token`) from the **Name** list. Enter `SONAR_TOKEN` for **Text Variable**, then click **OK**.

   ![sonarqube-credentials](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonarqube-credentials.png)

4. Under the **withCredentials** step, click **Add Nesting Steps** to add a nested step for it.

   ![nested-step](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/nested-step.png)

5. Click **withSonarQubeEnv**. In the displayed dialog box, do not change the default name `sonar` and click **OK** to save it.

   ![sonar](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonar.png)

6. Under the **withSonarQubeEnv** step, click **Add Nesting Steps** to add a nested step for it.

   ![add-nested-step](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/add-nested-step.png)

7. Click **shell** and enter the following command in the command line for the sonarqube branch and authentication. Click **OK** to finish.

   ```shell
   mvn sonar:sonar -Dsonar.login=$SONAR_TOKEN
   ```

   ![sonarqube-shell-new](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonarqube-shell-new.png)

8. Click **Add Nesting Steps** (the third one) for the **container** step directly and select **timeout**. Enter `1` for time and select **Hours** for unit. Click **OK** to finish.

   ![add-nested-step-2](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/add-nested-step-2.png)

   ![timeout](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/timeout.png)

9. Click **Add Nesting Steps** for the **timeout** step and select **waitForQualityGate**. Select **Start the follow-up task after the inspection** in the displayed dialog box. Click **OK** to save it.

   ![waitforqualitygate](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/waitforqualitygate.png)

   ![sonar-ready](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonar-ready.png)

#### Stage 4: Build and push the image

1. Click the plus icon on the right of the previous stage to add a new stage to build and push images to Docker Hub. Name it `Build and Push`.

   ![build-and-push-image](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/build-and-push-image.png)

2. Click **Add Step** under **Task** and select **container**. Name it `maven`, and then click **OK**.

   ![maven-set](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/maven-set.png)

3. Click **Add Nesting Steps** under the `maven` container to add a nested step. Select **shell** from the list, and enter the following command in the displayed dialog box. Click **OK** to finish.

   ```shell
   mvn -Dmaven.test.skip=true clean package
   ```

   ![nested-step-maven](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/nested-step-maven.png)

4. Click **Add Nesting Steps** again and select **shell**. Enter the following command in the command line to build a Docker image based on the [Dockerfile](https://github.com/kubesphere/devops-maven-sample/blob/sonarqube/Dockerfile-online). Click **OK** to confirm.

   {{< notice note >}}

   DO NOT omit the dot `.` at the end of the command.

   {{</ notice >}} 

   ```shell
   docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
   ```

   ![shell-command](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/shell-command.png)

5. Click **Add Nesting Steps** again and select **withCredentials**. Fill in the following fields in the displayed dialog box. Click **OK** to confirm.

   - **Credential Name**: Select the Docker Hub credentials you created, such as `dockerhub-id`.
   - **Password Variable**: Enter `DOCKER_PASSWORD`.
   - **Username Variable**: Enter `DOCKER_USERNAME`.

   {{< notice note >}} 

   For security reasons, the account information displays as variables in the script.

   {{</ notice >}} 

   ![docker-credential](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/docker-credential.png)

6. Click **Add Nesting Steps** (the first one) in the **withCredentials** step created above. Select **shell** and enter the following command in the displayed dialog box, which is used to log in to Docker Hub. Click **OK** to confirm.

   ```shell
   echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
   ```

   ![login-docker-command](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/login-docker-command.png)

7. Click **Add nesting steps** in the **withCredentials** step. Select **shell** and enter the following command to push the SNAPSHOT image to Docker Hub. Click **OK** to finish.

   ```shell
   docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
   ```

   ![push-snapshot-to-docker](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/push-snapshot-to-docker.png)

#### Stage 5: Generate the artifact

1. Click the plus icon on the right of the **Build and Push** stage to add a new stage to save artifacts and name it `Artifacts`. This example uses a JAR package.

   ![add-artifact-stage](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/add-artifact-stage.png)

2. With the **Artifacts** stage selected, click **Add Step** under **Task** and select **archiveArtifacts**. Enter `target/*.jar` in the displayed dialog box, which is used to set the archive path of artifacts in Jenkins. Click **OK** to finish.

   ![artifact-info](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/artifact-info.png)

#### Stage 6: Deploy to development

1. Click the plus icon on the right of the stage **Artifacts** to add the last stage. Name it `Deploy to Dev`. This stage is used to deploy resources to your development environment (namely, the project of `kubesphere-sample-dev`).

   ![develop-to-dev](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/develop-to-dev.png)

2. Click **Add Step** under the **Deploy to Dev** stage. Select **input** from the list and enter `@project-admin` in the **Message** field, which means the account `project-admin` will review this pipeline when it runs to this stage. Click **OK** to save it.

   ![input-message](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/input-message.png)

   {{< notice note >}}

   In KubeSphere 3.3, the account that can run a pipeline will be able to continue or terminate the pipeline if there is no reviewer specified. Pipeline creators, accounts with the role of `admin` in a project, or the account you specify will be able to continue or terminate a pipeline.

   {{</ notice >}}

3. Click **Add Step** under the **Deploy to Dev** stage again. Select **container** from the list, name it `maven`, and click **OK**.

4. Click **Add Nesting Steps** in the `maven` container step. Select **withCredentials** from the list, fill in the following fields in the displayed dialog box, and click **OK**.

   - **Credential Name**: Select the kubeconfig credential you created, such as `demo-kubeconfig`.
   - **Kubeconfig Variable**: Enter `KUBECONFIG_CONTENT`.

5. Click **Add Nesting Steps** in the **withCredentials** step. Select **shell** from the list, enter the following commands in the displayed dialog box, and click **OK**.

   ```shell
   mkdir ~/.kube
   echo "$KUBECONFIG_CONTENT" > ~/.kube/config
   envsubst < deploy/dev-ol/devops-sample-svc.yaml | kubectl apply -f -
   envsubst < deploy/dev-ol/devops-sample.yaml | kubectl apply -f -
   ```

6. If you want to receive email notifications when the pipeline runs successfully, click **Add Step** and select **mail** to add email information. Note that configuring the email server is optional, which means you can still run your pipeline if you skip this step.

   {{< notice note >}}

   For more information on configuring your email server, see [Set Email Server for KubeSphere Pipelines](../jenkins-email/).

   {{</ notice >}} 

7. When you finish the steps above, click **Save** in the lower-right corner. You can see the pipeline now has a complete workflow with each stage clearly listed on the pipeline. When you define a pipeline using the graphical editing panel, KubeSphere automatically creates its corresponding Jenkinsfile. Click **Edit Jenkinsfile** to view the Jenkinsfile.

   {{< notice note >}}
   
   On the **Pipelines** page, you can click <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" /> on the right side of the pipeline and then select **Copy** to create a copy of it. If you need to concurrently run multiple pipelines that don't contain multiple branches, you can select all of these pipelines and then click **Run** to run them in a batch. 
   
   {{</ notice >}}

### Step 5: Run a pipeline

1. You need to manually run the pipeline that is created through the graphical editing panel. Click **Run**, and you can see three string parameters defined in Step 3. Click **OK** to run the pipeline.

   ![run-pipeline](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/run-pipeline.png)
   
2. To see the status of a pipeline, go to the **Run Records** tab and click the record you want to view.

3. Wait for a while and the pipeline stops at the stage **Deploy to Dev** if it runs successfully. As the reviewer of the pipeline, `project-admin` needs to approve it before resources are deployed to the development environment.

   ![pipeline-successful](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/pipeline-successful.jpg)

4. Log out of KubeSphere and log back in to the console as `project-admin`. Go to your DevOps project and click the pipeline `graphical-pipeline`. Under the **Run Records** tab, click the record to be reviewed. To approve the pipeline, click **Proceed**.

### Step 6: View pipeline details

1. Log in to the console as `project-regular`. Go to your DevOps project and click the pipeline `graphical-pipeline`. Under the **Run Records** tab, click the record marked with **Successful** under **Status**.

2. If everything runs successfully, you can see that all stages are completed.

3. Click **View Logs** in the upper-right corner to inspect all the logs. Click each stage to see detailed logs of it. You can debug any problems based on the logs which also can be downloaded locally for further analysis.

### Step 7: Download the artifact

Click the **Artifacts** tab and then click the icon on the right to download the artifact.

![download-artifact](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/download-artifact.png)

### Step 8: View code analysis results

On the **Code Check** page, view the code analysis result of this example pipeline, which is provided by SonarQube. If you do not configure SonarQube in advance, this section is not available. For more information, see [Integrate SonarQube into Pipelines](../../../how-to-integrate/sonarqube/).

![sonarqube-result-detail](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonarqube-result-detail.png)

### Step 9: Verify Kubernetes resources

1. If every stage of the pipeline runs successfully, a Docker image will be automatically built and pushed to your Docker Hub repository. Ultimately, the pipeline automatically creates a Deployment and a Service in the project you set beforehand.

2. Go to the project (for example, `kubesphere-sample-dev` in this tutorial), click **Workloads** under **Application Workloads**, and you can see the Deployment appears in the list. 

3. In **Services**, you can find the port number of the example Service is exposed through a NodePort. To access the Service, visit `<Node IP>:<NodePort>`.

   {{< notice note >}}

   You may need to configure port forwarding rules and open the port in your security group before you access the Service.

   {{</ notice >}} 

4. Now that the pipeline has run successfully, an image will be pushed to Docker Hub. Log in to Docker Hub and check the result.

   ![dockerhub-image](/images/docs/v3.3/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/dockerhub-image.png)

5. The app is named `devops-sample` as it is the value of `APP_NAME` and the tag is the value of `SNAPSHOT-$BUILD_NUMBER`. `$BUILD_NUMBER` is the serial number of a record under the **Run Records** tab.

6. If you set the email server and add the email notification step in the final stage, you can also receive the email message.

## See Also

[Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/)

[Choose Jenkins Agent](../choose-jenkins-agent/)

[Set Email Server for KubeSphere Pipelines](../jenkins-email/)