---
title: 'KubeSphere 3.3.1 is now generally available'
tag: 'Product News'
keywords: 'Kubernetes, KubeSphere, K8s, release, news'
description: 'In KubeSphere 3.3.1, significant changes are made on authentication and authorization.'
createTime: '2022-10-27'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KS-3.3.1-GA.png'
---

Since the first release four years ago, KubeSphere has witnessed more than 10 iterations. Today, we're excited to announce that our open-source KubeSphere project has attracted over **320** contributors, and the main repository of KubeSphere has reached over **11300** GitHub stars and **1700** forks, with millions of downloads worldwide to date.

Ever since the release of KubeSphere 3.3.0 in **June** of this year, our community members have been awaiting the next official release. Finally, it's today that KubeSphere 3.3.1 gets officially released!

Here, we want to thank **36** contributors for their great support and contribution to our KubeSphere project.

Let's recap what's new and the enhancements in KubeSphere 3.3.1.

## Access control

In KubeSphere 3.3.1, one of the most significant updates is access control. This release removes two platform roles `users-manager` and `workspace-manager`, which were built-in roles in earlier versions. In this case, upgrading KubeSphere to v3.3.1 will revoke permissions from users with `users-manager` and `workspace-manager` roles and change their roles to `platform-regular`. At the same time, another platform role `platform-self-provisioner` is built in KubeSphere to manage workspaces.

![](https://pek3b.qingstor.com/kubesphere-community/images/202210281343186666.jpeg)

Users with the `platform-self-provisioner` role have permissions to create workspaces and become the administrators of the workspaces created. This indicates that users can manage all resources in the workspaces created on their own. The design of this role is tailored for multi-cluster scenarios.

+ If a user with the `platform-self-provisioner` role creates a workspace in a public cluster, the cluster resources are available to the workspace.
+ If a user with the `platform-self-provisioner` role creates a workspace in a private cluster, the user must apply for permissions on cluster resources from `platform-admin` or `cluster-admin` users.

At the same time, the permissions granted to custom roles have the following changes:

-   Platform-level permissions on users, roles, and workspaces are revoked from custom roles.
-   Workspace-level permissions on members, roles, and user groups are revoked from custom roles.
-   Namespace-level permissions on members and roles are revoked from custom roles.
-   Upgrading KubeSphere to v3.3.1 will retain the existing custom roles. However, the preceding permissions will be revoked from the roles.

## DevOps optimization

The DevOps pipelines are optimized in the following aspects:

-   For pipelines using build parameters, the source data is updated immediately after you save changes, rather than synchronize metadata every 10 seconds in earlier versions. This ensures that parameters are updated in real time.
-   In the CI/CD pipeline templates, kubernetesDeploy that was unavailable is replaced by kubeconfig for deployment.
-   Editing Jenkinsfile steps with kubeconfig is supported in the KubeSphere console.
-   The cron expression for pipelines is optimized.


## More information

Beyond the preceding new features and enhancements, KubeSphere 3.3.1 has some other improvements:

+ Fix an issue where users fail to create routing rules in IPv6 and IPv4 dual-stack environments.
+ Set `hostpath` as a required option when users mount volumes.
+ Support changing the number of items displayed on each page.
+ Support batch stopping workloads.

Read the release notes below to check out more details:

**https://github.com/kubesphere/kubesphere/releases/tag/v3.3.1**
