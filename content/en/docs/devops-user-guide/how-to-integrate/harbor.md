---
title: "Integrate Harbor into Pipelines"
keywords: 'Kubernetes, Docker, DevOps, Jenkins, Harbor'
description: 'Integrate Harbor into your pipeline to push images to your Harbor registry.'
linkTitle: "Integrate Harbor into Pipelines"
weight: 11320
---

This tutorial demonstrates how to integrate Harbor into KubeSphere pipelines.

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../pluggable-components/devops/).
- You need to create a workspace, a DevOps project, and an account (`project-regular`). This account needs to be invited to the DevOps project with the `operator` role. See [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/) if they are not ready.

## Install Harbor

It is highly recommended that you install Harbor through [the App Store of KubeSphere](../../../application-store/built-in-apps/harbor-app/). Alternatively, install Harbor manually through Helm3.

```bash
helm repo add harbor https://helm.goharbor.io
# For a qucik start, you can expose Harbor by nodeport and disable tls.
# Set externalURL to one of your node ip and make sure it can be accessed by jenkins.
helm install harbor-release harbor/harbor --set expose.type=nodePort,externalURL=http://$ip:30002,expose.tls.enabled=false
```

## Get Harbor Credentials

1. After Harbor is installed, visit `NodeIP:30002` and log in to the console with the default account and password (`admin/Harbor12345`). Go to **Projects** and click **NEW PROJECT**.

   ![harbor-projects](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/harbor-projects.jpg)

2. Set a name and click **OK**.

   ![set-name](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/set-name.png)

3. Click the project you just created, and select **NEW ROBOT ACCOUNT** in **Robot Accounts**.

   ![robot-account](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/robot-account.png)

4. Enter the name of the robot account and save it.

   ![robot-account-name](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/robot-account-name.png)

5. Click **EXPORT TO FILE** to save the token.

   ![export-to-file](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/export-to-file.png)

## Create Credentials

1. Log in to KubeSphere as `project-regular`, go to your DevOps project and create credentials for Harbor in **Credentials** under **Project Management**.

   ![create-credentials](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/create-credentials.png)

2. On the **Create Credentials** page, set a credential ID and select **Account Credentials** for **Type**. The **Username** field must be the same as the value of `name` in the Json file you just downloaded and input the value of `token` in the file for **Token/Password**.

   ![credentials-page](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/credentials-page.png)

3. Click **OK** to save it.

## Create a Pipeline

1. Go to the **Pipelines** page and click **Create**. Provide the basic information in the dialog that appears and click **Next**.

   ![basic-info](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/basic-info.png)

2. Use default values in **Advanced Settings** and click **Create**.

   ![advanced-settings](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/advanced-settings.png)

## Edit the Jenkinsfile

1. Click the pipeline to go to its detail page and click **Edit Jenkinsfile**.

   ![edit-jenkinsfile](/images/docs/devops-user-guide/tool-integration/integrate-harbor-into-pipeline/edit-jenkinsfile.png)

2. Copy and paste the following content into the Jenkinsfile. Note that you must replace the value of `REGISTRY`, `HARBOR_NAMESPACE`, `APP_NAME`, and `HARBOR_CREDENTIAL`.

   ```groovy
   pipeline {  
     agent {
       node {
         label 'maven'
       }
     }
     
     environment {
       // the address of your harbor registry
       REGISTRY = '103.61.38.55:30002'
       // the project name
       // make sure your robot account have enough access to the project
       HARBOR_NAMESPACE = 'ks-devops-harbor'
       // docker image name
       APP_NAME = 'docker-example'
       // ‘yuswift’ is the credential id you created on ks console
       HARBOR_CREDENTIAL = credentials('yuswift')
     }
     
     stages {
       stage('docker login') {
         steps{
           container ('maven') {
             // replace the Docker Hub username behind -u and do not forget ''. You can also use a Docker Hub token. 
             sh '''echo $HARBOR_CREDENTIAL_PSW | docker login $REGISTRY -u 'robot$yuswift2018' --password-stdin'''
               }
             }  
           }
           
       stage('build & push') {
         steps {
           container ('maven') {
             sh 'git clone https://github.com/kstaken/dockerfile-examples.git'
             sh 'cd dockerfile-examples/rethinkdb && docker build -t $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:devops-test .'
             sh 'docker push  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:devops-test'
             }
           }
         }
       }
     }
   
   
   ```

   {{< notice note >}}

   You can pass the parameter to `docker login -u ` via Jenkins credentials with environment variables. However, every Harbor robot account's username contains a "\$" character, which will be converted into "\$$" by Jenkins when used by environment variables. [Learn more](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/).

   {{</ notice >}} 

## Run the Pipeline

Save the Jenkinsfile and KubeSphere automatically creates all stages and steps on the graphical editing panels. Click **Run** to execute the pipeline. If everything goes well, the image will be pushed to your Harbor registry by Jenkins.
