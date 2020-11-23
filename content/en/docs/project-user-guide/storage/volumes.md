---
title: "Volumes"
keywords: 'kubernetes, docker, persistent volume, persistent volume claim, volume clone, volume snapshot, volume expanding'
description: 'Create Volumes (PVCs)'

linkTitle: "Volumes"
weight: 2110
---

## Introduction

In this section, Volume always refer to PersistentVolumeClaim(PVC) of Kubernetes.

## Create Volume

### Method

There are two methods to create a volume:

- Create empty volume by StorageClass
- Create volume from VolumeSnapshot

![Create](/images/storage/create-volume.png)

## Attach Volume onto Workloads

Take attaching volume onto deployment for example, in the `Mount Volumes` step of *Create Deployment*,
volumes cloud be attached on containers' path.
![Attach](/images/storage/attach-volume.png)

## Volume Features

Volume Features include:

- Clone Volume
- Create Volume Snapshot
- Expand Volume

KubeSphere can get supported features of underlying storage plugin called `Storage Capability`.
The console only displays supported features in `Volume Detail Page`.
For more information about `Storage Capability`, see [Design Documentation](https://github.com/kubesphere/community/blob/master/sig-storage/concepts-and-designs/storage-capability-interface.md).

![Volume Feature](/images/storage/volume-features.png)

**Node**: Some in-tree or special CSI plugins may not be covered by **Storage Capability**.
If Kubesphere does not display the correct features in your cluster, you could adjust according to [the guide](https://github.com/kubesphere/kubesphere/issues/2986).

## Volume Monitoring

KubeSphere retrieves metric data of PVCs with FileSystem mode from Kubelet to monitor volumes including capacity usage and inode usage.
![Monitoring](/images/storage/volume-monitoring.png)

For more information about Volume Monitoring illustrations, see [Research on Volume Monitoring](https://github.com/kubesphere/kubesphere/issues/2921).
