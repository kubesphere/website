---
title: "Create Workspaces, Projects, Accounts and Roles"
keywords: 'KubeSphere, Kubernetes, Multi-tenant, Workspace, Account, Role, Project'
description: 'Take advantage of the multi-tenant system of KubeSphere for fine-grained access control at different levels.'
linkTitle: "Create Workspaces, Projects, Accounts and Roles"
weight: 2300
---

This quickstart demonstrates how to create workspaces, roles and user accounts which are required for other tutorials. Meanwhile, you will learn how to create projects and DevOps projects within your workspace where your workloads are running. After this tutorial, you will become familiar with the multi-tenant management system of KubeSphere.

## Prerequisites

KubeSphere needs to be installed in your machine.

## Architecture

The multi-tenant system of KubeSphere features **three** levels of hierarchical structure which are cluster, workspace, and project. A project in KubeSphere is a Kubernetes [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).

You are required to create a new [workspace](../../workspace-administration/what-is-workspace/) to work with instead of using the system workspace where system resources are running and most of them are viewable only. In addition, it is strongly recommended different tenants work with corresponding roles in a workspace for security considerations.

You can create multiple workspaces within a KubeSphere cluster. Under each workspace, you can also create multiple projects. Each level has multiple built-in roles. Besides, KubeSphere allows you to create roles with customized authorization as well. The KubeSphere hierarchy is applicable for enterprise users with different teams or groups, and different roles within each team.

## Hands-on Lab

### Step 1: Create an account

After KubeSphere is installed, you need to add different users with varied roles to the platform so that they can work at different levels on various resources. Initially, you only have one default account, which is `admin`, granted the role `platform-admin`. In the first step, you create an account `user-manager` and further create more accounts as `user-manager`.

1. Log in to the web console as `admin` with the default account and password (`admin/P@88w0rd`).

   {{< notice tip >}}
   For account security, it is highly recommended that you change your password the first time you log in to the console. To change your password, select **User Settings** in the drop-down list in the upper-right corner. In **Password Settings**, set a new password. You also can change the console language in **User Settings**.
   {{</ notice >}}

2. Click **Platform** in the upper-left corner, and then select **Access Control**. In the left nevigation pane, select **Account Roles**. There are four built-in roles as shown in the following table.

   <table>
     <tbody>
       <tr>
         <th width='180'>Built-in Roles</th>
         <th>Description</th>
       </tr>
       <tr>
         <td><code>workspaces-manager</code></td>
         <td>Workspace manager who can manage all workspaces on the platform.</td>
       </tr>
       </tr>
       <tr>
         <td><code>users-manager</code></td>
         <td>User manager who can manage all users on the platform.</td>
       </tr></tr>
       <tr>
         <td><code>platform-regular</code></td>
         <td>Regular user who has no access to any resources before joining a workspace or cluster.</td>
       </tr>
   <tr>
         <td><code>platform-admin</code></td>
         <td>Administrator who can manage all resources on the platform.</td>
       </tr>
     </tbody>
   </table>

   {{< notice note >}}
   Built-in roles are created automatically by KubeSphere and cannot be edited or deleted.
   {{</ notice >}}

3. In **Accounts**, click **Create**. In the displayed dialog box, provide all the necessary information (marked with *) and select `users-manager`  for **Role**. Refer to the following image as an example.

   ![create-account](/images/docs/quickstart/create-workspaces-projects-accounts/create-account.png)

   Click **OK** after you finish. The new account will display in the **Accounts** list page.

