---
title: "在 KubeSphere 中部署 Harbor"
keywords: 'Kubernetes, KubeSphere, Harbor, 应用商店'
description: '如何在 KubeSphere 中通过应用商店部署 Harbor'
linkTitle: "在 KubeSphere 中部署 Harbor"
weight: 14220
---
[Harbor](https://goharbor.io/) 是一个开源仓库，通过各种策略和基于角色的访问控制来保护制品，确保镜像经过扫描且没有漏洞，并将镜像标记为可信。

本教程演示如何从 KubeSphere 应用商店部署 [Harbor](https://goharbor.io/)。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户帐户 (`project-regular`) 供本教程操作使用。该帐户需要是平台普通用户，并邀请至项目中赋予 `operator` 角色作为项目操作员。本教程中，请以 `project-regular` 身份登录控制台，在企业空间 `demo-workspace` 中的 `demo-project` 项目中进行操作。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：从应用商店中部署 Harbor

1. 在 `demo-project` 项目的**概览**页面，点击左上角的**应用商店**。

   ![应用商店](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/app-store.PNG)

2. 找到 Harbor，点击**应用信息**页面上的**部署**。

   ![寻找 Harbor](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/find-harbor.PNG)

   ![点击部署](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/click-deploy.PNG)

3. 设置名称并选择应用版本。请确保将 Harbor 部署在 `demo-project` 中，点击**下一步**。

   ![部署 Harbor](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/deploy-harbor.PNG)

4. 在**应用配置**页面，编辑 Harbor 的配置文件，请注意以下字段。

   `type`：访问 Harbor 服务的方式。本示例使用 `nodePort`。

   `tls`：指定是否启用 HTTPS。多数情况下设置为 `false`。

   `externalURL`：暴露给租户的 URL。

   ![配置 Harbor](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/harbor-config.PNG)

   {{< notice note >}}

   - 请指定 `externalURL`，如果您访问 Harbor 有问题，该字段会对解决问题非常有用。

   - 有关更多信息，请参见常见问题中的[示例配置](#常见问题)。

   {{</ notice >}} 

   配置编辑完成后，点击**部署**继续。

5. 稍等片刻待 Harbor 启动并运行。

   ![创建 Harbor](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/creating-harbor.PNG)

### 步骤 2：访问 Harbor

1. 基于配置文件中 `expose.type` 字段的设置，访问方式可能会不同。本示例使用 `nodePort` 访问 Harbor，按照先前步骤中的设置，访问 `http://nodeIP:30002`。

   ![登录 Harbor](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/harbor-login.PNG)

   {{< notice note >}}

   您可能需要在安全组中打开该端口，并根据您的 Kubernetes 集群部署位置来配置相关端口转发规则。

   {{</ notice >}} 

2. 使用默认帐户和密码 (`admin/Harbor12345`) 登录 Harbor。密码由配置文件中的 `harborAdminPassword` 字段定义。

   ![Harbor 仪表板](/images/docs/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/harbor-dashboard.jpg)

## 常见问题

1. 如何启用 HTTP 登录？

   在步骤 1 中将 `tls.enabled` 设置为 `false`。`externalURL` 的协议必须和 `expose.type.ports` 相同。

   如果您使用 Docker 登录，请在 `daemon.json` 中将 `externalURL` 设置为 `insecure-registries` 其中之一，然后重新加载 Docker。

   下面是示例配置文件，供您参考。请注意阅读注解。

   ```yaml
   ## NOTICE 192.168.0.9 is the example IP address and you must use your own.
   expose:
     type: nodePort
     tls:
       enabled: false
       secretName: ""
       notarySecretName: ""
       commonName: "192.168.0.9"  # Change commonName to your own.
     nodePort:
       # The name of NodePort service
       name: harbor
       ports:
         http:
           # The service port Harbor listens on when serving with HTTP
           port: 80
           # The node port Harbor listens on when serving with HTTP
           nodePort: 30002
         https:
           # The service port Harbor listens on when serving with HTTPS
           port: 443
           # The node port Harbor listens on when serving with HTTPS
           nodePort: 30003
         # Only needed when notary.enabled is set to true
         notary:
           # The service port Notary listens on
           port: 4443
           # The node port Notary listens on
           nodePort: 30004
   
   externalURL: http://192.168.0.9:30002 # Use your own IP address.
   
   # The initial password of Harbor admin. Change it from portal after launching Harbor
   harborAdminPassword: "Harbor12345"
   # The secret key used for encryption. Must be a string of 16 chars.
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