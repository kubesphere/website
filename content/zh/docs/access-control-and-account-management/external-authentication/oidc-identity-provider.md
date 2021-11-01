---
title: "OIDC身份提供者"
keywords: "OIDC, 身份提供者"
description: "如何使用外部 OIDC 身份提供者。"

linkTitle: "OIDC身份提供者"
weight: 12221
---

## OIDC 身份提供者

[OpenID Connect](https://openid.net/connect/) 是一种基于 OAuth 2.0 系列规范的可互操作的身份认证协议。使用简单的 REST/JSON 消息流，其设计目标是 “让简单的事情变得简单，让复杂的事情成为可能” 。与之前的任何身份认证协议（例如 Keycloak、Okta、Dex、Auth0、Gluu 等）相比，开发人员集成起来非常容易。



*使用 [Google Identity Platform](https://developers.google.com/identity/protocols/oauth2/openid-connect) 的示例*：

```yaml
apiVersion: v1
data:
  kubesphere.yaml: |
    authentication:
      authenticateRateLimiterMaxTries: 10
      authenticateRateLimiterDuration: 10m0s
      jwtSecret: "********"
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
kind: ConfigMap
name: kubesphere-config
namespace: kubesphere-system
```

字段描述如下：

| 参数 | 描述 |
| ----------| ----------- |
| clientID | 客户端 ID。 |
| clientSecret | 客户端密码。 |
| redirectURL | 重定向到 ks-console 的 URL。 |
| issuer | 定义客户端如何动态发现有关 OpenID 提供者的信息。 |
| preferredUsernameKey | 可配置的密钥，包含首选用户声明。 |
| emailKey | 可配置的密钥，包含电子邮件声明。 |
| getUserInfo | 使用 userinfo 端点获取令牌的附加声明。非常适用于上游返回 “thin” id令牌的场景。 |
| insecureSkipVerify | 关闭 TLS 证书验证。 |