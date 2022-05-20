---
title: "Use Pipeline Templates"
keywords: 'KubeSphere, Kubernetes, Jenkins, Graphical Pipelines, Pipeline Templates'
description: 'Understand how to use pipeline templates on KubeSphere.'
linkTitle: "Use Pipeline Templates"
weight: 11213
---

KubeSphere offers a graphical editing panel where the stages and steps of a Jenkins pipeline can be defined through interactive operations. In KubeSphere 3.3.0, two built-in pipeline templates are provided as frameworks of continuous integration (CI) and continuous delivery (CD).

When you have a pipeline created in your DevOps project on KubeSphere, you can click the pipeline to go to its details page, and then click **Edit Pipeline** to select a pipeline template based on your needs. This document illustrates the concept of these two pipeline templates.

## CI Pipeline Template

![ci-template](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-template.png)

![ci-stages](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/ci-stages.png)

The CI pipeline template contains two stages. The **clone code** stage checks out code and the **build & push** stage builds an image and pushes it to Docker Hub. You need to create the credentials for your code repository and your Docker Hub registry in advance, and then set the URL of your repository and these credentials in corresponding steps. After you finish editing, the pipeline is ready to run.

## CI & CD Pipeline Template

![cicd-template](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/cicd-template.png)

![cicd-stages](/images/docs/devops-user-guide/using-devops/use-pipeline-templates/cicd-stages.png)

The CI & CD pipeline template contains six stages. For more information about each stage, refer to [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/#pipeline-overview) where you can find similar stages and the descriptions. You need to create credentials for your code repository, your Docker Hub registry, and the kubeconfig of your cluster in advance, and then set the URL of your repository and these credentials in corresponding steps. After you finish editing, the pipeline is ready to run.

{{< notice info >}}

You can also customize the stages and steps in the pipeline templates based on your needs. For more information about how to use the graphical editing panel, refer to [Create a Pipeline Using Graphical Editing Panels](../create-a-pipeline-using-graphical-editing-panel/).

{{</ notice >}}