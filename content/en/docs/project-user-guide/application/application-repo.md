---
title: "Application Repository"
keywords: 'kubernetes, chart, helm, KubeSphere, application'
description: 'Application Repository'


weight: 2200
---

An application template is the packaging, delivery, and management approach for the application in KubeSphere. An application template is composed of one or more Kubernetes workloads and services according to the application's characteristics and built on the [Helm](https://helm.sh/) packaging specification and delivered through a unified public or private application repository. The public repository is also called App Store in KubeSphere accessible to anybody. The private repository is usually limited access within workspace scope.

Application templates visualize and provide deployment and management capabilities in KubeSphere, enabling users to quickly deploy applications to specified projects based on application templates. The application template can serve as a standard delivery way for database, middleware and business system created by the enterprise. The templates could be shared between the teams through repository.

KubeSphere deploys an application repository service based on [OpenPitrix](https://openpitrix.io/) as a [pluggable component](../../../pluggable-components/app-store/). Before using any application template, you need to upload the Helm application package to a reposiotyr hosted by an object storage service, then add the application repository in KubeSphere. The KubeSphere repository service will automatically loads all the applications templates into the repository created in KubeSphere, as described [below](#add-a-sample-repository).

![Use Application Template Flow](/images/application-templates/app-template-en.png)

In addition, application templates can leverage OpenPitrix's application lifecycle management capabilities to support docking ISV, and regular users through application uploading, application review, deployment testing, application publishing, application version management and more, finally build a public or private application store where offers application services for KubeSphere. Companies can also build industry-wide public or internal application stores to enable standardized one-click delivery of applications, see [OpenPitrix Official Documentation](https://openpitrix.io/docs/v0.4/zh-CN/manual-guide/introduction).

This document will explain how to add a repository and use it. [Deploy Application from App Template](../deploy-app-from-template/) demonstates how to deploy an example application based on template from workspace private repository. [Deploy Application from App Store](../deploy-app-from-appstore) demonstrates how to deploy an example application from App Store, the public repository built in KubeSphere.

## Application List

In a project, the **Applications** under **Application Workloads** shows all deployed applications. This is also the place where you deploy applications based on templates either from a private repository or from App Store.

![Application List](/images/application-templates/app-portal.png)

Click **Deploy New Application** to go to the **App Templates** page.

## Application Template

### Add a sample repository

As mentioned earlier, before using an application template, the workspace admin needs to pre-add the available application repository so that users can access and deploy the application from the template.

This document provides a sample application repository just for demonstration. Users can upload application packages in any Helm-based repository and add it to KubeSphere as needed.

1. Sign in with the workspace admin account to the KubeSphere and go into the target workspace, then choose **App Management → App Repos** to enter the list page. Click **Add Repo** button.

    ![Adding a sample repository](/images/application-templates/add-repo.png)

2. Fill in the basic information in the pop-up window, select https for the URL, fill in the blank with `charts.kubesphere.io/stable/`, then click the **Validate** button. After the validation is passed, click **OK** to complete it.

    ![basic information](/images/application-templates/validate-repo.png)

    ![repo list](https://pek3b.qingstor.com/kubesphere-docs/png/20190311145335.png)

### Access the application templates

Log out and switch to sign in with project-regular account and go into the target project, then choose  **Application Workloads → Applications → Deploy New Application → From App Templates → docs-demo-repo**. You can see that all the application templates have been imported into the KubeSphere repository, then you will be able to browse or search any desired application to deploy with one click.

![Access the application templates](/images/application-templates/deploy-new-application.png)

![Choose the application templates](/images/application-templates/choose-new-application.png)