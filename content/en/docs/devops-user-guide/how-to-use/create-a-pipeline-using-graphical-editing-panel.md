---
title: "Create a Pipeline Using Graphical Editing Panels"
keywords: 'KubeSphere, Kubernetes, jenkins, cicd, graphical pipelines'
description: 'How to create a pipeline using graphical editing panels.'
linkTitle: 'Create a Pipeline Using Graphical Editing Panels'
weight: 11220
---

A graphical editing panel in KubeSphere contains all the necessary operations used in Jenkins [stages](https://www.jenkins.io/doc/book/pipeline/#stage) and [steps](https://www.jenkins.io/doc/book/pipeline/#step). You can directly define these stages and steps on the highly responsive and interactive panel without creating any Jenkinsfile.

This tutorial demonstrates how to create a pipeline through graphical editing panels in KubeSphere. During the whole process, you do not need to create any Jenkinsfile manually as KubeSphere will automatically generate one based on your settings on the editing panels. When the pipeline successful runs, it creates a Deployment and a Service accordingly in your development environment and pushes an image to Docker Hub.

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to have a [Docker Hub](http://www.dockerhub.com/) account.
- You need to create a workspace, a DevOps project, and an account (`project-regular`). This account must be invited to the DevOps project with the `operator` role. See [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project/) if they are not ready.
- Set CI dedicated nodes to run the pipeline. For more information, see [Set CI Node for Dependency Cache](../set-ci-node/).
- Configure your email server for pipeline notifications (Optional). For more information, see [Set Email Server for KubeSphere Pipelines](../../how-to-use/jenkins-email/).
- Configure SonarQube to include code analysis as part of the pipeline (Optional). For more information, see [Integrate SonarQube into Pipelines](../../../devops-user-guide/how-to-integrate/sonarqube/).

## Pipeline Overview

This example pipeline includes the following six stages.

![Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20190516091714.png#align=left&display=inline&height=1278&originHeight=1278&originWidth=2190&search=&status=done&width=2190)

{{< notice note >}} 

- **Stage 1. Checkout SCM**: Pull source code from a GitHub repository.
- **Stage 2. Unit test**: It will not proceed with the next stage unit the test is passed.
- **Stage 3. Code analysis**: Configure SonarQube for static code analysis.
- **Stage 4. Build and push**: Build an image and push it to Docker Hub with the tag `snapshot-$BUILD_NUMBER`, the `$BUILD_NUMBER` of which is the record serial number in the pipeline’s activity list.
- **Stage 5. Artifacts**: Generate an artifact (jar package) and save it.
- **Stage 6. Deploy to DEV**: Create a Deployment and a Service in the development environment. It requires review in this stage. An email notification will be sent after the Deployment is successful.

{{</ notice >}}

## Hands-on Lab

### Step 1: Create credentials

1. Log in to the KubeSphere console as `project-regular`. Go to your DevOps project and create the following credentials in **Credentials** under **Project Management**. For more information about how to create credentials, see [Credential Management](../credential-management/).

   {{< notice note >}} 

   If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.

   {{</ notice >}} 

   | Credential ID   | Type                | Where to use |
   | --------------- | ------------------- | ------------ |
   | dockerhub-id    | Account Credentials | Docker Hub   |
   | demo-kubeconfig | kubeconfig          | Kubernetes   |

2. You need to create an additional credential ID (`sonar-token`) for SonarQube, which is used in stage 3 (Code analysis) mentioned above. Refer to [Create SonarQube Token for New Project](../../../devops-user-guide/how-to-integrate/sonarqube/#create-sonarqube-token-for-new-project) to use the token for the **secret** field below. Click **OK** to finish.

   ![sonar-token](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonar-token.jpg)

3. In total, you have three credentials in the list.

   ![credential-list](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/credential-list.jpg)

### Step 2: Create a project

In this tutorial, the example pipeline will deploy the [sample](https://github.com/kubesphere/devops-java-sample/tree/sonarqube) app to a project. Hence, you must create the project (for example, `kubesphere-sample-dev`) in advance. The Deployment and Service of the app will be created automatically in the project once the pipeline runs successfully.

You can use the account `project-admin` to create the project. Besides, this account is also the reviewer of the CI/CD pipeline. Make sure the account `project-regular` is invited to the project with the role of `operator`. For more information, see [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project/).

### Step 3: Create a pipeline

1. Make sure you have logged in KubeSphere as `project-regular`, and then go to your DevOps project. Click **Create** in **Pipelines**.

   ![create-pipeline](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/create-pipeline.jpg)

2. In the dialog that appears, name it `graphical-pipeline` and click **Next**.

   ![basic-info](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/basic-info.jpg)

3. On the **Advanced Settings** page, click **Add Parameter** to add three string parameters as follows. These parameters will be used in the Docker command of the pipeline. Click **Create** when you finish adding.

   ![add-parameter](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/add-parameter.jpg)

   | Parameter Type | Name                | Value           | Description                                                  |
   | -------------- | ------------------- | --------------- | ------------------------------------------------------------ |
   | String         | REGISTRY            | `docker.io`     | This is the image registry address. This example uses `docker.io`. |
   | String         | DOCKERHUB_NAMESPACE | Docker ID       | You Docker Hub account or the organization name under the account. |
   | String         | APP_NAME            | `devops-sample` | The app name.                                                |

   {{< notice note >}}

   For other fields, use the default values directly or refer to [Pipeline Settings](../pipeline-settings/) to customize the configuration.

   {{</ notice >}} 

4. The pipeline created will appear in the list.

   ![pipeline-list](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/pipeline-list.jpg)

### Step 4: Edit the pipeline

Click the pipeline to go to its detail page. To use graphical editing panels, click **Edit Pipeline** under the tab **Pipeline**. This pipeline consists of six stages. Follow the steps below to set each stage.

![edit-pipeline](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/edit-pipeline.jpg)

{{< notice note >}}

You can also click **Edit Jenkinsfile** to create a Jenkinsfile manually for your pipeline.

{{</ notice >}} 

#### Stage 1: Pull source code (Checkout SCM)

A graphical editing panel includes two areas - **canvas** on the left and **content** on the right. It automatically generates a Jenkinsfile based on how you configure different stages and steps, which is much more user-friendly for developers.

{{< notice note >}}

Pipelines include [declarative pipelines](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) and [scripted pipelines](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline). Currently, you can create declarative pipelines through the panel. For more information about pipeline syntax, see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/).

{{</ notice >}}

1. On the graphical editing panel, select **node** from the **Type** drop-down list and input `maven` for **label**.

   {{< notice note >}}

   `agent` is used to define the execution environment. The `agent` directive tells Jenkins where and how to execute the pipeline. For more information, see [Choose Jenkins Agent](../choose-jenkins-agent/).

   {{</ notice >}} 

   ![graphical-panel](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/graphical-panel.jpg)

2. To add a stage, click the plus icon on the left. Click the box above the **Add Step** area and set a name (for example, `Checkout SCM`) for the stage in the field **Name** on the right.

   ![edit-panel](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/edit-panel.jpg)

3. Click **Add Step**. Select **git** from the list as the example code is pulled from GitHub. In the dialog that appears, fill in the required field. Click **OK** to finish.

   - **Url**. Enter the GitHub repository address `https://github.com/kubesphere/devops-java-sample.git`. Note that this is an example and you need to use your own repository address.
   - **Credential ID**. You do not need to enter the Credential ID for this tutorial. 
   - **Branch**. It defaults to the master branch if you leave it blank. Enter `sonarqube` or leave it blank if you do not need the code analysis stage.

   ![enter-repo-url](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/enter-repo-url.jpg)

4. The first stage is now set.

   ![first-stage-set](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/first-stage-set.jpg)

#### Stage 2: Unit test

1. Click the plus icon on the right of stage 1 to add a new stage to perform a unit test in the container. Name it `Unit Test`.

   ![unit-test](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/unit-test.jpg)

2. Click **Add Step** and select **container** from the list. Name it `maven` and then click **OK**.

   ![container](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/container.jpg)

3. Click **Add nesting steps** to add a nested step under the `maven` container. Select **shell** from the list and enter the following command in the command line. Click **OK** to save it.

   ```shell
   mvn clean -o -gs `pwd`/configuration/settings.xml test
   ```

   {{< notice note >}}

   You can specify a series of [steps](https://www.jenkins.io/doc/book/pipeline/syntax/#steps) to be executed in a given stage directive on the graphical editing panel.

   {{</ notice >}} 

   ![shell](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/shell.jpg)
   
   ![unit-test-set](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/unit-test-set.jpg)
   

#### Stage 3: Code analysis (Optional)

This stage uses SonarQube to test your code. You can skip this stage if you do not need the analysis.

1. Click the plus icon on the right of the `Unit Test` stage to add a stage for SonarQube code analysis in the container. Name it `Code Analysis`.

   ![code-analysis-stage](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/code-analysis-stage.jpg)

2. Click **Add Step** under **Task** in **Code Analysis** and select **container**. Name it `maven` and click **OK**.

   ![maven-container](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/maven-container.jpg)

3. Click **Add nesting steps** under the `maven` container to add a nested step. Click **withCredentials** and select the SonarQube token (`sonar-token`) from the **Credential ID** list. Input `SONAR_TOKEN` for **Text Variable**, then click **OK**.

   ![sonarqube-credentials](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonarqube-credentials.jpg)

4. Under the **withCredentials** step, click **Add Nesting steps** to add a nested step for it.

   ![nested-step](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/nested-step.jpg)

5. Click **withSonarQubeEnv**. In the dialog that appears, do not change the default name `sonar` and click **OK** to save it.

   ![sonar](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonar.jpg)

6. Under the **withSonarQubeEnv** step, click **Add Nesting steps** to add a nested step for it.

   ![add-nested-step](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/add-nested-step.jpg)

7. Click **shell** and enter the following command in the command line for the sonarqube branch and authentication. Click **OK** to finish.

   ```shell
   mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.login=$SONAR_TOKEN
   ```

   ![sonarqube-shell-new](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonarqube-shell-new.jpg)

8. Click **Add nesting steps** (the third one) for the **container** step directly and select **timeout**. Input `1` for time and select **Hours** for unit. Click **OK** to finish.

   ![add-nested-step-2](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/add-nested-step-2.jpg)

   ![timeout](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/timeout.jpg)

9. Click **Add nesting steps** for the **timeout** step and select **waitforSonarQubeGate**. Select **Start the follow-up task after the inspection** in the pop-up dialog. Click **OK** to save it.

   ![waitforqualitygate](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/waitforqualitygate.jpg)

   ![sonar-ready](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonar-ready.jpg)

#### Stage 4: Build and push the image

1. Click the plus icon on the right of the previous stage to add a new stage to build and push images to Docker Hub. Name it `Build and Push`.

   ![build-and-push-image](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/build-and-push-image.jpg)

2. Click **Add Step** under **Task** and select **container**. Name it `maven`, and then click **OK**.

   ![maven-set](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/maven-set.jpg)

3. Click **Add nesting steps** under the `maven` container to add a nested step. Select **shell** from the list, and enter the following command in the pop-up window. Click **OK** to finish.

   ```shell
   mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
   ```

   ![nested-step-maven](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/nested-step-maven.jpg)

4. Click **Add nesting steps** again and select **shell**. Enter the following command in the command line to build a Docker image based on the [Dockerfile](https://github.com/kubesphere/devops-java-sample/blob/sonarqube/Dockerfile-online). Click **OK** to confirm.

   {{< notice note >}}

   DO NOT omit the dot `.` at the end of the command.

   {{</ notice >}} 

   ```shell
   docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
   ```

   ![shell-command](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/shell-command.jpg)

5. Click **Add nesting steps** again and select **withCredentials**. Fill in the following fields in the dialog. Click **OK** to confirm.

   - **Credential ID**: Select the Docker Hub credentials you created, such as `dockerhub-id`.
   - **Password Variable**: Enter `DOCKER_PASSWORD`.
   - **Username Variable**: Enter `DOCKER_USERNAME`.

   {{< notice note >}} 

   For security reasons, the account information displays as variables in the script.

   {{</ notice >}} 

   ![docker-credential](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/docker-credential.jpg)

6. Click **Add nesting steps** (the first one) in the **withCredentials** step created above. Select **shell** and enter the following command in the pop-up window, which is used to log in to Docker Hub. Click **OK** to confirm.

   ```shell
   echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
   ```

   ![login-docker-command](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/login-docker-command.jpg)

7. Click **Add nesting steps** in the **withCredentials** step. Select **shell** and enter the following command to push the SNAPSHOT image to Docker Hub. Click **OK** to finish.

   ```shell
   docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
   ```

   ![push-snapshot-to-docker](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/push-snapshot-to-docker.jpg)

#### Stage 5: Generate the artifact

1. Click the plus icon on the right of the **Build and Push** stage to add a new stage to save artifacts and name it `Artifacts`. This example uses a jar package.

   ![add-artifact-stage](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/add-artifact-stage.jpg)

2. With the **Artifacts** stage selected, click **Add Step** under **Task** and select **archiveArtifacts**. Enter `target/*.jar` in the dialog, which is used to set the archive path of artifacts in Jenkins. Click **OK** to finish.

   ![artifact-info](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/artifact-info.jpg)

#### Stage 6: Deploy to development

1. Click the plus icon on the right of the stage **Artifacts** to add the last stage. Name it `Deploy to Dev`. This stage is used to deploy resources to your development environment (namely, the project of `kubesphere-sample-dev`).

   ![develop-to-dev](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/develop-to-dev.jpg)

2. Click **Add Step** under the **Deploy to Dev** stage. Select **input** from the list and enter `@project-admin` in the **Message** field, which means the account `project-admin` will review this pipeline when it runs to this stage. Click **OK** to save it.

   ![input-message](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/input-message.jpg)

3. Click **Add Step** under the **Deploy to Dev** stage again. Select **kubernetesDeploy** from the list and fill in the following fields in the dialog. Click **OK** to save it.

   - **Kubeconfig**: Select the Kubeconfig you created, such as `demo-kubeconfig`.
   - **Configuration File Path**: Enter `deploy/no-branch-dev/**`, which is the relative path of the Kubernetes resource [YAML](https://github.com/kubesphere/devops-java-sample/tree/sonarqube/deploy/no-branch-dev) file in the code repository.

   ![kubernetesDeploy](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/kubernetesDeploy.jpg)

4. If you want to receive email notifications when the pipeline runs successfully, click **Add Step** and select **mail** to add email information. Note that configuring the email server is optional, which means you can still run your pipeline if you skip this step.

   {{< notice note >}}

   For more information on configuring your email server, see [Set Email Server for KubeSphere Pipelines](../jenkins-email/).

   {{</ notice >}} 

5. When you finish the steps above, click **Confirm** and **Save** in the bottom right corner. You can see the pipeline now has a complete workflow with each stage clearly listed on the pipeline. When you define a pipeline using the graphical editing panel, KubeSphere automatically creates its corresponding Jenkinsfile. Click **Edit Jenkinsfile** to view the Jenkinsfile.

   ![pipeline-done](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/pipeline-done.jpg)

### Step 5: Run a pipeline

1. You need to manually run the pipeline that is created through the graphical editing panel. Click **Run**, and you can see three string parameters defined in Step 3. Click **OK** to run the pipeline.

   ![run-pipeline](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/run-pipeline.jpg)
   
2. To see the status of a pipeline, go to the **Activity** tab and click the record you want to view.

3. Wait for a while and the pipeline stops at the stage **Deploy to Dev** if it runs successfully. As the reviewer of the pipeline, `project-admin` needs to approve it before resources are deployed to the development environment.

   ![pipeline-successful](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/pipeline-successful.jpg)

4. Log out of KubeSphere and log back in the console as `project-admin`. Go to your DevOps project and click the pipeline `graphical-pipeline`. Under the **Activity** tab, click the record to be reviewed. To approve the pipeline, click **Proceed**.

### Step 6: View pipeline details

1. Log back in the console as `project-regular`. Go to your DevOps project and click the pipeline `graphical-pipeline`. Under the **Activity** tab, click the record marked with **Success** under **Status**.

2. If everything runs successfully, you can see that all stages are completed.

   ![complete](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/complete.jpg)

3. Click **Show Logs** in the top right corner to inspect all the logs. Click each stage to see detailed logs of it. You can debug any problems based on the logs which also can be downloaded locally for further analysis.

   ![inspect-logs](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/inspect-logs.jpg)

### Step 7: Download the artifact

Click the **Artifacts** tab and then click the icon on the right to download the artifact.

![download-artifact](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/download-artifact.jpg)

### Step 8: View code analysis results

On the **Code Quality** page, view the code analysis result of this example pipeline, which is provided by SonarQube. If you do not configure SonarQube in advance, this section is not available. For more information, see [Integrate SonarQube into Pipelines](../../../devops-user-guide/how-to-integrate/sonarqube/).

![sonarqube-result-detail](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/sonarqube-result-detail.jpg)

### Step 9: Verify Kubernetes resources

1. If every stage of the pipeline runs successfully, a Docker image will be automatically built and pushed to your Docker Hub repository. Ultimately, the pipeline automatically creates a Deployment and a Service in the project you set beforehand.

2. Go to the project (i.e. `kubesphere-sample-dev` in this tutorial), click **Workloads** under **Application Workloads**, and you can see the Deployment displays in the list. 

   ![view-deployment](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/view-deployment.jpg)

3. In **Services**, you can find the port number of the example Service is exposed through NodePort. To access the Service, visit `node IP:port number`.

   ![service-exposed](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/service-exposed.jpg)

   ![access-service](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/access-service.jpg)

   {{< notice note >}}

   You may need to configure port forwarding rules and open the port in your security group before you access the Service.

   {{</ notice >}} 

4. Now that the pipeline has run successfully, an image will be pushed to Docker Hub. Log in to Docker Hub and check the result.

   ![dockerhub-image](/images/docs/devops-user-guide/using-devops/create-a-pipeline-using-graphical-editing-panels/dockerhub-image.jpg)

5. The app is named `devops-sample` as it is the value of `APP_NAME` and the tag is the value of `SNAPSHOT-$BUILD_NUMBER`. `$BUILD_NUMBER` is the serial number of a record under the **Activity** tab.

6. If you set the email server and add the email notification step in the final stage, you can also receive the email message.

## See Also

[Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/)

[Choose Jenkins Agent](../choose-jenkins-agent/)

[Set Email Server for KubeSphere Pipelines](../jenkins-email/)