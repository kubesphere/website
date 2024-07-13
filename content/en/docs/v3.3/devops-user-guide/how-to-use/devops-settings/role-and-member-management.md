---
title: "Role and Member Management In Your DevOps project"
keywords: 'Kubernetes, KubeSphere, DevOps, role, member'
description: 'Create and manage roles and members in DevOps projects.'
linkTitle: "Role and Member Management"
weight: 11242
version: "v3.3"
---

This guide demonstrates how to manage roles and members in your DevOps project.

In DevOps project scope, you can grant the following resources' permissions to a role:

- Pipelines
- Credentials
- DevOps Settings
- Access Control

## Prerequisites

At least one DevOps project has been created, such as `demo-devops`. Besides, you need a user of the `admin` role (for example, `devops-admin`) at the DevOps project level. 

## Built-in Roles

In **DevOps Project Roles**, there are three available built-in roles as shown below. Built-in roles are created automatically by KubeSphere when a DevOps project is created and they cannot be edited or deleted.

| Built-in Roles     | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| viewer | The viewer who can view all resources in the DevOps project. |
| operator   | The normal member in a DevOps project who can create pipelines and credentials in the DevOps project. |
| admin     | The administrator in the DevOps project who can perform any action on any resource. It gives full control over all resources in the DevOps project. |

## Create a DevOps Project Role

1. Log in to the console as `devops-admin` and select a DevOps project (for example, `demo-devops`) on the **DevOps Projects** page.

   {{< notice note >}}

   The account `devops-admin` is used as an example. As long as the account you are using is granted a role including the permissions of **Member Viewing**, **Role Management** and **Role Viewing** in **Access Control** at DevOps project level, it can create a DevOps project role.

   {{</ notice >}} 

2. Go to **DevOps Project Roles** in **DevOps Project Settings**, click **Create** and set a **Name**. In this example, a role named `pipeline-creator` will be created. Click **Edit Permissions** to continue.

3. In **Pipeline Management**, select the permissions that you want this role to contain. For example, **Pipeline Management** and **Pipeline Viewing** are selected for this role. Click **OK** to finish.

   {{< notice note >}} 

   **Depends on** means the major permission (the one listed after **Depends on**) needs to be selected first so that the affiliated permission can be assigned.

   {{</ notice >}} 

4. Newly created roles will be listed in **DevOps Project Roles**. You can click <img src="/images/docs/v3.x/common-icons/three-dots.png" height="15px" alt="icon"> on the right to edit it.

   {{< notice note >}} 

   The role of `pipeline-creator` is only granted **Pipeline Management** and **Pipeline Viewing**, which may not satisfy your need. This example is only for demonstration purpose. You can create customized roles based on your needs.

   {{</ notice >}} 

## Invite a New Member

1. In **DevOps Project Settings**, select **DevOps Project Members** and click **Invite**.

2. Click <img src="/images/docs/v3.x/common-icons/invite-member-button.png" height="15px" alt="icon"> to invite a user to the DevOps project. Grant the role of `pipeline-creator` to the account. 

   {{< notice note >}} 

   The user must be invited to the DevOps project's workspace first.

   {{</ notice >}} 

3. After you add a user to the DevOps project, click **OK**. In **DevOps Project Members**, you can see the newly invited member listed.

4. You can also change the role of an existing member by editing it or remove it from the DevOps project.


