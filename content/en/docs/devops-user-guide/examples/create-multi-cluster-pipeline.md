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

- You need to have three Kubernetes clusters with KubeSphere installed. Choose one cluster as your Host Cluster and the other two as your Member Clusters. For more information about cluster roles and how to build a multi-cluster environment on KubeSphere, refer to [Multi-cluster Management](../../../multicluster-management/).
- You need to set your Member Clusters as [public clusters](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#make-a-cluster-public). Alternatively, you can [set cluster visibility after a workspace is created](../../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#set-cluster-visibility-after-a-workspace-is-created).
- You need to [enable the KubeSphere DevOps system](../../../pluggable-components/devops/) on your Host Cluster.
- You need to integrate SonarQube into your pipeline. For more information, refer to [Integrate SonarQube into Pipelines](../../how-to-integrate/sonarqube/).
- You need to create four accounts on your Host Cluster: `ws-manager`, `ws-admin`, `project-admin`, and `project-regular`, and grant these accounts different roles. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-1-create-an-account).

## Workflow Overview

This tutorial uses three clusters to serve as three isolated environments in the workflow. See the diagram as below.

![use-case-for-multi-cluster](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/use-case-for-multi-cluster.png)

The three clusters are used for development, testing, and production respectively. Once codes get submitted to a Git repository, a pipeline will be triggered to run through the following stages—`Unit Test`, `SonarQube Analysis`, `Build & Push`, and `Deploy to Development Cluster`. Developers use the development cluster for self-testing and validation. When developers give approval, the pipeline will proceed to the stage of `Deploy to Testing Cluster` for stricter validation. Finally, the pipeline, with necessary approval ready, will reach the stage of `Deploy to Production Cluster` to provide services externally. 

## Hands-on Lab

### Step 1: Prepare clusters

See the table below for the role of each cluster. 

| Cluster Name | Cluster Role   | Usage       |
| ------------ | -------------- | ----------- |
| host         | Host Cluster   | Testing     |
| shire        | Member Cluster | Production  |
| rohan        | Member Cluster | Development |

{{< notice note >}}

These Kubernetes clusters can be hosted across different cloud providers and their Kubernetes versions can also vary. Recommended Kubernetes versions for KubeSphere v3.1.0: v1.17.9, v1.18.8, v1.19.8 and v1.20.4.

{{</ notice >}}

### Step 2: Create a workspace

1. Log in to the web console of the Host Cluster as `ws-manager`. On the **Workspaces** page, click **Create**.

2. On the **Basic Information** page, name the workspace `devops-multicluster`, select `ws-admin` for **Administrator**, and click **Next**.

   ![create-workspace](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/create-workspace.png)

3. On the **Select Clusters** page, select all three clusters and click **Create**.

   ![select-all-clusters](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/select-all-clusters.png)

4. The workspace created will display in the list. You need to log out of the console and log back in as `ws-admin` to invite both `project-admin` and `project-regular` to the workspace and grant them the role `workspace-self-provisioner` and `workspace-viewer` respectively. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-2-create-a-workspace).

   ![workspace-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/workspace-created.png)

### Step 3: Create a DevOps project

1. Log out of the console and log back in as `project-admin`. Go to the **DevOps Projects** page and click **Create**.

2. In the dialog that appears, enter `multicluster-demo` for **Name**, select **host** for **Cluster Settings**, and then click **OK**.

   ![devops-project](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/devops-project.png)

   {{< notice note >}}

   Only clusters with the DevOps component enabled will be available in the drop-down list.

   {{</ notice >}}

3. The DevOps project created will display in the list. Make sure you invite the account `project-regular` to this project with the role `operator`. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-5-create-a-devops-project-optional).

   ![devops-project-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/devops-project-created.png)

### Step 4: Create projects on clusters

You must create the projects as shown in the table below in advance. Make sure you invite the account `project-regular` to these projects with the role `operator`. For more information about how to create a project, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/#step-3-create-a-project).

| Cluster Name | Usage       | Project Name           |
| ------------ | ----------- | ---------------------- |
| host         | Testing     | kubesphere-sample-prod |
| shire        | Production  | kubesphere-sample-prod |
| rohan        | Development | kubesphere-sample-dev  |

### Step 5: Create credentials

1. Log out of the console and log back in as `project-regular`. On the **DevOps Projects** page, click the DevOps project `multicluster-demo`.

