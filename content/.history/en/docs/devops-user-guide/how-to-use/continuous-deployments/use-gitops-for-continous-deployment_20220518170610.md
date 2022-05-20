---
title: "Use GitOps for Continuous Deployment on KubeSphere"
keywords: 'Kubernetes, GitOps, KubeSphere, CI，CD, 持续集成，持续部署'
description: '介绍如何在 KubeSphere 中使用 GitOps 实现持续部署。'
linkTitle: "在 KubeSphere 中使用 GitOps 实现持续部署"
weight: 11221
---
GitOps 是一种为云原生应用实现持续部署的理念。GitOps 的核心思想是拥有一个 Git 仓库，并将应用系统的声明性基础架构和应用程序存放在 Git 仓库中进行版本控制。GitOps 结合 Kubernetes 能够利用自动交付流水线将更改应用到指定的任意多个集群中，从而解决跨云部署的一致性问题。

KubeSphere 3.3.0 引入了 GitOps，您可以在控制台上便捷地创建持续部署。

## Prerequsites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).

- You need to [import an code repository](../../../../devops-user-guide/how-to-use/code-repositories/import-code-repositories/).

## Procedure

1. Log in to the KubeSphere consone as `project-admin`. In the navigation tree on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation tree on the left, click **Continuous Deployments**.

4. On the **Continuous Deployments** page, click **Create**.

5. On the **Basic Information** tab, enter a name of the continuous deployment and choose a code repository. Then, click **Next**. Optionally, you can set an alias and add description.

6. On the **Deployment Settings** tab, choose the cluster and project that the continuous deployment will be deployed.

7. In **Code Repository Settings**, set a branch or tag of the repository and specify the path of the mainfest file.

8. In **Sync Strategy**, you can choose eitehr **手动同步**或****自动同步**。当选择**自动同步**时，会出现**清理资源**和**自恢复**选项，请根据您的实际需要选择。

    - **清理资源**：自动同步时,自动删除 git 中不存在的资源。
    - **自恢复**：时刻保证与 git 中定义的状态同步。

9.  在**同步设置**区域，按照实际需要选择以下设置项：
    - **跳过规范校验**：不校验资源规范性。
    - **自动创建项目**：在同步的过程中，自动创建项目。
    - **最后清理**：直到所有的资源都已经同步且处于健康状态才删除不存在的资源。
    - **仅应用未同步**：仅应用未同步的资源。

10. 在**依赖清理策略**区域，选择一个清理策略：
    - **foreground**：先删除附属资源，再删除主资源。
    - **background**：先删除主资源，再删除附属资源。
    - **orphan**：删除主资源之后，附属资源仍然存在。

11. 在**替换资源**区域，选择是否需要替换已存在的资源，点击**创建**。
    
    您可以在**持续部署**页面上查看到已创建的持续部署的信息，如下表所示：

    <table>
    <tbody>
      <tr>
      	<th>参数</th>
       	<th>描述信息</th>
      </tr>
      <tr>
        <td>名称</td>
        <td>持续部署的名称。</td>
      </tr>
      <tr>
        <td>健康状态</td>
        <td>持续部署的健康状态。主要包含以下几种状态：<br/>
           <ul>
           <li>健康：资源健康。</li>
           <li>已降级：资源已经被降级。</li>
           <li>进行中：资源不健康，但是仍在运行中，可能很快恢复到健康状态。默认返回该状态。</li>
           <li>暂停：资源已经被暂停并等待恢复。</li>
           <li>未知：资源健康状态未知。</li>
           <li>丢失：资源已丢失。</li></td>
      </tr>
      <tr>
        <td>同步状态</td>
        <td>持续部署的同步状态。主要包含以下几种状态：<br/>
           <ul>
           <li>已同步：资源同步已完成。</li>
           <li>未同步：资源的实际运行状态和期望状态不一致。</li>
           <li>未知：资源同步状态未知。</li></td>
      </tr>
      <tr>
         <td>部署位置</td>
        <td>部署的集群和项目。</td>
      </tr>
      <tr>
        <td>更新时间</td>
        <td>资源更新的时间。</td>
      </tr>
    </tbody>
    </table>

12. 点击持续部署右侧的 <img src="/images/docs/common-icons/three-dots.png" width="15" />，您可以执行以下操作：
    - 编辑信息：编辑别名和描述信息。
    - 编辑 YAML：编辑持续部署的 YAML 文件。
    - 同步：触发资源同步。
    - 删除：删除持续部署。