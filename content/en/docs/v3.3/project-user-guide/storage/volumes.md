---
title: "Persistent Volume Claims"
keywords: 'Kubernetes, Persistent Volumes, Persistent Volume Claims, Volume Clone, Volume Snapshot, Volume Expansion'
description: 'Learn how to create, edit, and mount a PVC on KubeSphere.'
linkTitle: "Persistent Volume Claims"
weight: 10310
version: "v3.3"
---

When you create an application workload in a project, you can create a [Persistent Volume Claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) (PVC) for it. A PVC allows you to create a storage request, further provisioning persistent storage to applications. More specifically, persistent storage is managed by persistent volume resources.

Cluster administrators configure Persistent Volumes (PVs) using storage classes. In other words, to create a PVC in a project, your cluster must have an available storage class. If no customized storage class is configured when you install KubeSphere, [OpenEBS](https://openebs.io/) is installed in your cluster by default to provide local persistent volumes. However, it does not support dynamic volume provisioning. In a production environment, it is recommended you configure storage classes in advance to provide persistent storage services for your apps.

This tutorial demonstrates how to create a PVC, mount a PVC, and use PVC features from its details page.

## Prerequisites

- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

- If you want to dynamically provision a volume, you need to [configure a storage class](../../../cluster-administration/storageclass/) that supports dynamic provisioning.

## Create a PVC

KubeSphere binds a PVC to a PV that satisfies the request you set for the PVC, such as capacity and access mode. When you create an application workload, you can select the desired PVC and mount it to your workload.

1. Log in to the web console of KubeSphere as `project-regular` and go to a project. Click **Persistent Volume Claims** under **Storage** from the navigation bar, and you see all PVCs that have been mounted to workloads in the project.

2. To create a PVC, click **Create** on the **Persistent Volume Claims** page.

3. In the displayed dialog box, set a name (for example, `demo-volume`) for the PVC, select a project, and click **Next**.

   {{< notice note >}}

   You can see the PVC's manifest file in YAML format by enabling **Edit YAML** in the upper-right corner. You can edit the manifest file directly to create a PVC. Alternatively, you can follow the steps below to create a PVC using the console.

   {{</ notice >}} 

4. On the **Storage Settings** page, select a method to create a PVC.

   - **From Storage Class**. You can configure storage classes both [before](../../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/) and [after](../../../cluster-administration/storageclass/) the installation of KubeSphere.

   - **From Volume Snapshot**. To use a snapshot to create a PVC, you must create a volume snapshot first.

   Select **From Storage Class** in this example. For more information about how to create a PVC by snapshot, see [Volume Snapshots](../volume-snapshots/).

5. Select a storage class from the drop-down list. This tutorial uses `csi-standard`, a standard storage class provided by QingCloud Platform. You can select your own storage class.

6. Depending on the storage class you select, you may see different access modes in this section as some PVs only support specific access modes. In total, there are three access modes.

   - **ReadWriteOnce**: The volume can be mounted as read-write by a single node.
   - **ReadOnlyMany**: The volume can be mounted as read-only by many nodes.
   - **ReadWriteMany**: The volume can be mounted as read-write by many nodes.

   Select the desired access mode.

7. Under **Volume Capacity**, specify the size of the PVC. Click **Next** to continue.

8. On the **Advanced Settings** page, you can add metadata to the PVC, such as **Labels** and **Annotations**. They can be used as identifiers to search for and schedule resources.

9. Click **Create** to finish creating a PVC.

10. A created PVC displays on the **Persistent Volume Claims** page in a project. After it is mounted to a workload, it will turn to **Mounted** under the **Mount Status** column.

    {{< notice note >}}

Newly-created PVCs are also displayed on the **Persistent Volume Claims** page in **Cluster Management**. Project users such as `project-regular` can view PVs under the **Persistent Volumes** column. Cluster administrators have the responsibility to view and keep track of created PVCs in a project. Conversely, if a cluster administrator creates a PVC for a project in **Cluster Management**, the PVC is also displayed on the **Persistent Volume Claims** page in a project.

{{</ notice >}} 

## Mount a PVC

When you create application workloads, such as [Deployments](../../../project-user-guide/application-workloads/deployments/), [StatefulSets](../../../project-user-guide/application-workloads/statefulsets/) and [DaemonSets](../../../project-user-guide/application-workloads/daemonsets/), you can mount PVCs to them.

{{< notice note >}}

This tutorial does not explain how to create workloads. For more information, see related guides in [Application Workloads](../../application-workloads/deployments/).

{{</ notice >}}

On the **Storage Settings** page, you can see there are different volumes that you can mount to your workload.

- **Add Persistent Volume Claim Template** (Only available to [StatefulSets](../../../project-user-guide/application-workloads/statefulsets/)): A PVC template is used to dynamically create a PVC. Mount the PVC of the StorageClass type to the Pod by setting the name, storage class, access mode, capacity and path, which are all indicated by the field `volumeClaimTemplates`.

- **Mount Volume**: Support emptyDir volumes and PVCs.

  In **Mount Volume**, there are three kinds of volumes:

  - **Persistent Volume**: Use a PVC to mount.

    Persistent volumes can be used to save users' persistent data. You need to create PVCs in advance so that you can choose an existing PVC from the list.

  - **Temporary Volume**: Use an emptyDir volume to mount.

    The temporary volume represents [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir), which is first created when a Pod is assigned to a node, and exists as long as that Pod is running on that node. An emptyDir volume offers an empty directory from which containers in the Pod can read and write. Depending on your deployment environment, an emptyDir volume can be stored on any medium that is backing the node, which could be a disk or SSD. When the Pod is removed from the node for any reason, the data in the emptyDir is deleted forever.

  - **HostPath Volume**: Use a hostPath volume to mount.

    A HostPath volume mounts a file or directory from the host node's filesystem into your Pod. This is not something that most Pods will need, but it offers a powerful escape hatch for some applications. For more information, refer to [the Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath).

- **Mount ConfigMap or Secret**: Support key-value pairs of [ConfigMaps](../../../project-user-guide/configuration/configmaps/) or [Secrets](../../../project-user-guide/configuration/secrets/).

  A [Secret](https://kubernetes.io/docs/concepts/storage/volumes/#secret) volume is used to provide sensitive information, such as passwords, OAuth tokens, and SSH keys, for Pods. Secret volumes are backed by tmpfs (a RAM-backed filesystem) so they are never written to non-volatile storage.

  A [ConfigMap](https://kubernetes.io/docs/concepts/storage/volumes/#configmap) is used to store configuration data in the form of key-value pairs. The ConfigMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type `configMap` and then consumed by containerized applications running in a Pod. ConfigMaps are often used in the following cases:

  - Set the value of environment variables.
  - Set command parameters in containers.
  - Create a configuration file in volumes.

## View and Manage PVCs

After a PVC is created, you can see detailed information of it, edit it, or leverage PVC features. To view PVC details, click a PVC on the **Persistent Volume Claims** page.

### View Details of a PVC

On the **Persistent Volume Claims** page, click a PVC to view its details.

1. Click the **Resource Status** tab, view the PVC usage and mounted pods.

2. Click the **Metadata** tab, view the labels and annotations of the PVC.

3. Click the **Events** tab, view the events of the PVC.

4. Click the **Snapshots** tab, view the snapshots of the PVC.
### Edit a PVC

On the details page, you can click **Edit Information** to change its basic information. Click **More**, and you can edit its YAML file or delete this PVC.

To delete a PVC, make sure the PVC is not mounted to any workload. To unmount a PVC, go to the details page of a workload. From the **More** drop-down list, click **Edit Settings**. On the **Edit Settings** dialog box, click **Storage**. Hover your mouse on the PVC, and click the dustbin icon to unmount it.

If the status of a PVC remains **Terminating** for a long time after you clicked **Delete**, manually delete it by using the following command:

```bash
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}'
```

### Use PVC Features

From the **More** drop-down menu, there are other additional options provided by KubeSphere based on the underlying storage plugin, also known as `Storage Capability`. PVC features include the following:

- **Clone**: Create a same PVC.
- **Create Snapshot**: Create a volume snapshot which can be used to create PVCs. For more information, see [Volume Snapshots](../volume-snapshots/).
- **Expand**: Increase the size of a PVC. Keep in mind that you cannot reduce the size of a PVC on the console due to possible data loss.

For more information about `Storage Capability`, see [Design Documentation](https://github.com/kubesphere/community/blob/master/sig-storage/concepts-and-designs/storage-capability-interface.md).

{{< notice note >}}

Some in-tree or special CSI plugins may not be covered by `Storage Capability`. If KubeSphere does not display the correct features in your cluster, you can make adjustments according to [this guide](https://github.com/kubesphere/kubesphere/issues/2986).

{{</ notice >}} 

### Monitor PVCs

KubeSphere retrieves metric data of PVCs with `Filesystem` mode from Kubelet to monitor PVCs including capacity usage and inode usage.

For more information about PVC monitoring, see [Research on Volume Monitoring](https://github.com/kubesphere/kubesphere/issues/2921).

## View the PV List and Manage PVs
 ### View the PV List

1. Click the **Persistent Volumes** tab on the **Persistent Volume Claims** page to view the PV list page that provides the following information:

   <table border="1">
     <tbody>
     	<tr>
       	<th width="20%">Parameter</th>
         <th>Description</th>
       </tr>
       <tr>
       	<td>Name</td>
         <td> Name of the PV. It is specified by the field <b>.metadata.name</b> in the manifest file of the PV.</td>
       </tr>
       <tr>
       	<td>Status</td>
         <td>
         	Current status of the PV. It is specified by the field <b>.status.phase</b> in the manifest file of the PV, including:
           <ul>
             <li><b>Available</b>: The PV is available and not yet bound to a PVC.</li>
             <li><b>Bound</b>: The PV is bound to a PVC.</li>
             <li><b>Deleting</b>: The PV is being deleted.</li>
             <li><b>Failed</b>: The PV is unavailable.</li>
           </ul>
         </td>
       </tr>
       <tr>
       	<td>Capacity</td>
         <td>Capacity of the PV. It is specified by the field <b>.spec.capacity.storage</b> in the manifest file of the PV.</td>
       </tr>
       <tr>
       	<td>Access Mode</td>
         <td>
         	Access mode of the PV. It is specified by the field <b>.spec.accessModes</b> in the manifest file of the PV, including:
           <ul>
             <li><b>RWO</b>: The PV can be mounted as read-write by a single node.</li>
             <li><b>ROX</b>: The PV can be mounted as read-only by multiple nodes.</li>
             <li><b>RWX</b>: The PV can be mounted as read-write by multiple nodes.</li>
           </ul>
         </td>
       </tr>
       <tr>
       	<td>Reclaim Policy</td>
         <td>
         	Reclaim policy of the PV. It is specified by the field <b>.spec.persistentVolumeReclaimPolicy</b> in the manifest file of the PV, including:
           <ul>
             <li><b>Retain</b>: When a PVC is deleted, the PV still exists and requires manual reclamation.</li>
             <li><b>Delete</b>: Remove both the PV and the associated storage assets in the volume plugin infrastructure.</li>
             <li><b>Recycle</b>: Erase the data on the PV and make it available again for a new PVC.</li>
           </ul>
         </td>
       </tr>
       <tr>
       	<td>Creation Time</td>
         <td>Time when the PV was created.</td>
       </tr>
     </tbody>
   </table>

2. Click <img src="/images/docs/v3.x/common-icons/three-dots.png" width="15" alt="icon" /> on the right of a PV, and you can perform the following:

   - **Edit Information**: Edit information of the PV.
   - **Edit YAML**: Edit the YAML file of the PV.
   - **Delete**: Delete the PV. A PV in the **Bound** status cannot be deleted.

### View the PV Details Page

1. Click the name of a PV to go to its details page.

2. On the details page, click **Edit Information** to edit the basic information of the PV.

3. Click **More**, and you can perform the following:

   - **View YAML**: View the YAML file of the PV.
   - **Delete**: Delete the PV and return to the list page. A PV in the **Bound** status cannot be deleted.

4. Click the **Resource Status** tab to view the PVC to which the PV is bound.

5. Click the **Metadata** tab to view the labels and annotations of the PV.

6. Click the **Events** tab to view the events of the PV.