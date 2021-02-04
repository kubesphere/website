---
title: "Container Limit Ranges"
keywords: 'Kubernetes, KubeSphere, resource, quotas, limits, requests, limit ranges, containers'
description: 'How to set default container limit ranges.'
linkTitle: "Container Limit Ranges"
weight: 13400
---

A container can use as much CPU and memory as set by [the resource quota for a project](../../workspace-administration/project-quotas/). At the same time, KubeSphere uses requests and limits to control resource (e.g. CPU and memory) usage for a container, also known as [LimitRanges](https://kubernetes.io/docs/concepts/policy/limit-range/) in Kubernetes. Requests make sure the container can get the resources it needs as they are specifically guaranteed and reserved. On the contrary, limits ensure that container can never use resources above a certain value.

When you create a workload, such as a Deployment, you configure resource requests and limits for the container. To make these request and limit fields pre-populated with values, you can set default limit ranges.  

This tutorial demonstrates how to set default limit ranges for containers in a project.

## Prerequisites

You have an available workspace, a project and an account (`project-admin`). The account must have the `admin` role at the project level. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../quick-start/create-workspace-and-project/).

## Set Default Limit Ranges

1. Log in to the console as `project-admin` and go to a project. On the **Overview** page, you can see default limit ranges remain unset if the project is newly created. Click **Set** to configure limit ranges.

   ![limit-ranges](/images/docs/project-administration/container-limit-ranges/limit-ranges.jpg)

2. In the dialog that appears, you can see that KubeSphere does not set any requests or limits by default. To set requests and limits to control CPU and memory resources, use the slider to move to a desired value or input numbers directly. Leaving a field blank means you do not set any requests or limits. 

   ![default-limit-range](/images/docs/project-administration/container-limit-ranges/default-limit-range.jpg)

   {{< notice note >}}

   The limit can never be lower than the request.

   {{</ notice >}} 

3. Click **OK** to finish setting limit ranges.

4. Go to **Basic Info** in **Project Settings**, and you can see default limit ranges for containers in a project.

   ![view-limit-ranges](/images/docs/project-administration/container-limit-ranges/view-limit-ranges.jpg)

5. To change default limit ranges, click **Manage Project** on the **Basic Info** page and select **Edit Resource Default Request**.

   ![change-limit-range](/images/docs/project-administration/container-limit-ranges/change-limit-range.jpg)

6. Change limit ranges directly in the dialog and click **OK**.

7. When you create a workload, requests and limits of the container will be pre-populated with values.

   ![workload-values](/images/docs/project-administration/container-limit-ranges/workload-values.jpg)

   {{< notice note >}}

   For more information, see **Resource Request** in [Container Image Settings](../../project-user-guide/application-workloads/container-image-settings/).

   {{</ notice >}}

## See Also

[Project Quotas](../../workspace-administration/project-quotas/)