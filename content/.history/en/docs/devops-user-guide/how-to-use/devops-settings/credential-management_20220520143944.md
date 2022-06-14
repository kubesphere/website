---
title: "Credential Management"
keywords: 'Kubernetes, Docker, Credential, KubeSphere, DevOps'
description: 'Create credentials so that your pipelines can communicate with third-party applications or websites.'
linkTitle: "Credential Management"
weight: 11241
---

Credentials are objects containing sensitive information, such as usernames and passwords, SSH keys, and tokens. When a KubeSphere DevOps pipeline is running, it interacts with objects in external environments to perform a series of tasks, including pulling code, pushing and pulling images, and running scripts. During this process, credentials need to be provided accordingly while they do not appear explicitly in the pipeline.

A DevOps project user with necessary permissions can configure credentials for Jenkins pipelines. Once the user adds or configures these credentials in a DevOps project, they can be used in the DevOps project to interact with third-party applications.

Currently, you can create the following 4 types of credentials in a DevOps project:

- **Username and password**: Username and password which can be handled as separate components or as a colon-separated string in the format `username:password`, such as accounts of GitHub, GitLab, and Docker Hub.
- **SSH key**: Username with a private key, an SSH public/private key pair.
- **Access token**: a token with certain access.
- **kubeconfig**: It is used to configure cross-cluster authentication. If you select this type, the dialog will auto-populate the field with the kubeconfig file of the current Kubernetes cluster.

This tutorial demonstrates how to create and manage credentials in a DevOps project. For more information about how credentials are used, see [Create a Pipeline Using a Jenkinsfile](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/) and [Create a Pipeline Using Graphical Editing Panels](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/).

## Prerequisites

- You have enabled [KubeSphere DevOps System](../../../pluggable-components/devops/).
- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create Credentials

Log in to the console of KubeSphere as `project-regular`. Navigate to your DevOps project, select **Credentials** and click **Create**.

### Create Docker Hub credentials

1. In the displayed dialog box, provide the following information.

   - **Name**: Set a name, such as `dockerhub-id`, which can be used in pipelines.
   - **Type**: Select **Username and password**.
   - **Username**: Your Docker Hub account (for example, Docker ID).
   - **Password/Token**: Your Docker Hub password.
   - **Description**: A brief introduction to the credentials.

2. Click **OK** when you finish.

### Create GitHub credentials

Similarly, follow the same steps above to create GitHub credentials. Set a different credential name (for example, `github-id`) and also select **Username and password** for **Type**. Enter your GitHub username and password for **Username** and **Password/Token** respectively.

{{< notice note >}}

If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.

{{</ notice >}}

### Create kubeconfig credentials

Similarly, follow the same steps above to create kubeconfig credentials. Set a different credential name (for example, `demo-kubeconfig`) and select **kubeconfig**.

{{< notice info >}}

A file that is used to configure access to clusters is called a kubeconfig file. This is a generic way of referring to configuration files. For more information, see [the official documentation of Kubernetes](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). You create kubeconfig credentials for the access to the current Kubernetes cluster, which will be used in pipelines. You don't need to change the file since KubeSphere automatically populates the field with the kubeconfig of the current Kubernetes cluster. You may need to change kubeconfig when accessing other clusters.

{{</ notice >}}

## View and Manage Credentials

1. Credentials created are displayed in the list.

2. Click any of them to go to its details page, where you can see account details and all the events related to the credentials.

3. You can also edit or delete credentials on this page. Note that when you edit credentials, KubeSphere does not display the existing username or password information. The previous one will be overwritten if you enter a new username and password.

## See Also

[Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/)

[Create a Pipeline Using Graphical Editing Panels](../create-a-pipeline-using-graphical-editing-panel/)