---
title: "Import Helm Repository"
keywords: "Kubernetes, helm, KubeSphere, application"
description: "Import Helm Repository into KubeSphere"

linkTitle: "Import Helm Repository"
weight: 100
---

KubeSphere builds app repositories that allow users to use Kubernetes applications based on Helm charts. App repositories are powered by [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source platform for cross-cloud application management sponsored by QingCloud. In an app repository, every application serves as a base package library. To deploy and manage an app from an app repository, you need to create the repository in advance.

To create a repository, you use an HTTP/HTTPS server or object storage solutions to store packages. More specifically, an app repository relies on external storage independent of OpenPitrix, such as [MinIO](https://min.io/) object storage, [QingStor object storage](https://github.com/qingstor), and [AWS object storage](https://aws.amazon.com/what-is-cloud-object-storage/). These object storage services are used to store configuration packages and index files created by developers. After a repository is registered, the configuration packages are automatically indexed as deployable applications.

This tutorial demonstrates how to add an app repository to KubeSphere.

## Prerequisites

- You need to enable [KubeSphere App Store (OpenPitrix)](../../../pluggable-components/app-store/).
- You need to have an app repository. Refer to [the official documentation of Helm](https://v2.helm.sh/docs/developing_charts/#the-chart-repository-guide) to create repositories or [upload your own apps to the public repository of KubeSphere](../upload-app-to-public-repository/). Alternatively, use the example repository in the steps below, which are only for demonstration purposes.
- You need to create a workspace and a user account (`ws-admin`). The account must be granted the role of `workspace-admin` in the workspace. For more information, refer to [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project/).

## Add App Repository

1. Log in the web console of KubeSphere as `ws-admin`. In your workspace, go to **App Repos** under **Apps Management**, and then click **Add Repo**.

    ![app-repo](/images/docs/workspace-administration/app-repository/import-helm-repository/app-repo.jpg)

2. In the dialogue that appears, specify an app repository name and add your repository URL. For example, enter `https://charts.kubesphere.io/main`.

    ![app-info-dialogue](/images/docs/workspace-administration/app-repository/import-helm-repository/app-info-dialogue.jpg)

    - **App Repository Name**: Set a simple and clear name for the repository, which is easy for users to identify.
    - **Type**: Support applications based on Helm charts.
    - **URL**: Support the following three protocols:
      - S3: The URL is S3-styled, such as `s3.<zone-id>.qingstor.com/<bucket-name>/` for the access to QingStor services using the S3 interface. If you select this type, you need to provide the access key and secret.
      - HTTP: Readable but not writable. Applications in the app repository (object storage) can be acquired and deployed to the runtime environment, such as `http://docs-repo.gd2.qingstor.com`. The example contains an sample app NGINX, which will be imported automatically after the repository is created. You can deploy it from app templates.
      - HTTPS: Readable but not writable. Applications in the app repository can be acquired and deployed to the runtime environment.
    - **Description**: Give a brief introduction of main features of the app repository.

3. After you specify required fields, click **Validate** to verify the URL. You will see a green check mark next to the URL if it is available and click **OK** to finish.

    ![validate-link](/images/docs/workspace-administration/app-repository/import-helm-repository/validate-link.jpg)
    
    {{< notice note >}}

- The example repository used in this tutorial is a mirror of Google's Helm repository. Some of the apps in this repository may not be successfully deployed. The KubeSphere team will develop a commercial version of app repositories for enterprises in the future.
- In an on-premises private cloud environment, you can build your own repository based on [Helm](https://helm.sh). Then, you develop and upload applications to the repository and deploy them on KubeSphere for your own needs.

{{</ notice >}} 

4. The repository displays in the repository list below after imported and KubeSphere automatically adds all apps in the repository as app templates. When users choose to deploy apps using app templates, they can see apps in this repository. For more information, see [App Repository](../../../project-user-guide/application/application-repo/).

   ![app-repo-list](/images/docs/workspace-administration/app-repository/import-helm-repository/app-repo-list.jpg)