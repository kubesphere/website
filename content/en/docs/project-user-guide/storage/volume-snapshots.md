---
title: "Volume Snapshots"
keywords: 'KubeSphere, kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Volume Snapshots'

linkTitle: "Volume Snapshots"
weight: 2130
---

## Introduction
Many storage systems provide the ability to create a "snapshot" of a persistent volume. 
A snapshot represents a point-in-time copy of a volume. 
A snapshot can be used either to provision a new volume (pre-populated with the snapshot data) 
or to restore the existing volume to a previous state (represented by the snapshot).

On KubeSphere, requirements for Volume Snapshot are:
- With 1.17+ Kubernetes
- Underlying storage plugin supports Snapshot 

## Create Volume Snapshot
Volume Snapshot could be created from an existing volume on the volume detail page. 
![Apply Snapshot](/images/storage/create-snapshot.png)

The created Volume Snapshot will be listed in the volume snapshot page.
![Snapshot List](/images/storage/snapshot-list.png)

## Apply Volume Snapshot
Volume Snapshot could be applied to create volume from the snapshot. 

![Apply Snapshot](/images/storage/apply-snapshot.png)

