---
title: "Use GitOps to Achieve Continuous Deployment of Applications"
keywords: 'Kubernetes, GitOps, KubeSphere, CI, CD'
description: 'Describe how to use GitOps for continuous deployment on KubeSphere.'
linkTitle: "Use GitOps to Achieve Continuous Deployment of Applications"
weight: 11221
---

In KubeSphere 3.3, we introduce the GitOps concept, which is a way of implementing continuous deployment for cloud-native applications. The core component of GitOps is a Git repository that always stores applications and declarative description of the infrastructure for version control. With GitOps and Kubernetes, you can enable CI/CD pipelines to apply changes to any cluster, which ensures consistency in cross-cloud deployment scenarios.

This section walks you through the process of deploying an application using a continuous deployment.
## Prerequisites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).


## Import a Code Repository

1. Log in to the KubeSphere console as `project-regular`. In the navigation pane on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation pane on the left, click **Code Repositories**.

4. On the **Code Repositories** page on the left, click **Import**.

5. In the **Import Code Repository** dialog box, enter the name of code repository, for example, `open-podcasts`, and select a code repository. Optionally, you can set an alias and add description.

6. In the **Select Code Repository** dialog box, click **Git**. In **Code Repository URL**, enter the URL of the code repository, for example, `https://github.com/kubesphere-sigs/open-podcasts`, and click **OK**.

   {{< notice note >}}
   
   As the imported code repository is a public repository, it is not necessary to create a credential. However, if you add a private repository, a credential is required. For more information about how to create a credential, please refer to [Credential Management](../../../../devops-user-guide/how-to-use/devops-settings/credential-management/).

   {{</ notice >}}

## Create a Continuous Deployment

1. In the navigation pane on the left, click **Continuous Deployments**.

2. On the **Continuous Deployments** page, click **Create**.

3. On the **Basic Information** tab, enter a name of the continuous deployment, for example, `open-podcasts`, and choose a code repository. Then, click **Next**. Optionally, you can set an alias and add description.

4. On the **Deployment Settings** tab, choose the cluster and project that the continuous deployment will be deployed.

5.  In **Code Repository Settings**, set a branch or tag of the repository and specify the path of the manifest file, for example, `config/default`.

6.  In **Sync Strategy**, you can choose either **Manual Sync** or **Auto Sync**. If you choose **Auto Sync**, select **Prune resources** and **Self-heal** as needed. 

    - **Prune resources**: Automatically deletes resources that are no longer defined in Git.
    - **Self-heal**: Always synchronizes the state defined in Git.

7.  In **Sync Settings**, select the following options as needed:
    - **skip schema validation**: Does not validate resources.
    - **Auto create project**: Automatically creates a project during synchronization.
    - **Prune last**: Deletes resources that no longer exist after all resources have been synchronized and become healthy.
    - **Apply out of sync only**: Skips syncing resources that are already in the desired state.

8.  In **Prune Propagation Policy**, choose a deletion policy:
    - **foreground**: Deletes dependents first, and then deletes owners.
    - **background**: Deletes owners first, and then deletes dependents.
    - **orphan**: Deletes owners while retaining dependents.

9.  In **Replace Resource**, decide whether you want to replace resources that already exist. Click **Create**.
    
    On the **Continuous Deployments** page, you can view the created continuous deployment, as shown in the following table.

    <table>
    <tbody>
      <tr>
      	<th>Item</th>
       	<th>Description</th>
      </tr>
      <tr>
        <td>Name</td>
        <td>Name of the continuous deployment.</td>
      </tr>
      <tr>
        <td>Health Status</td>
        <td>Health status of the continuous deployment, which includes the following:<br/>
           <ul>
           <li><b>Healthy</b>: Resources are healthy.</li>
           <li><b>Degraded</b>: Resources are degraded.</li>
           <li><b>Progressing</b>: Resources are being synchronized. This is the default state.</li>
           <li><b>Suspended</b>: Resources have been suspended and are waiting to be resumed.</li>
           <li><b>Unknown</b>: The resource state is unknown.</li>
           <li><b>Missing</b>: Resources are missing.</li></td>
      </tr>
      <tr>
        <td>Sync Status</td>
        <td>Synchronization status of the continuous deployment, which includes the following:<br/>
           <ul>
           <li><b>Synced</b>: Resources have been synchronized.</li>
           <li><b>Out of sync</b>: The actual running state of resources is not as desired.</li>
           <li><b>Unknown</b>: The resource synchronization state is unknown.</li></td>
      </tr>
      <tr>
         <td>Deployment Location</td>
        <td>Cluster and project where resources are deployed.</td>
      </tr>
      <tr>
        <td>Update Time</td>
        <td>Time when resources are updated.</td>
      </tr>
    </tbody>
    </table>

10. Click <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" /> on the right of the continuous deployment, and you can perform the following:
    - **Edit Information**: Edits the alias and description.
    - **Edit YAML**: Edits the YAML file.
    - **Sync**: Triggers resources synchronization.
    - **Delete**: Deletes the continuous deployment.

  {{< notice warning >}}

  Deleting a continuous deployment also deletes resources associated with the continuous deployment. Therefore, exert caution when deleting the continuous deployment.
  
  {{</ notice >}}


11. Click the created continuous deployment to go to its details page, where you can view the synchronization status and result.

## Access the Created Application

1. Go to the project where the continuous deployment resides, in the navigation pane on the left, click **Services**.

2. On the **Services** page on the left, click  <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" /> on the right of the deployed application, and click **Edit External Access**.

3. In **Access Mode**, select **NodePort**, and click **OK**.

4. In the **External Access** column, check the exposed port, and access the application by `nodeIP: nodePort`.

  {{< notice note >}}
  Before accessing the service, open the exposed port in security groups.
  {{</ notice >}}