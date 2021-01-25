---
title: "Add existing Kubernetes namespaces to a KubeSphere Workspace"
keywords: "namespace, project, KubeSphere, Kubernetes"
description: "Add existing Kubernetes namespaces to a KubeSphere Workspace"
linkTitle: "Add existing Kubernetes namespaces to a KubeSphere Workspace"
Weight: 16430
---

A Kubernetes namespace is a KubeSphere project. If you create a namespace object not from the KubeSphere console, the namespace does not appear directly in a certain workspace. But cluster administrators can still see the namespace on the **Cluster Management** page. At the same time, you can also place the namespace into a workspace.

This tutorial demonstrates how to add an existing Kubernetes namespace to a KubeSphere workspace.

## Prerequisites

- You need an account granted a role including the authorization of **Clusters Management**. For example, you can log in to the console as `admin` directly or create a new role with the authorization and assign it to an account.

- You have an available workspace so that the namespace can be assigned to it. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Kubernetes Namespace

Create an example Kubernetes namespace first so that you can add it to a workspace later.

1. Execute the following command to create a file named `demo-namespace`.

   ```bash
   vi demo-namespace.json
   ```

2. Input the following content in the file and save it.

   ```json
   {
     "apiVersion": "v1",
     "kind": "Namespace",
     "metadata": {
       "name": "demo-namespace",
       "labels": {
         "name": "demo-namespace"
       }
     }
   }
   ```

3. Create the namespace.

   ```bash
   kubectl create -f demo-namespace.json
   ```

   For more information about creating a Kubernetes namespace, see [Namespaces Walkthrough](https://kubernetes.io/docs/tasks/administer-cluster/namespaces-walkthrough/).

## Add the Namespace to a KubeSphere Workspace

1. Log in to the KubeSphere console as `admin` and go to the **Cluster Management** page. Click **Projects**, and you can see all your projects (i.e. namespaces) running on the current cluster, including the one just created.

   ![user-projects](/images/docs/faq/access-control-and-account-management/add-exisiting-namespaces-to-a-kubesphere-workspace/user-projects.jpg)

2. The workspace created through kubectl does not belong to any workspace. Click the three dots on the right and select **Assign Workspace**.

   ![assign-workspace](/images/docs/faq/access-control-and-account-management/add-exisiting-namespaces-to-a-kubesphere-workspace/assign-workspace.jpg)

3. In the dialog that appears, select a workspace and a project manager for the project and click **OK**.

   ![select-workspace](/images/docs/faq/access-control-and-account-management/add-exisiting-namespaces-to-a-kubesphere-workspace/select-workspace.jpg)

4. Go to your workspace and you can see the project appear on the **Projects** page.

   ![project-page](/images/docs/faq/access-control-and-account-management/add-exisiting-namespaces-to-a-kubesphere-workspace/project-page.jpg)

