---
title: "etcd App"
keywords: 'kubernetes, kubesphere, etcd, app-store'
description: 'How to use etcd'


weight: 2240
---

# Objective

This tutorial shows you how to quickly deploy an [etcd](https://etcd.io) application using templates from KubeSphere App Store (Powered by OpenPitrix). The demonstration includes importing application repository, sharing and deploying apps within a workspace.

# Prerequisites

- You have enabled [KubeSphere Application Store](/docs/pluggable-components/app-store/)
- You have completed the tutorial [Create Workspace, Project, Account and Role](/docs/quick-start/create-workspace-and-project/). The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, we'll work in the project `apps` of the workspace `apps`.

# Hands-on Lab

## Step 1: Browse Apps

1.1. Sign in KubeSphere as a workspace regular account (`apps-regular` for this guide), then enter into project `apps`.

1.2. Click **Application Workloads → Applications**, click **Deploy New Application**.

![Deploy App](/images/docs/appstore/etcd/deploy-app.png)

1.3. Choose **From App Store**. Click `etcd`.

![Deploy etcd](/images/docs/appstore/etcd/deploy-etcd.png)

## Step 2: Deploy etcd Application

2.1. Click **Deploy** at the top right, customize app name if needed, and then click **Next**.

![Deploy etcd Info](/images/docs/appstore/etcd/deploy-etcd-info.png)

2.2. Customize the persistent volume size, and then click **Deploy**.

![etcd configuration](/images/docs/appstore/etcd/deploy-etcd-conf.png)

2.3. Wait for a few minutes, then you will see the application showing `active` in the application list.

![etcd Active](/images/docs/appstore/etcd/deploy-etcd-done.png)

## Step 3: Access the etcd Service

3.1. We can interact with etcd by etcdctl CLI tool within the etcd pod. Click the deployed app and enter the terminal.

![etcd workload](/images/docs/appstore/etcd/access-etcd-workload.png)

![etcd pod](/images/docs/appstore/etcd/access-etcd-pod.png)

![etcd terminal](/images/docs/appstore/etcd/access-etcd-terminal.png)

3.2. Write and read some data.

```
etcdctl set /name kubesphere
etcdctl get /name
```

![etcd data](/images/docs/appstore/etcd/access-etcd-data.png)

3.3. For clients within the KubeSphere cluster, etcd service can be accessed through `<app name>.<project name>.svc.<K8s domain>:2379` (`etcd-ca9w6t.apps.svc.cluster.local:2379` for this guide).
