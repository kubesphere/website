---
title: "使用 GitOps 实现应用持续部署"
keywords: 'Kubernetes, GitOps, KubeSphere, CI，CD, 持续集成，持续部署'
description: '介绍如何在 KubeSphere 中使用 GitOps 实现持续部署。'
linkTitle: "使用 GitOps 实现应用持续部署"
weight: 11221
---

KubeSphere 3.3 引入了一种为云原生应用实现持续部署的理念 – GitOps。GitOps 的核心思想是拥有一个 Git 仓库，并将应用系统的申明式基础架构和应用程序存放在 Git 仓库中进行版本控制。GitOps 结合 Kubernetes 能够利用自动交付流水线将更改应用到指定的任意多个集群中，从而解决跨云部署的一致性问题。

本示例演示如何创建持续部署实现应用的部署。

## 准备工作

- 您需要有一个企业空间、一个 DevOps 项目和一个用户 (**project-regular**)，并已邀请此帐户至 DevOps 项目中且授予 **operator** 角色。如果尚未准备好，请参考[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。

## 导入代码仓库

1. 以 **project-regular** 用户登录 KubeSphere 控制台，在左侧导航树，点击 **DevOps 项目**。

2. 在右侧的 **DevOps 项目**页面，点击您创建的 DevOps 项目。

3. 在左侧的导航树，点击**代码仓库**。

4. 在右侧的**代码仓库**页面，点击**导入**。

5. 在**导入代码仓库**对话框，输入代码仓库名称，如 **open-podcasts**，并选择代码仓库。您也可以为代码仓库设置别名和添加描述信息。


6. 在**选择代码仓库**对话框，点击 **Git**，在**代码仓库地址**区域，输入代码仓库地址，如 **https://github.com/kubesphere-sigs/open-podcasts**，点击**确定**。

   {{< notice note >}}

   此处导入的是公共仓库，因此不需要创建凭证。如果您添加的是私有仓库，则需要创建凭证。更多关于如何添加凭证的信息，请参阅[凭证管理](../../../../devops-user-guide/how-to-use/devops-settings/credential-management/)。

   {{</ notice >}}

## 创建持续部署

1. 在左侧的导航树，点击**持续部署**。

2. 在右侧的**持续部署**页面，点击**创建**。

3. 在**基本信息**页签，输入持续部署名称，如 **open-podcasts**，并选择上一步创建的代码仓库，您也可以设置别名和添加描述信息，点击**下一步**。

4. 在**部署设置**页签，选择持续部署的部署集群和项目。

5. 在**代码仓库设置**区域，设置代码仓库的分支或标签以及 Kustomization 清单文件路径。

    <table class="tableblock frame-all grid-all stretch">
    <colgroup>
    <col style={{width: "30%"}} />
    <col style={{width: "70%"}} />
    </colgroup>
    <thead>
    <tr class="header">
    <th class="tableblock halign-left valign-top">参数</th>
    <th class="tableblock halign-left valign-top">描述</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>修订版本</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>Git 仓库中的 commit ID、分支或标签。例如，<strong>master</strong>, <strong>v1.2.0</strong>, <strong>0a1b2c3</strong> 或 <strong>HEAD</strong>。</p>
    </div>
    </div></td>
    </tr>
    <tr class="even">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>清单文件路径</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>设置清单文件路径。例如，<strong>config/default</strong>。</p>
    </div>
    </div></td>
    </tr>
    </tbody>
    </table>

6. 在**同步策略**区域，根据需要选择**自动同步**或**手动同步**。

    -   **自动同步**：在检测到 Git 仓库中的清单与部署资源的实时状态之间存在差异时，根据设置的同步选项，自动触发应用程序同步。具体参数如下表所示。

        <table class="tableblock frame-all grid-all stretch">
        <colgroup>
        <col style={{width: "30%"}} />
        <col style={{width: "70%"}} />
        </colgroup>
        <thead>
        <tr class="header">
        <th class="tableblock halign-left valign-top">参数</th>
        <th class="tableblock halign-left valign-top">描述</th>
        </tr>
        </thead>
        <tbody>
        <tr class="odd">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>清理资源</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>如果勾选，自动同步时会删除 Git 仓库中不存在的资源。不勾选时，自动同步触发时不会删除集群中的资源。</p>
        </div>
        </div></td>
        </tr>
        <tr class="even">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>自纠正</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>如果勾选，当检测到 Git 仓库中定义的状态与部署资源中有偏差时，将强制应用 Git 仓库中的定义。不勾选时，对部署资源做更改时不会触发自动同步。</p>
        </div>
        </div></td>
        </tr>
        </tbody>
        </table>

    -   **手动同步**：根据设置的同步选项，手动触发应用程序同步。具体参数如下表所示。

        <table class="tableblock frame-all grid-all stretch">
        <colgroup>
        <col style={{width: "30%"}} />
        <col style={{width: "70%"}} />
        </colgroup>
        <thead>
        <tr class="header">
        <th class="tableblock halign-left valign-top">参数</th>
        <th class="tableblock halign-left valign-top">描述</th>
        </tr>
        </thead>
        <tbody>
        <tr class="odd">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>清理资源</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>如果勾选，同步会删除 Git 仓库中不存在的资源。不勾选时，同步不会删除集群中的资源，而是会显示 <strong>out-of-sync</strong>。</p>
        </div>
        </div></td>
        </tr>
        <tr class="even">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>模拟运行</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>模拟同步，不影响最终部署资源。</p>
        </div>
        </div></td>
        </tr>
        <tr class="odd">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>仅执行 Apply</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>如果勾选，同步应用资源时会跳过 <strong>pre/post</strong> 钩子，仅执行 <strong>kubectl apply</strong>。</p>
        </div>
        </div></td>
        </tr>
        <tr class="even">
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>强制 Apply</p>
        </div>
        </div></td>
        <td class="tableblock halign-left valign-top"><div class="content">
        <div class="paragraph">
        <p>如果勾选，同步时会执行 <strong>kubectl apply --force</strong>。</p>
        </div>
        </div></td>
        </tr>
        </tbody>
        </table>


7.  在**同步设置**区域，根据需要设置同步相关参数。

    <table class="tableblock frame-all grid-all stretch">
    <colgroup>
    <col style={{width: "30%"}} />
    <col style={{width: "70%"}} />
    </colgroup>
    <thead>
    <tr class="header">
    <th class="tableblock halign-left valign-top">参数</th>
    <th class="tableblock halign-left valign-top">描述</th>
    </tr>
    </thead>
    <tbody>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>跳过规范校验</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>跳过 <strong>kubectl</strong> 验证。执行 <strong>kubectl apply</strong> 时，增加 <strong>--validate=false</strong> 标识。</p>
    </div>
    </div></td>
    </tr>
    <tr class="even">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>自动创建项目</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>在项目不存在的情况下自动为应用程序资源创建项目。</p>
    </div>
    </div></td>
    </tr>
    <tr class="odd">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>最后清理</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>同步操作时，其他资源都完成部署且处于健康状态后，再清理资源。</p>
    </div>
    </div></td>
    </tr>
    <tr class="even">
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>选择性同步</p>
    </div>
    </div></td>
    <td class="tableblock halign-left valign-top"><div class="content">
    <div class="paragraph">
    <p>仅同步 <strong>out-of-sync</strong> 状态的资源。</p>
    </div>
    </div></td>
    </tr>
    </tbody>
    </table>

8.  在**依赖清理策略**区域，根据需要选择依赖清理策略。

    <table class="tableblock frame-all grid-all stretch">
    <colgroup>
    <col style={{width: "30%"}} />
    <col style={{width: "70%"}} />
    </colgroup>
    <thead>
    <tr class="header">
    <th class="tableblock halign-left valign-top">参数</th>
    <th class="tableblock halign-left valign-top">描述</th>
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
    <p>先删除依赖资源，再删除主资源。</p>
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
    <p>先删除主资源，再删除依赖资源。</p>
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
    <p>删除主资源，留下依赖资源成为孤儿。</p>
    </div>
    </div></td>
    </tr>
    </tbody>
    </table>

9. 在**替换资源**区域，选择是否需要替换已存在的资源。

    {{< notice note >}}

  如果勾选，将执行 **kubectl replace/create** 命令同步资源。不勾选时，使用 **kubectl apply** 命令同步资源。

    {{</ notice >}}
    
10. 点击**创建**。资源创建完成后将显示在持续部署列表中。

## 查看已创建的持续部署信息

1. 在**持续部署**页面上查看到已创建的持续部署信息。具体参数如下表所示。

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
           <li>进行中：资源正在同步。默认返回该状态。</li>
           <li>暂停：资源已经被暂停并等待恢复。</li>
           <li>未知：资源健康状态未知。</li>
           <li>丢失：资源已缺失。</li></td>
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
        <td>资源部署的集群和项目。</td>
      </tr>
      <tr>
        <td>更新时间</td>
        <td>资源更新的时间。</td>
      </tr>
    </tbody>
    </table>

2. 点击持续部署右侧的 <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" />，您可以执行以下操作：
    - **编辑信息**：编辑别名和描述信息。
    - **编辑 YAML**：编辑持续部署的 YAML 文件。
    - **同步**：触发资源同步。
    - **删除**：删除持续部署。

  {{< notice warning >}}

  删除持续部署的同时会删掉和该持续部署关联的资源。请谨慎操作。
  
  {{</ notice >}}

3. 点击已创建的持续部署进入详情页面，可以查看同步状态和同步结果。

## 访问已创建的应用

1. 进入持续部署所在的项目，在左侧导航栏，点击**服务**。

2. 在右侧的**服务**区域，找到已部署的应用，并点击右侧 <img src="/images/docs/v3.3/common-icons/three-dots.png" width="15" alt="icon" />，选择**编辑外部访问**。

3. 在**访问模式**中选择 **NodePort**，点击**确定**。

4. 在服务列表页面的**外部访问**列，查看暴露的端口，通过 {Node IP}:{NodePort} 访问此应用。

  {{< notice note >}}
  在访问服务之前，请确保安全组中的端口已打开。
  {{</ notice >}}