---
title: "Credential Management"
keywords: 'Kubernetes, Docker, Credential, KubeSphere, DevOps'
description: 'Create credentials so that your pipelines can communicate with third-party applications or websites.'
linkTitle: "Credential Management"
weight: 11241
version: "v3.3"
---

Credentials are objects containing sensitive information, such as usernames and passwords, SSH keys, and tokens. When a KubeSphere DevOps pipeline is running, it interacts with objects in external environments to perform a series of tasks, including pulling code, pushing and pulling images, and running scripts. During this process, credentials need to be provided accordingly while they do not appear explicitly in the pipeline.

A DevOps project user with necessary permissions can configure credentials for Jenkins pipelines. Once the user adds or configures these credentials in a DevOps project, they can be used in the DevOps project to interact with third-party applications.

Currently, you can create the following 4 types of credentials in a DevOps project:

- **Username and password**: Username and password which can be handled as separate components or as a colon-separated string in the format `username:password`, such as accounts of GitHub and GitLab.
- **SSH key**: Username with a private key, an SSH public/private key pair.
- **Access token**: a token with certain access.
- **kubeconfig**: It is used to configure cross-cluster authentication.

This tutorial demonstrates how to create and manage credentials in a DevOps project. For more information about how credentials are used, see [Create a Pipeline Using a Jenkinsfile](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-jenkinsfile/) and [Create a Pipeline Using Graphical Editing Panels](../../../../devops-user-guide/how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/).

## Prerequisites

- You have enabled [KubeSphere DevOps System](../../../../pluggable-components/devops/).
- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

## Create a Credential

Log in to the console of KubeSphere as `project-regular`. Navigate to your DevOps project, select **Credentials** and click **Create**.
1. Log in to the console of KubeSphere as `project-regular`.

2. Navigate to your DevOps project. On the navigation pane on the left, choose **DevOps Project Settings > Credentials**.

3. In the **Credentials** area on the right, click **Create**.

4. On the **Create Credential** dialog box, enter the credential name and choose the credetial type. Parameters vary depneding on the type you select. For more information, refer to the following.
### Create a username and password credential

To set a GitHub credential, you need to set the following parameters:

   - **Name**: Set a credential name, for example, `github-id`.
   - **Type**: Select **Username and password**.
   - **Username**: Enter your GitHub username.
   - **Password/Token**: Enter your GitHub token.
   - **Description**: Decribe the credential.

{{< notice note >}}

- Since August, 2021, GitHub has announced that it would require two factor authentication for users who contribute code on its service. Therefore, if you want to create a GitHub credential, you need to enter your GitHub token, instead of the password. For details about how to create a token, please refer to [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

- If there are any special characters such as `@` and `$` in your account or password, they can cause errors as a pipeline runs because they may not be recognized. In this case, you need to encode your account or password on some third-party websites first, such as [urlencoder](https://www.urlencoder.org/). After that, copy and paste the output for your credential information.

{{</ notice >}}
### Create an SSH key credential

You need to set the following parameters:

- **Name**: Set a credential name.
- **Type**: Select **SSH key**.
- **Username**: Enter your username.
- **Private Key**: Enter the SSH key.
- **Passphrase**: Enter the passphrase. For enhanced security, you are avised to set this parameter.
- **Description**: Decribe the credential.

### Create an access token credential

You need to set the following parameters:

- **Name**: Set a credential name.
- **Type**: Select **Access token**.
- **Access token**: Enter the access token.
- **Description**: Decribe the credential.

### Create a kubeconfig credential

You need to set the following parameters:

- **Name**: Set a credential name, for example, `demo-kubeconfig`.
- **Type**: Select **kubeconfig**.
- **Content**: The system automatically fills in the content when you access the current Kubernetes cluster. and you do not need to change it. However, if you are accessing other clusters, you may need change the content of kubeconfig.
- **Description**: Decribe the credential.

{{< notice info >}}

A file that is used to configure access to clusters is called a kubeconfig file. This is a generic way of referring to configuration files. For more information, see [the official documentation of Kubernetes](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

{{</ notice >}}

## View and Manage Credentials

1. Click any of them to go to its details page, where you can see account details and all the events related to the credentials.

2. You can also edit or delete credentials on this page. Note that when you edit credentials, KubeSphere does not display the existing username or password information. The previous one will be overwritten if you enter a new username and password.