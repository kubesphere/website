---
title: 'KubeSphere 多租户与认证鉴权实践：使用 GitLab 账号登陆 KubeSphere'
tag: '认证鉴权, 多租户'
keywords: ' KubeSphere, GitLab, 多租户, 认证鉴权'
description: '本文介绍了如何使用 GitLab 账号登录 KubeSphere，是对 KubeSphere 多租户与认证鉴权功能的实践。'
createTime: '2022-01-11'
author: '李帅'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/gitlab-kubesphere.png'
---

## 介绍

KubeSphere 多租户是实际生产使用中非常需要的一个功能，该功能满足不同用户登陆 KubeSphere 平台的需求。比如开发，运维，测试都需要登陆 KubeSphere 平台，并且需要为不同身份的用户配置不同的权限。当公司内需要访问 KubeSphere 的用户比较多时，管理员再去手动为用户创建账号就不太灵活了。KubeSphere 包含一个内置的 OAuth 服务和帐户系统，用户通过获取 OAuth 访问令牌以对 API 进行身份验证，我们可以通过接入 LDAP 或者 OIDC 来提供身份认证信息。

### 多租户方案

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802131844011.png)

### 认证鉴权链路

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802133353633.png)

## 使用

假设集群内已经最小化安装 KubeSphere。我们这里使用 OIDC 身份提供者进行认证，通过 Dex 接入到 GitLab 中，使用 GitLab 中的用户完成认证。

### 安装 Dex

Dex 是一种身份认证服务，它使用 OpenID Connect 来驱动其他应用程序的身份验证。Dex 通过 “connectors” 充当其他身份提供商的门户。 Dex 可以将身份验证推到 LDAP 服务器、SAML 提供商或已建立的身份提供商（如 GitHub、Gitlab、Google 和 Active Directory等）。 客户端编写身份验证逻辑以与 Dex 交互认证，然后 Dex 通过 connector 转发到后端用户认证方进行认证，并返回给客户端 Oauth2 Token。与其相似的身份认证服务还有 Keycloak，auth0 等。

首先需要在 gitlab 上创建应用，在范围里勾选这几个 `read_user` `profile` `email` `openid`，创建后需要记住页面上的应用程序 id 和密码，后面会用得到。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802001203688.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802001203688.png)

```shell
#添加dex的helm仓库
root@i-tsfhx8p6:~/qke-k8s/dex# helm repo add dex https://charts.dexidp.io
"dex" has been added to your repositories
#下载dex的chart 文件到本地
root@i-tsfhx8p6:~/qke-k8s/dex# helm pull dex/dex
root@i-tsfhx8p6:~/qke-k8s/dex# ls
dex-0.5.0.tgz
root@i-tsfhx8p6:~/qke-k8s/dex# tar xf dex-0.5.0.tgz 
root@i-tsfhx8p6:~/qke-k8s/dex# ls
dex  dex-0.5.0.tgz
root@i-tsfhx8p6:~/qke-k8s/dex# ls dex
Chart.yaml  LICENSE  README.md  ci  templates  values.yaml

```

修改`values.yaml`文件

