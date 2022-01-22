---
title: "Log Collection"
keywords: 'KubeSphere, Kubernetes, project, disk, log, collection'
description: 'Enable log collection so that you can collect, manage, and analyze logs in a unified way.'
linkTitle: "Log Collection"
weight: 13600
---

KubeSphere supports multiple log collection methods so that Ops teams can collect, manage, and analyze logs in a unified and flexible way.

This tutorial demonstrates how to collect logs for an example app.

## Prerequisites

- You need to create a workspace, a project and a user (`project-admin`). The user must be invited to the project with the role of `admin` at the project level. For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).
- You need to enable [the KubeSphere Logging System](../../pluggable-components/logging/).

## Enable Log Collection

1. Log in to the web console of KubeSphere as `project-admin` and go to your project.

2. From the left navigation bar, click **Log Collection** in **Project Settings**, and then click <img src="/images/docs/project-administration/disk-log-collection/log-toggle-switch.png" width="60" /> to enable the feature.

## Create a Deployment

1. From the left navigation bar, select **Workloads** in **Application Workloads**. Under the **Deployments** tab,  click **Create**.

2. In the dialog that appears, set a name for the Deployment (for example, `demo-deployment`) and click **Next**.

3. Under **Containers**, click **Add Container**.

4. Enter `alpine` in the search bar to use the image (tag: `latest`) as an example.

5. Scroll down to **Start Command** and select the checkbox. Enter the following values for **Command** and **Parameters** respectively, click **√**, and then click **Next**.

   **Command**

   ```bash
   /bin/sh
   ```

   **Parameters**

   ```bash
   -c,if [ ! -d /data/log ];then mkdir -p /data/log;fi; while true; do date >> /data/log/app-test.log; sleep 30;done
   ```

   {{< notice note >}}

   The command and parameters above mean that the date information will be exported to `app-test.log` in `/data/log` every 30 seconds.

   {{</ notice >}} 

6. On the **Volume Settings** tab, click <img src="/images/docs/project-administration/disk-log-collection/toggle-switch.png" width="20" /> to enable **Collect Logs on Volumes** and click **Mount Volume**.

7. On the **Temporary Volume** tab, enter a name for the volume (for example, `demo-disk-log-collection`) and set the access mode and path.

   Click **√**, and then click **Next**.

8. Click **Create** in **Advanced Settings** to finish the process.

   {{< notice note >}}

   For more information, see [Deployments](../../project-user-guide/application-workloads/deployments/).

   {{</ notice >}} 

## View Logs

1. Under the **Deployments** tab, click the Deployment just created to go to its detail page.

2. In **Resource Status**, you can click <img src="/images/docs/project-administration/disk-log-collection/arrow.png" width="20" /> to view container details, and then click <img src="/images/docs/project-administration/disk-log-collection/log-icon.png" width="20" /> of `logsidecar-container` (filebeat container) to view logs.

3. Alternatively, you can also click <img src="/images/docs/project-administration/disk-log-collection/toolbox.png" width="20" />  in the lower-right corner and select **Log Search** to view stdout logs. For example, use the Pod name of the Deployment for a fuzzy query.

