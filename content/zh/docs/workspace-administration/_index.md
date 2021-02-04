---
title: "企业空间管理和用户指南"
description: "本章帮助您更好地管理 KubeSphere 企业空间。"
layout: "single"

linkTitle: "企业空间管理和用户指南"

weight: 9000

icon: "/images/docs/docs.svg"

---

KubeSphere 租户在企业空间中进行操作，管理项目和应用，而企业空间管理员负责管理应用仓库。拥有必要权限的租户可以进一步从应用仓库中部署和使用应用模板。他们也可以使用上传并发布至应用商店的单个应用模板。此外，管理员还控制一个企业空间的网络是否与其他企业空间相互隔离。

本章演示企业空间管理员和租户如何在企业空间层级进行操作。

## [企业空间概述](../workspace-administration/what-is-workspace/)

了解 KubeSphere 企业空间的概念以及如何创建和删除企业空间。

## [上传基于 Helm 的应用程序](../workspace-administration/upload-helm-based-application/)

了解如何向您的企业空间上传基于 Helm 的应用程序用作应用模板。

## 应用仓库

### [导入 Helm 仓库](../workspace-administration/app-repository/import-helm-repository/)

导入 Helm 仓库至 KubeSphere，为企业空间中的租户提供应用模板。 

### [上传应用至 KubeSphere 的 GitHub 仓库](../workspace-administration/app-repository/upload-app-to-public-repository/)

上传您自己的应用至 KubeSphere 的 GitHub 仓库。

## [角色和成员管理](../workspace-administration/role-and-member-management/)

自定义企业空间角色并将角色授予用户。

## [企业空间网络隔离](../workspace-administration/workspace-network-isolation/)

在您的企业空间中开启或关闭网络策略。

## [项目配额](../workspace-administration/project-quotas/)

设置请求和限制，控制项目中的资源使用情况。



