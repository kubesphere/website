---
title: "Service Accounts"
keywords: 'KubeSphere, Kubernetes, Service Accounts'
description: 'Learn how to create service accounts on KubeSphere.'
linkTitle: "Service Accounts"
weight: 10440
---

A [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) provides an identity for processes that run in a Pod. When accessing a cluster, a user is authenticated by the API server as a particular user account. Processes in containers inside Pods are authenticated as a particular service account when these processes contact the API server.

This document describes how to create service accounts on KubeSphere.

## Prerequisites

You have created a workspace, a project, and a user (`project-regular`), invited the user to the project, and assigned it the `operator` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Service Account

1. Log in to the KubeSphere console as `project-regular`, and click **Projects**. 

1. Select a project where you want to create a service account.

1. On the left navigation pane, select **Configuration** > **Service Accounts**. You can see a service account `default` on the **Service Accounts** page, which is automatically created when the project is created.

   {{< notice note >}}

   If you have not specified any service account when creating workloads in a project, the service account `default` in the same project is automatically assigned.

   {{</ notice >}}

2. Click **Create**. In the displayed **Create Service Account** dialog box, set the following parameters:

- **Name** (mandatory): Specifies a unique identifier for the service account.
- **Alias**: Specifies an alias for the service account to help you better identify the service account.
- **Description**: Briefly introduces the service account. 
- **Project Role**: Selects a project role from the drop-down list for the service account. Different project roles have [different permissions](../../../project-administration/role-and-member-management/#built-in-roles). 

4. Click **Create** after you finish setting the parameters. The service account created is displayed on the **Service Accounts** page.

## View the Details Page of a Service Account

1. On the left navigation pane, select **Configuration** > **Service Accounts**. Click the service account created to go to its details page.

2. Click **Edit Information** to edit its basic information, or click **More** to perform the following operations:
   - **Edit YAML**: Views, updates, or downloads the YAML file.
   - **Change Role**: Changes the project role of the service account.
   - **Delete**: Deletes the service account.
   
3. On the **Resource Status** tab on the right, view details of the Secret and the kubeconfig of the service account.

