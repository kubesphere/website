---
title: 'KubeSphere 使用 HTTPS 协议集成 Harbor 镜像仓库指南'
tag: 'KubeSphere, Kubernetes, Harbor'
keywords: 'KubeSphere, Kubernetes, Harbor, Docker, nodelocaldns'
description: '本文介绍了如何为 KubeSphere 添加基于 HTTPS 的 Harbor 镜像仓库'
createTime: '2022-11-08'
author: '申红磊'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202211092145642.jpg'
---

> 作者：申红磊，青云科技容器解决方案架构师，开源项目爱好者，KubeSphere Member。

上面两篇文章讲了如何[部署 HTTPS Harbor](https://shenhonglei.blog.csdn.net/article/details/124183802) 和[对接 HTTP 的 Harbor 镜像仓库](https://blog.csdn.net/shenhonglei1234/article/details/124837763)；接下来详细介绍一下，如何添加基于 HTTPS 的 Harbor 镜像仓库对接使用说明。

因为 KubeSphere 无法直接解析 Harbor 域名，需要在 CoreDNS 添加解析记录，否则会报 no such host。

## NodeLocal DNSCache

NodeLocal DNSCache 通过在集群上运行一个 DNSCache  Daemonset 来提高 clusterDNS 性能和可靠性。相比于纯 CoreDNS 方案，nodelocaldns +  CoreDNS 方案能够大幅降低 DNS 查询 timeout 的频次，提升服务稳定性。

nodelocaldns 通过添加 iptables 规则能够接收节点上所有发往 xxx.xxx.xx.xx 的 DNS 查询请求，把针对集群内部域名查询请求路由到 CoreDNS；把集群外部域名请求直接通过 Host 网络发往集群外部 DNS 服务器。

## 将 nodelocaldns 解析都转发给 coredns

```bash
#forward ./etc/resolv.conf指向coredns service ip
#search coredns service ip
$ kubectl get svc coredns -n kube-system
NAME      TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
coredns   ClusterIP   10.233.0.3   <none>        53/UDP,53/TCP,9153/TCP   28d
#修改nodelocaldns的配置configmap的值
$ kubectl edit cm nodelocaldns -n kube-system
## 将 forward ./etc/resolv.conf 调整为：forward . 10.233.0.3
apiVersion: v1
data:
  Corefile: |
    cluster.local:53 {
        errors
        cache {
            success 9984 30
            denial 9984 5
        }
        reload
        loop
        bind 169.254.25.10
        forward . 10.233.0.3 {
            force_tcp
        }
        prometheus :9253
        health 169.254.25.10:9254
    }
    ...
## 保存、重启、或者手动重启，效果一样
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091927610.png)

## 在 coredns 中添加主机记录

```bash
#修改 coredns configmap 文件，添加主机记录
$ kubectl edit cm coredns -n kube-system

....
    }
    kubernetes cluster.local in-addr.arpa ip6.arpa {
       pods insecure
       fallthrough in-addr.arpa ip6.arpa
       ttl 30
    }
    hosts  {
         192.168.100.2  dockerhub.kubekey.local
         fallthrough
    }
    prometheus :9153
....
## 保存或者重启coredns一下进行验证
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091927978.png)

如果此时添加 harbor 对接信息，会提示 证书问题， x509 的错误提示

```bash
Get"https://dockerhub.kubekey.local/v2/":x509:certificate signed by unknown authority
```

## x509

在 KubepShere 中的 ks-apiserver 中添加镜像仓库 CA 证书。

### 通过 configmap 加载 CA 证书

查看 CA 证书的位置，在 Harbor 部署时，查看证书生成的位置及值：

```bash
#目录位置： ls /etc/docker/certs.d/
$ cat /etc/docker/certs.d/dockerhub.kubekey.local/ca.crt
-----BEGIN CERTIFICATE-----
MIIDATCCAemgAwIBAgIBADANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDEwtyZWdp
c3RyeS1jYTAeFw0yMjA0MjExNjUzNTJaFw0zMjA0MTgxNjUzNTJaMBYxFDASBgNV
BAMTC3JlZ2lzdHJ5LWNhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
vs0k1cS3S4L9tvTvJomlMwNN8eGSk8hujGKm6SQHAYicFsNmfYevfthJsufuikIq
ggxwyL9nExr470l4hN31PN/ztIKZh/57IKF6XZrF5Ld3fBxOvVGSTarZraIkxkPe
/N5HfJdAWh5CTKtdsOpal3CmP+6tbRQ6qQN5D9lO97Tid79W8a58jI7FHyeYS08D
VlBjDCip81mI4YsgMaXmatS0HjtLtCvQNsL5Py2KKAhHb+Rd0iepICUT2uUwR1Cu
RpO+FkiAxM8WXF/6IndiIsoC2XCh6pELadcKCNNy5IREC/+JbjveNZOuYU4KPJn5
TYZxzalJ8nWRHpi6neFHAQIDAQABo1owWDAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0T
AQH/BAUwAwEB/zAdBgNVHQ4EFgQUtcd+vBgIbcmB8O7ZeSBwFOCPj/QwFgYDVR0R
BA8wDYILcmVnaXN0cnktY2EwDQYJKoZIhvcNAQELBQADggEBABxAVx3Wkfic/SWY
Z1T0kv+zq8NW1YyHDw13mRwcjV+lRI0/WtANEBAbAejmZJkhhz7uc/N9egXF6cOY
PLoxvLXQJGxQKfBqrGkFhAlFt4FWJm0g7fXq/a6Fo/EStRmW9Oio0dFJHQ/F6Lon
DK/1bx0s27JJqBmU4WnmGF1U2prYuJ3/C8mwxWb49K+z1s1sDQQOCp/jt8gabc2R
GAZgcYhIj+HUXAEl14+GhpoLqJbJ5ngVLxz08YDMTGp1pQ8uYeE1m29yTOThMGrC
owVM1fSSHs5UtKQ2/tVcxi5Mf+WUWZr2D2km0dI9BJyXwtQwGKhp3lwJX5e0NTZi
+6a/23U=
-----END CERTIFICATE-----
```

```bash
#界面创建configmap:工作台>企业空间>System-workspace>项目>kubesphere-system>配置>配置字典，新建harbor4shl-ca
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091928499.png)

编辑 ks-apiserver deployment 文件，进行 configmap 的挂载：

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091928733.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091928262.png)

保存更新。

## 验证

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091928862.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091928656.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202211091929684.png)