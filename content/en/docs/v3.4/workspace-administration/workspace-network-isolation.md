---
title: "Workspace Network Isolation"
keywords: 'KubeSphere, Kubernetes, Calico, Network Policy'
description: 'Enable or disable the network policy in your workspace.'
linkTitle: "Workspace Network Isolation"
weight: 9500
---

## Prerequisites

- You have already enabled [Network Policies](../../pluggable-components/network-policy/).

- Use a user of the `workspace-admin` role. For example, use the `ws-admin` user created in [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

  {{< notice note >}}

  For the implementation of the network policy, you can refer to [KubeSphere NetworkPolicy](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md).

  {{</ notice >}}

## Enable or Disable Workspace Network Isolation

Workspace network isolation is disabled by default. You can turn on network isolation in **Basic Information** under **Workspace Settings**.

{{< notice note >}}

When network isolation is turned on, egress traffic will be allowed by default, while ingress traffic will be denied for different workspaces. If you need to customize your network policy, you need to turn on [Project Network Isolation](../../project-administration/project-network-isolation/) and add a network policy in **Project Settings**.

{{</ notice >}}

You can also disable network isolation on the **Basic Information** page.

## Best Practice

To ensure that all Pods in a workspace are secure, a best practice is to enable workspace network isolation.

When network isolation is on, the workspace cannot be accessed by other workspaces. If a workspace's default network isolation doesn't meet your needs, turn on project network isolation and customize your project's network policy.