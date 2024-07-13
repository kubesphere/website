---
title: "OAuth 2.0身份提供者"
keywords: 'Kubernetes, KubeSphere, OAuth2, Identity Provider'
description: '如何使用外部 OAuth2 身份提供者。'
linkTitle: "OAuth 2.0身份提供者"
weight: 12230
version: "v3.3"
---

本文档介绍了如何使用基于 OAuth 2.0 协议的外部身份提供者。

下图显示了 KubeSphere 与外部 OAuth 2.0 身份提供者之间的身份验证过程。

![oauth2](/images/docs/v3.x/access-control-and-account-management/external-authentication/use-an-oauth2-identity-provider/oauth2.svg)

## 准备工作

您需要部署一个 Kubernetes 集群，并在集群中安装 KubeSphere。有关详细信息，请参阅[在 Linux 上安装](../../../installing-on-linux/)和[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。

## 开发 OAuth 2.0 插件

{{< notice note >}}

KubeSphere 提供了两个内置的 OAuth 2.0 插件：GitHub 的 [GitHubIdentityProvider](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/github/github.go) 和阿里云IDaaS的 [AliyunIDaasProvider](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/github/github.go) ，可以根据内置的插件开发其他插件。

{{</ notice >}}

1. 在本地克隆 [KubeSphere](https://github.com/kubesphere/kubesphere) ，进入本地 KubeSphere 仓库，并在 `/pkg/apiserver/authentication/identityprovider/` 目录下创建一个插件的包。

2. 在插件包中，实现如下接口：

   ```go
   // /pkg/apiserver/authentication/identityprovider/oauth_provider.go
   type OAuthProvider interface {
   	// Exchange identity with a remote server.
   	IdentityExchange(code string) (Identity, error)
   }
   
   type OAuthProviderFactory interface {
   	// Return the identity provider type.
   	Type() string
   	// Apply settings from kubesphere-config.
   	Create(options oauth.DynamicOptions) (OAuthProvider, error)
   }
   ```

   ```go
   // /pkg/apiserver/authentication/identityprovider/identity_provider.go
   type Identity interface {
     // (Mandatory) Return the identifier of the user at the identity provider.
   	GetUserID() string
     // (Optional) Return the name of the user to be referred as on KubeSphere.
   	GetUsername() string
     // (Optional) Return the email address of the user.
   	GetEmail() string
   }
   ```

3. 在插件包的 `init()` 函数中注册插件。

   ```go
   // Custom plugin package
   func init() {
     // Change <StructName> to the actual name of the struct that
     // implements the OAuthProviderFactory interface.
   	identityprovider.RegisterOAuthProvider(&<StructName>{})
   }
   ```

4. 在 `/pkg/apiserver/authentication/options/authenticate_options.go` 中导入插件包。

   ```go
   // Change <CustomPackage> to the actual name of your plugin package.
   import (
   	...
   	_ "kubesphere.io/kubesphere/pkg/apiserver/authentication/identityprovider/<CustomPackage>"
   	...
   	)
   ```

5. [构建 ks-apiserver 镜像](https://github.com/kubesphere/community/blob/104bab42f67094930f2ca87c603b7c6365cd092a/developer-guide/development/quickstart.md) 并部署到您的集群中。

## 集成身份提供者 

1. 以 `admin` 身份登录 KubeSphere，将光标移动到右下角 <img src="/images/docs/v3.x/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px" alt="icon"> ，点击 **kubectl**，然后执行以下命令来编辑 CRD `ClusterConfiguration` 中的 `ks-installer`：

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```

2. 在 `spec:authentication` 部分配置的 `oauthOptions:identityProviders` 以外的字段信息请参阅[设置外部身份认证](../set-up-external-authentication/)。

3. 根据开发的身份提供者插件来配置 `oauthOptions:identityProviders` 中的字段。

   以下是使用 GitHub 作为外部身份提供者的配置示例。详情请参阅 [GitHub 官方文档](https://docs.github.com/en/developers/apps/building-oauth-apps)和 [GitHubIdentityProvider 源代码](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/github/github.go) 。

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
         - name: github
           type: GitHubIdentityProvider
           mappingMethod: auto
           provider:
             clientID: '******'
             clientSecret: '******'
             redirectURL: 'https://ks-console/oauth/redirect/github'
   ```
   
   同样，您也可以使用阿里云 IDaaS 作为外部身份提供者。详情请参阅[阿里云 IDaaS 文档](https://www.alibabacloud.com/help/product/111120.htm?spm=a3c0i.14898238.2766395700.1.62081da1NlxYV0)和 [AliyunIDaasProvider 源代码](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/aliyunidaas/idaas.go)。

4. 字段配置完成后，保存修改，然后等待 ks-installer 完成重启。

   {{< notice note >}}
   
   KubeSphere Web 控制台在 ks-installer 重新启动期间不可用。请等待重启完成。

   {{</ notice >}}

5. 进入 KubeSphere 登录界面，点击 **Log In with XXX** （例如，**Log In with GitHub**）。

6. 在外部身份提供者的登录界面，输入身份提供者配置的用户名和密码，登录 KubeSphere 。

   ![github-login-page](/images/docs/v3.x/access-control-and-account-management/external-authentication/use-an-oauth2-identity-provider/github-login-page.png)

