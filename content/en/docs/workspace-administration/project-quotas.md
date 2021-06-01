---
title: "Project Quotas"
keywords: 'KubeSphere, Kubernetes, projects, quotas, resources, requests, limits'
description: 'Set requests and limits to control resource usage in a project.'
linkTitle: "Project Quotas"
aliases: 
    - "/docs/project-administration/project-quota/"
weight: 9600
---

KubeSphere uses requests and limits to control resource (for example, CPU and memory) usage in a project, also known as [ResourceQuotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) in Kubernetes. Requests make sure a project can get the resources it needs as they are specifically guaranteed and reserved. On the contrary, limits ensure that a project can never use resources above a certain value.

Besides CPU and memory, you can also set resource quotas for other objects separately such as Pods, [Deployments](../../project-user-guide/application-workloads/deployments/), [Jobs](../../project-user-guide/application-workloads/jobs/), [Services](../../project-user-guide/application-workloads/services/) and [ConfigMaps](../../project-user-guide/configuration/configmaps/) in a project.

This tutorial demonstrates how to configure quotas for a project.

## Prerequisites

You have an available workspace, a project and an account (`ws-admin`). The account must have the `admin` role at the workspace level. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../quick-start/create-workspace-and-project/).

{{< notice note >}}

If you use the account `project-admin` (an account of the `admin` role at the project level), you can set project quotas as well for a new project (i.e. its quotas remain unset). However, `project-admin` cannot change project quotas once they are set. Generally, it is the responsibility of `ws-admin` to set limits and requests for a project. `project-admin` is responsible for [setting limit ranges](../../project-administration/container-limit-ranges/) for containers in a project.

{{</ notice >}} 

## Set Project Quotas

1. Log in to the console as `ws-admin` and go to a project. On the **Overview** page, you can see project quotas remain unset if the project is newly created. Click **Set** to configure quotas.

   ![project-quotas](/images/docs/workspace-administration/project-quotas/project-quotas.jpg)

2. In the dialog that appears, you can see that KubeSphere does not set any requests or limits for a project by default. To set requests and limits to control CPU and memory resources, use the slider to move to a desired value or input numbers directly. Leaving a field blank means you do not set any requests or limits. 

   ![set-project-quotas](/images/docs/workspace-administration/project-quotas/set-project-quotas.jpg)

   {{< notice note >}}

   The limit can never be lower than the request.

   {{</ notice >}} 

3. To set quotas for other resources, click **Add quota item** and select an object from the list.

   ![set-other-resouce-quotas](/images/docs/workspace-administration/project-quotas/set-other-resouce-quotas.jpg)

4. Click **OK** to finish setting quotas.

5. Go to **Basic Info** in **Project Settings**, and you can see all resource quotas for the project.

   ![resrouce-quotas](/images/docs/workspace-administration/project-quotas/resrouce-quotas.jpg)

6. To change project quotas, click **Manage Project** on the **Basic Info** page and select **Edit Quota**.

   ![edit-quotas](/images/docs/workspace-administration/project-quotas/edit-quotas.jpg)

7. Change project quotas directly on the **Project Quota** page and click **OK**.

## See Also

[Container Limit Ranges](../../project-administration/container-limit-ranges/)