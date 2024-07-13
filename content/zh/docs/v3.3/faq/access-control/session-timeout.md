---
title: "会话超时"
keywords: "会话超时, KubeSphere, Kubernetes"
description: "理解会话超时并自定义超时时间。"
linkTitle: "会话超时"
Weight: 16420
version: "v3.3"
---

当用户登录 KubeSphere 的控制台时会话开始。当会话过期时，您会看到信息“**会话超时或此帐户在其他地方登录，请重新登录**”。

## 会话超时

您可以控制会话超时时间，默认超时时间为两小时，即达到会话超时时间后，用户会从控制台自动登出。您可以为会话超时配置 [accessTokenMaxAge 和 accessTokenInactivityTimeout](../../../access-control-and-account-management/external-authentication/set-up-external-authentication)。

## 签名校验失败

在[多集群环境](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster)下，您必须正确设置 `clusterRole` 和 `jwtSecret`。

## 节点时钟偏移

节点时钟偏移会影响时间敏感性操作，例如用户令牌 (Token) 过期时间的验证。您可以将服务器时间和 NTP 服务器进行同步。[MaximumClockSkew](../../../access-control-and-account-management/external-authentication/set-up-external-authentication) 也可设置，默认为 10 秒。