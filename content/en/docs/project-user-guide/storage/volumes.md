---
title: "Volumes"
keywords: 'Kubernetes, Persistent Volumes, Persistent Volume Claims, Volume Clone, Volume Snapshot, Volume Expansion'
description: 'Learn how to create, edit, and mount a volume on KubeSphere.'
linkTitle: "Volumes"
weight: 10310
---

When you create an application workload in a project, you can create a [PersistentVolumeClaim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) (PVC) for it. A PVC allows you to create a storage request, further provisioning persistent storage to applications. More specifically, persistent storage is managed by PersistentVolume resources.

Cluster administrators configure PersistentVolumes using storage classes. In other words, to create a PersistentVolumeClaim in a project, your cluster must have an available storage class. If no customized storage class is configured when you install KubeSphere, [OpenEBS](https://openebs.io/) is installed in your cluster by default to provide Local Persistent Volumes. However, it does not support dynamic volume provisioning. In a production environment, it is recommended you configure storage classes in advance to provide persistent storage services for your apps.

This tutorial demonstrates how to create a volume, mount a volume and use volume features from its detail page.

## Prerequisites

- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

- If you want to dynamically provision a volume, you need to [configure a storage class](../../../cluster-administration/persistent-volume-and-storage-class/) that supports dynamic provisioning.

## Create a Volume

All the volumes that are created on the **Volumes** page are PersistentVolumeClaim objects. KubeSphere binds a PersistentVolumeClaim to a PersistentVolume that satisfies the request you set for the PersistentVolumeClaim, such as capacity and access mode. When you create an application workload, you can select the desired volume and mount it to your workload.

1. Log in to the web console of KubeSphere as `project-regular` and go to a project. Click **Volumes** under **Storage** from the navigation bar, and you see all volumes that have been mounted to workloads in the project.

2. To create a volume, click **Create** on the **Volumes** page.

3. In the displayed dialog box, set a name (for example, `demo-volume`) for the volume and click **Next**.

   {{< notice note >}}

   You can see the volume's manifest file in YAML format by enabling **Edit YAML** in the upper-right corner. KubeSphere allows you to edit the manifest file directly to create a volume. Alternatively, you can follow the steps below to create a volume via the dashboard.

   {{</ notice >}} 

4. On the **Volume Settings** page, select a method to create a volume.

   - **Create a Volume from Storage Class**. You can configure storage classes both [before](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/) and [after](../../../cluster-administration/persistent-volume-and-storage-class/) the installation of KubeSphere.

   - **Create a Volume from Volume Snapshot**. To use a snapshot to create a volume, you must create a volume snapshot first.

   Select **Create a Volume from Storage Class** in this example. For more information about how to create a volume by snapshot, see [Volume Snapshots](../volume-snapshots/).

5. Select a storage class from the drop-down list. This tutorial uses `csi-standard`, a standard storage class provided by QingCloud Platform. You can select your own storage class.

6. Depending on the storage class you select, you may see different access modes in this section as some PersistentVolumes only support specific access modes. In total, there are three access modes.

   - **ReadWriteOnce**: The volume can be mounted as read-write by a single node.
   - **ReadOnlyMany**: The volume can be mounted as read-only by many nodes.
   - **ReadWriteMany**: The volume can be mounted as read-write by many nodes.

   Select the desired access mode.

7. Under **Volume Capacity**, specify the size of the volume. Click **Next** to continue.

8. On the **Advanced Settings** page, you can add metadata to the volume, such as **Labels** and **Annotations**. They can be used as identifiers to search for and schedule resources.

9. Click **Create** to finish creating a volume.

10. A created volume displays on the **Volumes** page in a project. After it is mounted to a workload, it will turn to **Mounted** under the **Mount Status** column.

    {{< notice note >}}

Newly-created volumes is also displayed on the **Volumes** page in **Cluster Management**. Project users such as `project-regular` can view volume instances under the **Volume Instance** column. Cluster administrators have the responsibility to view and keep track of created volumes in a project. Conversely, if a cluster administrator creates a volume for a project in **Cluster Management**, the volume is also displayed on the **Volumes** page in a project.

{{</ notice >}} 

11. For some volumes, you can see the status reach **Bound** from **Pending** immediately after they are created as they are provisioned dynamically. For volumes that remain in the **Pending** status, they will turn to **Bound** once they are mounted to a workload. The difference is decided by the storage class of the volume.

    For example, if you install KubeSphere with the default storage class (OpenEBS), you can only create local volumes, which means dynamic provisioning is not supported. This is specified by the `volumeBindingMode` field which is set to `WaitForFirstConsumer`.

## Mount a Volume

When you create application workloads, such as [Deployments](../../../project-user-guide/application-workloads/deployments/), [StatefulSets](../../../project-user-guide/application-workloads/statefulsets/) and [DaemonSets](../../../project-user-guide/application-workloads/daemonsets/), you can mount volumes to them.

{{< notice note >}}

This tutorial does not explain how to create workloads. For more information, see related guides in Application Workloads.

{{</ notice >}}

On the **Volume Settings** page, you can see there are different volumes that you can mount to your workload.

- **Add Volume Template** (Only available to [StatefulSets](../../../project-user-guide/application-workloads/statefulsets/)): A volume template is used to dynamically create a PVC. Mount the PVC of the StorageClass type to the Pod by setting the name, storage class, access mode, capacity and path, which are all indicated by the field `volumeClaimTemplates`.

- **Mount Volume**: Support emptyDir volumes and PVCs.

  In **Mount Volume**, there are 3 kinds of volumes:

  - **Existing Volume**: Use a PVC to mount.

    Persistent storage volumes can be used to save users' persistent data. You need to create volumes (PVCs) in advance so that you can choose an existing volume from the list.

  - **Temporary Volume**: Use an emptyDir volume to mount.

    The temporary storage volume represents [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir), which is first created when a Pod is assigned to a node, and exists as long as that Pod is running on that node. An emptyDir volume offers an empty directory from which containers in the Pod can read and write. Depending on your deployment environment, an emptyDir volume can be stored on any medium that is backing the node, which could be a disk or SSD. When the Pod is removed from the node for any reason, the data in the emptyDir is deleted forever.

  - **HostPath Volume**: Use a hostPath volume to mount.

    A HostPath volume mounts a file or directory from the host node's filesystem into your Pod. This is not something that most Pods will need, but it offers a powerful escape hatch for some applications. For more information, refer to [the Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath).

- **Mount ConfigMap or Secret**: Support key-value pairs of [ConfigMaps](../../../project-user-guide/configuration/configmaps/) or [Secrets](../../../project-user-guide/configuration/secrets/).

  A [Secret](https://kubernetes.io/docs/concepts/storage/volumes/#secret) volume is used to provide sensitive information, such as passwords, OAuth tokens, and SSH keys, for Pods. Secret volumes are backed by tmpfs (a RAM-backed filesystem) so they are never written to non-volatile storage.

  A [ConfigMap](https://kubernetes.io/docs/concepts/storage/volumes/#configmap) is used to store configuration data in the form of key-value pairs. The ConfigMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type `configMap` and then consumed by containerized applications running in a Pod. ConfigMaps are often used in the following cases:

  - Set the value of environment variables.
  - Set command parameters in containers.
  - Create a configuration file in volumes.

## View Volume Details

After a volume is created, you can see detailed information of it, edit it, or leverage volume features. To view volume details, click a volume on the **Volumes** page.

### Edit a volume

On the details page, you can click **Edit Information** to change its basic information. Click **More** and you can edit its YAML file or delete this volume.

To delete a volume, make sure the volume is not mounted to any workload. To unmount a volume, go to the detail page of a workload. From the **More** drop-down list, click **Edit Settings**. Select **Volumes** from the pop-up window, and click the dustbin icon to unmount it.

If the status of a volume remains **Terminating** for a long time after you clicked **Delete**, manually delete it by using the following command:

```bash
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}'
```

### Volume features

From the **More** drop-down menu, there are three additional options provided by KubeSphere based on the underlying storage plugin, also known as `Storage Capability`. Volume features include:

- Clone a volume: Create a same volume.
- Create a volume snapshot: Create a volume snapshot which can be used to create volumes. For more information, see [Volume Snapshots](../volume-snapshots/).
- Expand a volume: Increase the size of a volume. Keep in mind that you cannot reduce the size of a volume on the console due to possible data loss. 

For more information about `Storage Capability`, see [Design Documentation](https://github.com/kubesphere/community/blob/master/sig-storage/concepts-and-designs/storage-capability-interface.md).

{{< notice note >}}

Some in-tree or special CSI plugins may not be covered by `Storage Capability`. If KubeSphere does not display the correct features in your cluster, you can make adjustments according to [this guide](https://github.com/kubesphere/kubesphere/issues/2986).

{{</ notice >}} 

### Volume monitoring

KubeSphere retrieves metric data of PVCs with `Filesystem` mode from Kubelet to monitor volumes including capacity usage and inode usage.

For more information about volume monitoring, see [Research on Volume Monitoring](https://github.com/kubesphere/kubesphere/issues/2921).
