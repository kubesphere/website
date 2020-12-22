---
title: "Forgot Password"
keywords: "Forgot, Password, KubeSphere, Kubernetes"
description: "How to reset the password if you forgot it."

Weight: 16500
---
 
## I forgot my password. How do I reset it?

### Forgot the password of a regular user

The administrator(who has the rights to manage users) can change a user password if required by simply using the "Change Password" action for a user. 

![modify-password](/images/docs/faq/forgot-password/modify-password.png)

### Forgot the unique administrator password

Execute the following command on the host cluster.

```bash
kubectl patch users <USERNAME> -p '{"spec":{"password":"<YOURPASSWORD>"}}' --type='merge' && kubectl annotate users <USERNAME> iam.kubesphere.io/password-encrypted-
```

Please don't forget to replace the `<USERNAME>` and `<YOURPASSWORD>`.