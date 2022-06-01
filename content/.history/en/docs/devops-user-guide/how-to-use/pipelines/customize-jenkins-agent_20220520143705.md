---
title: "Customize Jenkins Agent"
keywords: "KubeSphere, Kubernetes, DevOps, Jenkins, Agent"
description: "Learn how to customize a Jenkins agent on KubeSphere."
linkTitle: "Customize Jenkins Agent"
Weight: 112191
---

If you need to use a Jenkins agent that runs on a specific environment, for example, JDK 11, you can customize a Jenkins agent on KubeSphere.

This document describes how to customize a Jenkins agent on KubeSphere. 

## Prerequisites

- You have enabled [the KubeSphere DevOps System](../../../。。、pluggable-components/devops/).

## Customize a Jenkins agent

1. Log in to the web console of KubeSphere as `admin`.

2. Click **Platform** in the upper-left corner, select **Cluster Management**, and click **Configmaps** under **Configuration** on the left navigation pane.

3. On the **Configmaps** page, enter `jenkins-casc-config` in the search box and press **Enter**.

4. Click `jenkins-casc-config` to go to its details page, click **More**, and select **Edit YAML**.

5. In the displayed dialog box, enter the following code under the `data.jenkins_user.yaml:jenkins.clouds.kubernetes.templates` section and click **OK**.

   ```yaml
   - name: "maven-jdk11" # The name of the customized Jenkins agent.
     label: "maven jdk11" # The label of the customized Jenkins agent. To specify multiple labels, use spaces to seperate them. 
     inheritFrom: "maven" # The name of the existing pod template from which this customzied Jenkins agent inherits.
     containers:
     - name: "maven" # The container name specified in the existing pod template from which this customzied Jenkins agent inherits.
       image: "kubespheredev/builder-maven:v3.2.0jdk11" # This image is used for testing purposes only. You can use your own images.
   ```

   {{< notice note >}}

   Make sure you follow the indentation in the YAML file.

   {{</ notice >}}

6. Wait for at least 70 seconds until your changes are automatically reloaded.

7. To use the custom Jenkins agent, refer to the following sample Jenkinsfile to specify the label and container name of the custom Jenkins agent accordingly when creating a pipeline.

   ```groovy
   pipeline {
     agent {
       node {
         label 'maven && jdk11'
       }
     }
     stages {
       stage('Print Maven and JDK version') {
         steps {
           container('maven') {
             sh '''
             mvn -v
             java -version
             '''
           }
         }
       }
     }
   }
   ```

   
