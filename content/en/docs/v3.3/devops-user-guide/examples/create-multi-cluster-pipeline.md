---
title: "Create a Multi-cluster Pipeline"
keywords: 'KubeSphere, Kubernetes, Multi-cluster, Pipeline, DevOps'
description: 'Learn how to create a multi-cluster pipeline on KubeSphere.'
linkTitle: "Create a Multi-cluster Pipeline"
weight: 11440
---

As cloud providers offer different hosted Kubernetes services, DevOps pipelines have to deal with use cases where multiple Kubernetes clusters are involved.

This tutorial demonstrates how to create a multi-cluster pipeline on KubeSphere.

## Prerequisites

- You need to have three Kubernetes clusters with KubeSphere installed. Choose one cluster as your host cluster and the other two as your member clusters. For more information about cluster roles and how to build a multi-cluster environment on KubeSphere, refer to [Multi-cluster Management](../../../multicluster-management/).
- You need to set your member clusters as [public clusters](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#make-a-cluster-public). Alternatively, you can [set cluster visibility after a workspace is created](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#set-cluster-visibility-after-a-workspace-is-created).
- You need to [enable the KubeSphere DevOps system](../../../pluggable-components/devops/) on your host cluster.
- You need to integrate SonarQube into your pipeline. For more information, refer to [Integrate SonarQube into Pipelines](../../how-to-integrate/sonarqube/).
- You need to create four accounts on your host cluster: `ws-manager`, `ws-admin`, `project-admin`, and `project-regular`, and grant these accounts different roles. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-1-create-an-account).

## Workflow Overview

This tutorial uses three clusters to serve as three isolated environments in the workflow. See the diagram as below.

![use-case-for-multi-cluster](/images/docs/v3.3/devops-user-guide/examples/create-multi-cluster-pipeline/use-case-for-multi-cluster.png)

The three clusters are used for development, testing, and production respectively. Once codes get submitted to a Git repository, a pipeline will be triggered to run through the following stages—`Unit Test`, `SonarQube Analysis`, `Build & Push`, and `Deploy to Development Cluster`. Developers use the development cluster for self-testing and validation. When developers give approval, the pipeline will proceed to the stage of `Deploy to Testing Cluster` for stricter validation. Finally, the pipeline, with necessary approval ready, will reach the stage of `Deploy to Production Cluster` to provide services externally. 

## Hands-on Lab

### Step 1: Prepare clusters

See the table below for the role of each cluster. 

| Cluster Name | Cluster Role   | Usage       |
| ------------ | -------------- | ----------- |
| host         | Host cluster   | Testing     |
| shire        | Member cluster | Production  |
| rohan        | Member cluster | Development |

{{< notice note >}}

These Kubernetes clusters can be hosted across different cloud providers and their Kubernetes versions can also vary. Recommended Kubernetes versions for KubeSphere 3.3: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support).

{{</ notice >}}

### Step 2: Create a workspace

1. Log in to the web console of the host cluster as `ws-manager`. On the **Workspaces** page, click **Create**.

2. On the **Basic Information** page, name the workspace `devops-multicluster`, select `ws-admin` for **Administrator**, and click **Next**.

3. On the **Cluster Settings** page, select all three clusters and click **Create**.

4. The workspace created is displayed in the list. You need to log out of the console and log back in as `ws-admin` to invite both `project-admin` and `project-regular` to the workspace and grant them the role `workspace-self-provisioner` and `workspace-viewer` respectively. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-2-create-a-workspace).

### Step 3: Create a DevOps project

1. Log out of the console and log back in as `project-admin`. Go to the **DevOps Projects** page and click **Create**.

2. In the displayed dialog box, enter `multicluster-demo` for **Name**, select **host** for **Cluster Settings**, and then click **OK**.

   {{< notice note >}}

   Only clusters with the DevOps component enabled will be available in the drop-down list.

   {{</ notice >}}

3. The DevOps project created is displayed in the list. Make sure you invite the `project-regular` user to this project and assign it the `operator` role. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-5-create-a-devops-project-optional).

### Step 4: Create projects on clusters

You must create the projects as shown in the table below in advance. Make sure you invite the `project-regular` user to these projects and assign it the `operator` role. For more information about how to create a project, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-3-create-a-project).

| Cluster Name | Usage       | Project Name           |
| ------------ | ----------- | ---------------------- |
| host         | Testing     | kubesphere-sample-prod |
| shire        | Production  | kubesphere-sample-prod |
| rohan        | Development | kubesphere-sample-dev  |

### Step 5: Create credentials

1. Log out of the console and log back in as `project-regular`. On the **DevOps Projects** page, click the DevOps project `multicluster-demo`.

