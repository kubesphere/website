---
title: "Jenkins 系统设置"
keywords: 'Kubernetes, KubeSphere, Jenkins, CasC'
description: '了解如何自定义您的 Jenkins 设置。'
linkTitle: 'Jenkins 系统设置'
Weight: 11240
---

Jenkins 强大而灵活，已经成为 CI/CD 工作流的事实标准。但是，许多插件要求用户先设置系统级配置，然后才能使用。

KubeSphere DevOps 系统提供基于 Jenkins 的容器化 CI/CD 功能。为了向用户提供可调度的 Jenkins 环境，KubeSphere 使用 **Configuration as Code** 进行 Jenkins 系统设置，这要求用户登录 Jenkins 仪表板并在修改配置后重新加载。Jenkins 系统设置在 KubeSphere 当前版本的控制台上不可用，即将发布的版本将支持该设置。

本教程演示如何在 Jenkins 仪表板上设置 Jenkins 并重新加载配置。

## 准备工作

您已启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。

## Jenkins Configuration as Code

KubeSphere 默认安装 Jenkins Configuration as Code 插件，您可以通过 YAML 文件定义 Jenkins 的期望状态，便于再现 Jenkins 的配置（包括插件配置）。您可以[在该目录中](https://github.com/jenkinsci/configuration-as-code-plugin/tree/master/demos)查看具体的 Jenkins 配置和示例 YAML 文件。

此外，您可以在 [ks-jenkins](https://github.com/kubesphere/ks-jenkins) 仓库中找到 `formula.yaml` 文件，查看插件版本并按需自定义这些版本。

![plugin-version](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-system-settings/plugin-version.png)

## 修改 ConfigMap

建议您通过 Configuration as Code (CasC) 在 KubeSphere 中配置 Jenkins。内置 Jenkins CasC 文件存储为 [ConfigMap](../../../project-user-guide/configuration/configmaps/)。

1. 以 `admin` 身份登录 KubeSphere，点击左上角的**平台管理**，然后选择**集群管理**。

2. 如果您已经启用[多集群功能](../../../multicluster-management/)并已导入成员集群，您可以选择一个特定集群来编辑 ConfigMap。如果您尚未启用多集群功能，请直接参考下一步。

3. 在左侧导航栏中选择**配置**下的**配置字典**。在**配置字典**页面上，从下拉列表中选择 `kubesphere-devops-system`，然后点击 `jenkins-casc-config`。

4. 在详情页面上，点击**更多操作**，在下拉列表中选择**编辑 YAML**。

5. `jenkins-casc-config` 的配置模板是一个 YAML 文件，如下图所示。您可以在 ConfigMap 的代理 (Kubernetes Jenkins Agent) 中修改容器镜像、标签、资源请求 (Request) 和限制 (Limit) 等内容，或者在 podTemplate 中添加容器。完成操作后，点击**确定**。

   ![编辑 Jenkins](/images/docs/zh-cn/devops-user-guide/use-devops/jenkins-system-settings/edit-jenkins.png)

## 登录 Jenkins 重新加载配置

修改 `jenkins-casc-config` 后，您需要在 Jenkins 仪表板的 **Configuration as Code** 页面上重新加载更新后的系统配置。这是因为直接通过 Jenkins 仪表板配置的系统设置可能在 Jenkins 重新调度之后被 CasC 配置覆盖。

1. 执行以下命令获取 Jenkins 的地址。

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. 您可以看到如下所示的预期输出，获取 Jenkins 的 IP 地址和端口号。

   ```bash
   http://10.77.1.201:30180
   ```

3. 使用地址 `http://Node IP:Port Number` 访问 Jenkins。安装 KubeSphere 时，默认情况下也会安装 Jenkins 仪表板。Jenkins 还配置有 KubeSphere LDAP，这意味着您可以直接使用 KubeSphere 帐户（例如 `admin/P@88w0rd`）登录 Jenkins。

   {{< notice note >}}

   取决于您的实例的部署位置，您可能需要设置必要的端口转发规则并在您的安全组中放行端口 `30180`，以便访问 Jenkins。

   {{</ notice >}} 

4. 登录 Jenkins 仪表板后，点击导航栏中的**系统管理**。

5. 向下翻页并点击 **Configuration as Code**.

6. 要重新加载 ConfigMap 中已修改的配置，请点击**应用新配置**。

7. 有关如何通过 CasC 设置 Jenkins 的更多信息，请参见 [Jenkins 文档](https://github.com/jenkinsci/configuration-as-code-plugin)。

   {{< notice note >}}

   在当前版本中，并非所有插件都支持 CasC 设置。CasC 仅会覆盖通过 CasC 设置的插件配置。

   {{</ notice >}} 