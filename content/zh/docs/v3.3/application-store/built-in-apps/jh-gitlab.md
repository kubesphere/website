---
title: "在 KubeSphere 上部署极狐GitLab"
keywords: 'KubeSphere, Kubernetes, 极狐GitLab, DevOps'
description: '了解并掌握如何在 KubeSphere 中部署和使用极狐GitLab'
linkTitle: "部署极狐GitLab"
version: "v3.3"
---

[极狐GitLab](https://gitlab.cn)是GitLab DevOps平台的中国发行版，作为一套完备的一站式DevOps平台，从设计到投产，一个平台覆盖 DevSecOps 全流程。极狐GitLab 帮助团队更快、更安全地交付更好的软件，提升研运效能，实现 DevOps 价值最大化。

本教程将演示如何从 KubeSphere 应用商店部署极狐GitLab。

## **准备工作**


- 您需要[启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户。该用户必须是已邀请至项目的平台普通用户，并且在项目中的角色为 `operator`。在本教程中，您需要以 `project-regular` 用户登录，并在 `demo-workspace` 企业空间的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- 确保 `KubeSphere` 环境有至少 4 Core，8GB RAM 以及 50GB 以上存储。

## 安装

1. 创建一个 `Workspace`：

![workspace creation](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/workspace-creation.png)

2. 创建一个 `Project`

![project creation](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/project-creation.png)

3. 在左侧导航栏 `Application Workload` 的 `App` 中，创建一个 `App`：

![app creation](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/app-creation.png)

4. 在出现的安装选项界面中选择 **From App Store**（从应用商店安装）：

![from app store](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/from-app-store.png)

5. 在 `App Store` 中输入 **jh** 进行搜索，会出现 **jh-gitlab** 的应用：

![jh gitlab app](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/jihu-gitlab-app.png) 

6. 点击 jh-gitlab 应用，在出现的界面上点击 `install`，即可开始安装。根据表单填写基本信息，然后点击 `next`：

![jh install basic info](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/jh-install-basic-info.png)

7. 接着需要根据自身需求填写 App 的设置信息（也就是 values.yaml 文件内容，详细说明可以参考[极狐GitLab Helm Chart 官网](https://jihulab.com/gitlab-cn/charts/gitlab/-/blob/main-jh/values.yaml)）。

![jh helm chart](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/jh-helm-charts.png)

8. 然后点击 `install` 开始安装，整个过程需要持续一段时间，最后可以在 `Application Workload` 的 `App` 选项里面看到安装成功的极狐GitLab 应用程序：

![succ installation](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/succ-installation.png)

9. 如果需要调试，可以利用 KubeSphere 的小工具（下图右下角红色方框所示的小锤子）来查看安装的极狐GitLab实例所对应的 Kubernetes 资源：

![kubectl check](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/kubectl-check.png)

10. `Pod` 和  `Ingress` 的内容如下：

![pod status](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/pod-status.png)

11. 使用 `gitlab.jihu-xiaomage.cn`（需要根据自身需求设置访问域名）来访问已经安装成功的极狐GitLab实例：

![jh instance](/images/docs/v3.x/zh-cn/appstore/built-in-apps/jh-app/jh-instance.png)

接下来你就可以使用极狐GitLab实例来开启你的 DevOps 之旅了。

## 了解更多

如果你想了解更多极狐GitLab的使用场景和最佳实践，请访问[极狐(GitLab)公司官网](https://gitlab.cn)。
