---
title: "Use Pipeline Templates"
keywords: 'KubeSphere, Kubernetes, Jenkins, Graphical Pipelines, Pipeline Templates'
description: 'Understand how to use pipeline templates on KubeSphere.'
linkTitle: "Use Pipeline Templates"
weight: 11213
---

KubeSphere offers a graphical editing panel where the stages and steps of a Jenkins pipeline can be defined through interactive operations. KubeSphere 3.3 provides built-in pipeline templates, such as Node.js, Maven, and Golang, to help users quickly create pipelines. Additionally, KubeSphere 3.3 also supports customization of pipeline templates to meet diversified needs of enterprises.

This section describes how to use pipeline templates on KubeSphere.
## Prerequisites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).

- You need to [create a pipeline](../../../how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/).

## Use a Built-in Pipeline Template

The following takes Node.js as an example to show how to use a built-in pipeline template. Steps for using Maven and Golang pipeline templates are alike.


1. Log in to the KubeSphere console as `project-regular`. In the navigation pane on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation pane on the left, click **Pipelines**.

4. On the pipeline list on the right, click the created pipeline to go to its details page.

5. On the right pane, click **Edit Pipeline**.

6. On the **Create Pipeline** dialog box, click **Node.js**, and then click **Next**.


7. On the **Parameter Settings** tab, set the parameters based on the actual situation, and then click **Create**.
   
   | Parameter  | Meaning |
   | ----------- | ------------------------- |
   | GitURL     | URL of the project repository to clone                  |
   | GitRevision | Revision to check out from                  |
   | NodeDockerImage  | Docker image version of Node.js  |
   | InstallScript     | Shell script for installing dependencies  |
   | TestScript     | Shell script for testing  |
   | BuildScript     | Shell script for building a project  |
   | ArtifactsPath     | Path where the artifacts reside  |

8. On the left pane, the system has preset several steps, and you can add more steps and parallel stages.

9. Click a specific step. On the right pane, you can perform the following operations:
   - Change the stage name.
   - Delete a stage.
   - Set the agent type.
   - Add conditions.
   - Edit or delete a task.
   - Add steps or nested steps.
   
   {{< notice note >}}

   You can also customize the stages and steps in the pipeline templates based on your needs. For more information about how to use the graphical editing panel, refer to [Create a Pipeline Using Graphical Editing Panels](../create-a-pipeline-using-graphical-editing-panel/).
   {{</ notice >}}

10. On the **Agent** area on the left, select an agent type, and click **OK**. The default value is **kubernetes**.
    
    The following table explains the agent types.

    <style>
    table th:first-of-type {
        width: 20%;
    }
    table th:nth-of-type(2) {
        width: 80%;
    }
    </style>
    | Agent Type  | Description |
    | --------------- | ------------------------- |
    | any     | Uses the default base pod template to create a Jenkins agent to run pipelines.                  |
    | node | Uses a pod template with the specific label to create a Jenkins agent to run pipelines. Available labels include base, java, nodejs, maven, go, and more.                  |
    | kubernetes  | Use a yaml file to customize a standard Kubernetes pod template to create a jenkins agent to run pipelines.  |

11. On the pipeline details page, you can view the created pipeline template. Click **Run** to run the pipeline.

## Legacy Built-in Pipeline Templates

In earlier versions, KubeSphere also provides the CI and CI & CD pipeline templates. However, as the two templates are hardly customizable, you are advised to use the Node.js, Maven, or Golang pipeline template, or directly customize a template based on your needs.
The following briefly introduces the CI and CI & CD pipeline templates.

- CI pipeline template

   ![ci-template](/images/docs/v3.3/devops-user-guide/using-devops/use-pipeline-templates/ci-template.png)

   ![ci-stages](/images/docs/v3.3/devops-user-guide/using-devops/use-pipeline-templates/ci-stages.png)

   The CI pipeline template contains two stages. The **clone code** stage checks out code and the **build & push** stage builds an image and pushes it to Docker Hub. You need to create credentials for your code repository and your Docker Hub registry in advance, and then set the URL of your repository and these credentials in corresponding steps. After you finish editing, the pipeline is ready to run.

- CI & CD pipeline template

   ![cicd-template](/images/docs/v3.3/devops-user-guide/using-devops/use-pipeline-templates/cicd-template.png)

   ![cicd-stages](/images/docs/v3.3/devops-user-guide/using-devops/use-pipeline-templates/cicd-stages.png)

   The CI & CD pipeline template contains six stages. For more information about each stage, refer to [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/#pipeline-overview), where you can find similar stages and the descriptions. You need to create credentials for your code repository, your Docker Hub registry, and the kubeconfig of your cluster in advance, and then set the URL of your repository and these credentials in corresponding steps. After you finish editing, the pipeline is ready to run.