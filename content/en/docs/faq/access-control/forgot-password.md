---
title: "Reset the Account Password"
keywords: "Forgot, Password, KubeSphere, Kubernetes"
description: "How to reset the password if you forgot it."
linkTitle: "Reset the Account Password"
Weight: 16410
---

## Reset the Password of a Regular User

The administrator who has the permission to manage users can change an account password. On the **Accounts** page, click the account of which you need to change the password. On the detail page, select **Change Password** from the **More** drop-down list.

![modify-password](/images/docs/faq/forgot-password/modify-password.png)

## Reset the Administrator Password

Execute the following command on the host cluster to change the password of any account.

```bash
kubectl patch users <USERNAME> -p '{"spec":{"password":"<YOURPASSWORD>"}}' --type='merge' && kubectl annotate users <USERNAME> iam.kubesphere.io/password-encrypted-
```

{{< notice note >}}

Make sure you replace `<USERNAME>` and `<YOURPASSWORD>` with the account and the new password in the command before you run it.

{{</ notice >}} 