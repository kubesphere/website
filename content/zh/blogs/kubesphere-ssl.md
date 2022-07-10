---
title: 'Kubernetes Ingress 配置泛域名 TLS 证书'
tag: 'KubeSphere'
keywords: 'KubeSphere, Kubernetes, SSL'
description: "本文记录了利用 let's encrytp 泛域名证书实现 Kubernetes 集群外部服务自动证书配置和证书到期自动更新，支持 HTTPS 访问。"
createTime: '2022-07-07'
author: 'scwang18'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-ssl-cover.png'
---

> 作者：scwang18，主要负责技术架构，在容器云方向颇有研究。

## 前言

KubeSphere 集群默认安装的证书是自签发证书，浏览器访问访问会发出安全提醒。本文记录了利用 `let's encrytp` 泛域名证书实现 Kubernetes 集群外部服务自动证书配置和证书到期自动更新，支持 HTTPS 访问。我们还部署了证书自动分发组件，实现证书文件自动分发到其他 namespace 。

## 架构
在 KubeSphere 集群中使用 HTTPS 协议，需要一个证书管理器、一个证书自动签发服务。

cert-manager 是一个云原生证书管理开源项目，用于在 KubeSphere 集群中提供 HTTPS 证书并自动续期，支持 `Let’s Encrypt`, `HashiCorp Vault` 这些免费证书的签发。在 KubeSphere 集群中，我们可以通过 Kubernetes Ingress 和 `Let’s Encrypt` 实现外部服务的自动化 HTTPS。

