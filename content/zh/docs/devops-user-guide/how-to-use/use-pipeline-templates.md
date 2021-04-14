---
title: "Use Pipeline Templates"
keywords: 'KubeSphere, Kubernetes, Jenkins, Graphical Pipelines, Pipeline Templates'
description: 'Understand how to use pipeline templates on KubeSphere.'
linkTitle: "Use Pipeline Templates"
weight: 11280
---

KubeSphere provides users with a graphical editing panel where all stages and steps of a Jenkins pipeline can be defined through interactive operations. In KubeSphere v3.1, two built-in pipeline templates are provided as frameworks of continuous integration (CI) and continuous delivery (CD).

This tutorial demonstrates how to use these two pipeline templates.

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to have a [Docker Hub](http://www.dockerhub.com/) account.
- You need to create a workspace, a DevOps project, and an account (`project-regular`). This account must be invited to the DevOps project with the `operator` role. See [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/) if they are not ready.

## Use CI Pipeline Template

### Step 1: Create credentials

1. Log in to the KubeSphere console as `project-regular`. Go to your DevOps project and create the following credential in **Credentials** under **Project Management**. For more information about how to create credentials, refer to [Credential Management](../credential-management/).

   | Credential ID | Type                | Where to use |
| ------------- | ------------------- | ------------ |
   | dockerhub-id  | Account Credentials | Docker Hub   |

   {{< notice note >}} 

   If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.
   
   {{</ notice >}} 
   
2. The credential created will appear in the list.

   ![dockerhub-credential](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/dockerhub-credential.png)

### Step 2: Create a pipeline

1. Go to **Pipelines** and click **Create** .

   ![create-pipeline](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/create-pipeline.png)

2. In the dialog that appears, name it `ci-pipeline` and click **Next**.

   ![ci-pipeline](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-pipeline.png)

3. On the **Advanced Settings** tab, click **Add Parameter** to add three string parameters as follows. These parameters will be used in the Docker commands in the pipeline. Click **Create** when you finish adding.

   ![add-parameter](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/add-parameter.png)

   | Parameter Type | Name                | Value       | Description                                                  |
   | -------------- | ------------------- | ----------- | ------------------------------------------------------------ |
   | String         | REGISTRY            | `docker.io` | This is the image registry address. This example uses `docker.io`. |
   | String         | DOCKERHUB_NAMESPACE | Docker ID   | You Docker Hub account or the organization name under the account. |
   | String         | APP_NAME            | `ci-sample` | The app name.                                                |

4. The pipeline created will appear in the list.

   ![ci-pipeline-created](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-pipeline-created.png)

### Step 3: Edit the pipeline

Click the pipeline to go to its detail page, and then click **Edit Pipeline** under the **Pipeline** tab. In the dialog that appears, click the pipeline template for continuous integration.

![edit-ci-pipeline](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/edit-ci-pipeline.png)

![ci-template](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-template.png)

On the graphical editing panel, there are two predefined stages with built-in steps. You can customize these steps based on your needs.

![ci-stages](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-stages.png)

For example, you can select **maven** from the **label** drop-down list.

![select-maven](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/select-maven.png)

#### Stage 1: clone code

1. Click **clone code** to select this stage, and you can see the built-in steps shown on the right. For the step of **container**, click the dustbin icon on the right of it.

   ![delete-container-step](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/delete-container-step.png)

2. Click **Add Step**.

   ![click-add-step](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/click-add-step.png)

3. Select **git** from the list on the right as the example code is pulled from GitHub. In the dialog that appears, enter the GitHub repository address `https://github.com/Felixnoo/devops-java-sample.git`. Note that this is an example and you need to use your own repository address. Click **OK** to finish.

   ![select-git](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/select-git.png)

   ![git-url](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/git-url.png)

#### Stage 2: build & push

1. Click **build & push** to select this stage, and you can see the built-in steps shown on the right. Click the dustbin icon on the right of the step **container**.

   ![delete-container-step-ci](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/delete-container-step-ci.png)

2. Click **Add Step** under **Task** and select **container**. Name it `maven`, and then click **OK**.

   ![enter-maven](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/enter-maven.png)

3. Click **Add nesting steps** under the `maven` container. Select **shell** from the list, and enter the following command in the pop-up window. Click **OK** to finish.

   ```shell
   mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
   ```

   ![maven-command](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/maven-command.png)

4. Click **Add nesting steps** again and select **shell**. Enter the following command in the command line and click **OK** to confirm.

   ```shell
   docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
   ```

   ![docker-build-command](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/docker-build-command.png)

5. Click **Add nesting steps** again and select **withCredentials**. Select the Docker Hub credential created in step 1, enter `DOCKER_PASSWORD` and `DOCKER_USERNAME` for **Password Variable** and **Username Variable** respectively, and then click **OK**.

   ![set-credential](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/set-credential.png)

6. Click **Add nesting steps** (the first one) in the **withCredentials** step created above. Select **shell** and enter the following command in the pop-up window. Click **OK** to confirm.

   ```bash
   echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
   ```

   ![shell-echo](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/shell-echo.png)

7. Click **Add nesting steps** in the **withCredentials** step. Select **shell** and enter the following command. Click **OK** to finish.

   ```shell
   docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
   ```

   ![docker-push-shell](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/docker-push-shell.png)

8. When you finish the steps above, click **Confirm** and **Save** in the bottom right corner.

9. On the detail page of **ci-pipeline**, click **Edit Jenkinsfile**, delete the codes as shown in below image, and then click **OK**.

   ![delete-code](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/delete-code.png)

### Step 4: Run the pipeline

1. On the detail page of **ci-pipeline**, click the **Run** button.

   ![click-run-ci](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/click-run-ci.png)

2. In the dialog that appears, you can see the three string parameters defined in step 2. Click **OK** to run the pipeline.

   ![param-input-ci](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/param-input-ci.png)

3. After a while, you can see the status of the pipeline shown as success.

   ![ci-success](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-success.png)

4. An image will be pushed to Docker Hub. Log in to Docker Hub and check the result.

   ![ci-sample-pushed](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-sample-pushed.png)

## Use CI & CD Pipeline Template

### Step 1: Create credentials and projects

1. Log in to the KubeSphere console as `project-regular`. Go to your DevOps project and create the following credentials in **Credentials** under **Project Management**.

   | Credential ID   | Type                | Where to use |
| --------------- | ------------------- | ------------ |
   | dockerhub-id    | Account Credentials | Docker Hub   |
| demo-kubeconfig | kubeconfig          | Kubernetes   |
   
2. In total, you have two credentials in the list.

   ![two-credentials](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/two-credentials.png)

3. Log out and log back in as `project-admin`. You need to create two projects `kubesphere-sample-dev` and `kubesphere-sample-prod` to use them as the development environment and production environment respectively. Make sure you invite the account `project-regular` to these two projects with the role of `operator`.

### Step 2: Create a pipeline 

1. Go to your DevOps project, and then click **Create** in **Pipelines**.
2. In the dialog that appears, name it `cicd-pipeline` and click **Next**.

   ![cicd-pipeline](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/cicd-pipeline.png)

3. On the **Advanced Settings** tab, click **Add Parameter** to add three string parameters as follows. These parameters will be used in the Docker command of the pipeline. Click **Create** when you finish adding.

   | Parameter Type | Name                | Value         | Description                                                  |
   | -------------- | ------------------- | ------------- | ------------------------------------------------------------ |
   | String         | REGISTRY            | `docker.io`   | This is the image registry address. This example uses `docker.io`. |
   | String         | DOCKERHUB_NAMESPACE | Docker ID     | You Docker Hub account or the organization name under the account. |
   | String         | APP_NAME            | `cicd-sample` | The app name.                                                |

4. The pipeline created will appear in the list.

   ![cicd-pipeline-created](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/cicd-pipeline-created.png)

### Step 3: Edit the pipeline

Click the pipeline to go to its detail page, and then click **Edit Pipeline** under the **Pipeline** tab. In the dialog that appears, click the pipeline template for continuous integration & delivery.

![click-cicd-template](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/click-cicd-template.png)

In the graphical editing panel, there are six predefined stages with built-in steps. Likewise, you can customize these steps based on your needs. For the **clone code** stage and the **build & push** stage, you can follow [the same operations as described above for CI pipeline](#step-3-edit-the-pipeline).

#### Stage 4: push latest

1. Click push latest to select this stage, and then click the wrench icon on the right of the first **sh** step.

   ![click-sh-cicd](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/click-sh-cicd.png)

2. In the dialog that appears, delete `-$BRANCH_NAME` and then click **OK**.

   ![delete-codes](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/delete-codes.png)

#### Stage 5: deploy to dev

1. Click **deploy to dev** to select this stage, and then click the wrench icon on the right of the step **kubernetesDeploy**.

   ![deploy-dev](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/deploy-dev.png)

2. In the dialog that appears, select `demo-kubeconfig` from the drop-down list, enter `deploy/no-branch-dev/**` for **Config File Path**, and then click **OK**.

   ![change-dev](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/change-dev.png)

#### Stage 6: deploy to production

1. Click **deploy to production** to select this stage, and then click the wrench icon on the right of the step **kubernetesDeploy**.

   ![select-prod](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/select-prod.png)

2. In the dialog that appears, select `demo-kubeconfig` from the drop-down list, enter `deploy/no-branch-prod/**` for **Config File Path**, and then click **OK**.

   ![change-prod](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/change-prod.png)

3. When you finish the steps above, click **Confirm** and **Save** in the bottom right corner.

4. On the detail page of **cicd-pipeline**, click **Edit Jenkinsfile**, delete the codes as shown in below image, and then click **OK**.

   ![delete-cicd-codes](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/delete-cicd-codes.png)

### Step 4: Run the pipeline

1. On the detail page of **cicd-pipeline**, click the **Run** button.

2. In the dialog that appears, you can see the three string parameters defined in step 2. Click **OK** to run the pipeline.

   ![cicd-param](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/cicd-param.png)

3. After a while, you can see the status of the pipeline shown as success.

   ![cicd-success](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/cicd-success.png)

4. An image will be pushed to Docker Hub. Log in to Docker Hub and check the result.

   ![cicd-sample-pushed](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/cicd-sample-pushed.png)

5. The sample applications `ks-sample-dev` and `ks-sample` will be deployed to `kubesphere-sample-dev` and `kubesphere-sample-prod` respectively with corresponding Deployments and Services created.

   #### Deployments

   ![ks-sample-dev](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ks-sample-dev.png)

   ![ks-sample](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ks-sample.png)

   #### Services

   ![ks-sample-dev-svc](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ks-sample-dev-svc.png)

   ![ks-sample-svc](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ks-sample-svc.png)

   {{< notice info >}}

   For more information about how to use the graphical editing panel, refer to [Create a Pipeline Using Graphical Editing Panels](../create-a-pipeline-using-graphical-editing-panel/).

   {{</ notice >}}