2. On the **Credentials** page, you need to create the credentials as shown in the table below. For more information about how to create credentials, refer to [Credential Management](../../how-to-use/devops-settings/credential-management/#create-credentials) and [Create a Pipeline Using a Jenkinsfile](../../how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/#step-1-create-credentials).

   | Credential ID | Type                | Where to Use                       |
   | ------------- | ------------------- | ---------------------------------- |
   | host          | kubeconfig          | The host cluster for testing       |
   | shire         | kubeconfig          | The member cluster for production  |
   | rohan         | kubeconfig          | The member cluster for development |
   | dockerhub-id  | Username and password | Docker Hub                         |
   | sonar-token   | Access token        | SonarQube                          |

   {{< notice note >}}

   You have to manually enter the kubeconfig of your member clusters when creating the kubeconfig credentials `shire` and `rohan`. Make sure your host cluster can access the API Server addresses of your member clusters.

   {{</ notice >}}

3. Five credentials are created in total.

### Step 6: Create a pipeline

1. Go to the **Pipelines** page and click **Create**. In the displayed dialog box, enter `build-and-deploy-application` for **Name** and click **Next**.

2. On the **Advanced Settings** tab, click **Create** to use the default settings.

3. The pipeline created is displayed in the list. Click its name to go to the details page.

4. Click **Edit Jenkinsfile** and copy and paste the following contents. Make sure you replace the value of `DOCKERHUB_NAMESPACE` with your own value, and then click **OK**.

   ```groovy
   pipeline {
     agent {
       node {
         label 'maven'
       }
   
     }
     parameters {
           string(name:'BRANCH_NAME',defaultValue: 'master',description:'')
       }
     environment {
           DOCKER_CREDENTIAL_ID = 'dockerhub-id'
           PROD_KUBECONFIG_CREDENTIAL_ID = 'shire'
           TEST_KUBECONFIG_CREDENTIAL_ID = 'host'
           DEV_KUBECONFIG_CREDENTIAL_ID = 'rohan'
   
           REGISTRY = 'docker.io'
           DOCKERHUB_NAMESPACE = 'your Docker Hub account ID'
           APP_NAME = 'devops-maven-sample'
           SONAR_CREDENTIAL_ID = 'sonar-token'
           TAG_NAME = "SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
       }
     stages {
       stage('checkout') {
         steps {
           container('maven') {
             git branch: 'master', url: 'https://github.com/kubesphere/devops-maven-sample.git'
           }
         }
       }
       stage('unit test') {
         steps {
           container('maven') {
             sh 'mvn clean test'
           }
         }
       }
       stage('sonarqube analysis') {
         steps {
           container('maven') {
             withCredentials([string(credentialsId: "$SONAR_CREDENTIAL_ID", variable: 'SONAR_TOKEN')]) {
               withSonarQubeEnv('sonar') {
                 sh "mvn sonar:sonar -Dsonar.login=$SONAR_TOKEN"
               }
   
             }
           }
   
         }
       }
       stage('build & push') {
         steps {
           container('maven') {
             sh 'mvn -Dmaven.test.skip=true clean package'
             sh 'docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
             withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
               sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
               sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
             }
           }
         }
       }
       stage('push latest') {
         steps {
           container('maven') {
             sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
             sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
           }
         }
       }
       stage('deploy to dev') {
         steps {
            container('maven') {
               withCredentials([
                   kubeconfigFile(
                   credentialsId: env.DEV_KUBECONFIG_CREDENTIAL_ID,
                   variable: 'KUBECONFIG')
                   ]) {
                   sh 'envsubst < deploy/dev-all-in-one/devops-sample.yaml | kubectl apply -f -'
               }
            }
         }
       }
       stage('deploy to staging') {
         steps {
            container('maven') {
               input(id: 'deploy-to-staging', message: 'deploy to staging?')
               withCredentials([
                   kubeconfigFile(
                   credentialsId: env.TEST_KUBECONFIG_CREDENTIAL_ID,
                   variable: 'KUBECONFIG')
                   ]) {
                   sh 'envsubst < deploy/prod-all-in-one/devops-sample.yaml | kubectl apply -f -'
               }
            }
         }
       }
       stage('deploy to production') {
         steps {
            container('maven') {
               input(id: 'deploy-to-production', message: 'deploy to production?')
               withCredentials([
                   kubeconfigFile(
                   credentialsId: env.PROD_KUBECONFIG_CREDENTIAL_ID,
                   variable: 'KUBECONFIG')
                   ]) {
                   sh 'envsubst < deploy/prod-all-in-one/devops-sample.yaml | kubectl apply -f -'
               }
            }
         }
       }
     }
   }
   ```

   {{< notice note >}}

   The flag `-o` in the `mvn` commands indicates that the offline mode is enabled. If you have relevant maven dependencies and caches ready locally, you can keep the offline mode on to save time.

   {{</ notice >}}

5. After the pipeline is created, you can view its stages and steps on the graphical editing panel as well.

### Step 7: Run the pipeline and check the results

1. Click **Run** to run the pipeline. The pipeline will pause when it reaches the stage **deploy to staging** as resources have been deployed to the cluster for development. You need to manually click **Proceed** twice to deploy resources to the testing cluster `host` and the production cluster `shire`.

2. After a while, you can see the pipeline status shown as **Successful**.

3. Check the pipeline running logs by clicking **View Logs** in the upper-right corner. For each stage, you click it to inspect logs, which can be downloaded to your local machine for further analysis.

4. Once the pipeline runs successfully, click **Code Check** to check the results through SonarQube.

5. Go to the **Projects** page, and you can view the resources deployed in different projects across the clusters by selecting a specific cluster from the drop-down list.


   



