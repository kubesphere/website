---
title: "Jenkins 系统设置"
keywords: 'Kubernetes, KubeSphere, Jenkins, CasC'
description: '如何在 KubeSphere 中设置 Jenkins.'
linkTitle: 'Jenkins 系统设置'
Weight: 11240
---

Jenkins 强大而灵活，已经成为 CI/CD 工作流事实上的标准。 但是，许多插件要求用户先设置系统级配置，然后才能使用。
KubeSphere DevOps 系统提供基于 Jenkins 的容器化 CI/CD 功能。为了为用户提供可调度的 Jenkins 环境，KubeSphere 使用 **Configuration-as-Code** 进行 Jenkins 系统设置，这要求用户登录 Jenkins 仪表板并在修改后重新加载配置。在当前版本中，Jenkins 系统设置在 KubeSphere 控制台上不可用，即将发布的版本将支持该设置。
本教程演示了如何在 Jenkins 仪表板上设置 Jenkins 并重新加载配置。

## 先决条件

您已启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。

## 修改 ConfigMap

建议您通过Configuration-as-Code（CasC）在 KubeSphere 中配置 Jenkins。 内置的 Jenkins CasC 文件存储为 [ConfigMap](../../../project-user-guide/configuration/configmaps/)。

1. 以 kubeSphere 管理员（`admin`）身份登录， 单击左上角的**平台管理**，然后选择**集群管理**。

   ![cluster-management](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/cluster-management.png)

2. 如果您已经在导入成员集群时启用了[多集群特性](../../../multicluster-management)，那么您可以选择一个特定集群以查看其应用程序资源。 如果尚未启用该特性，请直接参考下一步。

3. 从导航栏中，在**配置中心**下选择**配置**。 在**配置**页面上，从下拉列表中选择 `kubesphere-devops-system`，然后单击 `jenkins-casc-config`。

   ![edit-configmap](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/edit-configmap.png)

4. 在详细信息页面上，从**更多操作**下拉列表中单击**编辑配置文件（YAML 文件）**。

   ![more-list](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/more-list.png)

5. 如下所示，`jenkins-casc-config` 的配置模板是一个 YAML 文件。 您可以在 ConfigMap 的代理（Kubernetes Jenkins agent）中修改容器镜像、标签等内容，或者在 podTemplate 中添加容器。 完成后，单击**更新**。

   ![edit-jenkins](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/edit-jenkins.png)

## 登录 Jenkins 重新加载配置

修改 `jenkins-casc-config` 后，需要在 Jenkins 仪表板上的 **Configuration as Code** 页面上重新加载更新的系统配置。 这是因为直接通过 Jenkins 仪表板配置的系统设置可能在 Jenkins 重新调度之后被 CasC（`Configuration as Code`） 配置覆盖。

1. 执行以下命令获取 Jenkins 的地址。

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services ks-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. 您可以看到如下所示的预期输出，它告诉您 Jenkins 的 IP 地址和端口号。

   ```bash
   http://10.77.1.201:30180
   ```

3. 使用地址 `http://Node IP:Port Number` 访问 Jenkins。安装 KubeSphere 时，默认情况下也会安装 Jenkins 仪表板。 Jenkins 配置了 KubeSphere LDAP，这意味着您可以直接使用 KubeSphere 帐户（例如 `admin/P@88w0rd`）登录 Jenkins。

   ![jenkins-dashboard](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/jenkins-dashboard.png)

   {{< notice note >}}

   您可能需要设置必要的端口转发规则并打开端口 `30180` 才能访问安全组中的 Jenkins，具体取决于您的实例部署的位置。

   {{</ notice >}}

4. 登录仪表板后，从导航栏中单击 **Manage Jenkins**。

   ![manage-jenkins](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/manage-jenkins.png)

5. 向下翻页并单击 **Configuration as Code**.

   ![configuration-as-code](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/configuration-as-code.png)

6. 要重新加载在 ConfigMap 中修改的配置，请单击 **Apply new configuration**。.

   ![app-config](/images/docs/devops-user-guide-zh/using-devops-zh/jenkins-system-settings-zh/app-config.png)

7. 有关如何通过 CasC 设置 Jenkins 的更多信息，请参阅 [Jenkins 文档](https://github.com/jenkinsci/configuration-as-code-plugin)。

   {{< notice note >}}

在当前版本中，并非所有插件都支持 CasC 设置。 CasC 将仅覆盖通过 CasC 设置的插件配置。

   {{</ notice >}}