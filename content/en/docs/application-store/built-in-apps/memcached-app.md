---
title: "Memcached App"
keywords: 'Kubernetes, KubeSphere, Memcached, app-store'
description: 'How to use built-in Memcached Object Storage'


weight: 2242
---
[Memcached](https://memcached.org/) is designed for large data caches. Its API is available for most popular languages. This guide will show you one-click deployment for Memcached in Kubenetes .

## Prerequisites

- You have enabled [KubeSphere App Store](../../pluggable-components/app-store)
- You have completed the tutorial in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/). Now switch to use `project-regular` account to log in and enter into `demo-peoject`.

## Hands-on Lab

### Common steps

1. Choose Memcached template `From App Store`.

![choose_memcached_from_app_store](/images/docs/appstore/memcached/choose_memcached_from_app_store.png)

2. Check app info and click `Deploy` button.

![deploy_minio](/images/docs/appstore/memcached/deploy_memcached.png)

3. Select app version and deployment location, then go to **Next → Deploy**

![deploy_memcached_confirm](/images/docs/appstore/memcached/deploy_memcached_confirm.png)

4. Wait for a few minutes, then you will see the application memcached showing active on the application list.

![minio_active](/images/docs/appstore/memcached/memcached_active.png)
