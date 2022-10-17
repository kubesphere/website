---
title: "CAS 身份提供者"
keywords: "CAS, 身份提供者"
description: "如何使用外部 CAS 身份提供者。"

linkTitle: "CAS 身份提供者"
weight: 12223
---

## CAS 身份提供者

CAS (Central Authentication Service)  是耶鲁 Yale 大学发起的一个java开源项目，旨在为 Web应用系统提供一种可靠的 单点登录 解决方案（ Web SSO ）， CAS 具有以下特点：

- 开源的企业级单点登录解决方案
- CAS Server 为需要独立部署的 Web 应用----一个独立的Web应用程序(cas.war)。
- CAS Client 支持非常多的客户端 ( 指单点登录系统中的各个 Web 应用 ) ，包括 Java, .Net, PHP, Perl, 等。


## 准备工作

您需要部署一个 Kubernetes 集群，并在集群中安装 KubeSphere。有关详细信息，请参阅[在 Linux 上安装](../../../installing-on-linux/)和[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。

## 步骤

1. 以 `admin` 身份登录 KubeSphere，将光标移动到右下角 <img src="/images/docs/v3.3/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px" alt="icon"> ，点击 **kubectl**，然后执行以下命令来编辑 CRD `ClusterConfiguration` 中的 `ks-installer`：

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```

2. 在 `spec.authentication.jwtSecret` 字段下添加以下字段。

   ```yaml
   spec:
     authentication:
       jwtSecret: ''
       authenticateRateLimiterMaxTries: 10
       authenticateRateLimiterDuration: 10m0s
       oauthOptions:
         accessTokenMaxAge: 1h
         accessTokenInactivityTimeout: 30m
         identityProviders:
         - name: cas
           type: CASIdentityProvider
           mappingMethod: auto
           provider:
             redirectURL: "https://ks-console:30880/oauth/redirect/cas"
             casServerURL: "https://cas.example.org/cas"
             insecureSkipVerify: true
   ```

   字段描述如下：

   | 参数                 | 描述                                                         |
   | -------------------- | ------------------------------------------------------------ |
   | redirectURL          | 重定向到 ks-console 的 URL，格式为：`https://<域名>/oauth/redirect/<身份提供者名称>`。URL 中的 `<身份提供者名称>` 对应 `oauthOptions:identityProviders:name` 的值。 |
   | casServerURL         | 定义cas 认证的url 地址                                       |
   | insecureSkipVerify   | 关闭 TLS 证书验证。                                          |



