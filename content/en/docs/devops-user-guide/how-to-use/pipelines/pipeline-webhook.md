---
title: "Trigger a Pipeline by Using a Webhook"
keywords: 'Kubernetes, DevOps, Jenkins, Pipeline, Webhook'
description: 'Learn how to trigger a Jenkins pipeline by using a webhook.'
linkTitle: "Trigger a Pipeline by Using a Webhook"
weight: 11219
---

If you create a Jenkinsfile-based pipeline from a remote code repository, you can configure a webhook in the remote repository so that the pipeline is automatically triggered when changes are made to the remote repository.

This tutorial demonstrates how to trigger a pipeline by using a webhook.

## Prerequisites

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).
- You need to create a workspace, a DevOps project, and a user (`project-regular`). This account needs to be invited to the DevOps project and assigned the `operator` role. See [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/) if they are not ready.

- You need to create a Jenkinsfile-based pipeline from a remote code repository. For more information, see [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/).

## Configure a Webhook

### Get a webhook URL

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click a pipeline (for example, `jenkins-in-scm`) to go to its details page.

2. Click **More** and select **Edit Settings** in the drop-down list.

3. In the displayed dialog box, scroll down to **Webhook** to obtain the webhook push URL.

### Set a webhook in the GitHub repository

1. Log in to GitHub and go to your own repository `devops-maven-sample`.

2. Click **Settings**, click **Webhooks**, and click **Add webhook**.

3. Enter the webhook push URL of the pipeline for **Payload URL** and click **Add webhook**. This tutorial selects **Just the push event** for demonstration purposes. You can make other settings based on your needs. For more information, see [the GitHub document](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks).

4. The configured webhook is displayed on the **Webhooks** page.

## Trigger the Pipeline by Using the Webhook

### Submit a pull request to the repository

1. On the **Code** page of your own repository, click **master** and then select the **sonarqube** branch.

2. Go to `/deploy/dev-ol/` and click the file `devops-sample.yaml`.

3. Click <img src="/images/docs/devops-user-guide/using-devops/pipeline-webhook/edit-btn.png" width="20px" /> to edit the file. For example, change the value of `spec.replicas` to `3`.

4. Click **Commit changes** at the bottom of the page.

### Check the webhook deliveries

1. On the **Webhooks** page of your own repository, click the webhook.

2. Click **Recent Deliveries** and click a specific delivery record to view its details.

### Check the pipeline

1. Log in to the KubeSphere web console as `project-regular`. Go to your DevOps project and click the pipeline.

2. On the **Run Records** tab, check that a new run is triggered by the pull request submitted to the `sonarqube` branch of the remote repository.

3. Go to the **Pods** page of the project `kubesphere-sample-dev` and check the status of the 3 Pods. If the status of the 3 Pods is running, the pipeline is running properly.



