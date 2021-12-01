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

You need to create a workspace, a project, and a user (`project-regular`), and invite the user to the project and assign it the `operator` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create Service Account

### Step 1: Log in to KubeSphere

1. Log in to the KubeSphere console as `project-regular`. Go to **Configuration** of a project and click **Service Accounts**. A service account named `default` is displayed on the **Service Accounts** page as it is automatically created when the project is created.

   {{< notice note >}}

   If no service account is specified when creating workloads in a project, the service account `default` in the same project is automatically assigned.

   {{</ notice >}}

2. Click **Create**.

### Step 2: Set a service account

1. In the displayed dialog box, set the following parameters:
   - **Name**: A unique identifier for the service account.
   - **Alias**: An alias for the service account to help you better identify the service account.
   - **Description**: A brief introduction of the service account. 
   - **Project Role**: Select a project role from the drop-down list for the service account. Different project roles have [different permissions](../../../project-administration/role-and-member-management/#built-in-roles) in a project. 
2. Click **Create** after you finish setting the parameters. The service account created is displayed on the **Service Accounts** page.

## Service Account Details Page

1. Click the service account created to go to its details page.
2. Click **Edit Information** to edit its basic information, or click **More** to select an operation from the drop-down menu.
   - **Edit YAML**: View, update, or download the YAML file.
   - **Change Role**: Change the project role of the service account.
   - **Delete**: Delete the service account and return to the previous page.
3. On the **Resource Status** tab, details about the corresponding Secret and the kubeconfig of the service account are displayed.

