---
title: "App Templates"
keywords: 'Kubernetes, Chart, Helm, KubeSphere, Application Template, Repository'
description: 'Understand the concept of app templates and how they can help to deploy applications within enterprises.'
linkTitle: "App Templates"
weight: 10110
version: "v3.3"
---

An app template serves as a way for users to upload, deliver, and manage apps. Generally, an app is composed of one or more Kubernetes workloads (for example, [Deployments](../../../project-user-guide/application-workloads/deployments/), [StatefulSets](../../../project-user-guide/application-workloads/statefulsets/) and [DaemonSets](../../../project-user-guide/application-workloads/daemonsets/)) and [Services](../../../project-user-guide/application-workloads/services/) based on how it functions and communicates with the external environment. Apps that are uploaded as app templates are built based on a [Helm](https://helm.sh/) package.

## How App Templates Work

You can deliver Helm charts to the public repository of KubeSphere or import a private app repository to offer app templates.

The public repository, also known as the App Store on KubeSphere, is accessible to every tenant in a workspace. After [uploading the Helm chart of an app](../../../workspace-administration/upload-helm-based-application/), you can deploy your app to test its functions and submit it for review. Ultimately, you have the option to release it to the App Store after it is approved. For more information, see [Application Lifecycle Management](../../../application-store/app-lifecycle-management/).

For a private repository, only users with required permissions are allowed to [add private repositories](../../../workspace-administration/app-repository/import-helm-repository/) in a workspace. Generally, the private repository is built based on object storage services, such as MinIO. After imported to KubeSphere, these private repositories serve as application pools to provide app templates.

{{< notice note >}}

[For individual apps that are uploaded as Helm charts](../../../workspace-administration/upload-helm-based-application/) to KubeSphere, they are displayed in the App Store together with built-in apps after approved and released. Besides, when you select app templates from private app repositories, you can also see **Current workspace** in the list, which stores these individual apps uploaded as Helm charts.

{{</ notice >}} 

KubeSphere deploys app repository services based on [OpenPitrix](https://github.com/openpitrix/openpitrix) as a [pluggable component](../../../pluggable-components/app-store/).

## Why App Templates

App templates enable users to deploy and manage apps in a visualized way. Internally, they play an important role as shared resources (for example, databases, middleware and operating systems) created by enterprises for the coordination and cooperation within teams. Externally, app templates set industry standards of building and delivery. Users can take advantage of app templates in different scenarios to meet their own needs through one-click deployment.

In addition, as OpenPitrix is integrated to KubeSphere to provide application management across the entire lifecycle, the platform allows ISVs, developers and regular users to all participate in the process. Backed by the multi-tenant system of KubeSphere, each tenant is only responsible for their own part, such as app uploading, app review, release, test, and version management. Ultimately, enterprises can build their own App Store and enrich their application pools with their customized standards. As such, apps can also be delivered in a standardized fashion.

For more information about how to use app templates, see [Deploy Apps from App Templates](../deploy-app-from-template/).