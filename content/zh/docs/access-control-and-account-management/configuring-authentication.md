---
title: "认证配置"
keywords: "LDAP, identity provider"
description: "How to configure authentication"

linkTitle: "认证配置"
weight: 12200
---

KubeSphere 包含一个内置的 OAuth 服务和帐户系统。用户通过获取 OAuth 访问令牌以对 API 进行身份验证。

## 认证配置

作为管理员，您可以通过以下命令修改认证配置:


```bash
kubectl -n kubesphere-system edit cc ks-installer
```

*配置示例*:

```yaml
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
spec:
  authentication:
    jwtSecret: ********************************
    authenticateRateLimiterMaxTries: 10
    authenticateRateLimiterDuration: 10m
    oauthOptions:
      accessTokenInactivityTimeout: 30m
      accessTokenMaxAge: 1h
      identityProviders:
      - mappingMethod: auto
        name: github
        type: GitHubIdentityProvider
        provider:
...
```

参数释意：

* `authenticateRateLimiterMaxTries`: `authenticateLimiterDuration`指定的期间内允许的最大连续登录失败次数。如果用户连续登录失败次数达到限制，则该用户将被封禁。 

* `authenticateRateLimiterDuration`: 作用于 `authenticateRateLimiterMaxTries`。

* `loginHistoryRetentionPeriod`: 用户登录记录保留期限，过期条目将被自动删除。 

* `maximumClockSkew`: 控制执行对时间敏感的操作（例如验证用户令牌的过期时间）时允许的最大时钟偏移，默认值为10秒。

* `multipleLogin`: 允许多个用户同时从不同位置登录，默认值为 `true`。

* `jwtSecret`: 签发用户令牌的密钥，最小长度为32个字符。[多集群环境需要注意的事项](../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster)。

`oauthOptions`: OAuth settings
  * `accessTokenMaxAge`: 访问令牌有效期。对于多集群环境中的成员集群，默认值为 `0h`，这意味着访问令牌永不过期。对于其他集群，默认值为 `2h`。
  * `accessTokenInactivityTimeout`: 令牌空闲超时时间。该值表示令牌过期后，刷新用户令牌最大的间隔时间，如果不在此时间窗口内刷新用户身份令牌，用户将需要重新登录以获得访问权。
  * `identityProviders`: Identity providers
    * `name`: 身份提供者的名称。
    * `type`: 身份提供者的类型。
    * `mappingMethod`: 帐户映射方式. 值可以是 `auto` 或者 `lookup`。
     * 默认值为 `auto`, 通过第三方帐户登录时会自动创建关联帐户。
     * 如果值为 `lookup`, 你需要手动关联第三方帐户与KubeSphere帐户。
    * `provider`: Identity provider 配置，此部分中的字段根据身份提供的类型而异。

当您修改上述配置后，需要等待配置生效，可以通过以下命令查看相关进度及日志：

```bash
 kubectl -n kubesphere-system logs -l app=ks-installer -f
```

如果 `mappingMethod` 设置为 `lookup`, 可以通过以下命令进行帐户关联。 如果 `mappingMethod` 是 `auto` 你可以跳过这个部分。

   ```bash
   kubectl edit user <KubeSphere username>
   ```
   
   ```yaml
   labels:
     iam.kubesphere.io/identify-provider: <Identity provider name>
     iam.kubesphere.io/origin-uid: <Third-party username>
   ```

## 身份提供者

您可以在 `identityProviders` 部分中配置多个身份提供者（IdentityProvider, IdP）。身份提供者会对用户进行认证，并向 KubeSphere 提供身份令牌。

KubeSphere 默认提供了以下几种类型的身份提供者：

* [LDAPIdentityProvider](../ldap-identity-provider)

* [OIDCIdentityProvider]()

* [GitHubIdentityProvider]()

* [CASIdentityProvider]()

* [AliyunIDaaSProvider]()

您也可以拓展 KubeSphere OAuth2 认证插件与您的帐户系统进行集成。