![](https://pek3b.qingstor.com/kubesphere-community/images/high-level-overview.svg)

**Issuers/ClusterIssuers**：定义使用什么证书颁发机构 (CA) 来去颁发证书，Issuers 和 ClusterIssuers 区别是： issuers 是一个名称空间级别的资源，只能用来签发自己所在  namespace 下的证书，ClusterIssuer 是个集群级别的资源 可以签发任意 namespace 下的证书

**Certificate**：定义所需的 X.509 证书，该证书将更新并保持最新。Certificate 是一个命名空间资源，当 Certificate 被创建时，它会去创建相应的 CertificateRequest 资源来去申请证书。

## 安装证书管理器

安装证书管理器比较简单，直接执行以下脚本就可以了。

```bash
$ kubectl create ns cert-manager
$ helm uninstall cert-manager -n cert-manager

$ helm install cert-manager jetstack/cert-manager \
  -n cert-manager \
  --version v1.8.0 \
  --set installCRDs=true \
  --set prometheus.enabled=false \
  --set 'extraArgs={--dns01-recursive-nameservers-only,--dns01-recursive-nameservers=119.29.29.29:53\,8.8.8.8:53}'    
```

## 选择证书颁发者

cert-manager 支持以下几种证书颁发者：

- SelfSigned
- CA
- Vault
- Venafi
- External
- ACME 

我们选择使用 ACME 来颁发证书。

## 选择证书校验方式

常用的校验方式有 HTTP-01 、DNS-01 。

### DNS-01 校验原理

DNS-01 的校验原理是利用 DNS 提供商的 API Key 拿到 DNS 控制权限， 在 Let’s Encrypt 为 ACME 客户端提供令牌后，ACME 客户端 (cert-manager) 将创建从该令牌和我的帐户密钥派生的 TXT 记录，并将该记录放在 _acme-challenge。 然后 Let’s Encrypt 将向 DNS 系统查询该记录，如果找到匹配项，就可以颁发证书。此方法支持泛域名证书。

### HTTP-01 校验原理

HTTP-01 的校验原理是给域名指向的 HTTP 服务增加一个临时 location ，Let’s Encrypt 会发送 HTTP 请求到 http:///.well-known/acme-challenge/，参数中 YOUR_DOMAIN 就是被校验的域名，TOKEN 是 ACME 协议的客户端负责放置的文件，ACME 客户端就是 cert-manager，它通过修改或创建 Ingress 规则来增加这个临时校验路径并指向提供 TOKEN 的服务。Let’s Encrypt 会对比 TOKEN 是否符合预期，校验成功后就会颁发证书。此方法仅适用于给使用 Ingress 暴露流量的服务颁发证书，不支持泛域名证书。

### 优劣对比

HTTP-01 的校验方式的优点是: 配置简单通用，不管使用哪个 DNS 提供商都可以使用相同的配置方法；缺点是：需要依赖 Ingress，如果服务不是通过 Ingress 暴露的就不适用，而且不支持泛域名证书。

DNS-01 的校验方式的优点是没有 HTTP-01 校验方式缺点，不依赖 Ingress，也支持泛域名；缺点就是不同 DNS 提供商的配置方式不一样，而且只有 cert-manager 支持的 DNS 提供商才可以选择这种方式。

Cert-manager 支持使用外部 webhook 的接入 DNS 提供商，正好公司使用腾讯云的 DNSPOD 属于支持的行列。我们可以选择 DNS-01 。

### HTTP-01 配置示例

这个配置示例仅供参考，使用这种方式，有多少的 Ingress 服务，就需要申请多少张证书，比较麻烦，但是配置较为简单，不依赖 DNS 服务商。

#### 1. 创建 CA 群集证书颁发者

证书管理器需要 Issuer 或 ClusterIssuer 资源，才能颁发证书。 这两种 Kubernetes 资源的功能完全相同，区别在于 Issuer 适用于单一命名空间，而 ClusterIssuer 适用于所有命名空间。

```yaml
# ClusterIssuer.yaml

apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    email: scwang18@xxx.xxx
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: issuer-account-key
    solvers:
    - http01:
        ingress:
          class: nginx
```

说明：

- metadata.name: 是我们创建的签发机构的名称，后面我们创建证书的时候会引用它；
- spec.acme.email: 是你自己的邮箱，证书快过期的时候会有邮件提醒，不过 cert-manager 会利用 acme 协议自动给我们重新颁发证书来续期；
- spec.acme.server: 是 acme 协议的服务端，我们使用 Let’s Encrypt；
- spec.acme.privateKeySecretRef: 指示此签发机构的私钥将要存储到哪个 Secret 对象中；
- spec.acme.solvers: 这里指示签发机构校验方式，有 http01 和 dns01 两种，该字段下配置的 class 和 name 只能同时存在一个， class 指定使用的 Ingress class 名称， name 比较少用，通常用于 Kubernetes 的 Ingress。

```bash
$ kubectl apply -f ClusterIssuer.yaml -n cert-manager
```

执行成功后，会将申请的证书文件放置在 issuer-account-key 这个 Secret 中。


查看证书是否自动创建成功：

```bash
$ kubectl -n infra  get certificate
```

#### 2. 在 Ingress 中使用上步申请到的 SSL 证书 

```yaml
# ingreess-wikijs.yaml

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    nginx.ingress.kubernetes.io/proxy-body-size: "0"
  name: ingress-wikijs
spec:
  ingressClassName: nginx
  rules:
  - host: wiki.xxx.xxx
    http:
      paths:
      - backend:
          service:
            name: wikijs
            port:
              number: 3000
        path: /
        pathType: Prefix
  tls: 
  - hosts:
    - wikijs.xxx.xxx
    secretName: ingress-wikijs-tls
```

> 注意：在 annotations 里 设置 `cert-manager.io/cluster-issuer` 为签名创建的集群证书颁发者 `letsencrypt`。

使用 yaml 文件创建 ingress 后，就可以使用该 Ingress 对外提供 HTTPS 服务了。

```
# 执行创建 ingress
kubectl apply -f ingress-wikijs.yaml -n infra

```

### DNS01 配置示例

使用这种方式需要 DNS 服务商支持通过 API 创建 DNS 记录，正好我的 DNS 服务商是腾讯云 dnspod 支持，因此在我们的及群里，最终采用了这种方式。

这个方式的配置会比较麻烦，踩了很久的坑，主要是因为我的集群启用了本地 DNS 服务器，默认 cert-manager 会通过本地 DNS 服务器去验证通过 API 创建的 DNS txt 记录，会一直检查不到新增的 txt 记录，造成在 challenge 阶段就一直 pendding。解决方案附后。

#### 1. 在 dnspod 创建 API ID 和 API Token

参考[腾讯云官方文档](https://support.dnspod.cn/Kb/showarticle/tsid/227/)记录下创建的 API ID 和 API Token （加码处理，需要自行获取自己的 API ID 和 API Token）。

```
AKIDVt3z4uVss11xjIdmddgMmHXXssssHp9D2buxrWR8
SekbG2gqdflQs5xxxviGagX8TYO
```

#### 2. 安装 cert-manager-webhook-dnspod

使用 helm 安装 roc/cert-manager-webhook-dnspod。

```bash
$ helm repo add roc https://charts.imroc.cc

$ helm uninstall cert-manager-webhook-dnspod -n cert-manager
$ helm install cert-manager-webhook-dnspod roc/cert-manager-webhook-dnspod \
    -n cert-manager \
    --set clusterIssuer.secretId=AKIDVt3z4uVss11xjIdmddgMmHXXssssHp9D2buxrWR8 \
    --set clusterIssuer.secretKey=SekbG2gqdflQs5xxxviGagX8TYO \
    --set clusterIssuer.email=xxx@xxx.xxx
```

#### 3. 创建泛域名证书

```yaml
# ipincloud-crt.yaml

apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ipincloud-crt
spec:
  secretName: ipincloud-crt
  issuerRef:
    name: dnspod
    kind: ClusterIssuer
    group: cert-manager.io
  dnsNames:
  - "*.xxx.xxx"
```

创建集群证书颁发者：

```bash
$ kubectl apply -f ipincloud-crt.yaml -n infra
```

#### 4. 验证证书

查看证书是否创建成功：

```bash
$ kubectl get Certificate -n cert-manager
NAME                                      READY   SECRET                                    AGE
cert-manager-webhook-dnspod-ca            True    cert-manager-webhook-dnspod-ca            18m
cert-manager-webhook-dnspod-webhook-tls   True    cert-manager-webhook-dnspod-webhook-tls   18m
ipincloud-crt                             True    ipincloud-crt                             3m12s
```

以上可以看出 ipincloud-crt 已经创建成功， READY 状态也是 True。

查看证书对应的域名：

```bash
$ kubectl describe Certificate ipincloud-crt -n cert-manager
Name:         ipincloud-crt
Namespace:    cert-manager
Labels:       <none>
Annotations:  <none>
API Version:  cert-manager.io/v1
Kind:         Certificate
Metadata:
  Creation Timestamp:  2022-05-07T14:19:07Z
  ...
Spec:
  Dns Names:
    *.xxx.xxx
  Issuer Ref:
    Group:      cert-manager.io
    Kind:       ClusterIssuer
    Name:       dnspod
  Secret Name:  ipincloud-crt
Status:
  Conditions:
    Last Transition Time:  2022-05-07T14:19:14Z
    Message:               Certificate is up to date and has not expired
    Observed Generation:   1
    Reason:                Ready
    Status:                True
    Type:                  Ready
  Not After:               2022-08-05T13:19:11Z
  Not Before:              2022-05-07T13:19:12Z
  Renewal Time:            2022-07-06T13:19:11Z
  Revision:                1
Events:
  Type    Reason     Age    From                                       Message
  ----    ------     ----   ----                                       -------
  Normal  Issuing    4m35s  cert-manager-certificates-trigger          Issuing certificate as Secret does not exist
  Normal  Generated  4m35s  cert-manager-certificates-key-manager      Stored new private key in temporary Secret resource "ipincloud-crt-4ml59"
  Normal  Requested  4m35s  cert-manager-certificates-request-manager  Created new CertificateRequest resource "ipincloud-crt-r76wp"
  Normal  Issuing    4m28s  cert-manager-certificates-issuing          The certificate has been successfully issued 
```

从 Certificate 的描述信息可以看到，这个证书是对应所有 `*.xxx.xxx` 的泛域名。

查看证书内容：

```bash
$ kubectl describe secret ipincloud-crt -n cert-manager
Name:         ipincloud-crt
Namespace:    cert-manager
Labels:       <none>
Annotations:  cert-manager.io/alt-names: *.xxx.xxx
              cert-manager.io/certificate-name: ipincloud-crt
              cert-manager.io/common-name: *.xxx.xxx
              cert-manager.io/ip-sans: 
              cert-manager.io/issuer-group: cert-manager.io
              cert-manager.io/issuer-kind: ClusterIssuer
              cert-manager.io/issuer-name: dnspod
              cert-manager.io/uri-sans: 

Type:  kubernetes.io/tls

Data
====
tls.crt:  5587 bytes
tls.key:  1675 bytes
```

TLS 证书保存在 cert-manager 命名空间里的 ipincloud-crt secret。可以供所有 `*.xxx.xxx` 的服务使用。

#### 其他

这个过程中，遇到最大的坑是：我的集群使用了自建的 DNS 服务器，默认 cert-manager 会使用这个集群的自建 DNS SERVER 进行证书发行的验证，虽然通过调用 dnspod 的 webook 在 腾讯云 DNS 服务器上创建的 _acme-challenge 握手数据，但是在我的自建 DNS 里是查不到的，所以会一直卡 pending 状态。

```bash
$ kubectl get challenge -A
NAMESPACE      NAME                                       STATE     DOMAIN         AGE
cert-manager   ipincloud-crt-f9kp6-381578565-136350475    pending   xxx.xxx   24s
```

查看原因是：

`Waiting for DNS-01 challenge propagation: DNS record for "xxx.xxx" not yet` 

```bash
$ kubectl -n cert-manager describe challenge ipincloud-crt-f9kp6-381578565-136350475
Name:         ipincloud-crt-f9kp6-381578565-136350475
Namespace:    cert-manager
Labels:       <none>
Annotations:  <none>
API Version:  acme.cert-manager.io/v1
Kind:         Challenge
---
中间略
---
Status:
  Presented:   true
  Processing:  true
  Reason:      Waiting for DNS-01 challenge propagation: DNS record for "xxx.xxx" not yet propagated
  State:       pending
Events:
  Type    Reason     Age   From                     Message
  ----    ------     ----  ----                     -------
  Normal  Started    41s   cert-manager-challenges  Challenge scheduled for processing
  Normal  Presented  39s   cert-manager-challenges  Presented challenge using DNS-01 challenge mechanism
```

查了很多资料，在官网上找到解决方案。办法是让 cert-manager 强制使用指定的 DNS 服务器进行握手验证。

我是用的是 helm 安装 cert-manager，所以添加一下 set 参数。

```bash
--set 'extraArgs={--dns01-recursive-nameservers-only,--dns01-recursive-nameservers=119.29.29.29:53\,8.8.8.8:53}'    
```

参考文档： https://cert-manager.io/docs/configuration/acme/dns01/#setting-nameservers-for-dns01-self-check

## 配置证书复制到其他 namespace

### 安装 kubed

```bash
$ helm repo add appscode https://charts.appscode.com/stable/
$ helm repo update
$ helm install kubed appscode/kubed \
  --version v0.13.2 \
  --namespace cert-manager
```
## 修改 Certificated 文件

为 certificated 对象设置 secretTemplate, 设置需要同步到哪些 namespace。

```yaml
# ipincloud-crt.yaml

apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ipincloud-crt
spec:
  secretName: ipincloud-crt
  issuerRef:
    name: dnspod
    kind: ClusterIssuer
    group: cert-manager.io
  dnsNames:
  - "*.xxx.xxx"
  secretTemplate:
    annotations:
      kubed.appscode.com/sync: "cert-manager-tls=ipincloud-crt" 
```

### 给需要同步的目标 namespace 打 label

上一步的 secretTemplate 里指定了同步的目标 namespace 的 label 过滤条件 `cert-manager-tls=ipincloud-crt` ， 因此，我们需要对接收同步 secret 的 namespace 打上相应的 label。

```bash
$ kubectl label ns default cert-manager-tls=ipincloud-crt
$ kubectl label ns app cert-manager-tls=ipincloud-crt
$ kubectl label ns dev-app cert-manager-tls=ipincloud-crt
$ kubectl label ns dev-infra cert-manager-tls=ipincloud-crt
$ kubectl label ns dev-wly cert-manager-tls=ipincloud-crt
$ kubectl label ns infra cert-manager-tls=ipincloud-crt
$ kubectl label ns istio-system cert-manager-tls=ipincloud-crt
$ kubectl label ns uat-app cert-manager-tls=ipincloud-crt
$ kubectl label ns uat-wly cert-manager-tls=ipincloud-crt
$ kubectl label ns wly cert-manager-tls=ipincloud-crt
$ kubectl label ns kubesphere-controls-system cert-manager-tls=ipincloud-crt
```

### 查看是否复制成功

查看目标 namespace 是否复制 secret 成功。

```bash
$ kubectl get secret ipincloud-crt
NAME            TYPE                DATA   AGE
ipincloud-crt   kubernetes.io/tls   2      18m
```

查看复制的 secret ，可以看到 label 信息中记录了证书来源信息。

```bash
$ kubectl describe secret ipincloud-crt
Name:         ipincloud-crt
Namespace:    default
Labels:       kubed.appscode.com/origin.cluster=unicorn
              kubed.appscode.com/origin.name=ipincloud-crt
              kubed.appscode.com/origin.namespace=cert-manager
Annotations:  cert-manager.io/alt-names: *.xxx.xxx
              cert-manager.io/certificate-name: ipincloud-crt
              cert-manager.io/common-name: *.xxx.xxx
              cert-manager.io/ip-sans: 
              cert-manager.io/issuer-group: cert-manager.io
              cert-manager.io/issuer-kind: ClusterIssuer
              cert-manager.io/issuer-name: dnspod
              cert-manager.io/uri-sans: 
              kubed.appscode.com/origin:
                {"namespace":"cert-manager","name":"ipincloud-crt","uid":"b4713633-731e-4151-844f-0f6d9cf6352c","resourceVersion":"12531075"}

Type:  kubernetes.io/tls

Data
====
tls.crt:  5587 bytes
tls.key:  1675 bytes
```

### 使用 TLS 证书配置 Ingress

#### 设置 Ingress

```yaml
kind: Ingress
apiVersion: networking.k8s.io/v1
metadata:
  name: wikijs
  namespace: infra
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: '0'
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - wiki.xxx.xxx
      secretName: ipincloud-crt
  rules:
    - host: wiki.xxx.xxx
      http:
        paths:
          - path: /
            pathType: ImplementationSpecific
            backend:
              service:
                name: wikijs
                port:
                  number: 3000

```

#### 测试

以上配置完成后，就可以使用 HTTPS 来访问新的 wiki.js 服务了。


```bash
$ curl -I https://wiki.xxx.xxx
HTTP/1.1 302 Found
Date: Sat, 07 May 2022 14:52:39 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Connection: keep-alive
X-Frame-Options: deny
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-UA-Compatible: IE=edge
Referrer-Policy: same-origin
Content-Language: zh
Set-Cookie: loginRedirect=%2F; Max-Age=900; Path=/; Expires=Sat, 07 May 2022 15:07:39 GMT
Location: /login
Vary: Accept, Accept-Encoding
Strict-Transport-Security: max-age=15724800; includeSubDomains
```

如上所示，就是成功启动了 HTTPS 。

## 参考

+ **https://artifacthub.io/packages/helm/cert-manager/cert-manager**
+ **https://www.1nth.com/post/k8s-cert-manager/**
+ **https://cert-manager.io/docs/configuration/acme/dns01/#setting-nameservers-for-dns01-self-check**
