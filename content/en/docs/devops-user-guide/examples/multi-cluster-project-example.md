---
title: "Deploy Apps in a Multi-cluster Project Using a Jenkinsfile"
keywords: 'Kubernetes, KubeSphere, docker, devops, jenkins, multi-cluster'
description: 'Learn how to deploy apps in a multi-cluster project using a Jenkinsfile-based pipeline.'
linkTitle: "Deploy Apps in a Multi-cluster Project Using a Jenkinsfile"
weight: 11420
---

## Prerequisites

- You need to [enable the multi-cluster feature](../../../../docs/multicluster-management/).
- You need to have a [Docker Hub](https://hub.docker.com/) account.
- You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/) on your host cluster.
- You need to create a workspace with multiple clusters, a DevOps project on your **host** cluster, a multi-cluster project (in this tutorial, this multi-cluster project is created on the host cluster and one member cluster), and an account (`project-regular`). This account needs to be invited to the DevOps project and the multi-cluster project with the role `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/), [Multi-cluster Management](../../../multicluster-management/) and [Multi-cluster Projects](../../../project-administration/project-and-multicluster-project/#multi-cluster-projects).

## Create a Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/) and select **Account Settings** from the menu in the top-right corner.

   ![dockerhub-settings](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/dockerhub-settings.jpg)

2. Click **Security** and **New Access Token**.

   ![dockerhub-create-token](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/dockerhub-create-token.jpg)

3. Enter the token name and click **Create**.

   ![dockerhub-token-ok](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/dockerhub-token-ok.jpg)

4. Click **Copy and Close** and remember to save the access token.

   ![dockerhub-token-copy](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/dockerhub-token-copy.jpg)

## Create Credentials

You need to create credentials in KubeSphere for the access token created so that the pipeline can interact with Docker Hub for imaging pushing. Besides, you also need to create kubeconfig credentials for the access to the Kubernetes cluster.

1. Log in to the web console of KubeSphere as `project-regular`. Go to your DevOps project and click **Create** in **Credentials**.

   ![create-dockerhub-id](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/create-dockerhub-id.jpg)

2. In the dialog that appears, set a **Credential ID**, which will be used later in the Jenkinsfile, and select **Account Credentials** for **Type**. Enter your Docker Hub account name for **Username** and the access token just created for **Token/Password**. When you finish, click **OK**.

   ![credential-docker-create](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/credential-docker-create.jpg)

   {{< notice tip >}}

   For more information about how to create credentials, see [Credential Management](../../../devops-user-guide/how-to-use/credential-management/).

   {{</ notice >}} 

3. Click **Create** again and select **kubeconfig** for **Type**. Note that KubeSphere automatically populates the **Content** field, which is the kubeconfig of the current user account. Set a **Credential ID** and click **OK**.

   ![create-kubeconfig](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/create-kubeconfig.jpg)

## Create a Pipeline

With the above credentials ready, you can create a pipeline using an example Jenkinsfile as below.

1. To create a pipeline, click **Create** on the **Pipelines** page.

   ![create-pipeline](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/create-pipeline.jpg)

2. Set a name in the pop-up window and click **Next** directly.

   ![set-pipeline-name](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/set-pipeline-name.jpg)

3. In this tutorial, you can use default values for all the fields. In **Advanced Settings**, click **Create** directly.

   ![create-pipeline-2](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/create-pipeline-2.jpg)

## Edit the Jenkinsfile

1. In the pipeline list, click this pipeline to go to its detail page. Click **Edit Jenkinsfile** to define a Jenkinsfile and your pipeline runs based on it.

   ![edit-jenkinsfile](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-project/edit-jenkinsfile.jpg)

2. Copy and paste all the content below to the pop-up window as an example Jenkinsfile for your pipeline. You must replace the value of `DOCKERHUB_USERNAME`,  `DOCKERHUB_CREDENTIAL`, `KUBECONFIG_CREDENTIAL_ID`,  `MULTI_CLUSTER_PROJECT_NAME`,  and `MEMBER_CLUSTER_NAME` with yours. When you finish, click **OK**.

   ```
   pipeline {
     agent {
       node {
         label 'maven'
       }
   
     }
     
     environment {
       REGISTRY = 'docker.io'
       // username of dockerhub
       DOCKERHUB_USERNAME = 'yuswift'
       APP_NAME = 'devops-go-sample'
       // ‘dockerhubid’ is the dockerhub credential id you created on ks console
       DOCKERHUB_CREDENTIAL = credentials('dockerhubid')
       // the kubeconfig credential id you created on ks console
       KUBECONFIG_CREDENTIAL_ID = 'multi-cluster'
       // mutli-cluster project name under your own workspace
       MULTI_CLUSTER_PROJECT_NAME = 'devops-with-go'
       // the member cluster name you want to deploy app on
       // in this tutorial, you are assumed to deploy app on host and only one member cluster
       // for more member clusters, please edit manifest/multi-cluster-deploy.yaml
       MEMBER_CLUSTER_NAME = 'c9'
     }  
     
     stages {
       stage('docker login') {
         steps {
           container('maven') {
             sh 'echo $DOCKERHUB_CREDENTIAL_PSW  | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
           }
   
         }
       }
       
       stage('build & push') {
         steps {
           container('maven') {
             sh 'git clone https://github.com/yuswift/devops-go-sample.git'
             sh 'cd devops-go-sample && docker build -t $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME .'
             sh 'docker push $REGISTRY/$DOCKERHUB_USERNAME/$APP_NAME'
           }
         }
       }
       
       stage('deploy app to multi cluster') {
         steps {
           container('maven') {
             script {
               withCredentials([
                 kubeconfigFile(
                   credentialsId: 'multi-cluster',
                   variable: 'KUBECONFIG')
                 ]) {
                 sh 'envsubst < devops-go-sample/manifest/multi-cluster-deploy.yaml | kubectl apply -f -'
                 }
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

![multi-cluster-ok](/images/docs/devops-user-guide/examples/compile-and-deploy-a-go-multi-cluster-project/multi-cluster-ok.png)