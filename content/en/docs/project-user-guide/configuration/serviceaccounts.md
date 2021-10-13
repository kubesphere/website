---
title: "Service Accounts"
keywords: 'KubeSphere, Kubernetes, Service Accounts'
description: 'Learn how to create Service Accounts on KubeSphere.'
linkTitle: "Service Accounts"
weight: 10440
---

A [Service Account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) provides an identity for processes that run in a Pod. When accessing a cluster, a user is authenticated by the API server as a particular user account. Processes in containers inside Pods are authenticated as a particular Service Account when these processes contact the API server.

This document describes how to create a Service Account on KubeSphere.

## Prerequisites

You need to create a workspace, a project, and an account (`project-regular`). The account must be invited to the project and granted the `operator` role. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Service Account

### Step 1: Log in to KubeSphere

1. Log in to the KubeSphere console as `project-regular`. Go to **Configuration** of a project and click **Service Accounts**. A Service Account `default` is listed on the **Service Accounts** page as it is automatically created when the project is created.

   {{< notice note >}}

   If no Service Account is specified when creating workload objects in a project, the Service Account `default` in the same project is automatically assigned.

   {{</ notice >}}

2. Click **Create**.

### Step 2: Set a Service Account

1. In the displayed dialog box, set the following fields:
   - **Name**: A unique identifier for the Service Account.
   - **Alias**: An alias for the Service Account to help you better identify the Service Account.
   - **Description**: A brief introduction of the Service Account. 
   - **Project Role**: Select a project role from the drop-down list for the Service Account. Different project roles have [different permissions](../../../project-administration/role-and-member-management/#built-in-roles) in a project. 
2. Click **Create** after you finish setting the fields. The Service Account is listed on the **Service Accounts** page if it is created successfully.

## View Service Account Details

1. Click the Service Account created to go to its details page.
2. Click **Edit Information** to edit its information in the displayed dialog box, or click **More** to select an operation from the drop-down menu.
   - **Edit YAML**: View, update, or download the YAML file.
   - **Change Role**: Change the project role of the Service Account.
   - **Delete**: Delete the Service Account and return to the previous page.
3. On the **Details** tab, details about the corresponding Secret and kubeconfig of the Service Account are displayed.

## Use a Service Account

To use a specific Service Account, add the following code to the `.spec` section of the YAML file of a workload object.

```yaml
serviceAccountName: <Service account name>
```

