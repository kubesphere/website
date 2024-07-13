---
title: "为 KubeSphere 流水线设置电子邮件服务器"
keywords: 'KubeSphere, Kubernetes, 通知, Jenkins, DevOps, CI/CD, 流水线, 电子邮件服务器'
description: '设置电子邮件服务器以接收有关您 Jenkins 流水线的通知。'
linkTitle: "为 KubeSphere 流水线设置电子邮件服务器"
Weight: 11218
version: "v3.3"
---


内置 Jenkins 无法与平台通知系统共享相同的电子邮件配置。因此，您需要单独为 KubeSphere DevOps 流水线配置电子邮件服务器设置。

## 准备工作

- 您需要启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。
- 您需要一个具有**集群管理**权限的帐户。例如，您可以直接以 `admin` 身份登录控制台或者创建具有该权限的新角色并将该角色分配给一个用户。

## 设置电子邮件服务器

1. 点击左上角的**平台管理**，然后选择**集群管理**。

2. 如果您已经启用[多集群功能](../../../../multicluster-management/)并已导入成员集群，那么您可以选择一个特定集群以查看其节点。如果尚未启用该功能，请直接参考下一步。

3. 转到**应用负载**下的**工作负载**，然后从下拉列表中选择 **kubesphere-devops-system** 项目。点击 `devops-jenkins` 右侧的 <img src="/images/docs/v3.x/common-icons/three-dots.png" height="15" alt="icon" /> 并选择**编辑 YAML** 以编辑其 YAML 配置文件。

4. 向下滚动到下图所示的需要指定的字段。完成修改后，点击**确定**以保存。

   {{< notice warning >}}

   在 `devops-jenkins` 部署 (Deployment) 中修改电子邮件服务器后，它会重新启动。因此，DevOps 系统将在几分钟内不可用，请在适当的时候进行此类修改。

   {{</ notice >}}

   ![设置电子邮件](/images/docs/v3.x/zh-cn/devops-user-guide/use-devops/set-email-server-for-kubesphere-pipelines/set-jenkins-email.png)

   | 环境变量名称      | 描述信息                  |
   | ----------------- | ------------------------- |
   | EMAIL\_SMTP\_HOST | SMTP 服务器地址           |
   | EMAIL\_SMTP\_PORT | SMTP 服务器端口（如：25） |
   | EMAIL\_FROM\_ADDR | 电子邮件发件人地址        |
   | EMAIL\_FROM\_NAME | 电子邮件发件人姓名        |
   | EMAIL\_FROM\_PASS | 电子邮件发件人密码        |
   | EMAIL\_USE\_SSL   | 是否启用 SSL 配置         |
