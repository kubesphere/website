---
title: "Reuse the Same App Name after Its Deletion"
keywords: "KubeSphere, OpenPitrix, Application, App"
description: "Learn how to reuse the same app name after its deletion."
linkTitle: "Reuse the Same App Name after Its Deletion"
Weight: 16920
---

To deploy an app in KubeSphere, tenants can go to the App Store and select the available app based on their needs. However, tenants could experience errors when deploying an app with the same app name as that of the deleted one. This tutorial demonstrates how to use the same app name after its deletion.

## Prerequisites

- You need to use a user invited to your project with the role of `operator`. This tutorial uses the account `project-regular` for demonstration purposes. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to [enable the App Store](../../../pluggable-components/app-store/).

## Reuse the Same App Name

### Deploy an app from the App Store

1. Log in to the web console of KubeSphere as `project-regular` and deploy an app from the App Store. This tutorial uses Redis as an example app and set the app name as `redis-1`. For more information about how to deploy Redis, refer to [Deploy Redis on KubeSphere](../../../application-store/built-in-apps/redis-app/).

   ![redis-1](/images/docs/faq/applications/use-the-same-app-name-after-deletion/redis-1.PNG)

2. Click the app to go to its detail page, and then click **Delete** to delete it.

   ![delete-redis-1](/images/docs/faq/applications/use-the-same-app-name-after-deletion/delete-redis-1.PNG)

### Reuse the same app name

1. If you try to deploy a new Redis app with the same app name as `redis-1`, you can see the following error prompt in the upper-right corner.

   ![error-prompt](/images/docs/faq/applications/use-the-same-app-name-after-deletion/error-prompt.PNG)

2. In your project, go to **Secrets** under **Configurations**, and enter `redis-1` in the search bar to search the Secret.

   ![search-secret](/images/docs/faq/applications/use-the-same-app-name-after-deletion/search-secret.PNG)

3. Click the Secret to go to its detail page, and click **More** to select **Delete** from the drop-down menu.

   ![delete-secret](/images/docs/faq/applications/use-the-same-app-name-after-deletion/delete-secret.PNG)

4. In the dialog that appears, enter the Secret name and click **OK** to delete it.

   ![confirm-delete](/images/docs/faq/applications/use-the-same-app-name-after-deletion/confirm-delete.PNG)

5. Now, you can deploy a new Redis app with the same app name as `redis-1`.

   ![new-redis-app](/images/docs/faq/applications/use-the-same-app-name-after-deletion/new-redis-app.PNG)
