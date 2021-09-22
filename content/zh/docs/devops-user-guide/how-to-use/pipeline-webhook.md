---
title: "Trigger a Pipeline via a Webhook"
keywords: 'Kubernetes, DevOps, Jenkins, Pipeline, Webhook'
description: 'Learn how to trigger a Jenkins pipeline via a webhook.'
linkTitle: "Trigger a Pipeline via a Webhook"
weight: 11293
---

If you create a Jenkinsfile-based pipeline from a remote code repository, you can configure a webhook in the remote repository so that the pipeline will be automatically triggered when changes are made to the remote repository.

This tutorial demonstrates how to trigger a pipeline via a webhook.

## Prerequisites

- You need to [enable the KubeSphere DevOps system](../../../pluggable-components/devops/).
- You need to create a workspace, a DevOps project, and an account (`project-regular`). This account needs to be invited to the DevOps project with the `operator` role. See [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/) if they are not ready.

- You need to create a Jenkinsfile-based pipeline from a remote code repository. For more information, see [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/).

## Configure a Webhook

### Get a webhook URL

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click a pipeline (for example, `jenkins-in-scm`) to go to its details page.

2. Click **More** and select **Edit Config** in the drop-down list.

   ![edit-config](/images/docs/devops-user-guide/using-devops/pipeline-webhook/edit-config.png)

3. In the displayed dialog box, scroll down to **Webhook Push** and you can see the webhook push URL.

   ![webhook-push](/images/docs/devops-user-guide/using-devops/pipeline-webhook/webhook-push.png)

### Set a webhook in the GitHub repository

1. Log in to your GitHub and go to your own repository `devops-java-sample`.

2. Click **Settings**, click **Webhooks**, and then click **Add webhook**.

   ![click-add-webhook](/images/docs/devops-user-guide/using-devops/pipeline-webhook/click-add-webhook.png)

3. Enter the Webhook Push URL of the pipeline for **Payload URL** and click **Add webhook**. This tutorial selects **Just the push event** for demonstration purposes. You can make other settings based on your needs. For more information, see [the GitHub document](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks).

   ![add-webhook](/images/docs/devops-user-guide/using-devops/pipeline-webhook/add-webhook.png)

4. The configured webhook is displayed on the **Webhooks** page.

   ![webhook-ready](/images/docs/devops-user-guide/using-devops/pipeline-webhook/webhook-ready.png)

## Trigger the Pipeline via the Webhook

### Submit a Pull Request to the repository

1. On the **Code** page of your own repository, click **master** and then select **sonarqube**.

   ![click-sonar](/images/docs/devops-user-guide/using-devops/pipeline-webhook/click-sonar.png)

2. Go to `/deploy/dev-ol/` and click the file `devops-sample.yaml`.

   ![click-file](/images/docs/devops-user-guide/using-devops/pipeline-webhook/click-file.png)

3. Click <img src="/images/docs/devops-user-guide/using-devops/pipeline-webhook/edit-btn.png" width="20px" /> to edit the file. For example, change the value of `spec.replicas` to `3`.

   ![edit-file](/images/docs/devops-user-guide/using-devops/pipeline-webhook/edit-file.png)

4. When you finish, click **Commit changes** at the bottom of the page.

### Check the webhook deliveries

1. On the **Webhooks** page of your own repository, click the webhook.

   ![webhook-ready](/images/docs/devops-user-guide/using-devops/pipeline-webhook/webhook-ready.png)

2. Click **Recent Deliveries** and you can click a specific delivery record to view its details.

   ![delivery-detail](/images/docs/devops-user-guide/using-devops/pipeline-webhook/delivery-detail.png)

### Check the pipeline

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click the pipeline.

2. On the **Activity** tab, you can see that a new run is triggered due to a Pull Request is submitted to the `sonarqube` branch of the remote repository.

   ![pipeline-triggered](/images/docs/devops-user-guide/using-devops/pipeline-webhook/pipeline-triggered.png)

3. After a while, the pipeline runs successfully. On the **Pods** page the project `kubesphere-sample-dev`, you can see that 3 Pods are running.

   ![pods](/images/docs/devops-user-guide/using-devops/pipeline-webhook/pods.png)



