---
title: "Build and Deploy a Go Project"
keywords: 'Kubernetes, docker, DevOps, Jenkins, Go, KubeSphere'
description: 'Learn how to build and deploy a Go project using a KubeSphere pipeline.'
linkTitle: "Build and Deploy a Go Project"
weight: 11410
---

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to have a [Docker Hub](https://hub.docker.com/) account.
- You need to create a workspace, a DevOps project, a project, and a user (`project-regular`). This account needs to be invited to the DevOps project and the project for deploying your workload with the role `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/), click your account in the upper-right corner, and select **Account Settings** from the menu.

2. Click **Security** in the left navigation pane and then click **New Access Token**.

3. In the displayed dialog box, enter a token name (`go-project-token`) and click **Create**.

4. Click **Copy and Close** and make sure you save the access token.

## Create Credentials

You need to create credentials in KubeSphere for the access token created so that the pipeline can interact with Docker Hub for imaging pushing. Besides, you also create kubeconfig credentials for the access to the Kubernetes cluster.

1. Log in to the web console of KubeSphere as `project-regular`. In your DevOps project, go to **Credentials** under **DevOps Project Settings** and then click **Create** on the **Credentials** page.

2. In the displayed dialog box, set a **Name**, which is used later in the Jenkinsfile, and select **Username and password** for **Type**. Enter your Docker Hub account name for **Username** and the access token just created for **Password/Token**. When you finish, click **OK**.

   {{< notice tip >}}

For more information about how to create credentials, see [Credential Management](../../../devops-user-guide/how-to-use/credential-management/).

   {{</ notice >}}

3. Click **Create** again and select **kubeconfig** for **Type**. Note that KubeSphere automatically populates the **Content** field, which is the kubeconfig of the current user account. Set a **Name** and click **OK**.

## Create a Pipeline

With the above credentials ready, you can create a pipeline using an example Jenkinsfile as below.

1. To create a pipeline, click **Create** on the **Pipelines** page.

2. Set a name in the displayed dialog box and click **Next**.

3. In this tutorial, you can use default values for all the fields. On the **Advanced Settings** tab, click **Create**.

## Edit the Jenkinsfile

1. In the pipeline list, click the pipeline name to go to its details page. Click **Edit Jenkinsfile** to define a Jenkinsfile and your pipeline runs based on it.

2. Copy and paste all the content below to the displayed dialog box as an example Jenkinsfile for your pipeline. You must replace the value of `DOCKERHUB_USERNAME`, `DOCKERHUB_CREDENTIAL`, `KUBECONFIG_CREDENTIAL_ID`, and `PROJECT_NAME` with yours. When you finish, click **OK**.

   ```groovy
   pipeline {
     agent {
       label 'go'
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
           container ('go') {
             sh 'echo $DOCKERHUB_CREDENTIAL_PSW  | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
           }
         }
       }
   
       stage('build & push') {
         steps {
           container ('go') {
             sh 'git clone https://github.com/yuswift/devops-go-sample.git'
             sh 'cd devops-go-sample && docker build -t $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME .'
             sh 'docker push $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME'
           }
         }
       }
       stage ('deploy app') {
         steps {
           container('go') {
              withCredentials([
                kubeconfigFile(
                  credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
                  variable: 'KUBECONFIG')
                ]) {
                sh 'envsubst < devops-go-sample/manifest/deploy.yaml | kubectl apply -f -'
              }
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

1. After you finish the Jenkinsfile, you can see graphical panels are displayed on the dashboard. Click **Run** to run the pipeline.

2. In **Run Records**, you can see the status of the pipeline. It may take a while before it successfully runs.


## Verify Results

1. A **Deployment** is created in the project specified in the Jenkinsfile if the pipeline runs successfully.

2. Check the image that is pushed to Docker Hub.
   
   