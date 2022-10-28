---
title: "Import a Code Repository"
keywords: 'Kubernetes, GitOps, KubeSphere, Code Repository'
description: 'Describe how to import a code repository on KubeSphere.'
linkTitle: "Import a Code Repository"
weight: 11231
---

In KubeSphere 3.3, you can import a GitHub, GitLab, Bitbucket, or Git-based repository. The following describes how to import a GitHub repository.

## Prerequisites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).


## Procedures

1. Log in to the KubeSphere console as `project-regular`. In the navigation pane on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation pane on the left, click **Code Repositories**.

4. On the **Code Repositories** page, click **Import**.

5. In the **Import Code Repository** dialog box, enter a name of the code repository, and then select a GitHub repository. Optionally, you can set an alias and add description.

   The following table lists supported code repositories and parameters to set.

   <table border="1">
     <tbody>
     	<tr>
       	<th width="20%">Code Repository</th>
         <th>Parameter</th>
       </tr>
       <tr>
       	<td>GitHub</td>
         <td><b>Credential</b>: Select the credential of the code repository.</td>
       </tr>
       <tr>
       	<td>GitLab</td>
         <td>
           <ul>
             <li><b>GitLab Server Address</b>: Select the GitLab server address, and the default value is <b>https:gitlab.com</b>.</li>
             <li><b>Project Group/Owner</b>: Enter the GitLab username.</li>
             <li><b>Credential</b>: Select the credential of the code repository.
             <li><b>Code Repository</b>: Select the code repository.</li>
           </ul>
         </td>
       <tr>
       	<td>Bitbucket</td>
         <td>
           <ul>
             <li><b>Bitbucket Server Address</b>: Set the Bitbucket server address.</li>
             <li><b>Credential</b>: Select the credential of the code repository.</li>
           </ul>
         </td>
       </tr>
       <tr>
       	<td>Git</td>
         <td>
           <ul>
             <li><b>Code Repository URL</b>: Enter the URL of the code repository.</li>
             <li><b>Credential</b>: Select the credential of the code repository.</li>
           </ul>
         </td>
       </tr>
     </tbody>
   </table>

   {{< notice note >}}

   To use a private GitLab repository, please refer to [Create a Multi-branch Pipeline with GitLab-Step 4](../../../../devops-user-guide/how-to-use/pipelines/gitlab-multibranch-pipeline/).

   {{</ notice >}}

6. In **Credential**, click **Create Credential**. In the **Create Credential** dialog box, set the following parameters:
   - **Name**: Enter a name of the credential, for example, `github-id`.
   - **Type**: Optional values include **Username and password**, **SSH key**, **Access token**, and **kubeconfig**. In DevOps projects, **Username and password** is recommended.
   - **Username**: The default username is `admin`.
   - **Password/Token**: Enter your GitHub token.
   - **Description**: Add description.

   {{< notice note >}}

   For more information about how to create a credential, please refer to [Credential Management](../../../../devops-user-guide/how-to-use/devops-settings/credential-management/).

   {{</ notice >}}

7. In the GitHub repositories that are displayed, select a repository, and click **OK**.
8. Click <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" /> on the right of the imported code repository, and you can perform the following operations:

   - **Edit**: Edits the alias and description of the code repository and reselects a code repository.
   - **Edit YAML**: Edits the YAML file of the code repository.
   - **Delete**: Deletes the code repository.

