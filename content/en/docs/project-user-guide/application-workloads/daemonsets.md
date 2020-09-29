---
title: "DaemonSets"
keywords: 'kubesphere, kubernetes, docker, devops, service mesh, openpitrix'
description: 'Kubernetes DaemonSets'


weight: 2250
---

## What is DaemonSets

A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them. There are some typical uses of a DaemonSet as following:

Running a logs collection daemon on every node, such as Fluentd or Logstash.
Running a node monitoring daemon on every node, such as Prometheus Node Exporter, collectd, AppDynamics Agent,
Running a cluster storage daemon and system program on every node, such as Glusterd, Ceph, kube-dns, kube-proxy, etc.

## Prerequisites

- You need to create a workspace, project and `project-regular` account. Please refer to the [Getting Started with Multi-tenant Management](../../../quick-start/create-workspace-and-project) if not yet.
- You need to sign in with `project-admin` account and invite `project-regular` to enter the corresponding project if not yet. Please refer to [Invite Member](../../../quick-start/create-workspace-and-project#task-3-create-a-project).

## Create a DaemonSets
