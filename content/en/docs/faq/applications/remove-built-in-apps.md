---
title: "Remove Built-in Apps in KubeSphere"
keywords: "KubeSphere, OpenPitrix, Application, App"
description: "Learn how to remove built-in apps from the KubeSphere App Store."
linkTitle: "Remove Built-in Apps in KubeSphere"
Weight: 16910
---

As an open source and app-centric container platform, KubeSphere integrates 17 built-in apps in the App Store that is based on [OpenPitrix](https://github.com/openpitrix/openpitrix). They are accessible to all tenants in a workspace, while you can also remove them from the App Store. This tutorial demonstrates how to remove a built-in app from the App Store.

## Prerequisites

- You need to use a user with the role of `platform-admin` (for example, `admin`) for this tutorial.
- You need to [enable the App Store](../../../pluggable-components/app-store/).

## Remove a Built-in App

1. Log in to the web console of KubeSphere as `admin`, click **Platform** in the upper-left corner, and then select **App Store Management**.

2. On the **App Store** page, you can see all 17 built-in apps in the list. Select an app that you want to remove from the App Store. For example, click **Tomcat** to go to its detail page.

   ![click-tomcat](/images/docs/faq/applications/remove-built-in-apps/click_tomcat.png)

3. On the detail page of Tomcat, click **Suspend App** to remove the app.

   ![suspend-tomcat](/images/docs/faq/applications/remove-built-in-apps/suspend_tomcat.png)

4. In the dialog that appears, click **OK** to confirm your operation.

   ![confirm-suspend](/images/docs/faq/applications/remove-built-in-apps/confirm_suspend.png)

5. To make the app available again in the App Store, click **Activate App** and then click **OK** to confirm your operation.

   ![activate-tomcat](/images/docs/faq/applications/remove-built-in-apps/activate_tomcat.png)

   {{< notice note >}}

   You can also create a new account with necessary roles based on your needs. For more information about managing apps in KubeSphere, refer to [Application Lifecycle Management](../../../application-store/app-lifecycle-management/).

   {{</ notice >}}