4. Log out of the console and log back in with the account `user-manager` to create four accounts that will be used in other tutorials.

   {{< notice tip >}}
   To log out, click your username in the upper-right corner and select **Log Out**.
   {{</ notice >}}

   <table>
     <tbody>
       <tr>
         <th width='140'>Account</th>
         <th width='160'>Role</th>
         <th>Description</th>
       </tr>
       <tr>
         <td><code>ws-manager</code></td>
         <td><code>workspaces-manager</code></td>
         <td>Create and manage all workspaces.</td>
       </tr>
       <tr>
         <td><code>ws-admin</code></td>
         <td><code>platform-regular</code></td>
         <td>Manage all resources in a specified workspace (This account is used to invite new members to a workspace in this example).</td>
       </tr><tr>
         <td><code>project-admin</code></td>
         <td><code>platform-regular</code></td>
         <td>Create and manage projects and DevOps projects, and invite new members into the projects.</td>
       </tr><tr>
         <td><code>project-regular</code></td>
         <td><code>platform-regular</code></td>
       <td><code>project-regular</code> will be invited to a project or DevOps project by <code>project-admin</code>. This account will be used to create workloads, pipelines and other resources in a specified project.</td>
       </tr>
     </tbody>
   </table>

5. Verify the four accounts created.

   ![account-list](/images/docs/quickstart/create-workspaces-projects-accounts/account-list.png)

### Step 2: Create a workspace

In this step, you create a workspace using the account `ws-manager` created in the previous step. As the basic logic unit for the management of projects, DevOps projects and organization members, workspaces underpin the multi-tenant system of KubeSphere.

1. Log in to KubeSphere as `ws-manager` which has the permission to manage all workspaces on the platform. Click **Platform** in the upper-left corner and select **Access Control**. In **Workspaces**, you can see there is only one default workspace `system-workspace`, where system-related components and services run. You are not allowed to delete this workspace.

