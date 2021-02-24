---
title: "下架 KubeSphere 中的内置应用"
keywords: "KubeSphere, OpenPitrix, 应用程序, 应用"
description: "如何下架 KubeSphere 中的内置应用"
linkTitle: "下架 KubeSphere 中的内置应用"
Weight: 16910
---

As an open-source and app-centric container platform, KubeSphere integrates 15 built-in apps in the App Store that is based on [OpenPitrix](https://github.com/openpitrix/openpitrix).

If you want to remove the built-in apps in KubeSphere, you have to use the account `admin` with the default role of `platform-admin` to log in to the web console of KubeSphere, and then follow the steps as below:

1. Click **Platform** in the upper left corner, and then select **App Store Management**.

   ![click-platform](/images/docs/zh-cn/faq/applications/remove-built-in-apps/click-platform.PNG)

   ![select-app-store-management](/images/docs/zh-cn/faq/applications/remove-built-in-apps/select-app-store-management.PNG)

2. In the **App Store** page, you can see all 15 built-in apps displayed in the list. Click **tomcat** to go to its detail page.

   ![click-tomcat](/images/docs/zh-cn/faq/applications/remove-built-in-apps/click-tomcat.PNG)

3. In the detail page of tomcat, click **Suspend App** to remove the app.

   ![suspend-tomcat](/images/docs/zh-cn/faq/applications/remove-built-in-apps/suspend-tomcat.PNG)

4. In the dialog that appears, click **OK** to confirm your operation.

   ![confirm-suspend](/images/docs/zh-cn/faq/applications/remove-built-in-apps/confirm-suspend.PNG)

5. To make the app available again in the App Store, click **Activate App** and then click **OK** to confirm your operation.

   ![activate-tomcat](/images/docs/zh-cn/faq/applications/remove-built-in-apps/activate-tomcat.PNG)

   {{< notice note >}}

   You can also create a new account with necessary roles based on your needs. For more information about managing apps in KubeSphere, refer to [Application Lifecycle Management](../../../application-store/app-lifecycle-management/).

   {{</ notice >}}