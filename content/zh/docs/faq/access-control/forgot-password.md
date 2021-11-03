---
title: "重置帐户密码"
keywords: "忘记, 密码, KubeSphere, Kubernetes"
description: "重置任意一个用户的密码。"
linkTitle: "重置帐户密码"
Weight: 16410
---

## 重置普通用户密码

1. 使用具有用户管理权限的用户登录 KubeSphere Web 控制台。

2. 点击左上角的**平台管理**，选择**访问**控制。点击**用户**。

3. 在**用户**页面，点击需要修改密码的用户进入详情页。

4. 在用户的详情页，点击**更多操作**并选择**修改密码**。

5. 在出现的对话框中，输入新的密码并重复输入新的密码。完成后点击**确定**。

## 重置管理员密码

在 Host 集群执行以下命令修改指定帐户的密码：

```bash
kubectl patch users <USERNAME> -p '{"spec":{"password":"<YOURPASSWORD>"}}' --type='merge' && kubectl annotate users <USERNAME> iam.kubesphere.io/password-encrypted-
```

{{< notice note >}}

请将命令中的 `<USERNAME>` 修改为实际的用户名，将 `<YOURPASSWORD>` 修改为实际的新密码。

{{</ notice >}} 