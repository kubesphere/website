---
title: "Use GitOps to Achieve Continuous Deployment of Applications"
keywords: 'Kubernetes, GitOps, KubeSphere, CI, CD'
description: 'Describe how to use GitOps for continuous deployment on KubeSphere.'
linkTitle: "Use GitOps to Achieve Continuous Deployment of Applications"
weight: 11221
---

In KubeSphere 3.4, we introduce the GitOps concept, which is a way of implementing continuous deployment for cloud-native applications. The core component of GitOps is a Git repository that always stores applications and declarative description of the infrastructure for version control. With GitOps and Kubernetes, you can enable CI/CD pipelines to apply changes to any cluster, which ensures consistency in cross-cloud deployment scenarios.

This section walks you through the process of deploying an application using a continuous deployment.
## Prerequisites

- You have a workspace, a DevOps project and a user (**project-regular**) invited to the DevOps project with the **operator** role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).


## Import a Code Repository

1. Log in to the KubeSphere console as **project-regular**. In the left-side navigation pane, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the left-side navigation pane, click **Code Repositories**.

4. On the **Code Repositories** page on the left, click **Import**.

5. In the **Import Code Repository** dialog box, enter the name of code repository, for example, **open-podcasts**, and select a code repository. Optionally, you can set an alias and add description.

6. In the **Select Code Repository** dialog box, click **Git**. In **Code Repository URL**, enter the URL of the code repository, for example, **https://github.com/kubesphere-sigs/open-podcasts**, and click **OK**.

   {{< notice note >}}
   
   As the imported code repository is a public repository, it is not necessary to create a credential. However, if you add a private repository, a credential is required. For more information about how to create a credential, please refer to [Credential Management](../../../../devops-user-guide/how-to-use/devops-settings/credential-management/).

   {{</ notice >}}

## Create a Continuous Deployment

1. In the left-side navigation pane, click **Continuous Deployments**.

2. On the **Continuous Deployments** page, click **Create**.

3. On the **Basic Information** tab, enter a name of the continuous deployment, for example, **open-podcasts**, and choose a code repository. Then, click **Next**. Optionally, you can set an alias and add description.

4. In the **Deployment Location** section of the **Deployment Settings** tab, configure the cluster and project for which the continuous deployment will be deployed.

5. In the **Code Repository Settings** section, specify a branch or tag of the repository and the manifest file path.

    <table class="tableblock frame-all grid-all stretch">
    <colgroup>
    <col style={{width: "30%"}} />
    <col style={{width: "70%"}} />
    </colgroup>
    <thead>
    <tr class="header">
    <th class="tableblock halign-left valign-top">Parameter</th>
    <th class="tableblock halign-left valign-top">Description</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Revision</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>The commit ID, branch, or tag of the repository. For example, <strong>master</strong>, <strong>v1.2.0</strong>, <strong>0a1b2c3</strong>, or <strong>HEAD</strong>.</p>
    </div>
    </div></td>
    </tr>
    <tr class="even">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Manifest File Path</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>The manifest file path. For example, <strong>config/default</strong>.</p>
    </div>
    </div></td>
    </tr>
    </tbody>
    </table>

6. In the **Sync Strategy** section, select **Auto Sync** or **Manual Sync** as needed.

    -   **Auto Sync**: automatically syncs an application when it detects differences between the desired manifests in Git, and the live state in the cluster. The following table describes the parameters.

        <table class="tableblock frame-all grid-all stretch">
        <colgroup>
        <col style={{width: "30%"}} />
        <col style={{width: "70%"}} />
        </colgroup>
        <thead>
        <tr class="header">
        <th class="tableblock halign-left valign-top">Parameter</th>
        <th class="tableblock halign-left valign-top">Description</th>
        </tr>
        </thead>
        <tbody>
        <tr class="odd">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>Prune resources</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>If checked, it will delete resources that are no longer defined in Git. By default and as a safety mechanism, auto sync will not delete resources.</p>
        </div>
        </div></td>
        </tr>
        <tr class="even">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>Self-heal</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>If checked, it will force the state defined in Git into the cluster when a deviation in the cluster is detected. By default, changes that are made to the live cluster will not trigger auto sync.</p>
        </div>
        </div></td>
        </tr>
        </tbody>
        </table>

    -   **Manual Sync**: manually triggers application synchronization according to the synchronization options set. The following table describes the parameters.

        <table class="tableblock frame-all grid-all stretch">
        <colgroup>
        <col style={{width: "25%"}} />
        <col style={{width: "75%"}} />
        </colgroup>
        <thead>
        <tr class="header">
        <th class="tableblock halign-left valign-top">Parameter</th>
        <th class="tableblock halign-left valign-top">Description</th>
        </tr>
        </thead>
        <tbody>
        <tr class="odd">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>Prune resources</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>If checked, it will delete resources that are no longer defined in Git.
         By default and as a safety mechanism, manual sync will not delete resources, but mark the resource <strong>out-of-sync</strong> state.</p>
        </div>
        </div></td>
        </tr>
        <tr class="even">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>Dry run</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>Preview apply without affecting the cluster.</p>
        </div>
        </div></td>
        </tr>
        <tr class="odd">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>Apply only</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>If checked, it will skip <strong>pre/post</strong> sync hooks and just run <strong>kubectl apply</strong> for application resources.</p>
        </div>
        </div></td>
        </tr>
        <tr class="even">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>Force</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>If checked, it will use <strong>kubectl apply --force</strong> to sync resources.</p>
        </div>
        </div></td>
        </tr>
        </tbody>
        </table>

    {{< notice note >}}

  To configure the preceding parameters, go to the list or details page of continous deployment, select **Sync** from the drop-down list, and then specify parameter values in the **Sync Resource** dialog box.

    {{</ notice >}}

