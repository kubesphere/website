---
title: "Jenkinsfile out of scm"
keywords: "Kubernetes, docker, kubesphere, DevOps"
description: "The example of graphical editing DevOps"

linkTitle: "Jenkinsfile out of scm"
weight: 400
---

### Overview of the flow line

Building a visualization pipeline contains the following six stages (stage), first through a flowchart to briefly illustrate the workflow of the entire pipeline.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190516091714.png)

>Specify the tasks to be performed in each phase.
> - **Phase 1. Checkout SCM**: pulling the GitHub repository code.
> - **Phase 2. Unit test**: unit test, and continue with the following tasks only if the test is passed.
> - **Phase 3. Build and Push**: Build the image and push the tag `SNAPSHOT-$BUILD_NUMBER` to DockerHub (where `$BUILD_NUMBER` is the run serial number of the pipeline activity list).
> - **Phase 4. Artifacts**: Production and storage of artifacts (jar packages).
> - **Phase 5. Deploy to DEV**: Deploy the project to the Dev environment, pre-approval is required at this stage, and an email is sent if the deployment is successful.

### Create project

The CI/CD pipeline will eventually deploy the sample web to development based on the [yaml template file](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy/no-branch-dev) on the documentation site. The environment `kubesphere-sample-dev`, which corresponds to a project in KubeSphere, needs to be created . Create the `kubesphere-sample-dev` project with the project-admin account and invite `project-regular`, a regular user of the project, into the project to grant the `operator` role.

The `operator` role is granted to `project-regular`. [](https://pek3b.qingstor.com/kubesphere-docs/png/20190514112245.png)

### Create credentials

This example creates a pipeline that requires access to a total of 2 credentials from DockerHub, Kubernetes (to create KubeConfig for access to a running Kubernetes cluster).

Log in to KubeSphere using a regular user of the project to create the credentials for DockerHub and Kubernetes, the credential IDs are `dockerhub-id` and `demo-kubeconfig` respectively.

The 2 credentials have now been created and will be used in the pipeline.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514023424.png)

### Create a pipeline

Refer to the following steps to create and run a complete pipeline.

#### Step 1: Fill in the basic information

1. in the DevOps project, select **Pipeline** on the left, then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514114907.png)

2, in the pop-up window, enter the basic information of the pipeline, click on the completion of the ** Next **.

- Name: the name of the pipeline up a simple and clear name, easy to understand and search, such as graphical-pipeline
- DESCRIPTION INFORMATION: A brief introduction to the main features of the assembly line, to help further understand the role of the line
- Code Repository: Code Repository is not selected here

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514131501.png)

#### Step 2: Advanced Settings

Click **Add Parameter**, add **3 ** string parameters as follows, which will be used in the pipeline docker command, click OK when finished.

|parameter type|name| default value | description information |
|--|----|----|----|
|REGISTRY|repository address, this example uses docker.io |Image Registry|
|String parameter (string)|DOCKERHUB_NAMESPACE|Fill in your DockerHub account (it can also be the Organization name under the account)|DockerHub Namespace|
| string parameter (string)|APP_NAME|Application Name, fill devops-sample| Application Name | devops-sample|


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514115433.png)

### Visual editing lines

The visualization pipeline consists of six stages, and the following explains what steps and tasks are performed in each phase.

#### Phase 1: Pulling the source code (Checkout SCM)

Visual editing pages, divided into a structure editing area and a content editing area. By building each stage and step of the pipeline, the Jenkinsfile can be generated automatically, so users do not need to learn the syntax of the Jenkinsfile, which is very convenient. The platform also supports manual editing of Jenkinsfile, and the pipeline is divided into "declarative pipeline" and "scripted pipeline". [Official Jenkins documentation](https://jenkins.io/doc/book/pipeline/syntax/).

1. As follows, choose `node` for the agent type and `maven` for the label.

> Description: The Agent section specifies where the entire Pipeline or a specific phase will be executed in the Jenkins environment, depending on where the agent section is placed. /... /devops/jenkins-agent).

2. In the graphical build pipeline interface, click the **"+"**" sign in the structure editing area on the left to add a Stage, click **Add Step** in the interface, and name it as **Checkout SCM** in the right input box.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514132128.png)

