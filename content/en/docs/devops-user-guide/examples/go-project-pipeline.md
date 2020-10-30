---
title: "How to compile and deploy a Go project"
keywords: 'kubernetes, docker, devops, jenkins, go'
description: ''
linkTitle: "Compile dnd deploy a Go project"
weight: 200

---

## Prerequisites

- You need to [enable KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to create a workspace, a DevOps project, a project, and a **project-regular** user account, and this account needs to be invited into a DevOps project and a normal project.

## Get Dockerhub Credential

Vist [dockerhub](https://dockerhub.com), log into the site, click **account settings**.

![](/images/devops/dockerhub-settings.png)

Click **Security** and **New Access Token**.

![](/images/devops/dockerhub-create-token.png)

Enter the name of the access token, then save it.

![](/images/devops/dockerhub-token-ok.png)

Click **Copy and Close** to save the access token and do not lose it.

![](/images/devops/dockerhub-token-copy.png)

### Create Credentials

Log into KubeSphere, enter into the created DevOps project and create the following credential under **Project Management → Credentials**:

![](/images/devops/create-dockerhub-id.png)

The **Username** is your dockerhub username. **Password**  is the access token you just copied.

After you have created your dockerhub credential, you still need create a **kubeconfig** type credential.

![](/images/devops/create-kubeconfig.png)

## Create a pipline

![](/images/devops/ks-console-create-pipline.png)

Fill in the pipeline's basic information in the pop-up window,  enter the name of piplne and set the others as default value.

![](/images/devops/create-pipline-2.png)

![](/images/devops/create-pipline-3.png)

## Edit jenkins file

Click **Edit Jenkins File** button under your pipeline and paste the following text into the pop-up window. You need to replace **DOCKERHUB_USERNAME**,  **DOCKERHUB_CREDENTIAL**, **KUBECONFIG_CREDENTIAL_ID**, **PROJECT_NAME** as yours.

```pipeline {
pipeline {  
  agent {
    node {
      label 'maven'
    }
  }
  
  environment {
    // the address of your harbor registry
    REGISTRY = 'docker.io'
    DOCKERHUB_USERNAME = 'yuswift'
    // docker image name
    APP_NAME = 'devops-go-sample'
    // ‘dockerhubid’ is the credential id you created on ks console
    DOCKERHUB_CREDENTIAL = credentials('dockerhubid')
    //the kubeconfig credential id you created on ks console
    KUBECONFIG_CREDENTIAL_ID = 'go'
    // the project name you created on ks console
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

> Note: 
>
> - You are assumed to push images into dockehub. If you are using Harbor, you can not pass the parameter to `docker login -u ` via jenkins credential with environment variable. Because every harbor robot account username contains a "\$" character, which will be converted into "\$$" by jenkins when used by environment varibles. See more about [this](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/).

![](/images/devops/edit-jenkins-file.png)

## Run the pipline

After you have saved the jenkins file, click the **Run** button. If everything goes well, you will see a deployment workload under your project.

![](/images/devops/run-pipline.png)

![](/images/devops/devops-go-ok.png)