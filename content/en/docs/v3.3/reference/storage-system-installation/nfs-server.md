---
title: "Set up an NFS Server"
keywords: 'Kubernetes, KubeSphere, NFS Server'
description: 'How to set up an NFS Server'
linkTitle: "Set up an NFS Server"
weight: 17410
---

KubeSphere supports [NFS-client Provisioner](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client) as a storage plugin. In order to use it, you must configure the NFS server in advance. With the NFS server in place, an NFS client mounts a directory on the server machine so that files residing on the NFS server are accessible to the NFS client. Namely, you need to create and export a directory that your client machine can access.

Once your NFS server machine is ready, you can use [KubeKey](../../../installing-on-linux/introduction/kubekey/) to install NFS-client Provisioner by Helm charts together with Kubernetes and KubeSphere. The exported directory of your NFS server must be provided in your Chart configurations used by KubeKey during installation.

{{< notice note >}}

- You can also create the storage class of NFS-client after you install a KubeSphere cluster.
- It is not recommended that you use NFS storage for production (especially on Kubernetes version 1.20 or later) as some issues may occur, such as `failed to obtain lock` and `input/output error`, resulting in Pod `CrashLoopBackOff`. Besides, some apps may not be compatible with NFS, including [Prometheus](https://github.com/prometheus/prometheus/blob/03b354d4d9386e4b3bfbcd45da4bb58b182051a5/docs/storage.md#operational-aspects).

{{</ notice >}} 

This tutorial demonstrates how to install the NFS server on Ubuntu 16.04 as an example.

## Install and Configure an NFS Server

### Step 1: Install the NFS kernel server

To set up your server machine, you must install the NFS kernel server on it.

1. Run the following command so that you will be using the latest package on Ubuntu for installation.

   ```bash
   sudo apt-get update
   ```

2. Install the NFS kernel server.

   ```bash
   sudo apt install nfs-kernel-server
   ```

### Step 2: Create an export directory

Your NFS client will mount a directory on the server machine which has been exported by the NFS server.

1. Run the following command to specify a mount folder name (for example, `/mnt/demo`).

   ```bash
   sudo mkdir -p /mnt/demo
   ```

2. For demonstration purposes, remove restrictive permissions of the folder so that all your clients can access the directory.

   ```bash
   sudo chown nobody:nogroup /mnt/demo
   ```

   ```bash
   sudo chmod 777 /mnt/demo
   ```

### Step 3: Grant your client machine access to the NFS server

1. Run the following command:

   ```bash
   sudo nano /etc/exports
   ```

2. Add your client information to the file.

   ```bash
   /mnt/demo clientIP(rw,sync,no_subtree_check)
   ```

   If you have multiple client machines, you can add them all in the file. Alternatively, specify a subnet in the file so that all the clients within it can access the NFS server. For example:

   ```bash
   /mnt/demo 192.168.0.0/24(rw,sync,no_subtree_check)
   ```

   {{< notice note >}}

   - `rw`: Read and write operations. The client machine will have both read and write access to the volume.
   - `sync`: Changes will be written to disk and memory.
   - `no_subtree_check`: Prevent subtree checking. It disables the security verification required for a client to mount permitted subdirectories.

   {{</ notice >}}

3. Save the file when you finish editing it.

### Step 4: Apply the configuration

1. Run the following command to export your shared directory.

   ```bash
   sudo exportfs -a
   ```

2. Restart the NFS kernel server.

   ```bash
   sudo systemctl restart nfs-kernel-server
   ```
