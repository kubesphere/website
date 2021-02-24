---
title: "Disk Log Collection"
keywords: 'KubeSphere, Kubernetes, project, disk, log, collection'
description: 'Disk Log Collection'
linkTitle: "Disk Log Collection"
weight: 13600
---

KubeSphere supports multiple log collection methods so that Ops teams can collect, manage and analyze logs in a unified and flexible way.

This tutorial demonstrates how to collect disk logs for an example app.

## Prerequisites

You need to create a workspace, a project and an account (`project-admin`). The account must be invited to the project with the role of `admin` at the project level. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../quick-start/create-workspace-and-project).

## Enable Disk Log Collection

1. Log in to the web console of KubeSphere as `project-admin` and go to your project.

2. From the left navigation bar, select **Advanced Settings** in **Project Settings**. Under **Disk Log Collection**, enable the feature through the toggle switch.

   ![enable-disk-log-collection](/images/docs/project-administration/disk-log-collection/enable-disk-log-collection.png)

## Create a Deployment

1. From the left navigation bar, select **Workloads** in **Application Workloads**. Under the **Deployments** tab,  click **Create**.

2. In the dialog that appears, set a name for the Deployment (e.g. `demo-deployment`) and click **Next**.

3. Under **Container Image**, click **Add Container Image**.

4. Enter `alpine` in the search bar to use the image (tag: `latest`) as an example.

   ![alpine-image](/images/docs/project-administration/disk-log-collection/alpine-image.png)

5. Scroll down to **Start Command** and check it. Input the following values for **Run Command** and **Parameters** respectively, click **√**, and then click **Next**.

   **Run Command**

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

   ![run-command](/images/docs/project-administration/disk-log-collection/run-command.png)

6. On the **Mount Volumes** tab, enable **Disk Log Collection** and click **Add Volume**.

   ![mount-volumes](/images/docs/project-administration/disk-log-collection/mount-volumes.png)
   
7. On the **Temporary Volume** tab, input a name for the volume (e.g. `demo-disk-log-collection`) and set the access mode and path. Refer to the image below as an example.

   ![volume-example](/images/docs/project-administration/disk-log-collection/volume-example.png)

   Click **√**, and then click **Next** to continue.

8. Click **Create** in **Advanced Settings** to finish the process.

   {{< notice note >}}

   For more information, see [Deployments](../../project-user-guide/application-workloads/deployments/).

   {{</ notice >}} 

## View Logs

1. Under the **Deployments** tab, click the Deployment just created to go to its detail page.

2. In **Resource Status**, click the arrow on the right to view container details, and then click the log icon of `logsidecar-container` (filebeat container) to inspect disk logs.

   ![container-log](/images/docs/project-administration/disk-log-collection/container-log.png)

   ![inspect-logs](/images/docs/project-administration/disk-log-collection/inspect-logs.png)

3. Alternatively, you can also use the **Log Search** function from **Toolbox** in the bottom right corner to view stdout logs. For example, use the Pod name of the Deployment for a fuzzy query:

   ![fuzzy-match](/images/docs/project-administration/disk-log-collection/fuzzy-match.png)

