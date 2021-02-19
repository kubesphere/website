---
title: "DevOps User Guide"
description: "Getting started with KubeSphere DevOps project"
layout: "single"

linkTitle: "DevOps User Guide"
weight: 11000

icon: "/images/docs/docs.svg"
---

To deploy and manage your CI/CD tasks and related workloads on your Kubernetes clusters, you use the KubeSphere DevOps system. This chapter demonstrates how to manage and work in DevOps projects, including running pipelines, creating credentials, and integrating tools.

As you install the DevOps component, Jenkins is automatically deployed. KubeSphere provides you with a consistent user experience as you can build a pipeline through the Jenkinsfile just as you did before. Besides, KubeSphere features graphical editing panels that visualizes the whole process, presenting you with a straightforward view of how your pipeline is running at what stage.

## Understand and Manage DevOps Projects

### [Overview](../devops-user-guide/understand-and-manage-devops-projects/overview/)

Develop a basic understanding of DevOps.

### [DevOps Project Management](../devops-user-guide/understand-and-manage-devops-projects/devops-project-management/)

Create and manage DevOps projects, and understand basic elements in DevOps projects.

### [Role and Member Management](../devops-user-guide/understand-and-manage-devops-projects/role-and-member-management/)

Create and manage roles and members in DevOps projects.

## Use DevOps

### [Create a Pipeline Using a Jenkinsfile](../devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/)

Learn how to create and run a pipeline by using an example Jenkinsfile.

### [Create a Pipeline Using Graphical Editing Panels](../devops-user-guide/how-to-use/create-a-pipeline-using-graphical-editing-panel/)

Learn how to create and run a pipeline by using the graphical editing panel of KubeSphere.

### [Credential Management](../devops-user-guide/how-to-use/credential-management/)

Create credentials so that your pipelines can communicate with third-party applications or websites.

### [Jenkins System Settings](../devops-user-guide/how-to-use/jenkins-setting/)

Learn how to customize your Jenkins settings.

### [Choose Jenkins Agent](../devops-user-guide/how-to-use/choose-jenkins-agent/)

Specify the Jenkins agent and use the built-in podTemplate for your pipeline.

### [Set Email Server for KubeSphere Pipelines](../devops-user-guide/how-to-use/jenkins-email/)

Set the email server to receive notifications of your Jenkins pipelines.

### [Set a CI Node for Dependency Cathing](../devops-user-guide/how-to-use/set-ci-node/)

Configure a node or a group of nodes specifically for continuous integration (CI) to speed up the building process in a pipeline.

### [Pipeline Settings](../devops-user-guide/how-to-use/pipeline-settings/)

Understand various pipeline properties in a DevOps project.

## Tool Integration

### [Integrate SonarQube into Pipelines](../devops-user-guide/how-to-integrate/sonarqube/)

Integrate SonarQube into your pipeline for code quality analysis.

### [Integrate Harbor in Pipelines](../devops-user-guide/how-to-integrate/harbor/)

Integrate Harbor into your pipeline to push images to your Harbor registry.

## Examples

### [Build and Deploy a Go Project](../devops-user-guide/examples/go-project-pipeline/)

Learn how to build and deploy a Go project using a KubeSphere pipeline.

### [Deploy Apps in a Multi-cluster Project Using a Jenkinsfile](../devops-user-guide/examples/multi-cluster-project-example/)

Learn how to deploy apps in a multi-cluster project using a Jenkinsfile-based pipeline.

### [Build and Deploy a Maven Project](../devops-user-guide/examples/a-maven-project/)

Learn how to build and deploy a Maven project using a KubeSphere pipeline.