2. Click **Create** on the right, set a name for the new workspace (for example, `demo-workspace`) and set the user `ws-admin` as the workspace manager. Click **Create** after you finish.

   {{< notice note >}}

   If you have enabled the [multi-cluster feature](../../multicluster-management/), you need to [assign an available cluster](../../cluster-administration/cluster-settings/cluster-visibility-and-authorization/#select-available-clusters-when-you-create-a-workspace) (or multiple clusters) to the workspace so that projects can be created on the cluster(s) later.

   {{</ notice >}} 

3. Log out of the console and log back in as `ws-admin`. In **Workspace Settings**, select **Workspace Members** and click **Invite Member**.

4. Invite both `project-admin` and `project-regular` to the workspace. Assign them the role `workspace-self-provisioner` and `workspace-viewer` respectively and click **OK**.

   {{< notice note >}}
The actual role name follows a naming convention: `<workspace name>-<role name>`. For example, in this workspace named `demo-workspace`, the actual role name of the role `viewer` is `demo-workspace-viewer`.
   {{</ notice >}}

   ![invite-member](/images/docs/quickstart/create-workspaces-projects-accounts/invite-member.png)

5. In **Workspace Members**, you can see three members listed.

   <table>
     <tbody>
       <tr>
         <th width='150'>Account</th>
         <th width='150'>Role</th>
         <th>Description</th>
       </tr>
       <tr>
         <td><code>ws-admin</code></td>
         <td><code>workspace-admin</code></td>
         <td>Manage all resources under the workspace (use this account to invite new members to the workspace).</td>
       </tr>
       <tr>
         <td><code>project-admin</code></td>
         <td><code>workspace-self-provisioner</code></td>
         <td>Create and manage projects and DevOps projects, and invite new members to join the projects.</td>
       </tr><tr>
         <td><code>project-regular</code></td>
         <td><code>workspace-viewer</code></td>
       <td><code>project-regular</code> will be invited by <code>project-admin</code> to join a project or DevOps project. The account can be used to create workloads, pipelines, etc.</td>
       </tr>
     </tbody>
   </table>

### Step 3: Create a project

In this step, you create a project using the account `project-admin` created in the previous step. A project in KubeSphere is the same as a namespace in Kubernetes, which provides virtual isolation for resources. For more information, see [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).

1. Log in to the KubeSphere web console as `project-admin`. In **Projects**, click **Create**.

2. Enter the project name (for example, `demo-project`) and click **OK** to finish. You can also add an alias and description for the project.

3. In **Projects**, click the project name to view its details page.

4. On the **Overview** page of the project, the project quota remains unset by default. You can click **Set** and specify [resource requests and limits](../../workspace-administration/project-quotas/) as needed (for example, 1 Core for CPU and 1000 Gi for memory).

   ![project-quota](/images/docs/quickstart/create-workspaces-projects-accounts/project-quota.png)

5. Invite `project-regular` to this project and grant this user the role `operator`. Refer to the following image for specific steps.

   ![invite-project-regular](/images/docs/quickstart/create-workspaces-projects-accounts/invite-project-regular.png)

   {{< notice info >}}
   The user granted the role `operator` is a project maintainer who can manage resources other than users and roles in the project.
   {{</ notice >}}

6. Before creating a [Route](../../project-user-guide/application-workloads/routes/) which is [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) in Kubernetes, you need to enable a gateway for this project. The gateway is an [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) running in the project. To set a gateway, go to **Advanced Settings** in **Project Settings** and click **Set Gateway**. The account `project-admin` is still used in this step.

7. Select the access method **NodePort** and click **Save**.

8. Under **Internet Access**, you can obtain the Gateway Address and the NodePort of http and https in the list.

   {{< notice note >}}
   If you want to expose services using the type `LoadBalancer`, you need to use the LoadBalancer plugin of cloud providers. If your Kubernetes cluster is running in a bare metal environment, it is recommended that you use [OpenELB](https://github.com/kubesphere/openelb) as the LoadBalancer plugin.
   {{</ notice >}}

   ![nodeport-setting](/images/docs/quickstart/create-workspaces-projects-accounts/nodeport-setting.png)

### Step 4: Create a role

After you finish the above steps, you know that users can be granted different roles at different levels. The roles used in previous steps are all built-in ones created by KubeSphere. In this step, you will learn how to define a customized role to meet the needs in your work.

1. Log in to the KubeSphere web console as `admin` again and go to **Access Control**. 

2. Click **Account Roles** on the left navigation pane, and then click **Create** on the right.

   {{< notice note >}}

   The preset roles on the **Account Roles** page cannot be edited and deleted.

   {{</ notice >}}

3. In the **Create Account Role** dialog box, set the name (for example, `clusters-admin`), alias, and description of the role, and click **Edit Permissions**.

   {{< notice note >}}

   This example demonstrates how to create a role responsible for cluster management.

   {{</ notice >}}

4. In the **Edit Permissions** dialog box, set the role permissions (for example, select **Cluster Management**) and click **OK**.

   {{< notice note >}}

   * In this example, the role `clusters-admin` contains the permissions **Cluster Management** and **Cluster Viewing**.
   * Some permissions depend on other permissions. The dependency is specified by the **Depends on** field under each permission.
   * When a permission is selected, the permission it depends on is automatically selected.
   * To deselect a permission, you need to deselect its subordinate permissions first.

   {{</ notice >}}

5. On the **Account Roles** page, you can click the name of the created role to view the role details and click <img src="/images/docs/quickstart/create-workspaces-projects-accounts/operation-icon.png" width="20px" align="center"> to edit the role, edit the role permissions, or delete the role.

6. On the **Accounts** page, you can assign the role to an account when you create an account or edit an existing account.


### Step 5: Create a DevOps project (Optional)

{{< notice note >}}

To create a DevOps project, you must install the KubeSphere DevOps system in advance, which is a pluggable component providing CI/CD pipelines, Binary-to-image, Source-to-image, and more. For more information about how to enable DevOps, see [KubeSphere DevOps System](../../pluggable-components/devops/).

{{</ notice >}}

1. Log in to the console as `project-admin`. In **DevOps Projects**, click **Create**.

2. Set a name for the DevOps project (for example, `demo-devops`) and click **OK**. You can also add an alias and description for the project.

3. Click the project name to view its details page.

4. Go to **Project Management** and select **Project Members**. Click **Invite Member** to grant `project-regular` the role `operator`, who is allowed to create pipelines and credentials. Click **OK** to finish.

   ![invite-devops-member](/images/docs/quickstart/create-workspaces-projects-accounts/invite-devops-member.png)

You are now familiar with the multi-tenant management system of KubeSphere. In other tutorials, the account `project-regular` will also be used to demonstrate how to create applications and resources in a project or DevOps project.
