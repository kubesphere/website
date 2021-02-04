---
title: "Workspace Administration and User Guide"
description: "This chapter helps you to better manage KubeSphere workspaces."
layout: "single"

linkTitle: "Workspace Administration and User Guide"

weight: 9000

icon: "/images/docs/docs.svg"

---

KubeSphere tenants work in a workspace to manage projects and apps. Among others, workspace administrators are responsible for the management of app repositories. Tenants with necessary permissions can further deploy and use app templates from app repositories. They can also leverage individual app templates which are uploaded and released to the App Store. Besides, administrators also control whether the network of a workspace is isolated from others'.

This chapter demonstrates how workspace administrators and tenants work at the workspace level.

## [Workspace Overview](../workspace-administration/what-is-workspace/)

Understand the concept of workspaces in KubeSphere and learn how to create and delete a workspace.

## [Upload Helm-based Applications](../workspace-administration/upload-helm-based-application/)

Learn how to upload a Helm-based application as an app template to your workspace.

## App Repositories

### [Import a Helm Repository](../workspace-administration/app-repository/import-helm-repository/)

Import a Helm repository to KubeSphere to provide app templates for tenants in a workspace. 

### [Upload Apps to the KubeSphere GitHub Repository](../workspace-administration/app-repository/upload-app-to-public-repository/)

Upload your own apps to the GitHub repository of KubeSphere.

## [Role and Member Management](../workspace-administration/role-and-member-management/)

Customize a workspace role and grant it to tenants.

## [Workspace Network Isolation](../workspace-administration/workspace-network-isolation/)

Enable or disable the network policy in your workspace.

## [Project Quotas](../workspace-administration/project-quotas/)

Set requests and limits to control resource usage in a project.