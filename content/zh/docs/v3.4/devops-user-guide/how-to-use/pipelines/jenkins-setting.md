---
title: "设置 Jenkins 系统"
keywords: 'Kubernetes, KubeSphere, Jenkins, CasC'
description: '了解如何自定义您的 Jenkins 设置。'
linkTitle: '设置 Jenkins 系统'
Weight: 11216
version: "v3.4"
---

Jenkins 强大而灵活，已经成为 CI/CD 工作流的事实标准。但是，许多插件要求用户先设置系统级配置，然后才能使用。

KubeSphere DevOps 系统提供基于 Jenkins 的容器化 CI/CD 功能。为了向用户提供可调度的 Jenkins 环境，KubeSphere 使用 **Configuration as Code** 进行 Jenkins 系统设置，这要求用户登录 Jenkins 仪表板并在修改配置后重新加载。Jenkins 系统设置在 KubeSphere 当前版本的控制台上不可用，即将发布的版本将支持该设置。

本教程演示如何在 Jenkins 仪表板上设置 Jenkins 并重新加载配置。

## 准备工作

您已启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。

## Jenkins Configuration as Code

KubeSphere 默认安装 Jenkins Configuration as Code 插件，您可以通过 YAML 文件定义 Jenkins 的期望状态，便于再现 Jenkins 的配置（包括插件配置）。您可以[在该目录中](https://github.com/jenkinsci/configuration-as-code-plugin/tree/master/demos)查看具体的 Jenkins 配置和示例 YAML 文件。

此外，您可以在 [ks-jenkins](https://github.com/kubesphere/ks-jenkins) 仓库中找到 `formula.yaml` 文件，查看插件版本并按需自定义这些版本。

![plugin-version](/images/docs/v3.x/zh-cn/devops-user-guide/use-devops/jenkins-system-settings/plugin-version.png)

## 修改 ConfigMap

建议您通过 Configuration as Code (CasC) 在 KubeSphere 中配置 Jenkins。内置 Jenkins CasC 文件存储为 [ConfigMap](../../../../project-user-guide/configuration/configmaps/)。

1. 以 `admin` 身份登录 KubeSphere，点击左上角的**平台管理**，然后选择**集群管理**。

2. 如果您已经启用[多集群功能](../../../../multicluster-management/)并已导入成员集群，您可以选择一个特定集群来编辑 ConfigMap。如果您尚未启用多集群功能，请直接参考下一步。

3. 在左侧导航栏中选择**配置**下的**配置字典**。在**配置字典**页面上，从下拉列表中选择 `kubesphere-devops-system`，然后点击 `jenkins-casc-config`。

4. 在详情页面上，点击**更多操作**，在下拉列表中选择**编辑 YAML**。

5. `jenkins-casc-config` 的配置模板是一个 YAML 文件，位于 `data.jenkins_user.yaml:` 部分。您可以在 ConfigMap 的代理 (Kubernetes Jenkins Agent) 中修改容器镜像、标签、资源请求 (Request) 和限制 (Limit) 等内容，或者在 podTemplate 中添加容器。完成操作后，点击**确定**。

6. 请至少等待 70 秒，您的改动会自动重新加载。

7. 有关如何通过 CasC 设置 Jenkins 的更多信息，请参见 [Jenkins 文档](https://github.com/jenkinsci/configuration-as-code-plugin)。

   {{< notice note >}}

   在当前版本中，并非所有插件都支持 CasC 设置。CasC 仅会覆盖通过 CasC 设置的插件配置。

   {{</ notice >}} 