3. Then click `Add Steps` under this stage. Select `git` on the right side, and at this stage pull the repository code through Git, and fill in the following information in the popup window.

 - Url: Fill in the URL of the GitHub sample repository `https://github.com/kubesphere/devops-java-sample.git`.
 - Credential ID: not required (for private repositories, such as Gitlab, you will need to create and fill in your credential ID beforehand).
 - Branch: you don't need to fill in the branch name here, otherwise the default is master branch.

 Click "OK" to save when you're done, and you can see the first stage of the build pipeline.

 ![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514132948.png)

#### Phase 2: Unit Test

1. Click **"+"** on the right side of `Checkout SCM` phase to continue to add a phase for executing unit tests in the container, named `Unit Test`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514133941.png)

2. click `Add Step` to select `Specify Container`, name it `maven`, and click `OK` when you are done.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514134044.png)

3. In the right `maven` container, click `Add nested steps`. Then select `shell`, enter the following command in the popup window, and click Save.

```shell
mvn clean -o -gs `pwd`/configuration/settings.xml test
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514134203.png)

#### Phase 3: Build and Push Mirroring

1.Click **"+"** on the right side of `Code Analysis` phase to continue adding a phase for building and pushing images to DockerHub, named `Build and Push`.

2.Click `Add Step` to select `Specify Container`, name it as `maven`, and click `OK` when finished.

3.Click `Add Nested Steps` on the right side, select `Shell` on the right side, and enter the following command in the popup window.

```shell
mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
```

4, continue on the right side by clicking `Add nested steps`, select `Shell`, in the popup window, enter the following command based on the repository [Dockerfile](https://github.com/kubesphere/devops-java-sample/blob/master/). Dockerfile-online) to build the Docker image, and click OK to save.

```shell
docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
```

5.Click `Add Nested Steps`, select `Add Credentials` on the right side, fill in the following information in the pop-up window, and click OK to save the information.

> Note: Because of the security of user information, all the account information will not appear in the script in clear text, but in the form of variables.

- Credential ID: Select the previously created DockerHub credentials such as `dockerhub-id`
- Password variable: `DOCKER_PASSWORD`
- User name variable: `DOCKER_USERNAME`


6. In the `Add Credentials' step, click `Add Nested Steps', select `Shell' on the right, and enter the following command in the popup window to log in to Docker Hub.

```shell
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

7. As above, go ahead and click `Add Nested Steps` Add `Shell` Enter a command to push the SNAPSHOT image to the Docker Hub.

