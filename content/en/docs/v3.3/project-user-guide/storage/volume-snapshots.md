---
title: "Volume Snapshots"
keywords: 'KubeSphere, Kubernetes, Volume, Snapshots'
description: 'Learn how to manage a snapshot of a persistent volume on KubeSphere.'
linkTitle: "Volume Snapshots"
weight: 10320
---

Many storage systems provide the ability to create a snapshot of a persistent volume. A snapshot represents a point-in-time copy of a volume. It can be used either to provision a new volume (pre-populated with the snapshot data) or to restore the existing volume to a previous state (represented by the snapshot). For more information, see [the Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/volume-snapshots/).

This tutorial demonstrates how to create and use a volume snapshot.

## Prerequisites

- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

- You need to install Kubernetes 1.17 or higher.

- Your underlying storage plugin supports snapshots.

- You have an available PVC so that you can create a snapshot for it. For more information, see [Volumes](../volumes/).

- You need to create a [volume snapshot class](../../../cluster-administration/snapshotclass/).

## Create a Volume Snapshot

You can create a volume snapshot using either of the following ways.

### Method 1: From the Volume Snapshot Page

1. Log in to the web console of KubeSphere as `project-regular`. On the navigation pane on the left, choose **Storage > Volume Snapshots**.

2. On the **Volume Snapshots** page on the right, click **Create**.

3. On the **Create Snapshot** page that is displayed, select a persistent volume claim that supports snapshots, enter a snapshot name, select a snapshot volume class, and then click **OK**. You can view the created volume snapshot in the volume snapshot list.

4. Click the Volume Snapshot Content tab, and you can view details of the volume snapshot, such as its status, capacity, and volume snapshot class.
### Method 2: From the Persistent Volume Claims Page

1. Log in to the web console of KubeSphere as `project-regular`. On the **Persistent Volume Claims** page of your project, select a volume for which you want to create a snapshot.

2. On the details page, choose **More > Create Snapshot**.

3. In the displayed dialog box, set a name for the snapshot which serves as a unique identifier and select a **Volume Snapshot Class**. Click **OK** to finish. You can view the created volume snapshot in the volume snapshot list.

## Use a Snapshot to Create a PVC

There are two ways for you to use a snapshot to create a PVC.

### From the Snapshot Details Page

1. Log in to the web console of KubeSphere as `project-regular`. On a snapshot's details page, click **Create Volume** to use the snapshot. Generally, the steps are the same as creating a PVC directly.

2. In the displayed dialog box, set a name for the PVC. Click **Next** to continue.

   {{< notice note >}}

   The resource you create is a Persistent Volume Claim (PVC).

   {{</ notice >}} 

3. On the **Storage Settings** tab, select an access mode and click **Next**.

4. On the **Advanced Settings** tab, add metadata for the PVC, such as labels and annotations. Click **Create** to finish.

   The created PVC is displayed on the **Persistent Storage Claims** page.

### From the Persistent Storage Claims Page

1. Log in to the web console of KubeSphere as `project-regular`. On the **Persistent Storage Claims** page of a project, click **Create**.

2. In the displayed dialog box, set a name for the volume. Click **Next** to continue.

3. On the **Storage Settings** tab, select **From Volume Snapshot** under the **Creation Method** section. Select a snapshot and an access mode, and click **Next** to continue.

4. On the **Advanced Settings** tab, add metadata for the PVC, such as labels and annotations. Click **Create** to finish creating the PVC.

   The PVC created is displayed on the **Persistent Storage Claims** page.