---
title: "重置帐户密码"
keywords: "忘记, 密码, KubeSphere, Kubernetes"
description: "重置任意一个用户的密码。"
linkTitle: "重置帐户密码"
Weight: 16410
---

## 重置普通用户密码

具有用户管理权限的管理员可修改帐户密码。在**帐户管理**页面，点击需要修改密码的帐户。在帐户的详情页面，点击**更多操作**并选择**修改密码**。

![modify-password](/images/docs/zh-cn/faq/forgot-password/modify-password.png)

## 重置管理员密码

在 Host 集群执行以下命令修改指定帐户的密码：

```bash
kubectl patch users <USERNAME> -p '{"spec":{"password":"<YOURPASSWORD>"}}' --type='merge' && kubectl annotate users <USERNAME> iam.kubesphere.io/password-encrypted-
```

{{< notice note >}}

请将命令中的 `<USERNAME>` 修改为实际的帐户名称，将 `<YOURPASSWORD>` 修改为实际的新密码。

{{</ notice >}} 