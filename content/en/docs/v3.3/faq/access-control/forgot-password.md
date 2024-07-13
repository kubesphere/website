---
title: "Reset the Account Password"
keywords: "Forgot, Password, KubeSphere, Kubernetes"
description: "Reset the password of any account."
linkTitle: "Reset the Account Password"
Weight: 16410
version: "v3.3"
---

## Reset the Password of a Regular User

1. Log in to the KubeSphere web console using the administrator who has the permission to manage users. 

2. Click **Platform** on the upper-left corner and select **Access Control**. Click **Users**.

3. On the **Users** page, click the user of which you need to change the password to visit its details page.

4. On the details page, click **More**, and then select **Change Password** from the drop-down list.

5. On the displayed dialog box, enter a new password and confirm the password. Click **OK** after finished.

## Reset the Administrator Password

Execute the following command on the host cluster to change the password of any account.

```bash
kubectl patch users <USERNAME> -p '{"spec":{"password":"<YOURPASSWORD>"}}' --type='merge' && kubectl annotate users <USERNAME> iam.kubesphere.io/password-encrypted-
```

{{< notice note >}}

Make sure you replace `<USERNAME>` and `<YOURPASSWORD>` with the username and the new password in the command before you run it.

{{</ notice >}} 