```yaml

replicaCount: 1

image:
  repository: dexidp/dex
  pullPolicy: IfNotPresent
  tag: "v2.29.0"

imagePullSecrets: []

nameOverride: ""

fullnameOverride: ""

hostAliases: []

https:
  # -- Enable the HTTPS endpoint.
  enabled: false

grpc:
  # -- Enable the gRPC endpoint.
  # Read more in the [documentation](https://dexidp.io/docs/api/).
  enabled: false

configSecret:
  # -- Enable creating a secret from the values passed to `config`.
  # If set to false, name must point to an existing secret.
  create: true

  # -- The name of the secret to mount as configuration in the pod.
  # If not set and create is true, a name is generated using the fullname template.
  # Must point to secret that contains at least a `config.yaml` key.
  name: ""

config: 
  issuer: https://dex-qke.lishuai.fun  #修改为你实际的地址
  storage: 
    type: kubernetes
    config:
      inCluster: true
  web:
    http: 0.0.0.0:5556
  telemetry:
    http: 0.0.0.0:5558
  expiry:
    signingKeys: "6h"
    idTokens: "24h"
  logger:
    level: debug
    format: json
  oauth2:
    responseTypes: ["code", "token", "id_token"]
    skipApprovalScreen: true
  connectors:
  - type: gitlab
    id: gitlab
    name: GitLab
    config:
      baseURL: https://gitlab.lishuai.fun  #修改为你实际的gitlab 地址 
      clientID: ca14d16e376b6f6634*********57378d1267e946e9d3e758e2f0     #修改为你gitlab 应用的clientid
      clientSecret: 15dcb3501becd17******1b82b05874e2ef893b7a0888fdaaa37885fd9387  #修改为你gitlab 应用的clientsecert
      redirectURI: https://dex-qke.lishuai.fun/callback  #修改为你实际的地址，格式为(dex issuer)/callback
      groups:
      - k8s-auth
      - k8s-auth/dashboard
      - k8s-auth/dashboard/show  ##gitlab项目组，只允许dashboard项目组成员访问
  staticClients:
  - id: dex-k8s-authenticator
    name: dex-k8s-authenticator
    secret: generatedLongRandomPhrase
    redirectURIs:
    - 'http://kubesphere.lishuai.fun/oauth/redirect/dex' #这个是kubesphere的回调地址，对于dex认证，格式为kubesphere_url/oauth/redirect/dex

volumes: []

volumeMounts: []

envFrom: []

env: {}

serviceAccount:
  # -- Enable service account creation.
  create: true

  # -- Annotations to be added to the service account.
  annotations: {}

  # -- The name of the service account to use.
  # If not set and create is true, a name is generated using the fullname template.
  name: "dex-sa"

rbac:
  create: true

podAnnotations: {}

podDisruptionBudget:
  enabled: false
  minAvailable:
  maxUnavailable:
priorityClassName: ""
podSecurityContext: {}
  # fsGroup: 2000

securityContext: {}
  # capabilities:
  #   drop:
  #   - ALL
  # readOnlyRootFilesystem: true
  # runAsNonRoot: true
  # runAsUser: 1000

service:
  annotations: {}
  type: ClusterIP

  ports:
    http:
      port: 5556
      nodePort:
    https:
      port: 5554
      nodePort:
    grpc:
      port: 5557
      nodePort:

ingress:
  enabled: true
  className: ""

  annotations: 
    kubernetes.io/ingress.class: nginx
    kubernetes.io/tls-acme: "true"
    cert-manager.io/cluster-issuer: tls  #集群内已经安装了cert-manager，通过cert-manager来进行证书签发

  hosts:
    - host: dex-qke.lishuai.fun
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: 
  - secretName: dex-tls
    hosts:
      - dex-qke.lishuai.fun

resources: {}
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80
  # targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity: {}

```

这里有几点需要注意：

- Gitlab 配置下的 groups 为项目组，需要根据实际情况填写，此处填写项目组的成员才会允许通过 Dex 进行身份认证
- 如果集群内没有安装 cert-manager，需要手动创建证书的 secert

执行如下命令进行安装。

```sh
root@i-tsfhx8p6:~/qke-k8s/dex# ls
dex  dex-0.5.0.tgz
#在当前目录执行
kubectl create ns dex 
kubectl -n dex install dex dex

root@i-tsfhx8p6:~/qke-k8s/dex# kubectl -n dex get pod 
NAME                                  READY   STATUS    RESTARTS   AGE
dex-d8c5cdfc-577gf                    1/1     Running   0          21h
```



### 配置 KubeSphere 

安装好 Dex 后需要修改 `cluster-configuration.yaml`。

