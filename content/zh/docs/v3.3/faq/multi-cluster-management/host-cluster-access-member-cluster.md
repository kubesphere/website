---
title: "恢复主集群对成员集群的访问权限"
keywords: "Kubernetes, KubeSphere, 多集群, 主集群, 成员集群"
description: "了解如何恢复主集群对成员集群的访问。"
linkTitle: "恢复主集群对成员集群的访问权限"
Weight: 16720
version: "v3.3"
---

[多集群管理](../../../multicluster-management/introduction/kubefed-in-kubesphere/)是 KubeSphere 的一大特色，拥有必要权限的租户（通常是集群管理员）能够从主集群访问中央控制平面，以管理全部成员集群。强烈建议您通过主集群管理整个集群的资源。

本教程演示如何恢复主集群对成员集群的访问权限。

## 可能出现的错误信息

如果您无法从中央控制平面访问成员集群，并且浏览器一直将您重新定向到 KubeSphere 的登录页面，请在该成员集群上运行以下命令来获取 ks-apiserver 的日志。

```
kubectl -n kubesphere-system logs ks-apiserver-7c9c9456bd-qv6bs
```

{{< notice note >}}

`ks-apiserver-7c9c9456bd-qv6bs` 指的是该成员集群上的容器组 ID。请确保您使用自己的容器组 ID。

{{</ notice >}}

您可能会看到以下错误信息：

```
E0305 03:46:42.105625       1 token.go:65] token not found in cache
E0305 03:46:42.105725       1 jwt_token.go:45] token not found in cache
E0305 03:46:42.105759       1 authentication.go:60] Unable to authenticate the request due to error: token not found in cache
E0305 03:46:52.045964       1 token.go:65] token not found in cache
E0305 03:46:52.045992       1 jwt_token.go:45] token not found in cache
E0305 03:46:52.046004       1 authentication.go:60] Unable to authenticate the request due to error: token not found in cache
E0305 03:47:34.502726       1 token.go:65] token not found in cache
E0305 03:47:34.502751       1 jwt_token.go:45] token not found in cache
E0305 03:47:34.502764       1 authentication.go:60] Unable to authenticate the request due to error: token not found in cache
```

## 解决方案

### 步骤 1：验证 jwtSecret

分别在主集群和成员集群上运行以下命令，确认它们的 jwtSecret 是否相同。

```
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v “apiVersion” | grep jwtSecret
```

### 步骤 2：更改 `accessTokenMaxAge`

请确保主集群和成员集群的 jwtSecret 相同，然后在该成员集群上运行以下命令获取 `accessTokenMaxAge` 的值。

```
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep accessTokenMaxAge
```

如果该值不为 `0`，请运行以下命令更改 `accessTokenMaxAge` 的值。

```
kubectl -n kubesphere-system edit cm kubesphere-config -o yaml
```

将 `accessTokenMaxAge` 的值更改为 `0` 之后，运行以下命令重启 ks-apiserver。

```
kubectl -n kubesphere-system rollout restart deploy ks-apiserver
```

现在，您可以再次从中央控制平面访问该成员集群。