2. On the **DevOps Credentials** page, you need to create the credentials as shown in the table below. For more information about how to create credentials, refer to [Credential Management](../../how-to-use/credential-management/#create-credentials) and [Create a Pipeline Using a Jenkinsfile](../../how-to-use/create-a-pipeline-using-jenkinsfile/#step-1-create-credentials).

   | Credential ID | Type                | Where to Use                       |
   | ------------- | ------------------- | ---------------------------------- |
   | host          | kubeconfig          | The Host Cluster for testing       |
   | shire         | kubeconfig          | The Member Cluster for production  |
   | rohan         | kubeconfig          | The Member Cluster for development |
   | dockerhub-id  | Account Credentials | Docker Hub                         |
   | sonar-token   | Secret Text         | SonarQube                          |

   {{< notice note >}}

   You have to manually enter the kubeconfig of your Member Clusters when creating the kubeconfig credentials `shire` and `rohan`. Make sure your Host Cluster can access the APIServer addresses of your Member Clusters.

   {{</ notice >}}

3. You will have five credentials in total.

   ![credentials-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/credentials-created.png)

### Step 6: Create a pipeline

1. Go to the **Pipelines** page and click **Create**. In the dialog that appears, enter `build-and-deploy-application` for **Name** and click **Next**.

   ![pipeline-name](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-name.png)

2. In the **Advanced Settings** tab, click **Create** to use the default settings.

3. The pipeline created will display in the list. Click it to go to its detail page.

   ![pipeline-created](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-created.png)

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
           APP_NAME = 'devops-java-sample'
           SONAR_CREDENTIAL_ID = 'sonar-token'
           TAG_NAME = "SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
       }
     stages {
       stage('checkout') {
         steps {
           container('maven') {
             git branch: 'master', url: 'https://github.com/kubesphere/devops-java-sample.git'
           }
         }
       }
       stage('unit test') {
         steps {
           container('maven') {
             sh 'mvn clean -o -gs `pwd`/configuration/settings.xml test'
           }
   
         }
       }
       stage('sonarqube analysis') {
         steps {
           container('maven') {
             withCredentials([string(credentialsId: "$SONAR_CREDENTIAL_ID", variable: 'SONAR_TOKEN')]) {
               withSonarQubeEnv('sonar') {
                 sh "mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.login=$SONAR_TOKEN"
               }
   
             }
           }
   
         }
       }
       stage('build & push') {
         steps {
           container('maven') {
             sh 'mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package'
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
           kubernetesDeploy(configs: 'deploy/dev-ol/**', enableConfigSubstitution: true, kubeconfigId: "$DEV_KUBECONFIG_CREDENTIAL_ID")
         }
       }
       stage('deploy to staging') {
         steps {
           input(id: 'deploy-to-staging', message: 'deploy to staging?')
           kubernetesDeploy(configs: 'deploy/prod-ol/**', enableConfigSubstitution: true, kubeconfigId: "$TEST_KUBECONFIG_CREDENTIAL_ID")
         }
       }
       stage('deploy to production') {
         steps {
           input(id: 'deploy-to-production', message: 'deploy to production?')
           kubernetesDeploy(configs: 'deploy/prod-ol/**', enableConfigSubstitution: true, kubeconfigId: "$PROD_KUBECONFIG_CREDENTIAL_ID")
         }
       }
     }
   }
   
   ```

   {{< notice note >}}

   The flag `-o` in the `mvn` commands indicates that the offline mode is enabled. If you have relevant maven dependencies and caches ready locally, you can keep the offline mode on to save time.

   {{</ notice >}}

5. After the pipeline is created, you can view its stages and steps on the graphical editing panel as well.

   ![pipeline-panel](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-panel.png)

### Step 7: Run the pipeline and check the results

1. Click **Run** to run the pipeline. The pipeline will pause when it reaches the stage **deploy to staging** as resources have been deployed to the cluster for development. You need to manually click **Proceed** twice to deploy resources to the testing cluster `host` and the production cluster `shire`.

   ![deploy-to-staging](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/deploy-to-staging.png)

2. After a while, you can see the pipeline status shown as **Success**.

   ![pipeline-success](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-success.png)

3. Check the pipeline running logs by clicking **Show Logs** in the upper-right corner. For each stage, you click it to inspect logs, which can be downloaded to your local machine for further analysis.

   ![pipeline-logs](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/pipeline-logs.png)

4. Once the pipeline runs successfully, click **Code Quality** to check the results through SonarQube.

   ![sonarqube-result](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/sonarqube-result.png)

5. Go to the **Projects** page and you can view the resources deployed in different projects across the clusters by selecting a specific cluster from the drop-down list.

   ![host-pods](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/host-pods.png)

   ![shire-pods](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/shire-pods.png)

   ![rohan-pods](/images/docs/devops-user-guide/examples/create-multi-cluster-pipeline/rohan-pods.png)

   



