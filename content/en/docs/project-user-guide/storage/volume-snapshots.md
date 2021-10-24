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

- Kubernetes version 1.17+.

- Your underlying storage plugin supports snapshots.
- You have an available volume so that you can create a snapshot for it. For more information, see [Volumes](../volumes/).

## Create a Volume Snapshot

1. Log in to the web console of KubeSphere as `project-regular`. On the **Volumes** page of your project, select a volume that you want to create a snapshot for.
2. On the details page, select **Create Snapshot** from the **More** drop-down menu.
3. In the displayed dialog box, set a name for the snapshot which serves as a unique identifier and select a **Volume Snapshot Class**. Click **OK** to finish.

4. Newly-created snapshots is displayed on the **Volume Snapshots** list.


## Use a Snapshot to Create a Volume

There are two ways for you to use a snapshot to create a volume.

### Create a volume from the snapshot detail page

1. Log in to the web console of KubeSphere as `project-regular`. On a snapshot's details page, click **Apply** to use the snapshot. Generally, the steps are the same as creating a volume directly.

2. In the displayed dialog box, set a name for the volume. Click **Next** to continue.

   {{< notice note >}}

   The resource you create is a PersistentVolumeClaim (PVC).

   {{</ notice >}} 

3. On the **Volume Settings** tab, select an access mode and click **Next**.

4. On the **Advanced Settings** tab, add metadata for the volume such as labels and annotations. Click **Create** to finish.

5. You can see the volume created appear on the **Volumes** page.

### Create a volume from the Volumes page

1. Log in to the web console of KubeSphere as `project-regular`. On the **Volumes** page of a project, click **Create**.

2. In the displayed dialog box, set a name for the volume. Click **Next** to continue.

3. On the **Volume Settings** tab, select **Create a Volume from Volume Snapshot** under the **Method** section. Select a snapshot and an access mode, and click **Next** to continue.

4. On the **Advanced Settings** tab, add metadata for the volume such as labels and annotations. Click **Create** to finish creating the volume.

5. The volume created is displayed on the **Volumes** page.