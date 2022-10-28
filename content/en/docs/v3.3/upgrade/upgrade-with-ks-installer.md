---
title: "Upgrade with ks-installer"
keywords: "Kubernetes, upgrade, KubeSphere, v3.3.1"
description: "Use ks-installer to upgrade KubeSphere."
linkTitle: "Upgrade with ks-installer"
weight: 7300
---

ks-installer is recommended for users whose Kubernetes clusters were not set up by [KubeKey](../../installing-on-linux/introduction/kubekey/), but hosted by cloud vendors or created by themselves. This tutorial is for **upgrading KubeSphere only**. Cluster operators are responsible for upgrading Kubernetes beforehand.

## Prerequisites

- You need to have a KubeSphere cluster running v3.2.x. If your KubeSphere version is v3.1.x or earlier, upgrade to v3.2.x first.
- Read [Release Notes for 3.3](../../../v3.3/release/release-v330/) carefully.
- Back up any important component beforehand.
- Supported Kubernetes versions of KubeSphere 3.3: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support).

## Major Updates

In KubeSphere 3.3.1, some changes have made on built-in roles and permissions of custom roles. Therefore, before you upgrade KubeSphere to 3.3.1, please note the following:

   - Change of built-in roles: Platform-level built-in roles `users-manager` and `workspace-manager` are removed. If an existing user has been bound to `users-manager` or `workspace-manager`, its role will be changed to `platform-regular` after the upgrade is completed. Role `platform-self-provisioner` is added. For more information about built-in roles, refer to [Create a user](../../quick-start/create-workspace-and-project).

   - Some permission of custom roles are removed:
       - Removed permissions of platform-level custom roles: user management, role management, and workspace management.
       - Removed permissions of workspace-level custom roles: user management, role management, and user group management.
       - Removed permissions of namespace-level custom roles: user management and role management.
       - After you upgrade KubeSphere to 3.3.1, custom roles will be retained, but removed permissions of the custom roles will be revoked.

## Apply ks-installer

Run the following command to upgrade your cluster.

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml  --force
```

## Enable Pluggable Components

You can [enable new pluggable components](../../pluggable-components/overview/) of KubeSphere 3.3 after the upgrade to explore more features of the container platform.

