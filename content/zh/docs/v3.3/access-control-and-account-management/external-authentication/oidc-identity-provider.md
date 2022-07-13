---
title: "OIDC 身份提供者"
keywords: "OIDC, 身份提供者"
description: "如何使用外部 OIDC 身份提供者。"

linkTitle: "OIDC 身份提供者"
weight: 12221
---

## OIDC 身份提供者

[OpenID Connect](https://openid.net/connect/) 是一种基于 OAuth 2.0 系列规范的可互操作的身份认证协议。使用简单的 REST/JSON 消息流，其设计目标是“让简单的事情变得简单，让复杂的事情成为可能”。与之前的任何身份认证协议（例如 Keycloak、Okta、Dex、Auth0、Gluu、Casdoor 等）相比，开发人员集成起来非常容易。

## 准备工作

您需要部署一个 Kubernetes 集群，并在集群中安装 KubeSphere。有关详细信息，请参阅[在 Linux 上安装](../../../installing-on-linux/)和[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。

## 步骤

1. 以 `admin` 身份登录 KubeSphere，将光标移动到右下角 <img src="/images/docs/v3.3/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px" alt="icon"> ，点击 **kubectl**，然后执行以下命令来编辑 CRD `ClusterConfiguration` 中的 `ks-installer`：

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```

2. 在 `spec.authentication.jwtSecret` 字段下添加以下字段。

   *使用 [Google Identity Platform](https://developers.google.com/identity/protocols/oauth2/openid-connect) 的示例*：

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
         - name: google
           type: OIDCIdentityProvider
           mappingMethod: auto
           provider:
             clientID: '********'
             clientSecret: '********'
             issuer: https://accounts.google.com
             redirectURL:  'https://ks-console/oauth/redirect/google'
   ```

   字段描述如下：

   | 参数                 | 描述                                                         |
   | -------------------- | ------------------------------------------------------------ |
   | clientID             | 客户端 ID。                                                  |
   | clientSecret         | 客户端密码。                                                 |
   | redirectURL          | 重定向到 ks-console 的 URL，格式为：`https://<域名>/oauth/redirect/<身份提供者名称>`。URL 中的 `<身份提供者名称>` 对应 `oauthOptions:identityProviders:name` 的值。 |
   | issuer               | 定义客户端如何动态发现有关 OpenID 提供者的信息。             |
   | preferredUsernameKey | 可配置的密钥，包含首选用户声明。此参数为可选参数。           |
   | emailKey             | 可配置的密钥，包含电子邮件声明。此参数为可选参数。           |
   | getUserInfo          | 使用 userinfo 端点获取令牌的附加声明。非常适用于上游返回 “thin” ID 令牌的场景。此参数为可选参数。 |
   | insecureSkipVerify   | 关闭 TLS 证书验证。                                          |



