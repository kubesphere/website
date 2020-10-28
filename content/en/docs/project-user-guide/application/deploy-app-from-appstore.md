---
title: "Deploy Applications from App Store"
keywords: 'kubernetes, chart, helm, KubeSphere, application'
description: 'Deploy Applications from App Store'


weight: 2209
---

The application template is the storage, delivery, and management approach for the application in KubeSphere. The application template is built on the [Helm](https://helm.sh/) packaging specification and delivered through a unified public or private application repository. The application can be composed of one or more Kubernetes workloads and services according to the application's characteristics.

Application templates visualize and provide deployment and management capabilities in KubeSphere, enabling users to quickly deploy applications to pointed projects based on application templates. The application template can serve as a middleware and business system created by the enterprise, which could be shared between the teams. It can also be used as the basis for constructing industry delivery standards, delivery processes and paths according to industry characteristics. 

Before using an application template, you need to add an application repository in advance. KubeSphere built an application repository service based on [OpenPitrix](https://openpitrix.io). Before using the application template, you need to upload the Helm application package to the object storage, then add an application repository in KubeSphere. It will automatically loads all the applications as App template under this repository, as described in [Add Application Repository](../deploy-app-from-repo).

![Use Application Template Flow](/images/application-templates/app-template-en.png)

In addition, application templates can also be combined with OpenPitrix's application lifecycle management capabilities to support docking ISV, and regular users through application uploading, application review, deployment testing, application publishing, application version management and more, finnaly build a public or private application store where offers application services for KubeSphere. Companies can also build industry-wide public or internal application stores to enable standardized one-click delivery of applications, see [OpenPitrix Official Documentation](https://openpitrix.io/docs/v0.4/zh-CN/manual-guide/introduction).

## Application List

In all projects, an **application** portal is provided, which serves as an entry point for the application template. Once the application is deployed, it can also be used as a list of applications to manage all applications under the current project.

![Application List](/images/application-templates/app-portal.png)

Click **Deploy New Application** to go to the **App Templates** page.

## Application Template

### Add a sample repository

As mentioned earlier, before using an application template, the cluster admin needs to pre-add the available application repository so that users can access and deploy the application in the application template.

This document provides a sample application repository just for demonstration. Users can upload application packages in the object storage and add application repositories as needed.

1. Sign in with the cluster admin account to the KubeSphere and go into the target workspace, then choose **App Management → App Repos** to enter the list page.

![Adding a sample repository](/images/application-templates/add-repo.png)

2. Click **Add Repo** button.

3. Fill in the basic information in the pop-up window, select https for the URL, fill in the blank with `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/`, then click the **Validate** button. After the validation is passed, click **OK** to complete it.

![basic information](/images/application-templates/validate-repo.png)
![repo list](https://pek3b.qingstor.com/kubesphere-docs/png/20190311145335.png)

### Access the application templates

Log out and switch to sign in with project-regular account, the normal user of the project and go into the target project, then choose  **Application Workloads → Applications → Deploy New Application → From App Templates → docs-demo-repo**, you can see that all the applications in the sample application repository have been imported into the application template, then you will be able to browse or search for the desired app for one-click deployment to the desired project.

![Access the application templates](/images/application-templates/deploy-new-application.png)

![Choose the application templates](/images/application-templates/choose-new-application.png)

For an example of a step-by-step deployment application, refer to [Quick Start - One-Click Deployment Application](../../quick-start/one-click-deploy)