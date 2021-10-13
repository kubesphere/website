---
title: "Use Jenkins Shared Libraries in a Pipeline"
keywords: 'KubeSphere, Kubernetes, Jenkins, Shared Library, Pipelines'
description: 'Learn how to use Jenkins shared libraries in a pipeline.'
linkTitle: "Use Jenkins Shared Libraries in a Pipeline"
weight: 11292
---

For Jenkins pipelines that contain the same stages or steps, one way to avoid repetition in the pipeline codes is to use Jenkins shared libraries in the Jenkinsfiles.

This tutorial demonstrates how to use Jenkins shared libraries in KubeSphere DevOps pipelines.

## Prerequisites

- You need to [enable the KubeSphere DevOps system](../../../pluggable-components/devops/).
- You need to create a workspace, a DevOps project and a user (`project-regular`). This account must be invited to the DevOps project with the `operator` role. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to have a Jenkins shared library available. This tutorial uses the Jenkins shared library in [a GitHub repository](https://github.com/devops-ws/jenkins-shared-library) as an example.

## Configure a Shared Library on the Jenkins Dashboard

1. [Log in to the Jenkins dashboard](../jenkins-setting/#log-in-to-jenkins-to-reload-configurations) and click **Manage Jenkins** in the left navigation bar.

2.  Scroll down and click **Configure System**.

   ![click_configure](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/click-configure.png)

3. Scroll down to **Global Pipeline Libraries** and click **Add**.

   ![click-add](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/click-add.png)

4. Configure the fields as below.

   - **Name**. Set a name (for example, `demo-shared-library`) for the shared library so that you can import the shared library by referring to this name in a Jenkinsfile.

   - **Default version**. Set a branch name from the repository where you put your shared library as the default branch for importing your shared library. Enter `master` for this tutorial.

   - Under **Retrieval method**, choose **Modern SCM**.

   - Under **Source Code Management**, choose **Git** and enter the URL of the example repository for **Project Repository**. You have to configure **Credentials** if you use your own repository that requires the credentials for accessing it.

     ![configure-shared-library](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/configure-shared-library.png)

5. When you finish editing, click **Apply**.

   {{< notice note >}}

   You can also configure [Folder-level Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/#folder-level-shared-libraries).

   {{</ notice >}}

## Use the Shared Library in a Pipeline

### Step 1: Create a pipeline

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click **Create** on the **Pipelines** page.

2. Set a name (for example, `demo-shared-library`) in the pop-up window and click **Next**.

   ![set-name](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/set-name.png)

3. In **Advanced Settings**, click **Create** directly to create a pipeline with the default settings.

   ![click-create](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/click-create.png)

### Step 2: Edit the pipeline

1. In the pipeline list, click the pipeline to go to its detail page and click **Edit Jenkinsfile**.

   ![edit-jenkinsfile](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/edit-jenkinsfile.png)

2. In the displayed dialog box, enter the following example Jenkinsfile. When you finish editing, click **OK**.

   ```groovy
   library identifier: 'devops-ws-demo@master', retriever: modernSCM([
       $class: 'GitSCMSource',
       remote: 'https://github.com/devops-ws/jenkins-shared-library',
       traits: [[$class: 'jenkins.plugins.git.traits.BranchDiscoveryTrait']]
   ])
   
   pipeline {
       agent any
   
       stages {
           stage('Demo') {
               steps {
                   script {
                       mvn.fake()
                   }
               }
           }
       }
   }
   ```
   
   {{< notice note >}}
   
   You can specify a `label` for `agent` based on your needs.
   
   {{</ notice >}}
   
3. Alternatively, you can use a Jenkinsfile starting with `@Library('<the configured name of shared library>') _`. If you use this type of Jenkinsfile, you need to configure the shared library on the Jenkins dashboard in advance. In this tutorial, you can use the following example Jenkinsfile.

   ```groovy
   @Library('demo-shared-library') _
   
   pipeline {
       agent any
   
       stages {
           stage('Demo') {
               steps {
                   script {
                       mvn.fake()
                   }
               }
           }
       }
   }
   ```

   {{< notice note >}}

   You can use `@Library('demo-shared-library@<branch name>') _` to specify a specific branch.

   {{</ notice >}}

### Step 3: Run the pipeline

1. You can view the stage under the **Pipeline** tab. Click **Run** to run it.

   ![click-run](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/click-run.png)

2. After a while, the pipeline will run successfully.

   ![run-successfully](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/run-successfully.png)

3. You can click the **Success** record under **Status**, and then click **Show Logs** to view the log details.

   ![log-details](/images/docs/devops-user-guide/using-devops/jenkins-shared-library/log-details.png)

