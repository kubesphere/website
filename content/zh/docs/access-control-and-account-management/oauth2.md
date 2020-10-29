---
title: "OAuth2 Identity Provider"
keywords: 'kubernetes, kubesphere, OAuth2, Identity Provider'
description: 'OAuth2 Identity Provider'

weight: 2240
---

## 概览

KubeSphere 可以通过标准的 OAuth2 协议对接外部的 OAuth2 Provider，通过外部 OAuth2 Server 完成账户认证后可以关联登录到 KubeSphere。
完整的认证流程如下：

![oauth2](/images/docs/access-control-and-account-management/oauth2.svg)

## GitHubIdentityProvider

KubeSphere 默认提供了 GitHubIdentityProvider 做为 OAuth2 认证插件的开发示例，配置及使用方式如下:

### 参数配置

IdentityProvider 的参数通过 kubesphere-system 项目下 kubesphere-config 这个 ConfigMap 进行配置

通过 `kubectl -n kubesphere-system edit cm kubesphere-config` 进行编辑，配置示例:

```yaml
apiVersion: v1
data:
  kubesphere.yaml: |
    authentication:
      authenticateRateLimiterMaxTries: 10
      authenticateRateLimiterDuration: 10m0s
      loginHistoryRetentionPeriod: 7d
      maximumClockSkew: 10s
      multipleLogin: true
      kubectlImage: kubesphere/kubectl:v1.0.0
      jwtSecret: "jwt secret"
      oauthOptions:
        accessTokenMaxAge: 1h
        accessTokenInactivityTimeout: 30m
        identityProviders:
        - name: github
          type: GitHubIdentityProvider
          mappingMethod: mixed
          provider:
            clientID: 'Iv1.547165ce1cf2f590'
            clientSecret: 'c53e80ab92d48ab12f4e7f1f6976d1bdc996e0d7'
            endpoint:
              authURL: 'https://github.com/login/oauth/authorize'
              tokenURL: 'https://github.com/login/oauth/access_token'
            redirectURL: 'https://ks-console/oauth/redirect'
            scopes:
            - user
    ...
```

在 `authentication.oauthOptions.identityProviders` 下增加 GitHubIdentityProvider 的配置块，参数示意:

| 字段 | 说明 |
|-----------|-------------|
| name | IdentityProvider 的唯一名称 |
| type | IdentityProvider 插件的类型，GitHubIdentityProvider 是一种默认实现的类型 |
| mappingMethod | 账户关联配置，详细说明: https://github.com/kubesphere/kubesphere/blob/master/pkg/apiserver/authentication/oauth/oauth_options.go#L37-L44 |
| clientID | OAuth2 client ID |
| clientSecret | OAuth2 client secret |
| authURL | OAuth2 endpoint |
| tokenURL | OAuth2 endpoint |
| redirectURL | 重定向到 ks-console 的跳转路径`https://ks-console/oauth/redirect` |

重启 ks-apiserver 以更新配置: `kubectl -n kubesphere-system rollout restart deploy ks-apiserver`，重启完成后打开前端页面可以看到通过 `通过 github 登录` 按钮

![github](/images/docs/access-control-and-account-management/github1.png)

### 通过 Github 账户登录 KubeSphere

![github](/images/docs/access-control-and-account-management/github2.png)
![github](/images/docs/access-control-and-account-management/github3.png)
![github](/images/docs/access-control-and-account-management/github4.png)

账户登录到 KubeSphere 之后就可以被添加、邀请到启用空间中[参与项目协同](https://kubesphere.io/docs/workspaces-administration/role-and-member-management) 。

## OAuth2 插件开发

OAuth2 作为一个开放协议，解决了 API 认证授权的问题，进行账户接入还需要对用户信息接口和字段进行适配，您可以参照 [GitHubIdentityProvider](https://github.com/kubesphere/kubesphere/blob/master/pkg/apiserver/authentication/identityprovider/github/github.go) 、 [AliyunIDaasProvider](https://github.com/kubesphere/kubesphere/blob/master/pkg/apiserver/authentication/identityprovider/aliyunidaas/idaas.go) 这两个插件进行开发，以接入您私有的账户体系。

插件开发流程:

### 实现 `OAuthProvider` 接口

```go
type OAuthProvider interface {
	Type() string
	Setup(options *oauth.DynamicOptions) (OAuthProvider, error)
	IdentityExchange(code string) (Identity, error)
}
```

插件通过 kubesphere-config 中 `authentication.oauthOptions.identityProviders` 部分进行配置，其中 provider 是动态配置， 也就是插件中的 `*oauth.DynamicOptions`。

### 插件注册

注册插件

`pkg/apiserver/authentication/identityprovider/github/github.go`

```go
func init() {
	identityprovider.RegisterOAuthProvider(&Github{})
}
```

启用插件

`/pkg/apiserver/authentication/options/authenticate_options.go` 

```go
import (
	"fmt"
	"github.com/spf13/pflag"
	_ "kubesphere.io/kubesphere/pkg/apiserver/authentication/identityprovider/aliyunidaas"
	_ "kubesphere.io/kubesphere/pkg/apiserver/authentication/identityprovider/github"
	"kubesphere.io/kubesphere/pkg/apiserver/authentication/oauth"
	"time"
)
```

### 构建镜像

[构建 ks-apiserver 的镜像](https://github.com/kubesphere/community/blob/104bab42f67094930f2ca87c603b7c6365cd092a/developer-guide/development/quickstart.md) 后部署到您的集群中，参照 GitHubIdentityProvider 的使用流程启用您新开发的插件。
