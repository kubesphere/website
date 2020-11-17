---
title: "How to integrate Harbor in Pipeline"
keywords: 'kubernetes, docker, devops, jenkins, harbor'
description: ''
linkTitle: "Integrate Harbor in Pipeline"
weight: 360
---

## Prerequisites

- You need to [enable KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to create a workspace, a DevOps project, and a **project-regular** user account, and this account needs to be invited into a DevOps project. See [create-workspace-and-project](../../../../docs/quick-start/create-workspace-and-project).
- You need to have installed **Harbor** already. 

## Install  Harbor

It is highly recommended that you install harbor [by application store](). You can also install harbor manally by helm3.

```bash
helm repo add harbor https://helm.goharbor.io
# for qucik taste, you can expose harbor by nodeport and disable tls.
# set externalURL as one of your node ip and make sure it can be accessed by jenkins.
helm install harbor-release harbor/harbor --set expose.type=nodePort,externalURL=http://$ip:30002,expose.tls.enabled=false
```

After several minutes, open your browser and visit http:$node_ip:30003. Enter **admin** and **Harbor12345** , then click **LOG** **IN**.

![](/images/devops/harbor-login.png)

Click **NEW** **PROJECT** , enter the project name, then click **ok**.

## Get Harbor credential

![](/images/devops/harbor-new-project.png)

![](/images/devops/harbor-project-ok.png)

Click your project name you just created, find the **Robot Accounts** tab, then click **NEW ROBOT ACCOUNT**.

![](/images/devops/harbor-robot-account.png)

Enter the name of the robot account, then save it.

![](/images/devops/harbor-robot-account-ok.png)

Click **EXPORT TO FILE** to save the credential.

![](/images/devops/harbor-robot-account-save.png)

### Create Credentials

Log into KubeSphere, enter into the created DevOps project and create the following credential under **Project Management → Credentials**:

![](/images/devops/ks-console-create-credential.png)

The **Username** is the name field of the json file you just saved. **Password**  takes the token field.

![](/images/devops/ks-console-credential-ok.png)

## Create a pipeline

![](/images/devops/ks-console-create-pipline.png)

Fill in the pipeline's basic information in the pop-up window,  enter the name of pipelne and set the others as default value.

![](/images/devops/create-pipline-2.png)

![](/images/devops/create-pipline-3.png)

## Edit jenkins file

Click **Edit Jenkins File** button under your pipeline and paste the following text into the pop-up window. You need to replace **REGISTRY**, **HARBOR_NAMESPACE**, **APP_NAME**, **HARBOR_CREDENTIAL** as yours.

```pipeline {
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
          // replace the username behind -u and do not forget ''
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

> Note: 
>
> - You can pass the parameter to `docker login -u ` via jenkins credential with environment variable. However, every harbor-robot-account username contains a "\$" character, which will be converted into "\$$" by jenkins when used by environment varibles. See more about [this](https://number1.co.za/rancher-cannot-use-harbor-robot-account-imagepullbackoff-pull-access-denied/).

![](/images/devops/edit-jenkins-file.png)

## Run the pipeline

After you have saved the jenkins file, click the **Run** button. If everything goes well, you will see image have been pushed into your harbor registry by jenkins.

![](/images/devops/run-pipline.png)