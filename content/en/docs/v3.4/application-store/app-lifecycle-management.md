---
title: "Kubernetes Application Lifecycle Management"
keywords: 'Kubernetes, KubeSphere, app-store'
description: 'Manage your app across the entire lifecycle, including submission, review, test, release, upgrade and removal.'
linkTitle: 'Application Lifecycle Management'
weight: 14100
---

KubeSphere integrates [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source multi-cloud application management platform, to set up the App Store, managing Kubernetes applications throughout their entire lifecycle. The App Store supports two kinds of application deployment:

- **Template-Based Apps** provide a way for developers and independent software vendors (ISVs) to share applications with users in a workspace. You can also import third-party app repositories within a workspace.
- **Composed Apps** help users quickly build a complete application using multiple microservices to compose it. KubeSphere allows users to select existing services or create new services to create a composed app on the one-stop console.

Using [Redis](https://redis.io/) as an example application, this tutorial demonstrates how to manage the Kubernetes app throughout the entire lifecycle, including submission, review, test, release, upgrade and removal.

## Prerequisites

- You need to enable the [KubeSphere App Store (OpenPitrix)](../../pluggable-components/app-store/).
- You need to create a workspace, a project and a user (`project-regular`). For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Create a customized role and two users

You need to create two users first, one for ISVs (`isv`) and the other (`reviewer`) for app technical reviewers.

1. Log in to the KubeSphere console with the user `admin`. Click **Platform** in the upper-left corner and select **Access Control**. In **Platform Roles**, click **Create**.

2. Set a name for the role, such as `app-review`, and click **Edit Permissions**.

3. In **App Management**, choose **App Template Management** and **App Template Viewing** in the permission list, and then click **OK**.

   {{< notice note >}}

   The user who is granted the role `app-review` has the permission to view the App Store on the platform and manage apps, including review and removal.

   {{</ notice >}} 

4. As the role is ready now, you need to create a user and grant the role `app-review` to it. In **Users**, click **Create**. Provide the required information and click **OK**.

5. Similarly, create another user `isv`, and grant the role of `platform-regular` to it.

6. Invite both users created above to an existing workspace such as `demo-workspace`, and grant them the role of `workspace-admin`.

### Step 2: Upload and submit an application

1. Log in to KubeSphere as `isv` and go to your workspace. You need to upload the example app Redis to this workspace so that it can be used later. First, download the app [Redis 11.3.4](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-11.3.4.tgz) and click **Upload Template** in **App Templates**.

   {{< notice note >}}

   In this example, a new version of Redis will be uploaded later to demonstrate the upgrade feature.

   {{</ notice >}} 

2. In the dialog that appears, click **Upload Helm Chart** to upload the chart file. Click **OK** to continue.

3. Basic information of the app displays under **App Information**. To upload an icon for the app, click **Upload Icon**. You can also skip it and click **OK** directly.

   {{< notice note >}}

   The maximum accepted resolution of the app icon is 96 x 96 pixels.

   {{</ notice >}} 

4. The app displays in the template list with the status **Developing** after it is successfully uploaded, which means this app is under development. The uploaded app is visible to all members in the same workspace.

5. Go to the detail page of the app template by clicking Redis from the list. You can edit the basic information of this app by clicking **Edit**.

6. You can customize the app's basic information by specifying the fields in the pop-up window.

7. Click **OK** to save your changes, then you can test this application by deploying it to Kubernetes. Click the draft version to expand the menu and click **Install**.

   {{< notice note >}} 

   If you don't want to test the app, you can submit it for review directly. However, it is recommended that you test your app deployment and function first before you submit it for review, especially in a production environment. This helps you detect any problems in advance and accelerate the review process. 

   {{</ notice >}} 

8. Select the cluster and project to which you want to deploy the app, set up different configurations for the app, and then click **Install**.

   {{< notice note >}}

   Some apps can be deployed with all configurations set in a form. You can use the toggle switch to see its YAML file, which contains all parameters you need to specify in the form. 

   {{</ notice >}} 

9. Wait for a few minutes, then switch to the tab **App Instances**. You will find that Redis has been deployed successfully.

10. After you test the app with no issues found, you can click **Submit for Release** to submit this application for release.

    {{< notice note >}}

The version number must start with a number and contain decimal points.

{{</ notice >}}

11. After the app is submitted, the app status will change to **Submitted**. Now app reviewers can release it.

### Step 3: Release the application

1. Log out of KubeSphere and log back in as `app-reviewer`. Click **Platform** in the upper-left corner and select **App Store Management**. On the **App Release** page, the app submitted in the previous step displays under the tab **Unreleased**.

2. To release this app, click it to inspect the app information, introduction, chart file and update logs from the pop-up window.

3. The reviewer needs to decide whether the app meets the release criteria on the App Store. Click **Pass** to approve it or **Reject** to deny an app submission.

### Step 4: Release the application to the App Store

After the app is approved, `isv` can release the Redis application to the App Store, allowing all users on the platform to find and deploy this application.

1. Log out of KubeSphere and log back in as `isv`. Go to your workspace and click Redis on the **Template-Based Apps** page. On its details page, expand the version menu, then click **Release to Store**. In the pop-up prompt, click **OK** to confirm.

2. Under **App Release**, you can see the app status. **Activated** means it is available in the App Store.

3. Click **View in Store** to go to its **Versions** page in the App Store. Alternatively, click **App Store** in the upper-left corner, and you can also see the app.

   {{< notice note >}}

   You may see two Redis apps in the App Store, one of which is a built-in app in KubeSphere. Note that a newly-released app displays at the beginning of the list in the App Store.

   {{</ notice >}} 

4. Now, users in the workspace can install Redis from the App Store. To install the app to Kubernetes, click the app to go to its **App Information** page, and click **Install**.
   
   {{< notice note >}}
   
   If you have trouble installing an application and the **Status** column shows **Failed**, you can hover your cursor over the **Failed** icon to see the error message.
   
   {{</ notice >}}

### Step 5: Create an application category

`app-reviewer` can create multiple categories for different types of applications based on their function and usage. It is similar to setting tags and categories can be used in the App Store as filters, such as Big Data, Middleware, and IoT.

1. Log in to KubeSphere as `app-reviewer`. To create a category, go to the **App Store Management** page and click <img src="/images/docs/v3.3/appstore/application-lifecycle-management/plus.png" height="20px"> in **App Categories**.

2. Set a name and icon for the category in the dialog, then click **OK**. For Redis, you can enter `Database` for the field **Name**.

   {{< notice note >}}

   Usually, an app reviewer creates necessary categories in advance and ISVs select the category in which an app appears before submitting it for review. A newly-created category has no app in it.

   {{</ notice >}} 

3. As the category is created, you can assign the category to your app. In **Uncategorized**, select Redis and click **Change Category**. 

4. In the dialog, select the category (**Database**) from the drop-down list and click **OK**.

5. The app displays in the category as expected.

### Step 6: Add a new version

To allow workspace users to upgrade apps, you need to add new app versions to KubeSphere first. Follow the steps below to add a new version for the example app.

1. Log in to KubeSphere as `isv` again and navigate to **Template-Based Apps**. Click the app Redis in the list.

2. Download [Redis 12.0.0](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-12.0.0.tgz), which is a new version of Redis for demonstration in this tutorial. On the tab **Versions**, click **New Version** on the right to upload the package you just downloaded.

3. Click **Upload Helm Chart** and click **OK** after it is uploaded.

4. The new app version displays in the version list. You can click it to expand the menu and test the new version. Besides, you can also submit it for review and release it to the App Store, which is the same as the steps shown above.

### Step 7: Upgrade an application

After a new version is released to the App Store, all users can upgrade this application to the new version.

{{< notice note >}}

To follow the steps below, you must deploy an app of one of its old versions first. In this example, Redis 11.3.4 was already deployed in the project `demo-project` and its new version 12.0.0 was released to the App Store.

{{</ notice >}} 

1. Log in to KubeSphere as `project-regular`, navigate to the **Apps** page of the project, and click the app to upgrade.

2. Click **More** and select **Edit Settings** from the drop-down list.

3. In the window that appears, you can see the YAML file of application configurations. Select the new version from the drop-down list on the right. You can customize the YAML file of the new version. In this tutorial, click **Update** to use the default configurations directly.

   {{< notice note >}}

   You can select the same version from the drop-down list on the right as that on the left to customize current application configurations through the YAML file.

   {{</ notice >}}

4. On the **Apps** page, you can see that the app is being upgraded. The status will change to **Running** when the upgrade finishes.

### Step 8: Suspend an application

You can choose to remove an app entirely from the App Store or suspend a specific app version.

1. Log in to KubeSphere as `app-reviewer`. Click **Platform** in the upper-left corner and select **App Store Management**. On the **App Store** page, click Redis.

2. On the detail page, click **Suspend App** and select **OK** in the dialog to confirm the operation to remove the app from the App Store.

   {{< notice note >}}

   Removing an app from the App Store does not affect tenants who are using the app.

   {{</ notice >}} 

3. To make the app available in the App Store again, click **Activate App**.

4. To suspend a specific app version, expand the version menu and click **Suspend Version**. In the dialog that appears, click **OK** to confirm.

   {{< notice note >}}

   After an app version is suspended, this version is not available in the App Store. Suspending an app version does not affect tenants who are using this version.

   {{</ notice >}}

5. To make the app version available in the App Store again, click **Activate Version**.

   

   

   

   

