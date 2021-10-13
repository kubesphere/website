---
title: "Build and Deploy a Maven Project"
keywords: 'kubernetes, docker, devops, jenkins, maven'
description: 'Learn how to build and deploy a Maven project using a KubeSphere pipeline.'
linkTitle: "Build and Deploy a Maven Project"
weight: 11430
---

## Prerequisites

- You need to [enable the KubeSphere DevOps System](../../../../docs/pluggable-components/devops/).
- You need to have a [Docker Hub](http://www.dockerhub.com/) account.
- You need to create a workspace, a DevOps project, and a user account, and this account needs to be invited into the DevOps project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Workflow for a Maven Project

As is shown in the graph below, there is the workflow for a Maven project in KubeSphere DevOps, which uses a Jenkins pipeline to build and deploy the Maven project. All steps are defined in the pipeline.

![maven-project-jenkins](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/maven-project-jenkins.png)

At first, the Jenkins Master creates a Pod to run the pipeline. Kubernetes creates the Pod as the agent of Jenkins Master, and the Pod will be destroyed after the pipeline finished. The main process includes cloning code, building and pushing an image, and deploying the workload.

## Default Configurations in Jenkins

### Maven version

Execute the following command in the Maven builder container to get version information.

```bash
mvn --version

Apache Maven 3.5.3 (3383c37e1f9e9b3bc3df5050c29c8aff9f295297; 2018-02-24T19:49:05Z)
Maven home: /opt/apache-maven-3.5.3
Java version: 1.8.0_232, vendor: Oracle Corporation
Java home: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.i386/jre
Default locale: en_US, platform encoding: UTF-8
```

### Maven cache

The Jenkins Agent mounts the directories by Docker Volume on the node. The pipeline can cache some special directories such as `/root/.m2`, which are used for Maven building and the default cache directory for Maven tools in KubeSphere DevOps, so that dependency packages are downloaded and cached on the node.

### Global Maven settings in the Jenkins Agent

The default file path of Maven settings is `maven` and the configuration file path is `/opt/apache-maven-3.5.3/conf/settings.xml`. Execute the following command to get the content of Maven settings.

```bash
kubectl get cm -n kubesphere-devops-system ks-devops-agent -o yaml
```

### Network of Maven Pod

The Pod labeled `maven` uses the docker-in-docker network to run the pipeline. Namely, `/var/run/docker.sock` in the node is mounted to the Maven container.

## A Maven Pipeline Example

### Prepare for the Maven project

- Ensure you build the Maven project successfully on the development device.
- Add the Dockerfile to the project repository to build the image. For more information, refer to <https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online>.
- Add the YAML file to the project repository to deploy the workload. For more information, refer to <https://github.com/kubesphere/devops-java-sample/tree/master/deploy/dev-ol>. If there are different environments, you need to prepare multiple deployment files.

### Create credentials

| Credential ID   | Type                | Where to Use                 |
| --------------- | ------------------- | ---------------------------- |
| dockerhub-id    | Account Credentials | Registry, such as Docker Hub |
| demo-kubeconfig | kubeconfig          | Workload deployment         |

For details, refer to the [Credential Management](../../how-to-use/credential-management/).

![view-credential-list](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/view-credential-list.png)

### Create a project for workloads

In this example, all workloads are deployed in `kubesphere-sample-dev`. You must create the project `kubesphere-sample-dev` in advance.

![view-namespace](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/view-namespace.png)

### Create a pipeline for the Maven project

1. Go to **Pipelines** of your DevOps project and click **Create** to create a pipeline named `maven`. For more information, see [Create a Pipeline - using Graphical Editing Panel](../../how-to-use/create-a-pipeline-using-graphical-editing-panel/).

2. Go to the detail page of the pipeline and click **Edit Jenkinsfile**.

   ![edit-jenkinsfile](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/edit-jenkinsfile.png)

3. Copy and paste the following content into the pop-up window. You must replace the value of `DOCKERHUB_NAMESPACE` with yours. When you finish editing, click **OK** to save the Jenkinsfile.

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
           DOCKERHUB_NAMESPACE = 'Docker Hub Namespace'
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

4. You can see stages and steps are automatically created on graphical editing panels.

   ![view-edit-jenkinsfile](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/view-edit-jenkinsfile.png)

### Run and test

1. Click **Run**, enter `v1` for **TAG_NAME** in the dialog that appears, and then click **OK** to run the pipeline.

   ![run-maven-pipeline](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/run-maven-pipeline.png)

2. When the pipeline runs successfully, you can go to the **Activity** tab to view its details.

   ![view-result-maven-pipeline](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/view-result-maven-pipeline.png)

3. In the project of `kubesphere-sample-dev`, there are new workloads created.

   ![view-result-maven-workload](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/view-result-maven-workload.png)

4. You can view the access address of the Service as below.

   ![view-result-maven-workload-svc](/images/docs/devops-user-guide/examples/build-and-deploy-a-maven-project/view-result-maven-workload-svc.png)