```yaml
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: v3.1.1
spec:
  persistence:
    storageClass: "longhorn"        # If there is no default StorageClass in your cluster, you need to specify an existing StorageClass here.
  authentication:
    jwtSecret: ""
    authenticateRateLimiterMaxTries: 10
    authenticateRateLimiterDuration: 10m0s
    oauthOptions:
      accessTokenMaxAge: 1h
      accessTokenInactivityTimeout: 30m
      identityProviders:
      - name: dex
        type: OIDCIdentityProvider
        mappingMethod: auto
        provider:
          clientID: 'dex-k8s-authenticator'
          clientSecret: 'gener*******ongRandomPhrase'
          issuer: https://dex-qke.lishuai.fun
          redirectURL: http://kubesphere.lishuai.fun/oauth/redirect/dex
          scopes:
          - openid
          - email
......
```

参数释意：

- `authenticateRateLimiterMaxTries`: `authenticateLimiterDuration` 指定的期间内允许的最大连续登录失败次数。如果用户连续登录失败次数达到限制，则该用户将被封禁。
- `authenticateRateLimiterDuration`: 作用于 `authenticateRateLimiterMaxTries`。
- `loginHistoryRetentionPeriod`: 用户登录记录保留期限，过期条目将被自动删除。
- `maximumClockSkew`: 控制执行对时间敏感的操作（例如验证用户令牌的过期时间）时允许的最大时钟偏移，默认值为 10 秒。
- `multipleLogin`: 允许多个用户同时从不同位置登录，默认值为 `true`。
- `jwtSecret`: 签发用户令牌的密钥，最小长度为 32 个字符。[多集群环境需要注意的事项](https://kubesphere.com.cn/docs/multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster)。

`oauthOptions`: OAuth 设置

- `accessTokenMaxAge`: 访问令牌有效期。对于多集群环境中的成员集群，默认值为 `0h`，这意味着访问令牌永不过期。对于其他集群，默认值为 `2h`。
- `accessTokenInactivityTimeout`: 令牌空闲超时时间。该值表示令牌过期后，刷新用户令牌最大的间隔时间，如果不在此时间窗口内刷新用户身份令牌，用户将需要重新登录以获得访问权。
- identityProviders： 身份提供者设置
  - `name`: 身份提供者的名称。
  - `type`: 身份提供者的类型。
  - `mappingMethod`: 帐户映射方式. 值可以是 `auto` 或者 `lookup`。
  - 默认值为 `auto`, 通过第三方帐户登录时会自动创建关联帐户。
  - 如果值为 `lookup`, 你需要手动关联第三方帐户与KubeSphere帐户。
  - `provider`: Identity provider 配置，此部分中的字段根据身份提供的类型而异

provider:

- ​	clientID: OAuth2 客户端 ID
- ​	clientSecret:  OAuth2 客户端secert
- ​	issuer： dex的地址
- ​	redirectURL：重定向到 ks-console 的 URL ，注意这个地址要在dex里也配置



修改完后执行 `kubectl apply -f cluster-configuration.yaml` 。

也可以通过以下命令修改认证配置:

```
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

当修改上述配置后，需要等待配置生效，可以通过以下命令查看相关进度及日志：

```
 kubectl -n kubesphere-system logs -l app=ks-installer -f
```

重新应用后打开登录页面会发现登录页面多了`通过 dex 登陆`的按钮。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802172827663.png)

点击后会自动跳转到 Gitlab 进行认证，第一次登陆需要授权应用可以访问，这里要注意允许访问的 KubeSphere 的 Gitlab用户为 Dex 服务中定义的 Gitlab 项目组中的用户，实际中我们可以设置特定特定的项目组，将用户添加到项目组中来实现用户登陆的限制。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802173147353.png)

点击 `authorize` 允许后，KubeSphere 会让我们确认账户信息,此时需要合理修改用户名。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802173707924.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802173828610.png)

设定完成后，就可以进入 KubeSphere 了，此时该用户是没有任何访问权限的，还需要管理员对该用户进行授权才能正常进行使用，希望后期 KubeSphere 可以支持在用户登陆前可以对用户组进行授权，或者预先通过邮箱对用户进行收钱，避免用户登陆后，管理员还需要手动去创建权限。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-20210802231454038.png)
