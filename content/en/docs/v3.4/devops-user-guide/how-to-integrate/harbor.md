---
title: "Integrate Harbor into Pipelines"
keywords: 'Kubernetes, Docker, DevOps, Jenkins, Harbor'
description: 'Integrate Harbor into your pipeline to push images to your Harbor registry.'
linkTitle: "Integrate Harbor into Pipelines"
weight: 11320
version: "v3.4"
---

This tutorial demonstrates how to integrate Harbor into KubeSphere pipelines.

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../pluggable-components/devops/).
- You need to create a workspace, a DevOps project, and a user (`project-regular`). This account needs to be invited to the DevOps project with the `operator` role. See [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/) if they are not ready.

## Install Harbor

It is highly recommended that you install Harbor through [the App Store of KubeSphere](../../../application-store/built-in-apps/harbor-app/). Alternatively, install Harbor manually through Helm3.

```bash
helm repo add harbor https://helm.goharbor.io
# For a quick start, you can expose Harbor by nodeport and disable tls.
# Set externalURL to one of your node ip and make sure it can be accessed by jenkins.
helm install harbor-release harbor/harbor --set expose.type=nodePort,externalURL=http://$ip:30002,expose.tls.enabled=false
```

## Get Harbor Credentials

1. After Harbor is installed, visit `<NodeIP>:30002` and log in to the console with the default account and password (`admin/Harbor12345`). Click **Projects** in the left navigation pane and click **NEW PROJECT** on the **Projects** page.

2. In the displayed dialog box, set a name (`ks-devops-harbor`) and click **OK**.

3. Click the project you just created, and click **NEW ROBOT ACCOUNT** under the **Robot Accounts** tab.

4. In the displayed dialog box, set a name (`robot-test`) for the robot account and click **SAVE**. Make sure you select the checkbox for pushing artifact in **Permissions**. 

5. In the displayed dialog box, click **EXPORT TO FILE** to save the token.

## Enable Insecure Registry

You have to configure Docker to disregard security for your Harbor registry.

1. Run the `vim /etc/docker/daemon.json` command on your host to edit the `daemon.json` file, enter the following contents, and save the changes.

   ```json
   {
     "insecure-registries" : ["103.61.38.55:30002"]
   }
   ```

   {{< notice note >}}

   Make sure you replace `103.61.38.55:30002` with your Harbor registry address. The default location of the `daemon.json` file is `/etc/docker/daemon.json` on Linux or `C:\ProgramData\docker\config\daemon.json` on Windows.

   {{</ notice >}}

2. Run the following commands to restart Docker for the changes to take effect.

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```

   {{< notice note >}}

   It is suggested that you use this solution for isolated testing or in a tightly controlled, air-gapped environment. For more information, refer to [Deploy a plain HTTP registry](https://docs.docker.com/registry/insecure/#deploy-a-plain-http-registry). After you finish the above operations, you can also use the images in your Harbor registry when deploying workloads in your project. You need to create an image Secret for your Harbor registry, and then select your Harbor registry and enter the absolute path of your images in **Container Settings** under the **Container Image** tab to search for your images.

   {{</ notice >}}

## Create Credentials

1. Log in to KubeSphere as `project-regular`, go to your DevOps project and create credentials for Harbor in **Credentials** under **DevOps Project Settings**.

2. On the **Create Credentials** page, set a credential ID (`robot-test`) and select **Username and password** for **Type**. The **Username** field must be the same as the value of `name` in the JSON file you just downloaded and enter the value of `token` in the file for **Password/Token**.

3. Click **OK** to save it.

## Create a Pipeline

1. Go to the **Pipelines** page and click **Create**. In the **Basic Information** tab, enter a name (`demo-pipeline`) for the pipeline and click **Next**.

2. Use default values in **Advanced Settings** and click **Create**.

## Edit the Jenkinsfile

1. Click the pipeline to go to its details page and click **Edit Jenkinsfile**.

2. Copy and paste the following contents into the Jenkinsfile. Note that you must replace the values of `REGISTRY`, `HARBOR_NAMESPACE`, `APP_NAME`, and `HARBOR_CREDENTIAL` with your own values.

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
       // ‘robot-test’ is the credential ID you created on the KubeSphere console
       HARBOR_CREDENTIAL = credentials('robot-test')
     }
     
     stages {
       stage('docker login') {
         steps{
           container ('maven') {
             // replace the Docker Hub username behind -u and do not forget ''. You can also use a Docker Hub token. 
             sh '''echo $HARBOR_CREDENTIAL_PSW | docker login $REGISTRY -u 'robot$robot-test' --password-stdin'''
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

Save the Jenkinsfile and KubeSphere automatically creates all stages and steps on the graphical editing panel. Click **Run** to run the pipeline. If everything goes well, the image is pushed to your Harbor registry by Jenkins.

