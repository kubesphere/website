---
title: "Import Helm Repository"
keywords: "kubernetes, helm, kubesphere, application"
description: "Import Helm Repository into KubeSphere"

linkTitle: "Import Helm Repository"
weight: 100
---

KubeSphere builds application repository services on [OpenPitrix](https://openpitrix.io), the open source cross-cloud application management platform from [QingCloud](https://www.qingcloud.com), which supports for Kubernetes applications based on Helm Chart. In an application repository, each application is a base package repository and if you want to use OpenPitrix for application management, you need to create the repository first. You can store packages to an HTTP/HTTPS server, a [minio](https://docs.min.io/), or an S3 object storage. The application repository is an external storage independent of OpenPitrix, which can be [minio](https://docs.min.io/), QingCloud's QingStor object storage, or AWS object storage, in which the contents are the configuration packages of the application developed by developers. and indexed files. After registering the repository, the stored application configuration packages are automatically indexed as deployable applications.

## Preparing the application repository

The [official Helm documentation](https://helm.sh/docs/topics/chart_repository/#hosting-chart-repositories) already provides several ways to create application repositories, But in this document, we recommend that you use the official KubeSphere helm repo.

- [KubeSphere Official Application Repository](https://charts.kubesphere.io/)

## Adding application repositories

1. Create a Workspace, and then in the Workspace, go to `Workspace Management → Application Repository` and click `Create Application Repository`.

    ![repo](https://pek3b.qingstor.com/kubesphere-docs/png/20191025004747.png)

2. In the Add Repository window, fill in the URL with `https://charts.kubesphere.io/main`, and then create the repository after verification.

    - Repository Name: Give a simple and clear name to the repository, which is easy for users to browse and search.
    - Type: Helm Chart type application is supported.
    - URL: The following three protocols are supported
        - The URL is S3 styled, e.g. `s3.<zone-id>.qingstor.com/<bucket-name>/` to access the QingStor service using the S3 interface.
        - HTTP: readable, not writable, only supports fetching applications from this application repository (object storage) and deploying to the runtime environment, e.g., enter `http://docs-repo.gd2.qingstor.com`. This example contains a sample Nginx application that will be automatically imported into the platform after creation, and can be done in the application template Deployment.
        - HTTPS: readable, not writable, supports only getting applications from this application repository, supports deployment to a runtime environment.

    - Description information: a brief description of the main features of the application repository to give users a better understanding of the application repository.

3. If the validation is passed, click the **OK** button to complete the addition of the application repository. Once the repository is added, KubeSphere will automatically load all the application templates under the repository.

> Note that the example repository added above is a mirror of Google's Helm repository (we will be developing a commercial version of the application repository for enterprise use in the future), and some of these applications may not be successfully deployed.

In an on-premises private cloud scenario, you can build your own repository based on [Helm](https://helm.sh), and develop and upload applications to your repository that meet your business needs, and then deploy them for distribution based on KubeSphere.
