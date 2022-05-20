---
title: "Deploy Apps in a Multi-cluster Project Using a Jenkinsfile"
keywords: 'Kubernetes, KubeSphere, Docker, DevOps, Jenkins, Multi-cluster'
description: 'Learn how to deploy apps in a multi-cluster project using a Jenkinsfile-based pipeline.'
linkTitle: "Deploy Apps in a Multi-cluster Project Using a Jenkinsfile"
weight: 11420
---

## Prerequisites

- You need to [enable the multi-cluster feature](../../../../docs/multicluster-management/) and create a workspace with your multiple clusters.
- You need to have a [Docker Hub](https://hub.docker.com/) account.
- You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/) on your host cluster.
- You need to use a user (for example, `project-admin`) with the role of `workspace-self-provisioner` to create a multi-cluster project and a DevOps project on the host cluster. This tutorial creates a multi-cluster project on the host cluster and one member cluster.
- You need to invite a user (for example, `project-regular`) to the DevOps project and grant it the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/), [Multi-cluster Management](../../../multicluster-management/) and [Multi-cluster Projects](../../../project-administration/project-and-multicluster-project/#multi-cluster-projects).

## Create a Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/), click your account in the upper-right corner, and select **Account Settings** from the menu.

2. Click **Security** in the left navigation pane and then click **New Access Token**.

3. In the displayed dialog box, enter a token name (`go-project-token`) and click **Create**.

4. Click **Copy and Close** and make sure you save the access token.

## Create Credentials

You need to create credentials in KubeSphere for the access token created so that the pipeline can interact with Docker Hub for pushing images. Besides, you also need to create kubeconfig credentials for the access to the Kubernetes cluster.

1. Log in to the web console of KubeSphere as `project-regular`. In your DevOps project, go to **Credentials** under **DevOps Project Settings** and then click **Create** on the **Credentials** page.

2. In the displayed dialog box, set a **Name**, which is used later in the Jenkinsfile, and select **Username and password** for **Type**. Enter your Docker Hub account name for **Username** and the access token just created for **Password/Token**. When you finish, click **OK**.

   {{< notice tip >}}

   For more information about how to create credentials, see [Credential Management](../../../devops-user-guide/how-to-use/devops-settings/credential-management/).

   {{</ notice >}} 

3. Log out of the KubeSphere web console and log back in as `project-admin`. Go to your DevOps project and click **Create** in **Credentials**. Select **kubeconfig** for **Type**. Note that KubeSphere automatically populates the **Content** field, which is the kubeconfig of the current account. Set a **Name** and click **OK**.
   
   {{< notice note >}}
   
   In future releases, you will be able to invite the account `project-regular` to your multi-cluster project and grant it the necessary role to create the kubeconfig credentials.
   
   {{</ notice >}}

## Create a Pipeline

With the above credentials ready, you can use the user `project-regular` to create a pipeline with an example Jenkinsfile as below.

1. To create a pipeline, click **Create** on the **Pipelines** page.

2. Set a name in the displayed dialog box and click **Next**.

3. In this tutorial, you can use default values for all the fields. On the **Advanced Settings** tab, click **Create**.

## Edit the Jenkinsfile

1. In the pipeline list, click this pipeline to go to its details page. Click **Edit Jenkinsfile** to define a Jenkinsfile and your pipeline runs based on it.

2. Copy and paste all the content below to the displayed dialog box as an example Jenkinsfile for your pipeline. You must replace the value of `DOCKERHUB_USERNAME`, `DOCKERHUB_CREDENTIAL`, `KUBECONFIG_CREDENTIAL_ID`, `MULTI_CLUSTER_PROJECT_NAME`, and `MEMBER_CLUSTER_NAME` with yours. When you finish, click **OK**.

   ```groovy
   pipeline {
     agent {
       label 'go'
     }
     
     environment {
       REGISTRY = 'docker.io'
       // Docker Hub username
       DOCKERHUB_USERNAME = 'Your Docker Hub username'
       APP_NAME = 'devops-go-sample'
       // ‘dockerhub’ is the Docker Hub credentials ID you created on the KubeSphere console
       DOCKERHUB_CREDENTIAL = credentials('dockerhub')
       // the kubeconfig credentials ID you created on the KubeSphere console
       KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'
       // mutli-cluster project name under your own workspace
       MULTI_CLUSTER_PROJECT_NAME = 'demo-multi-cluster'
       // the name of the member cluster where you want to deploy your app
       // in this tutorial, the apps are deployed on host cluster and only one member cluster
       // for more member clusters, please edit manifest/multi-cluster-deploy.yaml
       MEMBER_CLUSTER_NAME = 'Your member cluster name'
     }  
     
     stages {
       stage('docker login') {
         steps {
           container('go') {
             sh 'echo $DOCKERHUB_CREDENTIAL_PSW  | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
           }
         }
       }
       
       stage('build & push') {
         steps {
           container('go') {
             sh 'git clone https://github.com/yuswift/devops-go-sample.git'
             sh 'cd devops-go-sample && docker build -t $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME .'
             sh 'docker push $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME'
           }
         }
       }
       
       stage('deploy app to multi cluster') {
         steps {
            container('go') {
               withCredentials([
                 kubeconfigFile(
                   credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
                   variable: 'KUBECONFIG')
                 ]) {
                 sh 'envsubst < devops-go-sample/manifest/multi-cluster-deploy.yaml | kubectl apply -f -'
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

After you save the Jenkinsfile, click **Run**. If everything goes well, you will see the Deployment workload in your multi-cluster project.
