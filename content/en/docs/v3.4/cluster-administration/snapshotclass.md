---
title: "Volume Snapshot Classes"
keywords: 'KubeSphere, Kubernetes, PVC, PV, Snapshot, Snapshot Classes'
description: 'Learn how to manage snapshot classes on KubeSphere.'
linkTitle: "Volume Snapshot Classes"
weight: 8900
version: "v3.4"
---

Volume snapshot classes provide a way for administrators to define storage types used for volume snapshots. This tutorial describes how to create and use snapshot classes.

## Prerequisites

- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

- You need to install Kubernetes 1.17 or higher.

- Your underlying storage plugin supports snapshots.

## Procedures

1. Log in to the web console of KubeSphere as `project-regular`. On the navigation pane on the left, click **Storage > Volume Snapshot Classes**.

2. On the **Volume Snapshot Classes** page, click **Create**.

3. In the displayed **Create Volume Snapshot Class** dialog box, set the name of the volume snapshot, and click **Next**. Also, you can set an alias and add description.

4. On the **Volume Snapshot Class Settings** tab, select a provisioner and deletion policy, which supports the following types:

   -  Delete: The snapshot of the underlying storage will be deleted along with the VolumeSnapshotContent.
   -  Retain: Both the snapshot of the underlying storage and the VolumeSnapshotContent will be retained.

