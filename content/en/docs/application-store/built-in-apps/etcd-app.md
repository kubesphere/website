---
title: "Deploy etcd on KubeSphere"
keywords: 'Kubernetes, KubeSphere, etcd, app-store'
description: 'How to deploy etcd on KubeSphere.'
linkTitle: "Deploy etcd on KubeSphere"
weight: 14210
---

Written in Go, [etcd](https://etcd.io/) is a distributed key-value store to store data that needs to be accessed by a distributed system or cluster of machines. In Kubernetes, it is the backend for service discovery and stores cluster states and configurations.

This tutorial walks you through an example of deploying etcd from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account (`project-regular`) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy etcd from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top left corner.

   ![project-overview](/images/docs/appstore/built-in-apps/etcd-app/project-overview.jpg)

2. Find etcd and click **Deploy** on the **App Info** page.

   ![etcd-app-store](/images/docs/appstore/built-in-apps/etcd-app/etcd-app-store.jpg)

   ![deploy-etcd](/images/docs/appstore/built-in-apps/etcd-app/deploy-etcd.jpg)

3. Set a name and select an app version. Make sure etcd is deployed in `demo-project` and click **Next**.

   ![deployment-location](/images/docs/appstore/built-in-apps/etcd-app/deployment-location.jpg)

4. On the **App Config** page, specify the size of the persistent volume for etcd and click **Deploy**.

   ![specify-volume](/images/docs/appstore/built-in-apps/etcd-app/specify-volume.jpg)

   {{< notice note >}}

   To specify more values for etcd, use the toggle switch to see the app's manifest in YAML format and edit its configurations.

   {{</ notice >}} 

5. In **App Templates** of the **Applications** page, wait until etcd is up and running.

   ![etcd-running](/images/docs/appstore/built-in-apps/etcd-app/etcd-running.jpg)

### Step 2: Access the etcd Service

After the app is deployed, you can use etcdctl, a command-line tool for interacting with etcd server, to access etcd on the KubeSphere console directly.

1. Navigate to **StatefulSets** in **Workloads**, and click the service name of etcd.

   ![etcd-statefulset](/images/docs/appstore/built-in-apps/etcd-app/etcd-statefulset.jpg)

2. Under **Pods**, expand the menu to see container details, and then click the **Terminal** icon.

   ![etcd-teminal](/images/docs/appstore/built-in-apps/etcd-app/etcd-teminal.jpg)

3. In the terminal, you can read and write data directly. For example, execute the following two commands respectively.

   ```bash
   etcdctl set /name kubesphere
   ```

   ```bash
   etcdctl get /name
   ```

   ![etcd-command](/images/docs/appstore/built-in-apps/etcd-app/etcd-command.jpg)

4. For clients within the KubeSphere cluster, the etcd service can be accessed through `<app name>.<project name>.svc.<K8s domain>:2379` (e.g. `etcd-bqe0g4.demo-project.svc.cluster.local:2379` in this guide).

5. For more information, see [the official documentation of etcd](https://etcd.io/docs/v3.4.0/).