7. In the **Sync Settings** section, configure parameters as needed.

    <table class="tableblock frame-all grid-all stretch">
    <colgroup>
    <col style={{width: "30%"}} />
    <col style={{width: "70%"}} />
    </colgroup>
    <thead>
    <tr class="header">
    <th class="tableblock halign-left valign-top">Parameter</th>
    <th class="tableblock halign-left valign-top">Description</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Skip schema validation</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Disables <strong>kubectl</strong> validation. <strong>--validate=false</strong> is added when <strong>kubectl apply</strong> runs.</p>
    </div>
    </div></td>
    </tr>
    <tr class="even">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Auto create project</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Automatically creates projects for application resources if the projects do not exist.</p>
    </div>
    </div></td>
    </tr>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Prune last</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Resource pruning happened as a final, implicit wave of a sync operation,  after other resources have been deployed and become healthy.</p>
    </div>
    </div></td>
    </tr>
    <tr class="even">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Selective sync</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Syncs only <strong>out-of-sync</strong> resources.</p>
    </div>
    </div></td>
    </tr>
    </tbody>
    </table>

8. In the **Prune Propagation Policy** section, select a policy as needed.

    <table class="tableblock frame-all grid-all stretch">
    <colgroup>
    <col style={{width: "30%"}} />
    <col style={{width: "70%"}} />
    </colgroup>
    <thead>
    <tr class="header">
    <th class="tableblock halign-left valign-top">Parameter</th>
    <th class="tableblock halign-left valign-top">Description</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>foreground</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Deletes dependent resources first, and then deletes the owner resource.</p>
    </div>
    </div></td>
    </tr>
    <tr class="even">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>background</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Deletes the owner resource immediately, and then deletes the dependent resources in the background.</p>
    </div>
    </div></td>
    </tr>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>orphan</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Deletes the dependent resources that remain orphaned after the owner resource is deleted.</p>
    </div>
    </div></td>
    </tr>
    </tbody>
    </table>

9. In the **Replace Resource** section, specify whether to replace the resources that already exist.

    <Notice type="note">

    If checked, the resources will be synced by **kubectl replace/create**. By default, the resources will be synced by **kubectl apply**.

    </Notice>

10. Click **Create**. The resource you create will appear in the list of continuous deployments.

## View the Created Continuous Deployment

1. On the **Continuous Deployments** page, view the created continuous deployment. The following table describes the parameters.

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

2. Click <img src="/images/docs/v3.x/common-icons/three-dots.png" width="15" alt="icon" /> on the right of the continuous deployment, and you can perform the following:
    - **Edit Information**: edits the alias and description.
    - **Edit YAML**: edits the YAML file.
    - **Sync**: triggers resources synchronization.
    - **Delete**: deletes the continuous deployment.

  {{< notice warning >}}

  Deleting a continuous deployment also deletes resources associated with the continuous deployment. Therefore, exert caution when deleting the continuous deployment.
  
  {{</ notice >}}


3. Click the created continuous deployment to go to its details page, where you can view the synchronization status and result.

## Access the Created Application

1. Go to the project where the continuous deployment resides, in the left-side navigation pane, click **Services**.

2. On the **Services** page on the left, click  <img src="/images/docs/v3.x/common-icons/three-dots.png" width="15" alt="icon" /> on the right of the deployed application, and click **Edit External Access**.

3. In **Access Mode**, select **NodePort**, and click **OK**.

4. In the **External Access** column, check the exposed port, and access the application by **nodeIP: nodePort**.

  {{< notice note >}}
  Before accessing the service, open the exposed port in security groups.
  {{</ notice >}}