---
title: "Volume Snapshots"
keywords: 'KubeSphere, Kubernetes, volume, snapshots'
description: 'Learn how to manage a snapshot of a persistent volume in KubeSphere.'
linkTitle: "Volume Snapshots"
weight: 10320
---

Many storage systems provide the ability to create a snapshot of a persistent volume. A snapshot represents a point-in-time copy of a volume. It can be used either to provision a new volume (pre-populated with the snapshot data) or to restore the existing volume to a previous state (represented by the snapshot). For more information, see [the Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/volume-snapshots/).

This tutorial demonstrates how to create and use a volume snapshot.

## Prerequisites

- You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

- Kubernetes version 1.17+.

- Your underlying storage plugin supports snapshots.
- You have an available volume so that you can create a snapshot for it. For more information, see [Volumes](../volumes/).

## Create a Volume Snapshot

1. Log in to the web console of KubeSphere as `project-regular`. On the **Volumes** page of your page, select a volume that you want to create a snapshot for.

   ![select-volume](/images/docs/project-user-guide/volume-management/volume-snapshots/select-volume.jpg)

2. On the detail page, select **Create Snapshot** from the **More** drop-down list.

   ![drop-down-list-select](/images/docs/project-user-guide/volume-management/volume-snapshots/drop-down-list-select.jpg)

3. Set a name for the snapshot which serves as a unique identifier. Click **OK** to finish.

   ![snapshot-name](/images/docs/project-user-guide/volume-management/volume-snapshots/snapshot-name.jpg)

4. Newly-created snapshots will appear on the **VolumeSnapshots** list.

   ![snapshot-list](/images/docs/project-user-guide/volume-management/volume-snapshots/snapshot-list.jpg)

## Use a Snapshot to Create a Volume

There are two ways for you to use a snapshot to create a volume.

### Create a volume from the snapshot detail page

1. Log in to the web console of KubeSphere as `project-regular`. On a snapshot's detail page, click **Apply** to use the snapshot. Generally, the steps are the same as creating a volume directly.

   ![apply-volume](/images/docs/project-user-guide/volume-management/volume-snapshots/apply-volume.jpg)

2. In the dialog that appears, set a name for the volume. Click **Next** to continue.

   {{< notice note >}}

   The resource you create is a PersistentVolumeClaim (PVC).

   {{</ notice >}} 

3. Select an access mode and click **Next**.

   ![pvc-create](/images/docs/project-user-guide/volume-management/volume-snapshots/pvc-create.jpg)

4. On the **Advanced Settings** page, add metadata for the volume such as labels and annotations. Click **Create** to finish.

5. You can see the volume created appear on the **Volumes** page.

### Create a volume from the Volumes page

1. Log in to the web console of KubeSphere as `project-regular`. On the **Volumes** page of a project, click **Create**.

   ![volumes-page](/images/docs/project-user-guide/volume-management/volume-snapshots/volumes-page.jpg)

2. In the dialog that appears, set a name for the volume. Click **Next** to continue.

3. On the **Volume Settings** page, select **Create a volume by VolumeSnapshot** under the **Method** section. Select a snapshot and an access mode, and click **Next** to continue.

   ![create-by-snapshot](/images/docs/project-user-guide/volume-management/volume-snapshots/create-by-snapshot.jpg)

4. On the **Advanced Settings** page, add metadata for the volume such as labels and annotations. Click **Create** to finish.

5. You can see the volume created appear on the **Volumes** page.