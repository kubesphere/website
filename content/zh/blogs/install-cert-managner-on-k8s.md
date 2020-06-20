---
title: '使用 KubeSphere 在 Kubernetes 安装 cert-manager 为网站启用 HTTPS'
tag: 'KubeSphere,Kubernetes'
createTime: '2020-04-29'
author: 'Jeff Zhang'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200428230558.png'
---

![cert-manager](https://pek3b.qingstor.com/kubesphere-docs/png/20200428230558.png)

## 什么是 cert-manager

cert-manager（`https://cert-manager.io/`）是 Kubernetes 原生的证书管理控制器。它可以帮助从各种来源颁发证书，例如 Let's Encrypt，HashiCorp Vault，Venafi，简单的签名密钥对或自签名。它将确保证书有效并且是最新的，并在证书到期前尝试在配置的时间续订证书。它大致基于 kube-lego 的原理，并从其他类似项目（例如 kube-cert-manager）中借鉴了一些智慧。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428230220.png)

### 准备工作

1. 需要一个公网可访问的 IP，例如 `139.198.121.121`
2. 需要一个域名，并且已经解析到到对应的IP，例如 ` A kubesphere.io 139.198.121.121`，我们将 `staging.kubesphere.io` 域名解析到了 `139.198.121.121`
3. 在KubeSphere上已经运行网站对应的服务，例如本例中的`ks-console`

### 启用项目网关

登录 KubeSphere，进入任意一个企业空间下的项目中。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428224301.png)

在 KubeSphere 中启用对应项目下的网关。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428223939.png)

> 我们开启的是一个NodePort类型的网关，需要在集群外部使用 LoadBalancer 转发到网关的端口，将 `139.198.121.121` 绑定到 LoadBalancer 上，这样我们就可以通过公网IP直接访问我们的服务了；
> 如果 Kubernetes 集群是在物理机上，可以安装 Porter（`https://porter.kubesphere.io`）负载均衡器对外暴露集群服务；
> 如果在公有云上，可以安装和配置公有云支持的负载均衡器插件，然后创建 LoadBalancer 类型的网关，填入公网IP对应的 eip，会自动创建好负载均衡器，并将端口转发到网关。

### 安装 cert-manager

详细安装文档可以参考 [cert-manager](https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html)。

>  `cert-manager` 部署时会创建一个 `webhook` 来校验 `cert-manager` 相关对象是否符合格式，不过也会增加部署的复杂性。这里我们使用官方提供的一个 `no-webhook` 版本安装。  

可以在 KubeSphere 右下角的工具箱中，打开 Web Kubectl。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428225544.png)

在 Web Kubectl 执行下列命令安装 cert-manager：

 ```
 # Install the CustomResourceDefinitions and cert-manager itself
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.11.0/cert-manager-no-webhook.yaml
 ```

### 创建 Issuer
`Issuer` 是 cert-manager 中的概念，表示证书的签发者。在此实例中，我们使用免费的[ `letsencrypt`](https://letsencrypt.org/) 来获取TLS证书。


在 kubectl 中执行下面命令来创建一个`kubesphere-system`项目可用的 `Issuer`(注意修改项目和email信息)
```
kubectl -n kubesphere-system create -f - <<EOF
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: letsencrypt-prod
  namespace: kubesphere-system
spec:
  acme:
    email: kubesphere@kubesphere.io
    privateKeySecretRef:
      name: letsencrypt-prod
    server: https://acme-v02.api.letsencrypt.org/directory
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```
创建完成后，执行下面命令可以看到
```
[root@master ~]# kubectl -n kubesphere-system get issuers.cert-manager.io
NAME               AGE
letsencrypt-prod   46m
```

### 创建证书 `Certificate`
在kubectl里执行下面命令创建
```
kubectl -n kubesphere-system create -f - <<EOF
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: staging-kubesphere-io
  namespace: kubesphere-system
spec:
  commonName: staging.kubesphere.io
  dnsNames:
  - staging.kubesphere.io
  duration: 2160h
  issuerRef:
    name: letsencrypt-prod
  renewBefore: 360h
  secretName: staging-kubesphere-io
EOF
```
`cert-manager` 会根据 `Certificate` 自动进行 `http01 challenge` 签发证书，在 `kubesphere-system` 下创建对应的 TLS 证书
```
[root@master ~]# kubectl -n kubesphere-system get secrets
NAME                                TYPE                                  DATA   AGE
staging-kubesphere-io               kubernetes.io/tls                     3      40m
```

### 使用证书

证书签发完成后，确认对应的 TLS 证书已经在项目下创建，就可以在创建应用路由（Ingress）中使用证书了。如下，创建时选择对应的 TLS 证书即可

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428224006.png)

当创建 Ingress 完成后，即可通过浏览器 `https://staging.kubesphere.io` 访问 Ingress 代理的服务，本示例我们已给 KubeSphere Console 服务配置了该域名。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200428224449.png)

> KubeSphere (https://kubesphere.io) 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。
