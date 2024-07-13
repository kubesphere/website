---
title: "Remove Built-in Apps in KubeSphere"
keywords: "KubeSphere, OpenPitrix, Application, App"
description: "Learn how to remove built-in apps from the KubeSphere App Store."
linkTitle: "Remove Built-in Apps in KubeSphere"
Weight: 16910
version: "v3.3"
---

As an open source and app-centric container platform, KubeSphere integrates apps in the App Store that is based on [OpenPitrix](https://github.com/openpitrix/openpitrix). They are accessible to all tenants in a workspace, while you can also remove them from the App Store. This tutorial demonstrates how to remove a built-in app from the App Store.

## Prerequisites

- You need to use a user with the role of `platform-admin` (for example, `admin`) for this tutorial.
- You need to [enable the App Store](../../../pluggable-components/app-store/).

## Remove a Built-in App

1. Log in to the web console of KubeSphere as `admin`, click **Platform** in the upper-left corner, and then select **App Store Management**.

2. On the **Apps** page, you can see all apps in the list. Select an app that you want to remove from the App Store. For example, click **Tomcat** to go to its detail page.

3. On the detail page of Tomcat, click **Suspend App** to remove the app.

4. In the displayed dialog box, click **OK** to confirm your operation.

5. To make the app available again in the App Store, click **Activate App** and then click **OK** to confirm your operation.

   {{< notice note >}}

   You can also create a new user with necessary roles based on your needs. For more information about managing apps in KubeSphere, refer to [Application Lifecycle Management](../../../application-store/app-lifecycle-management/).

   {{</ notice >}}