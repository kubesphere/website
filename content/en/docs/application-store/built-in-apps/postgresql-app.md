---
title: "PostgreSQL App"
keywords: 'Kubernetes, KubeSphere, PostgreSQL, app-store'
description: 'How to use built-in PostgreSQL'


weight: 2242
---
[PostgreSQL](https://www.postgresql.org/) is a powerful, open source object-relational database system which is famous for reliability, feature robustness, and performance. This guide will show you one-click deployment for PostgreSQL in Kubenetes .

## Prerequisites

- You have enabled [KubeSphere App Store](../../pluggable-components/app-store)
- You have completed the tutorial in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/). Now switch to use `project-regular` account to log in and enter into `demo-peoject`.

## Hands-on Lab

### Common steps

1. Choose PostgreSQL template `From App Store`.

![choose_postgresql_from_app_store](/images/docs/appstore/postgresql/choose_postgresql_from_app_store.png)

2. Check app info and click `Deploy` button.

![deploy_minio](/images/docs/appstore/postgresql/deploy_postgresql.png)

3. Select app version and deployment location, then go to **Next → Deploy**

![deploy_postgresql_confirm](/images/docs/appstore/postgresql/deploy_postgresql_confirm.png)

4. Wait for a few minutes, then you will see the application postgresql showing active on the application list.

![postgresql_active](/images/docs/appstore/postgresql/postgresql_active.png)

5. Click into PostgreSQL application, and then enter into its service page.

![View PostgreSQL Detail](/images/docs/appstore/postgresql/view_postgresql_service.png)

6. In this page, make sure its deployment and Pod are running, then click **More → Edit Internet Access**, and select **NodePort** in the dropdown list, click **OK** to save it.

![Expose PostgreSQL Service](/images/docs/appstore/postgresql/expose_postgresql_service.png)

7.Go to **App Template  → Configuration Files** and get rootUsername and rootPassword from `values.yaml`.

![Get PostgreSQL rootUsername/rootPassword](/images/docs/appstore/postgresql/get_postgresql_secret.png)

8. In this step, we can connect PostgreSQL db outside cluster using host: ${Node IP}, port: ${NODEPORT}, with the rootUsername and rootPassword we got previously.

![Connect PostgreSQL](/images/docs/appstore/postgresql/connect_postgresql.png)
