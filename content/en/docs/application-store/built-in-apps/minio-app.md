---
title: "Minio App"
keywords: 'Kubernetes, KubeSphere, Minio, app-store'
description: 'How to use built-in Minio Object Storage'


weight: 2242
---
MinIO object storage is designed for high performence and the S3 API. This guide will show you how to deploy Minio object storage with only a few steps.

## Prerequisites

- You have enabled [KubeSphere App Store](../../pluggable-components/app-store)
- You have completed the tutorial in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/). Now switch to use `project-regular` account to log in and enter into `demo-peoject`.

## Hands-on Lab

### Common steps

1. Choose Minio template `From App Store`.

![choose_minio_from_app_store](/images/docs/appstore/minio/choose_minio_from_app_store.png)

2. Check app info and click `Deploy` button.

![deploy_minio](/images/docs/appstore/minio/deploy_minio.png)

3. Select app version and deployment location, then go to **Next → Deploy**

![deploy_minio_confirm](/images/docs/appstore/minio/deploy_minio_confirm.png)

4. Wait for a few minutes, then you will see the application minio showing active on the application list.

![minio_active](/images/docs/appstore/minio/minio_active.png)

5. Click into Minio application, and then enter into its service page.

![View Minio Detail](/images/docs/appstore/minio/view_minio_service.png)

6. In this page, make sure its deployment and Pod are running, then click **More → Edit Internet Access**, and select **NodePort** in the dropdown list, click **OK** to save it.

![Expose Minio Service](/images/docs/appstore/minio/expose_minio_service.png)

7.Go to **App Template  → Configuration Files** and get accessKey and secretKey from `values.yaml`.

![Get Minio Access Key](/images/docs/appstore/minio/get_minio_access_key.png)

8. In this step, we can access Minio object storage service using ${Node IP}:${NODEPORT}, e.g. http://192.168.18.152:30116/ with the access key and secret key we got previously to login.

![Get Minio Access Key](/images/docs/appstore/minio/login_minio_console.png)

