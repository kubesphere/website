---
title: "设置外部身份验证"
keywords: "LDAP, 外部, 第三方, 身份验证"
description: "如何在 KubeSphere 上设置外部身份验证。"

linkTitle: "设置外部身份验证"
weight: 12210
---

本文档描述了如何在 KubeSphere 上使用外部身份提供者，例如 LDAP 服务或 Active Directory 服务。

KubeSphere 提供了一个内置的 OAuth 服务。用户通过获取 OAuth 访问令牌以对 API 进行身份验证。作为 KubeSphere 管理员，您可以编辑 CRD `ClusterConfiguration` 中的 `ks-installer` 来配置 OAuth 并指定身份提供者。

## 准备工作

您需要部署一个 Kubernetes 集群，并在集群中安装 KubeSphere。有关详细信息，请参阅[在 Linux 上安装](../../../installing-on-linux/)和[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。


## 步骤

1. 以 `admin` 身份登录 KubeSphere，将光标移动到右下角 <img src="/images/docs/v3.3/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px" alt="icon"> ，点击 **kubectl**，然后执行以下命令来编辑 CRD `ClusterConfiguration` 中的 `ks-installer`：

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```

2. 在 `spec.authentication.jwtSecret` 字段下添加以下字段。

   示例:

   ```yaml
   spec:
     authentication:
       jwtSecret: ''
       authenticateRateLimiterMaxTries: 10
       authenticateRateLimiterDuration: 10m0s
       loginHistoryRetentionPeriod: 168h
       maximumClockSkew: 10s
       multipleLogin: true
       oauthOptions:
         accessTokenMaxAge: 1h
         accessTokenInactivityTimeout: 30m
         identityProviders:
         - name: LDAP
           type: LDAPIdentityProvider
           mappingMethod: auto
           provider:
             host: 192.168.0.2:389
             managerDN: uid=root,cn=users,dc=nas
             managerPassword: ********
             userSearchBase: cn=users,dc=nas
             loginAttribute: uid
             mailAttribute: mail
   ```
   
    字段描述如下：

    * `jwtSecret`：签发用户令牌的密钥。在多集群环境下，所有的集群必须[使用相同的密钥](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster)。
    * `authenticateRateLimiterMaxTries`：`authenticateLimiterDuration` 指定的期间内允许的最大连续登录失败次数。如果用户连续登录失败次数达到限制，则该用户将被封禁。 
    * `authenticateRateLimiterDuration`：`authenticateRateLimiterMaxTries` 适用的时间段。
    * `loginHistoryRetentionPeriod`：用户登录记录保留期限，过期的登录记录将被自动删除。 
    * `maximumClockSkew`：时间敏感操作（例如验证用户令牌的过期时间）的最大时钟偏差，默认值为10秒。
    * `multipleLogin`：是否允许多个用户同时从不同位置登录，默认值为 `true`。
    * `oauthOptions`：
      * `accessTokenMaxAge`：访问令牌有效期。对于多集群环境中的成员集群，默认值为 `0h`，这意味着访问令牌永不过期。对于其他集群，默认值为 `2h`。
      * `accessTokenInactivityTimeout`：令牌空闲超时时间。该值表示令牌过期后，刷新用户令牌最大的间隔时间，如果不在此时间窗口内刷新用户身份令牌，用户将需要重新登录以获得访问权。
      * `identityProviders`：
        * `name`：身份提供者的名称。
        * `type`：身份提供者的类型。
        * `mappingMethod`：帐户映射方式，值可以是 `auto` 或者 `lookup`。
         * 如果值为 `auto`（默认），需要指定新的用户名。通过第三方帐户登录时，KubeSphere 会根据用户名自动创建关联帐户。
         * 如果值为 `lookup`，需要执行步骤 3 以手动关联第三方帐户与 KubeSphere 帐户。
        * `provider`：身份提供者信息。此部分中的字段根据身份提供者的类型而异。
   
3. 如果 `mappingMethod` 设置为 `lookup`，可以运行以下命令并添加标签来进行帐户关联。如果 `mappingMethod` 是 `auto` 可以跳过这个部分。

   ```bash
   kubectl edit user <KubeSphere username>
   ```

    ```yaml
   labels:
     iam.kubesphere.io/identify-provider: <Identity provider name>
     iam.kubesphere.io/origin-uid: <Third-party username>
    ```

4. 字段配置完成后，保存修改，然后等待 ks-installer 重启完成。

   {{< notice note >}}
   
   多集群环境中，只需要在主集群中进行配置。
   
   {{</ notice >}}


## 身份提供者

您可以在 `identityProviders` 部分中配置多个身份提供者（IdPs）。身份提供者会对用户进行认证，并向 KubeSphere 提供身份令牌。

KubeSphere 默认提供了以下几种类型的身份提供者：

* [LDAP Identity Provider](../use-an-ldap-service)

* [OIDC Identity Provider](../oidc-identity-provider)

* GitHub Identity Provider

* CAS Identity Provider

* Aliyun IDaaS Provider

您也可以拓展 KubeSphere [OAuth2 认证插件](../use-an-oauth2-identity-provider) 与您的帐户系统进行集成。
