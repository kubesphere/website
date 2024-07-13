---
title: "在 KubeSphere 中部署 Harbor"
keywords: 'Kubernetes, KubeSphere, Harbor, 应用商店'
description: '了解如何从 KubeSphere 应用商店中部署 Harbor 并访问服务。'
linkTitle: "在 KubeSphere 中部署 Harbor"
weight: 14220
version: "v3.4"
---
[Harbor](https://goharbor.io/) 是一个开源仓库，通过各种策略和基于角色的访问控制来保护制品，确保镜像经过扫描且没有漏洞，并对镜像签名使其受信。

本教程演示如何从 KubeSphere 应用商店部署 [Harbor](https://goharbor.io/)。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 Harbor

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

2. 找到 Harbor，点击**应用信息**页面上的**安装**。

3. 设置名称并选择应用版本。请确保将 Harbor 部署在 `demo-project` 中，点击**下一步**。

4. 在**应用设置**页面，编辑 Harbor 的配置文件，请注意以下字段。

   `type`：访问 Harbor 服务的方式。本示例使用 `nodePort`。

   `tls`：指定是否启用 HTTPS。多数情况下设置为 `false`。

   `externalURL`：暴露给租户的 URL。

   {{< notice note >}}

   - 请指定 `externalURL`，如果您访问 Harbor 有问题，该字段会对解决问题非常有用。

   - 请确保在本教程中使用 HTTP 协议和其对应的 `nodePort`。有关更多信息，请参见常见问题中的[示例配置](#常见问题)。

   {{</ notice >}} 

   配置编辑完成后，点击**安装**继续。

5. 稍等片刻待 Harbor 启动并运行。


### 步骤 2：访问 Harbor

1. 基于配置文件中 `expose.type` 字段的设置，访问方式可能会不同。本示例使用 `nodePort` 访问 Harbor，按照先前步骤中的设置，访问 `http://nodeIP:30002`。

   ![登录 Harbor](/images/docs/v3.x/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/harbor-login-7.PNG)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 

2. 使用默认帐户和密码 (`admin/Harbor12345`) 登录 Harbor。密码由配置文件中的 `harborAdminPassword` 字段定义。

   ![Harbor 仪表板](/images/docs/v3.x/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/harbor-dashboard-8.jpg)

## 常见问题

1. 如何启用 HTTP 登录？

   在步骤 1 中将 `tls.enabled` 设置为 `false`。`externalURL` 的协议必须和 `expose.nodePort.ports` 相同。

   如果您使用 Docker 登录，请在 `daemon.json` 中将 `externalURL` 设置为 `insecure-registries` 其中之一，然后重新加载 Docker。

   下面是示例配置文件，供您参考。请注意阅读注解。

   ```yaml
   ## 请注意，192.168.0.9 是示例 IP 地址，您必须使用自己的地址。 
   expose:
     type: nodePort
     tls:
       enabled: false
       secretName: ""
       notarySecretName: ""
       commonName: "192.168.0.9"  # 将 commonName 更改成您自己的值。
     nodePort:
       # NodePort 服务的名称。
       name: harbor
       ports:
         http:
           # 使用 HTTP 服务时，Harbor 监听的服务端口。
           port: 80
           # 使用 HTTP 服务时，Harbor 监听的节点端口。
           nodePort: 30002
         https:
           # 使用 HTTPS 服务时，Harbor 监听的服务端口。
           port: 443
           # 使用 HTTPS 服务时，Harbor 监听的服务端口。
           nodePort: 30003
         # 仅在 notary.enabled 设置为 true 时需要此配置。
         notary:
           # Notary 监听的服务端口。
           port: 4443
           # Notary 监听的节点端口。
           nodePort: 30004
   
   externalURL: http://192.168.0.9:30002 # 使用您自己的 IP 地址。
   
   # Harbor admin 的初始密码。启动 Harbor 后可以通过主页修改。
   harborAdminPassword: "Harbor12345"
   # 用于加密的密钥，必须是包含 16 个字符的字符串。
   secretKey: "not-a-secure-key"
   ```

2. 如何启用 HTTPS 登录？

    a. 使用自签名证书。
      * 在步骤 1 中将配置文件中的 `tls.enabled` 设置为 `true`，并对应编辑 `externalURL`。
      * 将 Pod `harbor-core` 的 `/etc/core/ca` 中存储的自签名证书复制到您的主机。
      * 先在您的主机中信任该自签名证书，然后重启 Docker。

    b. 使用公共 SSL。
      * 将证书添加为密钥 (Secret)。
      * 在步骤 1 中将配置文件中的 `tls.enabled` 设置为 `true`，并对应编辑 `externalURL`。
      * 编辑 `tls.secretName`。

有关更多信息，请参见 [Harbor 文档](https://goharbor.io/docs/2.1.0/)。
