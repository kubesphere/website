---
title: "Build and Deploy a Go Project"
keywords: 'Kubernetes, docker, devops, jenkins, go, KubeSphere'
description: 'Learn how to build and deploy a Go project using a KubeSphere pipeline.'
linkTitle: "Build and Deploy a Go Project"
weight: 11410
---

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to have a [Docker Hub](https://hub.docker.com/) account.
- You need to create a workspace, a DevOps project, a project, and a user (`project-regular`). This account needs to be invited to the DevOps project and the project for deploying your workload with the role `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/) and select **Account Settings** from the menu in the top-right corner.

   ![dockerhub-settings](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/dockerhub-settings.jpg)

2. Click **Security** and **New Access Token**.

   ![dockerhub-create-token](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/dockerhub-create-token.jpg)

3. Enter the token name and click **Create**.

   ![dockerhub-token-ok](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/dockerhub-token-ok.jpg)

4. Click **Copy and Close** and remember to save the access token.

   ![dockerhub-token-copy](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/dockerhub-token-copy.jpg)

## Create Credentials

You need to create credentials in KubeSphere for the access token created so that the pipeline can interact with Docker Hub for imaging pushing. Besides, you also create kubeconfig credentials for the access to the Kubernetes cluster.

1. Log in to the web console of KubeSphere as `project-regular`. Go to your DevOps project and click **Create** in **Credentials**.

   ![create-dockerhub-id](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/create-dockerhub-id.png)

2. In the dialog that appears, set a **Credential ID**, which will be used later in the Jenkinsfile, and select **Account Credentials** for **Type**. Enter your Docker Hub account name for **Username** and the access token just created for **Token/Password**. When you finish, click **OK**.

   ![credential-docker-create](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/credential-docker-create.jpg)

   {{< notice tip >}}

For more information about how to create credentials, see [Credential Management](../../../devops-user-guide/how-to-use/credential-management/).

   {{</ notice >}}

3. Click **Create** again and select **kubeconfig** for **Type**. Note that KubeSphere automatically populates the **Content** field, which is the kubeconfig of the current user account. Set a **Credential ID** and click **OK**.

   ![create-kubeconfig](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/create-kubeconfig.jpg)

## Create a Pipeline

With the above credentials ready, you can create a pipeline using an example Jenkinsfile as below.

1. To create a pipeline, click **Create** on the **Pipelines** page.

   ![create-pipeline](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/create-pipeline.png)

2. Set a name in the pop-up window and click **Next** directly.

   ![set-pipeline-name](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/set-pipeline-name.png)

3. In this tutorial, you can use default values for all the fields. In **Advanced Settings**, click **Create** directly.

   ![create-pipeline-2](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/create-pipeline-2.png)

## Edit the Jenkinsfile

1. In the pipeline list, click this pipeline to go to its detail page. Click **Edit Jenkinsfile** to define a Jenkinsfile and your pipeline runs based on it.

   ![edit-jenkinsfile](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/edit-jenkinsfile.png)

2. Copy and paste all the content below to the pop-up window as an example Jenkinsfile for your pipeline. You must replace the value of `DOCKERHUB_USERNAME`,  `DOCKERHUB_CREDENTIAL`, `KUBECONFIG_CREDENTIAL_ID`,  and `PROJECT_NAME` with yours. When you finish, click **OK**.

   ```groovy
   pipeline {  
     agent {
       node {
         label 'maven'
       }
     }
   
     environment {
       // the address of your Docker Hub registry
       REGISTRY = 'docker.io'
       // your Docker Hub username
       DOCKERHUB_USERNAME = 'Docker Hub Username'
       // Docker image name
       APP_NAME = 'devops-go-sample'
       // ‘dockerhubid’ is the credentials ID you created in KubeSphere with Docker Hub Access Token
       DOCKERHUB_CREDENTIAL = credentials('dockerhubid')
       // the kubeconfig credentials ID you created in KubeSphere
       KUBECONFIG_CREDENTIAL_ID = 'go'
       // the name of the project you created in KubeSphere, not the DevOps project name
       PROJECT_NAME = 'devops-go'
     }
   
     stages {
       stage('docker login') {
         steps{
           container ('maven') {
             sh 'echo $DOCKERHUB_CREDENTIAL_PSW  | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
               }
             }  
           }
   
       stage('build & push') {
         steps {
           container ('maven') {
             sh 'git clone https://github.com/yuswift/devops-go-sample.git'
             sh 'cd devops-go-sample && docker build -t $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME .'
             sh 'docker push $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME'
             }
           }
         }
       stage ('deploy app') {
         steps {
           container('maven') {
             kubernetesDeploy(configs: 'devops-go-sample/manifest/deploy.yaml', kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
             }
           }
         }
       }
     }
   ```

   {{< notice note >}}

If your pipeline runs successfully, images will be pushed to Docker Hub. If you are using Harbor, you cannot pass the parameter to `docker login -u`  via the Jenkins credential with environment variables. This is because every Harbor robot account username contains a  `$` character, which will be converted to `$$` by Jenkins when used by environment variables. [Learn more](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/).

   {{</ notice >}}

## Run the Pipeline

1. After you finish the Jenkinsfile, you can see graphical panels display on the dashboard. Click **Run** to run the pipeline.

   ![run-pipeline](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/run-pipeline.png)

2. In **Activity**, you can see the status of the pipeline. It may take a while before it successfully runs.

   ![pipeline-running](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/pipeline-running.png)


## Verify Results

1. A **Deployment** will be created in the project specified in the Jenkinsfile if the pipeline runs successfully.

   ![view-deployments](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/view-deployments.png)

2. Check whether the image is pushed to Docker Hub as shown below:

   ![docker-image-1](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/docker-image-1.jpg)

   ![docker-image-2](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/docker-image-2.jpg)
   
   