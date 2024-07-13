---
title: "DevOps — Overview"
keywords: 'Kubernetes, KubeSphere, DevOps, overview'
description: 'Develop a basic understanding of DevOps.'
linkTitle: "Overview"
weight: 11110
version: "v3.4"
---

DevOps is a set of practices and tools that automate the processes between IT and software development teams. Among other things, as agile software development sees increasing popularity, continuous integration (CI) and continuous delivery (CD) have become an ideal solution in this connection. In a CI/CD workflow, every integration is tested through automatic building, including coding, releasing and testing. This helps developers to identify any integration errors beforehand and teams can deliver internal software to a production environment with speed, security, and reliability.

Nevertheless, the traditional controller-agent architecture of Jenkins (i.e. multiple agents work for a controller) has the following shortcomings.

- The entire CI/CD pipeline will crash once the controller goes down.
- Resources are not allocated equally as some agents see pipeline jobs waiting in queue while others remain idle.
- Different agents may be configured in different environments and require different coding languages. The disparity can cause inconvenience in management and maintenance. 

## Understand KubeSphere DevOps

KubeSphere DevOps projects support source code management tools such as GitHub, Git, and SVN. Users can build CI/CD pipelines through graphical editing panels (Jenkinsfile out of SCM) or create a Jenkinsfile-based pipeline from the code repository (Jenkinsfile in SCM).

### Features

The KubeSphere DevOps system provides you with the following features:

- Independent DevOps projects for CI/CD pipelines with access control.
- Out-of-the-box DevOps functions with no complex Jenkins configurations.
- [Source-to-image (S2I)](../../../project-user-guide/image-builder/source-to-image/) and [Binary-to-image (B2I)](../../../project-user-guide/image-builder/binary-to-image/) for rapid delivery of images.
- [Jenkinsfile-based pipelines](../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/) for consistent user experience which support multiple code repositories.
- [Graphical editing panels](../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/) to create pipelines with a low learning curve.
- A powerful tool integration mechanism such as [SonarQube](../../../devops-user-guide/how-to-integrate/sonarqube/) for code quality check.

### KubeSphere CI/CD pipeline workflows

A KubeSphere CI/CD pipeline runs on the back of the underlying Kubernetes Jenkins agents. These Jenkins agents can be dynamically scaled as they are dynamically provisioned or released based on the job status. The Jenkins controller and agents run as Pods on KubeSphere nodes. The controller runs on one of the nodes with its configuration data stored in a volume. Agents run across nodes while they may not be active all the time because they are created dynamically and deleted automatically as needed.

When the Jenkins controller receives a building request, it dynamically creates Jenkins agents that run in Pods according to labels. At the same time, Jenkins agents will be registered in the controller. After agents finish their jobs, they will be released and related Pods will be deleted as well.

### Dynamically provision Jenkins agents

The advantages of dynamically provisioning Jenkins agents are:

**Reasonable resource allocation**. KubeSphere dynamically assigns agents created to idle nodes, so that jobs will not be queuing on a single node whose resource utilization is already high.

**High scalability**. When a KubeSphere cluster has insufficient resources which lead to long waiting time of jobs in the queue, you can add new nodes to the cluster.

**High availability**. When a Jenkins controller fails, KubeSphere automatically creates a new Jenkins controller container with the volume mounted to the new container. In this way, the data are secured with high availability achieved for the cluster.
