---
title: "Workspace Quotas"
keywords: 'KubeSphere, Kubernetes, workspace, quotas'
description: 'Set workspace quotas to control the total resource usage of projects and DevOps projects in a workspace.'
linkTitle: "Workspace Quotas"
weight: 9700
---

Workspace quotas are used to control the total resource usage of all projects and DevOps projects in a workspace. Similar to [project quotas](../project-quotas/), workspace quotas contain requests and limits of CPU and memory. Requests make sure projects in the workspace can get the resources they needs as they are specifically guaranteed and reserved. On the contrary, limits ensure that the resource usage of all projects in the workspace can never go above a certain value.

In [a multi-cluster architecture](../../multicluster-management/), as you need to [assign one or multiple clusters to a workspace](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/), you can decide the amount of resources that can be used by the workspace on different clusters.

This tutorial demonstrates how to manage resource quotas for a workspace.

## Prerequisites

You have an available workspace and a user (`ws-manager`). The user must have the `workspaces-manager` role at the platform level. For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

## Set Workspace Quotas

1. Log in to the KubeSphere web console as `ws-manager` and go to a workspace.

2. Navigate to **Workspace Quotas** under **Workspace Settings**.

3. The **Workspace Quotas** page lists all the available clusters assigned to the workspace and their respective requests and limits of CPU and memory. Click **Edit Workspace Quotas** on the right of a cluster.

4. In the displayed dialog box, you can see that KubeSphere does not set any requests or limits for the workspace by default. To set requests and limits to control CPU and memory resources, move <img src="/images/docs/common-icons/slider.png" width="20" /> to a desired value or enter numbers directly. Leaving a field blank means you do not set any requests or limits.

   {{< notice note >}}

   The limit can never be lower than the request.

   {{</ notice >}} 

5. Click **OK** to finish setting quotas.

## See Also

[Project Quotas](../project-quotas/)

[Container Limit Ranges](../../project-administration/container-limit-ranges/)