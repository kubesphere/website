---
title: "Workspace Network Isolation"
keywords: 'KubeSphere, kubernetes, Calico, Network Policy'
description: 'Workspace Network Isolation'

linkTitle: "Workspace Network Isolation"
weight: 10500
---

## Prerequisites

- You have already enabled Network Policy. Please refer to [network-policy](../../pluggable-components/network-policy) it is not ready yet.
- Use an account of the `workspace-admin` role. For example, use the account `ws-admin` created in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/).
{{< notice note >}}
For the implementation of the network policy, you can refer to [kubesphere-network-policy](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md)
{{</ notice >}}

## Enable/Disable Workspace Network Isolation

Workspace network isolation is disabled by default. You can turn on network isolation in **Basic Info** under **Workspace Settings**.

{{< notice note >}}
When network isolation is turned on, egress traffic will be allowed by default, while ingress traffic will be denied for
 different workspaces.
If you need to customize your network policy, you need to turn on [Project Network Isolation](../../project-administration/project-network-isolation) and add a network policy in
 `Project Settings`.
{{</ notice >}}

You can also disable network isolation via this path.

## Best practice

To ensure that all pods in the workspace are secure, a best practice is to enable workspace network isolation.

When network isolation is on, the workspace cannot be accessed by other workspaces. If workspace's default network isolation doesn't meet your needs, 
turn on project network isolation and customize your project's network policy.