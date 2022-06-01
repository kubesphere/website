---
title: "Use GitOps for Continuous Deployment on KubeSphere"
keywords: 'Kubernetes, GitOps, KubeSphere, CI，CD'
description: 'Describe how to use GitOps for continuous deployment on KubeSphere.'
linkTitle: "Use GitOps for Continuous Deployment on KubeSphere"
weight: 11221
---

GitOps is a way of implemeting continuous deployment for cloud-native applications. The core component of GitOps is a Git repository that always stores applications and declarative description of the infrastructure for version control. With GitOps and Kubernetes, you can enable CI/CD pipelines to apply changes to any cluster, which ensures consistency in crosss-cloud deployment scenarios.

In KubeSphere 3.3.0, we introduce the GitOps concept, and you can create continuous deployments on the console in a more convenient way.

## Prerequisites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).

- You need to [import an code repository](../../../../devops-user-guide/how-to-use/code-repositories/import-code-repositories/).

## Procedure

1. Log in to the KubeSphere console as `project-admin`. In the navigation tree on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation tree on the left, click **Continuous Deployments**.

4. On the **Continuous Deployments** page, click **Create**.

5. On the **Basic Information** tab, enter a name of the continuous deployment and choose a code repository. Then, click **Next**. Optionally, you can set an alias and add description.

6. On the **Deployment Settings** tab, choose the cluster and project that the continuous deployment will be deployed.

7. In **Code Repository Settings**, set a branch or tag of the repository and specify the path of the manifest file.

8. In **Sync Strategy**, you can choose either **Manual Sync** or ****Auto Sync**. If you choose **Auto Sync**, select **Prune resources** and **Self-heal** as needed. 

    - **Prune resources**: Automatically deletes resources that are no longer defined in Git.
    - **Self-heal**: Always synchronizes the state defined in Git.

9. In **Sync Settings**, select the following options as needed:
    - **skip schema validation**: Does not validate resources.
    - **Auto create project**: Automatically creates a project during synchronization.
    - **Prune last**: Deletes resources that no longer exist after all resources have been synchronized and become healthy.
    - **Aplly out of sync only**: Skips syncing resources that are already in the desired state.

10. In **Prune Propagation Policy**, choose a deleting policy:
    - **foreground**: 先删除附属资源，再删除主资源。
    - **background**: 先删除主资源，再删除附属资源。
    - **orphan**: 删除主资源之后，附属资源仍然存在。

11. In **Replace Resource**, decide whether you want to replace resources that already exist. Click **Create**.
    
    您可以在**Continuous Deployments**页面上查看到已创建的持续部署的信息，如下表所示：

    <table>
    <tbody>
      <tr>
      	<th>参数</th>
       	<th>描述信息</th>
      </tr>
      <tr>
        <td>Name</td>
        <td>持续部署的名称。</td>
      </tr>
      <tr>
        <td>Health Status</td>
        <td>持续部署的健康状态。主要包含以下几种状态：<br/>
           <ul>
           <li>Healthy：资源健康。</li>
           <li>Degraded：资源已经被降级。</li>
           <li>Progressing：资源不健康，但是仍在运行中，可能很快恢复到健康状态。默认返回该状态。</li>
           <li>Suspended：资源已经被暂停并等待恢复。</li>
           <li>Unknown：资源健康状态未知。</li>
           <li>Missing：资源已丢失。</li></td>
      </tr>
      <tr>
        <td>Sync Status</td>
        <td>持续部署的同步状态。主要包含以下几种状态：<br/>
           <ul>
           <li>Synced：资源同步已完成。</li>
           <li>Out of sync：资源的实际运行状态和期望状态不一致。</li>
           <li>Unknown：资源同步状态未知。</li></td>
      </tr>
      <tr>
         <td>Deployment Location</td>
        <td>部署的集群和项目。</td>
      </tr>
      <tr>
        <td>Update Time</td>
        <td>资源更新的时间。</td>
      </tr>
    </tbody>
    </table>

12. 点击持续部署右侧的 <img src="/images/docs/common-icons/three-dots.png" width="15" />，您可以执行以下操作：
    - Edit Information：编辑别名和描述信息。
    - Edit YAML：编辑持续部署的 YAML 文件。
    - Sync：触发资源同步。
    - Delete：删除持续部署。