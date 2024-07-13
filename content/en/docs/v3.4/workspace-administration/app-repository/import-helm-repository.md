---
title: "Import a Helm Repository"
keywords: "Kubernetes, Helm, KubeSphere, Application"
description: "Import a Helm repository to KubeSphere to provide app templates for tenants in a workspace."
linkTitle: "Import a Helm Repository"
weight: 9310
version: "v3.4"
---

KubeSphere builds app repositories that allow users to use Kubernetes applications based on Helm charts. App repositories are powered by [OpenPitrix](https://github.com/openpitrix/openpitrix), an open source platform for cross-cloud application management sponsored by QingCloud. In an app repository, every application serves as a base package library. To deploy and manage an app from an app repository, you need to create the repository in advance.

To create a repository, you use an HTTP/HTTPS server or object storage solutions to store packages. More specifically, an app repository relies on external storage independent of OpenPitrix, such as [MinIO](https://min.io/) object storage, [QingStor object storage](https://github.com/qingstor), and [AWS object storage](https://aws.amazon.com/what-is-cloud-object-storage/). These object storage services are used to store configuration packages and index files created by developers. After a repository is registered, the configuration packages are automatically indexed as deployable applications.

This tutorial demonstrates how to add an app repository to KubeSphere.

## Prerequisites

- You need to enable the [KubeSphere App Store (OpenPitrix)](../../../pluggable-components/app-store/).
- You need to have an app repository. Refer to [the official documentation of Helm](https://v2.helm.sh/docs/developing_charts/#the-chart-repository-guide) to create repositories or [upload your own apps to the public repository of KubeSphere](../upload-app-to-public-repository/). Alternatively, use the example repository in the steps below, which is only for demonstration purposes.
- You need to create a workspace and a user (`ws-admin`). The user must be granted the role of `workspace-admin` in the workspace. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Add an App Repository

1. Log in to the web console of KubeSphere as `ws-admin`. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.

2. In the dialog that appears, specify an app repository name and add your repository URL. For example, enter `https://charts.kubesphere.io/main`.

    - **Name**: Set a simple and clear name for the repository, which is easy for users to identify.
    - **URL**: Follow the RFC 3986 specification with the following three protocols supported:
      - S3: The URL is S3-styled, such as `s3.<region>.amazonaws.com` for the access to Amazon S3 services using the S3 interface. If you select this type, you need to provide the access key and secret.
      - HTTP: For example, `http://docs-repo.gd2.qingstor.com`. The example contains a sample app NGINX, which will be imported automatically after the repository is created. You can deploy it from app templates.
      - HTTPS: For example, `https://docs-repo.gd2.qingstor.com`.
      {{< notice note >}}

If you want to use basic access authentication in HTTP/HTTPS, you can use a URL with a style like this: `http://username:password@docs-repo.gd2.qingstor.com`.

{{</ notice >}}

    - **Synchronization Interval**: Interval of synchronizing the remote app repository.

    - **Description**: Give a brief introduction of main features of the app repository.

3. After you specify required fields, click **Validate** to verify the URL. You will see a green check mark next to the URL if it is available and click **OK** to finish.

    {{< notice note >}}

- In an on-premises private cloud environment, you can build your own repository based on [ChartMuseum](https://chartmuseum.com/). Then, you develop and upload applications to the repository and deploy them on KubeSphere for your own needs. 

- If you need to set up HTTP basic access authentication, you can refer to [this document](https://github.com/helm/chartmuseum#basic-auth).

    {{</ notice >}}

4. The repository appears in the repository list after imported and KubeSphere automatically adds all apps in the repository as app templates. When users choose to deploy apps using app templates, they can see apps in this repository. For more information, see [Deploy Apps from App Templates](../../../project-user-guide/application/deploy-app-from-template/).
