---
title: "How to build and deploy a maven project"
keywords: 'kubernetes, docker, devops, jenkins, maven'
description: ''
linkTitle: "Build And Deploy A Maven Project"
weight: 200
---

## Prerequisites

- You need to [enable KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to create [DockerHub](http://www.dockerhub.com/) account.
- You need to create a workspace, a DevOps project, and a user account, and this account needs to be invited into the DevOps project as the role of maintainer.

## Workflow for Maven Project

![](/images/devops/maven-project-jenkins.png)

As is shown in the graph, there is the workflow for a maven project in KubeSphere DevOps.

It uses the pipeline of Jenkins to build and deploy the maven project in KubeSphere DevOps. All steps are defined in the pipeline. 

When running, Jenkins Master create the pod to run the pipeline. Kubernetes creates the pod as the agent of Jenkins Master and will be destoryed after pipeline finished. The main process is to clone code, build & push image, and deploy the workload.

## Default Configurations in Jenkins

### Maven Version

Executing the following command in the maven builder container to get version info.

```bash
mvn --version

Apache Maven 3.5.3 (3383c37e1f9e9b3bc3df5050c29c8aff9f295297; 2018-02-24T19:49:05Z)
Maven home: /opt/apache-maven-3.5.3
Java version: 1.8.0_232, vendor: Oracle Corporation
Java home: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.i386/jre
Default locale: en_US, platform encoding: UTF-8
```

###  Maven Cache

Jenkins Agent mounts the directories by Docker Volume on the node. So, the pipeline can cache some spicial directory, such as `/root/.m2`, which is used for the maven building.

`/root/.m2` is the default cache directory for maven tools in KubeSphere DevOps. The dependency packages are e downloaded and cached and there won't be network request if it's used next time.

### Global Maven Setting in Jenkins Agent

The default maven settings file path is maven and the configuration file path is `/opt/apache-maven-3.5.3/conf/settings.xml` . 

Executing the following command to get the content of Maven Setting.

```bash
kubectl get cm -n kubesphere-devops-system ks-devops-agent -o yaml
```

### Network of Maven Pod

The Pod labeled maven uses the docker-in-docker network to run the pipeline. That is, the `/var/run/docker.sock` in the node is mounted into the maven container.

## An example of a maven pipeline

### Prepare for the Maven Project

- ensure build the maven project successfully on the development device.
- add the Dockerfile file into the project repo for building the image, refer to https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online
- add the yaml file into the project repo for deploy the workload, refer to https://github.com/kubesphere/devops-java-sample/tree/master/deploy/dev-ol. If there are different environments, you need to prepare multiple deployment files.

### Create the Credentials

- dockerhub-id. A *Account Credentials* for registry, e.g DockerHub.
- demo-kuebconfig. A *Kubeconfig Credential* for deploying workloads.

For details, please refer to the [Credentials Management](../../how-to-use/credential-management/).

![](/images/devops/view-credential-list.png)

### Create the Project for Workloads

In this demo, all of workload are deployed under kubesphere-sample-dev. So, you need to create namespaces `kubesphere-sample-dev` in advance.

![](/images/devops/view-namespace.png)

### Create the Pipeline for the Maven Project

At First, create a *DevOps Project* and a *Pipeline* refer to [Create a Pipeline - using Graphical Editing Panel](../../how-to-use/create-a-pipeline-using-graphical-editing-panel) .

Secondly, click *Edit Jenkinsfile* button under your pipeline.

![](/images/devops/edit-jenkinsfile.png)

Paste the following text into the pop-up window and save it.

```groovy
pipeline {
  agent {
    node {
      label 'maven'
    }
  }

    parameters {
        string(name:'TAG_NAME',defaultValue: '',description:'')
    }

    environment {
        DOCKER_CREDENTIAL_ID = 'dockerhub-id'
        KUBECONFIG_CREDENTIAL_ID = 'demo-kubeconfig'
        REGISTRY = 'docker.io'
        // need to replace by yourself dockerhub namespace
        DOCKERHUB_NAMESPACE = 'shaowenchen'
        APP_NAME = 'devops-java-sample'
        BRANCH_NAME = 'dev'
    }

    stages {
        stage ('checkout scm') {
            steps {
                git branch: 'master', url: "https://github.com/kubesphere/devops-java-sample.git"
            }
        }

        stage ('unit test') {
            steps {
                container ('maven') {
                    sh 'mvn clean -o -gs `pwd`/configuration/settings.xml test'
                }
            }
        }

        stage ('build & push') {
            steps {
                container ('maven') {
                    sh 'mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package'
                    sh 'docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
                    withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
                        sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
                        sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
                    }
                }
            }
        }

        stage('deploy to dev') {
          steps {
            kubernetesDeploy(configs: 'deploy/dev-ol/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
          }
        }
    }
}
```

After saving, you will get this.

![](/images/devops/view-edit-jenkinsfile.png)

### Run and test

Click `run` and type `TAG_NAME` to run the pipeline.

![](/images/devops/run-maven-pipeline.png)

After the run is complete, you can see the following figure.

![](/images/devops/view-result-maven-pipeline.png)

Under the project of `kubesphere-sample-dev`, there are new workloads created. 

![](/images/devops/view-result-maven-workload.png)

You can view the access address of the service through service.

![](/images/devops/view-result-maven-workload-svc.png)

## Summary

This document is not a getting started document. It introduces some configurations for building maven projects on the KubeSphere DevOps Platform. At the same time, a example flow of the maven project is provided. In your case, you are free to add new steps to improve the pipeline.
