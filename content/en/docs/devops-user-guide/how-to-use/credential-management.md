---
title: "Credential Management"
keywords: 'Kubernetes, Docker, Credential, KubeSphere, DevOps'
description: 'Create credentials so that your pipelines can communicate with third-party applications or websites.'
linkTitle: "Credential Management"
weight: 11230
---

Credentials are objects containing sensitive information, such as usernames and passwords, SSH keys, and tokens. When a KubeSphere DevOps pipeline is running, it interacts with objects in external environments to perform a series of tasks, including pulling code, pushing and pulling images, and running scripts. During this process, credentials need to be provided accordingly while they do not appear explicitly in the pipeline.

A DevOps project user with necessary permissions can configure credentials for Jenkins pipelines. Once the user adds or configures these credentials in a DevOps project, they can be used in the DevOps project to interact with third-party applications.

Currently, you can store the following 4 types of credentials in a DevOps project:

![create-credential-page](/images/docs/devops-user-guide/using-devops/credential-management/create-credential-page.png)

- **Account Credentials**: Username and password which can be handled as separate components or as a colon-separated string in the format `username:password`, such as accounts of GitHub, GitLab, and Docker Hub.
- **SSH**: Username with a private key, an SSH public/private key pair.
- **Secret Text**: Secret content in a file.
- **kubeconfig**: It is used to configure cross-cluster authentication. If you select this type, the dialog will auto-populate the field with the kubeconfig file of the current Kubernetes cluster.

This tutorial demonstrates how to create and manage credentials in a DevOps project. For more information about how credentials are used, see [Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/) and [Create a Pipeline Using Graphical Editing Panels](../create-a-pipeline-using-graphical-editing-panel/).

## Prerequisites

- You have enabled [KubeSphere DevOps System](../../../pluggable-components/devops/).
- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create Credentials

Log in to the console of KubeSphere as `project-regular`. Navigate to your DevOps project, choose **Credentials** and click **Create**.

![create-credential-step1](/images/docs/devops-user-guide/using-devops/credential-management/create-credential-step1.png)

### Create Docker Hub credentials

1. In the dialog that appears, provide the following information.

   ![dockerhub-credentials](/images/docs/devops-user-guide/using-devops/credential-management/dockerhub-credentials.png)

   - **Credential ID**:  Set an ID, such as `dockerhub-id`, which can be used in pipelines.
   - **Type**: Select **Account Credentials**.
   - **Username**: Your Docker Hub account (i.e Docker ID).
   - **Token/Password**: Your Docker Hub password.
   - **Description**: A brief introduction to the credentials.

2. Click **OK** when you finish.

### Create GitHub credentials

Similarly, follow the same steps above to create GitHub credentials. Set a different Credential ID (for example, `github-id`) and also select **Account Credentials** for **Type**. Enter your GitHub username and password for **Username** and **Token/Password** respectively.

{{< notice note >}}

If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.

{{</ notice >}}

### Create kubeconfig credentials

Similarly, follow the same steps above to create kubeconfig credentials. Set a different Credential ID (for example, `demo-kubeconfig`) and select **kubeconfig**.

{{< notice info >}}

A file that is used to configure access to clusters is called a kubeconfig file. This is a generic way of referring to configuration files. For more information, see [the official documentation of Kubernetes](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). You create kubeconfig credentials for the access to the current Kubernetes cluster, which will be used in pipelines. You don't need to change the file since KubeSphere automatically populates the field with the kubeconfig of the current Kubernetes cluster. You may need to change kubeconfig when accessing other clusters.

{{</ notice >}}

## View and Manage Credentials

1. Credentials created appear in the list as below.

   ![credentials-list](/images/docs/devops-user-guide/using-devops/credential-management/credentials-list.png)

2. Click any of them to go to its detail page, where you can see account details and all the events related to the credentials.

   ![credential-detail-page](/images/docs/devops-user-guide/using-devops/credential-management/credential-detail-page.png)

3. You can also edit or delete credentials on this page. Note that when you edit credentials, KubeSphere does not display the existing username or password information. The previous one will be overwritten if you enter a new username and password.

   ![edit-credentials](/images/docs/devops-user-guide/using-devops/credential-management/edit-credentials.png)

## See Also

[Create a Pipeline Using a Jenkinsfile](../create-a-pipeline-using-jenkinsfile/)

[Create a Pipeline Using Graphical Editing Panels](../create-a-pipeline-using-graphical-editing-panel/)