---
title: "为 KubeSphere 流水线设置电子邮件服务器"
keywords: 'KubeSphere, Kubernetes, notification, jenkins, devops, ci/cd, pipeline, email server'
description: '为 KubeSphere CI/CD 流水线设置电子邮件服务器'
linkTitle: "为 KubeSphere 流水线设置电子邮件服务器"
Weight: 400
---


内置的 Jenkins 无法与平台通知系统共享相同的电子邮件配置。 因此，您需要单独为 KubeSphere DevOps 流水线配置电子邮件服务器设置。
## 前提条件

- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要一个被授予**集群管理**角色的帐户。 例如，您可以直接以 `admin` 身份登录控制台或使用授权创建新角色并将其分配给帐户。

## 设置电子邮件服务器

1. 单击左上角的**平台管理**，然后选择**集群管理**。

![clusters-management](/images/docs/devops-user-guide-zh/jenkins-email-zh/clusters-management.png)

2. 如果您已经在导入成员集群时启用了[多集群特性](../../../multicluster-management)，那么您可以选择一个特定集群以查看其应用程序资源。 如果尚未启用该特性，请直接参考下一步。

3. 转到**应用负载**下的**工作负载**，然后从下拉列表中选择项目 **kubesphere-devops-system**。 单击 **ks-jenkins** 右侧的三个点以编辑其 YAML 配置文件。

![workloads-list](/images/docs/devops-user-guide-zh/jenkins-email-zh/workloads-list.png)

4. 向下滚动到图像下方需要指定的字段。 完成保存后，单击**更新**。

{{< notice warning >}}

在 `ks-jenkins` 部署（Deployment）中修改电子邮件服务器后，它将重新启动。 因此，DevOps 系统将在几分钟内不可用, 请在适当的时候进行此类修改。

{{</ notice >}}

![set-jenkins-email-3](/images/docs/devops-user-guide-zh/jenkins-email-zh/set-jenkins-email.png)

| 环境变量名称 | 描述 |
|---|---|
|EMAIL\_SMTP\_HOST | SMTP 服务器名称 |
|EMAIL\_SMTP\_PORT | SMTP 服务端口 (如：25)  |
|EMAIL\_FROM\_ADDR | 电子邮件发件人地址 |
|EMAIL\_FROM\_NAME | 电子邮件发件人姓名 |
|EMAIL\_FROM\_PASS | 电子邮件发件人密码 |
|EMAIL\_USE\_SSL | 是否启用SSL配置 |