```shell
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232407.png)

#### Phase 4: Artifacts (Artifacts)

1.Click **"+"** on the right side of `Build and Push` stage to add a stage for saving products.

2. Click `Add Step`, select `Save Artifacts`, type `target/*.jar` in the popup window to set the final save path of the .jar file, `(target/*.jar)` and save it to Jenkins, click OK.

Click "OK". [](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232447.png)

#### Phase 5: Deploy to DEV (Deploy to DEV)

1. Click **"+"** on the right side of `Artifacts` phase to add a final phase named `Deploy to DEV` for deploying container images to the development environment, i.e. `kubesphere-sample-dev` project.

2. Click `Add Steps`, select `Audit`, enter `@project-admin` in the popup window to assign project-admin user to perform pipeline audit, click OK.

3. Click `Add Steps`, select `KubernetesDeploy`, fill in the following information in the popup window, and click OK to save the information.

- Kubeconfig: Select `demo-kubeconfig`.
- Configuration file path: Enter `deploy/no-branch-dev/**`, which is the Kubernetes resource deployment [yaml file](https://github.com/kubesphere/devops-java-sample/tree/) for this example. master/deploy/no-branch-dev) relative path in the repository.

4. ditto add another step for sending notification emails to users after this deployment and successful execution of the pipeline. Click `Add Step`, select `Mail`, customize the recipient, CC, subject and content.

At this point, all six stages of the graphical build pipeline have been added successfully, click `Confirm → Save' and the visual build pipeline is created and the Jenkinsfile file is generated.

### Running the pipeline

1. Manually constructed pipeline in the platform need to run manually, click `Run`, input parameters pop-up window can be seen before the definition of the three string parameters, there is no need to modify, click `OK`, the pipeline will start running.

Click `OK` and the pipeline will start running. [](https://pek3b.qingstor.com/kubesphere-docs/png/20190514155513.png)

2. In the **Activities** list, you can see the running status of the pipeline, click `Activities` to view the details of its running activities.


3. Click the run number `1` in the activity list to enter the activity detail page of the number `1` to view the specific running status of the pipeline.

`1` to view the specific running status of the pipeline. ![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514160039.png)

4. Log out of the platform and switch to `project-admin`, then enter `graphical-pipeline` under the sample DevOps project. Then click `Activity` to enter the activity detail page with serial number `1`, you can see that the pipeline has been run to `deploy to dev` stage, click `Continue`, the pipeline activity status changes to **Running**.

Click `Continue` and the active state of the pipeline changes to **Running**. > Note: If the previous steps are configured correctly, you can see that the pipeline has successfully run to the last stage in a few minutes. Since we have added an audit step at the last stage and specified a user named `project-admin`, the pipeline will be paused at this point. So the pipeline will pause at this point and wait for the auditor `project-admin` to log in to the pipeline run page to trigger it manually. At this point, the reviewer can test the build image and further review the entire process, and if the review passes, click ** to continue** and finally deploy it to the development environment.

The final deployment to the development environment will be made. ![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514160931.png)

### View the assembly line

1. After a few minutes, the pipeline will run successfully. Click on the pipeline under the `Activity` list to see the sequence number of the currently running pipeline, the page shows the running status of each step in the pipeline. The black boxes mark the names of the steps in the pipeline. The six stages of the pipeline in the example are the six stages created above.

In the example, the six stages of the pipeline are the six stages created above. [](https://pek3b.qingstor.com/kubesphere-docs/png/20190514161723.png)

2. the current page, click on the upper right of the `View Log` to view the pipeline operation log. The page shows the specific logs of each step, running status and time information, click on a specific stage on the left to expand the view of its specific logs, if there is an error can be analyzed according to the log information to locate the problem, the logs can be downloaded to the local view.

The logs can be downloaded and viewed locally. [](https://pek3b.qingstor.com/kubesphere-docs/png/20190514161819.png)

### View product

Click on `Activity` and then select `Products` to view the jar packages saved by the pipeline during operation.

Click on it to download it locally. [](https://pek3b.qingstor.com/kubesphere-docs/png/20190514163948.png)

### Verify the results of the run

If each step of the pipeline is executed successfully, the final Docker image built by the pipeline will also be successfully pushed to DockerHub, where we have configured the Docker image repository in Jenkinsfile. The image with the tag SNAPSHOT-xxx has been pushed to DockerHub and is finally deployed as a deployment and service in KubeSphere.

1. switch to `project-regular`, log into KubeSphere, go to `kubesphere-sample-dev` project, click **Workload → Deployment** on the left menu bar, you can see that ks-sample-dev has been created successfully.

|You can see that ks-sample-dev has been created successfully.
|--|--|--|--|
|Dev| `http://{$Virtual IP}:{$8080}` <br> Or `http://{$Intranet/Public IP}:{$30861}`| kubesphere-sample-dev| ks-sample-dev|ks-sample-dev|

**Views deployment**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514164023.png)

2. Select **Network & Services → Services** from the menu bar to view the corresponding created service, you can see the exposed NodePort is `30861`.

**You can see the exposed NodePort of the service is `30861`.
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514165026.png)

3: Looking at the images pushed to DockerHub, you can see that `devops-sample` is the value of **APP_NAME**, and tag is the value of `SNAPSHOT-$BUILD_NUMBER` (`$BUILD_NUMBER` corresponds to the active run serial number), where tag is the image of `SNAPSHOT-1`, which is the image used by `ks-sample-dev` deployment.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514164245.png)

4, Since we set up email notifications at the last stage of the pipeline, you can verify the received build notification email in your mailbox.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514200639.png)

### Access to sample services

To access the deployed demo service in an intranet environment, either log in to the cluster node via SSH or use the cluster administrator to log in to KubeSphere Verify access by entering the following command in the web kubectl, where Virtual IP and NodePort can be viewed in the service under the corresponding project.

```shell
# curl {$Virtual IP}:{$Port} or curl {$Internal IP}:{$NodePort}
curl 10.233.4.154:8080
Really appreaciate your star, that's the power of our life.
```

> Tip: If you need to access the service from the external network, you may need to bind the public EIP and configure the port forwarding and firewall rules. In the port forwarding rule, forward **internet port** 30861 to **source port** 30861, and then open this **source port** in the firewall to ensure that external traffic can pass through this port before external access. 

At this point, the graphical build pipeline example has been completed.
