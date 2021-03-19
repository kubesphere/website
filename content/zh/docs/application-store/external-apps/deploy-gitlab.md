---
title: "在 KubeSphere 上部署 GitLab"
keywords: 'KubeSphere, Kubernetes, GitLab, 应用商店'
description: '如何在 KubeSphere 上部署 GitLab'
linkTitle: "在 KubeSphere 上部署 GitLab"
weight: 14310
---

[GitLab](https://about.gitlab.com/) 是一个端到端的开源软件开发平台，具有内置的版本控制、问题追踪、代码审查、CI/CD 等功能。

本教程演示了如何在 KubeSphere 上部署 GitLab。

## 准备工作

- 您需要启用 [OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要为本教程创建一个企业空间、一个项目以及两个帐户（`ws-admin` 和 `project-regular`）。在企业空间中，`ws-admin` 帐户必须被赋予 `workspace-admin` 角色，`project-regular` 帐户必须被赋予 `operator` 角色。如果还未创建好，请参考[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：添加应用仓库

1. 以 `ws-admin` 身份登录 KubeSphere。在企业空间中，访问**应用管理**下的**应用仓库**，然后点击**添加仓库**。

   ![add-repo](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/add-repo.png)

2. 在出现的对话框中，输入 `main` 作为应用仓库名称，输入 `https://charts.kubesphere.io/main` 作为应用仓库 URL。点击**验证**来验证 URL，如果可用，则会在 URL 右侧看到一个绿色的对号。点击**确定**继续操作。

   ![add-main-repo](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/add-main-repo.png)

3. 仓库成功导入到 KubeSphere 后，会显示在列表里。

   ![added-main-repo](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/added-main-repo.png)

### 步骤 2：部署 GitLab

1. 登出 KubeSphere，再以 `project-regular` 登录。在您的项目中，访问**应用负载**下的**应用**，然后点击**部署新应用**。

   ![deploy-app](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/deploy-app.png)

2. 在出现的对话框中，选择**来自应用模板**。

   ![from-app-templates](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/from-app-templates.png)

3. 从下拉菜单中选择 `main`，然后点击 **gitlab**。

   ![click-gitlab](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/click-gitlab.png)

4. 在**应用信息**选项卡和**配置文件**选项卡，可以看到控制台的默认配置。点击**部署**继续。

   ![view-config](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/view-config.png)

5. 在**基本信息**页面，可以看到应用名称、应用版本以及部署位置。点击**下一步**继续。

   ![basic-info](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/basic-info.png)

6. 在**应用配置**页面，使用以下配置替换默认配置，然后点击**部署**。

   ```yaml
   global:
       hosts:
         domain: demo-project.svc.cluster.local
   
     gitlab-runner:
       install: false
   
     gitlab:
       webservice:
         helmTests:
           enabled: false
   ```

   ![change-value](/images/docs/zh-cn/appstore/external-apps/deploy-gitlab/change-value.png)

   {{< notice note >}}

   `demo-project` 指的是部署 GitLab 的项目名称，请确保使用您自己的项目名称。

   {{</ notice >}}

7. 等待 GitLab 正常运行。

   ![gitlab-running](/images/docs/appstore/external-apps/deploy-gitlab/gitlab-running.PNG)

8. 访问**工作负载**，可以看到为 GitLab 创建的所有部署和有状态副本集。

   ![deployments-running](/images/docs/appstore/external-apps/deploy-gitlab/deployments-running.PNG)

   ![statefulsets-running](/images/docs/appstore/external-apps/deploy-gitlab/statefulsets-running.PNG)

   {{< notice note >}}

   可能需要过一段时间才能看到所有部署和有状态副本集正常运行。

   {{</ notice >}}

### 步骤 3：获取 root 用户的密码

1. 访问**配置中心**的密钥，在搜索栏输入 `gitlab-initial-root-password`，然后按下键盘上的**回车键**来搜索密钥。

   ![search-secret](/images/docs/appstore/external-apps/deploy-gitlab/search-secret.PNG)

2. 点击密钥访问其详情页，然后点击右上角的眼睛图标查看密码。请确保将密码进行复制。

   ![click-eye-icon](/images/docs/appstore/external-apps/deploy-gitlab/click-eye-icon.PNG)

   ![password](/images/docs/appstore/external-apps/deploy-gitlab/password.PNG)

### 步骤 4：编辑 hosts 文件

1. 在本地机器上找到 hosts 文件。

   {{< notice note >}}

   对于 Linux，hosts 文件的路径是 `/etc/hosts`；对于 Windows，则是 `c:\windows\system32\drivers\etc\hosts`。

   {{</ notice >}}

2. 将以下条目添加进 hosts 文件中。

   ```
   192.168.4.3  gitlab.demo-project.svc.cluster.local
   ```

   {{< notice note >}}

   - `192.168.4.3` 和 `demo-project` 分别指的是部署 GitLab 的 NodeIP 和项目名称，请确保使用自己的 NodeIP 和项目名称。
   - 您可以使用自己 Kubernetes 集群中任意节点的 IP 地址。

   {{</ notice >}}

### 步骤 5：访问 GitLab

1. 访问**应用负载**下的**服务**，在搜索栏输入 `nginx-ingress-controller`，然后按下键盘上的**回车键**搜索该服务，可以看到通过端口 `32618` 暴露的服务，您可以使用该端口访问 GitLab。

   ![search-service](/images/docs/appstore/external-apps/deploy-gitlab/search-service.PNG)

   {{< notice note >}}

   在不同控制台上显示的端口号可能不同，请您确保使用自己的端口号。

   {{</ notice >}}

2. 通过 `http://gitlab.demo-project.svc.cluster.local:32618` 使用 root 帐户及其初始密码 (`root/LAtonWwrzFvbAW560gaZ0oty6slpkCcywzzCCpeqql9bxIjJBMSGys43zSwq3d9I`) 访问 GitLab。

   ![access-gitlab](/images/docs/appstore/external-apps/deploy-gitlab/access-gitlab.PNG)

   ![gitlab-console](/images/docs/appstore/external-apps/deploy-gitlab/gitlab-console.PNG)

   {{< notice note >}}

   根据您 Kubernetes 集群部署位置的不同，您可能需要在安全组中打开端口，并配置相关的端口转发规则。
   
   {{</ notice >}}

