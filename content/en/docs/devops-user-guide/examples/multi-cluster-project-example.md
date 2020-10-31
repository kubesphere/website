---
title: "How to deloy applications cross multiple clusters"
keywords: 'kubernetes, docker, devops, jenkins, multiple cluster'
description: ''
linkTitle: "Deloy applications cross multiple clusters"
weight: 300


---

## Prerequisites

- You need to [enable multi-cluster](../../../../docs/multicluster-management/).
- You need to [enable KubeSphere DevOps System](../../../../docs/pluggable-components/devops/) on your host cluster.
- You need to create a workspace with multiple clusters, a DevOps project on your **host** cluster, a multi-cluster project(in this tutorial, your are assumed to add host and only one member cluster to the  multi-cluster project), and a **project-regular** user account, and this account needs to be invited into the DevOps project and the multi-cluster project. See [multi-cluster](../../../multicluster-management) and [project-administration](../../../project-administration/project-and-multicluster-project.)

## Get Dockerhub Credential

Vist [dockerhub](https://dockerhub.com), log into the site, click **account settings**.

![](/images/devops/dockerhub-settings.png)

Click **Security** and **New Access Token**.

![](/images/devops/dockerhub-create-token.png)

Enter the name of the access token, then save it.

![](/images/devops/dockerhub-token-ok.png)

Click **Copy and Close** and remember to save the access token.

![](/images/devops/dockerhub-token-copy.png)

### Create Credentials

Log into KubeSphere, enter into the created DevOps project on your **host** cluster and create the following credential under **Project Management → Credentials**:

![](/images/devops/create-dockerhub-id.png)

The **Username** is your dockerhub username. **Password**  is the access token you just copied.

After you have created your dockerhub credential, you still need create a **kubeconfig** type credential.

![](/images/devops/create-kubeconfig.png)

## Create a pipeline

![](/images/devops/ks-console-create-pipline.png)

Fill in the pipeline's basic information in the pop-up window,  enter the name of pipeline and set the others as default value.

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
    // for more member clusters, please manifest/multi-cluster-deploy.yaml
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

> Note: 
>
> - You are assumed to push images into dockehub. If you are using Harbor robot account, you can not pass the parameter to `docker login -u ` via jenkins credential with environment variable. Because every harbor-robot-account username contains a "\$" character, which will be converted into "\$$" by jenkins when used by environment varibles. See more about [this](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/).

![](/images/devops/edit-jenkins-file.png)

## Run the pipline

After you have saved the jenkins file, click the **Run** button. If everything goes well, you will see two deployment workload under your multi-cluster project.

![](/images/devops/run-pipline.png)

![](/images/devops/multi-cluster-ok.png)