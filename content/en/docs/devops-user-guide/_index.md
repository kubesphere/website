---
title: "DevOps User Guide"
description: "Getting started with KubeSphere DevOps project"
layout: "single"

linkTitle: "DevOps User Guide"
weight: 4400

icon: "/images/docs/docs.svg"
---

To deploy and manage your CI/CD tasks and related workloads on your Kubernetes clusters, you use the KubeSphere DevOps system. This chapter demonstrates how to manage and work in DevOps projects, including running pipelines, creating credentials, and integrating tools.

As you install the DevOps component, Jenkins is automatically deployed. KubeSphere provides you with a consistent user experience as you can build a pipeline through the Jenkinsfile just as you did before. Besides, KubeSphere features a highly responsive graphical dashboard that visualizes the whole process, presenting you with a straightforward view of how your pipeline is running at what stage.

## Using DevOps

[DevOps Project Management](../devops-user-guide/how-to-use/devops-project-management/)

Create and manage DevOps projects, as well as roles and members in them.

[Create a Pipeline Using Jenkinsfile](../devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/)

Learn how to create and run a pipeline by using an example Jenkinsfile.

[Create a Pipeline Using Graphical Editing Panel](../devops-user-guide/how-to-use/create-a-pipeline-using-graphical-editing-panel/)

Learn how to create and run a pipeline by using the graphical editing panel of KubeSphere.

[Choose Jenkins Agent](../devops-user-guide/how-to-use/choose-jenkins-agent/)

Specify the Jenkins agent and use the built-in podTemplate for your pipeline.

[Credential Management](../devops-user-guide/how-to-use/credential-management/)

Create credentials so that your pipelines can communicate with third-party applications or websites.

[Set CI Node for Dependency Cathe](../devops-user-guide/how-to-use/set-ci-node/)

Configure a node or a group of nodes specifically for continuous integration (CI) to speed up the building process in a pipeline.

[Set Email Server for KubeSphere Pipelines](../devops-user-guide/how-to-use/jenkins-email/)

Set the email server to receive notifications of your Jenkins pipelines.

[Jenkins System Settings](../devops-user-guide/how-to-use/jenkins-setting/)

Learn how to customize your Jenkins settings.

## Tool Integration

[Integrate SonarQube into Pipeline](../devops-user-guide/how-to-integrate/sonarqube/)