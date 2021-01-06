---
title: "Application Lifecycle Management"
keywords: 'Kubernetes, KubeSphere, app-store'
description: 'App Lifecycle Management'
linkTitle: 'Application Lifecycle Management'
weight: 14100
---

KubeSphere integrates [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source multi-cloud application management platform, to set up the App Store, managing applications throughout their entire lifecycle. The App Store supports two kinds of application deployment:

- **App templates** provide a way for developers and independent software vendors (ISVs) to share applications with users in a workspace. You can also import third-party app repositories within a workspace.
- **Composing apps** help users quickly build a complete application using multiple microservices to compose it. KubeSphere allows users to select existing services or create new services to create a composing app on the one-stop console.

![app-store](/images/docs/appstore/application-lifecycle-management/app-store.png)

Using [Redis](https://redis.io/) as an example application, this tutorial demonstrates how to manage the app throughout the entire lifecycle, including submission, review, test, release, upgrade and removal.

## Prerequisites

- You need to enable [KubeSphere App Store (OpenPitrix)](../../pluggable-components/app-store/).
- You need to create a workspace, a project and an account (`project-regular`). For more information, see [Create Workspaces, Projects, Accounts and Roles](../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Create a customized role and account

You need to create two accounts first, one for ISVs (`isv`) and the other (`reviewer`) for app technical reviewers.

1. Log in to the KubeSphere console with the account `admin`. Click **Platform** in the top left corner and select **Access Control**. In **Account Roles**, click **Create**.

   ![create-role](/images/docs/appstore/application-lifecycle-management/create-role.jpg)

2. Set a name for the role, such as `app-review`, and click **Edit Authorization**.

   ![app-review-name](/images/docs/appstore/application-lifecycle-management/app-review-name.jpg)

3. In **Apps Management**, choose **App Templates Management** and **App Templates View**  in the authorization list, then click **OK**.

   ![create-roles](/images/docs/appstore/application-lifecycle-management/create-roles.png)

   {{< notice note >}}

   The account granted the role `app-review` is able to view the App Store on the platform and manage apps, including review and removal.

   {{</ notice >}} 

4. As the role is ready now, you need to create an account and grant the role of `app-review` to it. In **Accounts**, click **Create**. Provide the required information and click **OK**.

   ![create-review-role](/images/docs/appstore/application-lifecycle-management/create-review-role.jpg)

5. Similarly, create another account `isv`, and grant the role of `platform-regular` to it.

   ![account-ready](/images/docs/appstore/application-lifecycle-management/account-ready.jpg)

6. Invite both accounts created above to an existing workspace such as `demo-workspace`, and grant them the role of `workspace-admin`.

### Step 2: Upload and submit an application

1. Log in to KubeSphere as `isv` and go to your workspace. You need to upload the example app Redis to this workspace so that it can be used later. First, download the app [Redis 11.3.4](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-11.3.4.tgz) and click **Upload Template** in **App Templates**.

   ![upload-app](/images/docs/appstore/application-lifecycle-management/upload-app.jpg)

   {{< notice note >}}

   In this example, a new version of Redis will be uploaded later to demonstrate the upgrade feature.

   {{</ notice >}} 

2. In the dialog that appears, click **Upload Helm Chart Package** to upload the chart file. Click **OK** to continue.

   ![upload-template](/images/docs/appstore/application-lifecycle-management/upload-template.jpg)

3. Basic information of the app displays under **App Info**. To upload an icon for the app, click **Upload icon**. You can also skip it and click **OK** directly.

   {{< notice note >}}

   Maximum accepted resolutions of the app icon: 96 x 96 pixels.

   {{</ notice >}} 

   ![upload-icon](/images/docs/appstore/application-lifecycle-management/upload-icon.jpg)

4. The app displays in the template list with the status **draft** after successfully uploaded, which means this app is under development. The uploaded app is visible to all members in the same workspace.

   ![app-draft](/images/docs/appstore/application-lifecycle-management/app-draft.jpg)

5. Go to the detail page of the app template by clicking Redis from the list. You can edit the basic information of this app by clicking **Edit Info**.

   ![edit-app-template](/images/docs/appstore/application-lifecycle-management/edit-app-template.jpg)

6. You can customize the app's basic information by specifying the fields in the pop-up window.

   ![edit-app-information](/images/docs/appstore/application-lifecycle-management/edit-app-information.jpg)

7. Click **OK** to save your changes, then you can test this application by deploying it to Kubernetes. Click the draft version to expand the menu and select **Test Deploy**.

   ![test-deployment](/images/docs/appstore/application-lifecycle-management/test-deployment.jpg)

   {{< notice note >}} 

   If you don't want to test the app, you can submit it for review directly. However, it is recommended that you test your app deployment and function first before you submit it for review, especially in a production environment. This helps you detect any problems in advance and accelerate the review process. 

   {{</ notice >}} 

8. Select the cluster and project to which you want to deploy the app, set up different configurations for the app, and then click **Deploy**.

   ![deployment-place](/images/docs/appstore/application-lifecycle-management/deployment-place.jpg)

   ![deploying-app](/images/docs/appstore/application-lifecycle-management/deploying-app.jpg)

   {{< notice note >}}

   Some apps can be deployed with all configurations set in a form. You can use the toggle switch to see its YAML file, which contains all parameters you need to specify in the form. 

   {{</ notice >}} 

9. Wait for a few minutes, then switch to the tab **Deployed Instances**. You will find that Redis has been deployed successfully.

   ![deployed-instance-success](/images/docs/appstore/application-lifecycle-management/deployed-instance-success.jpg)

10. After you test the app with no issues found, you can click **Submit Review** to submit this application for review.

    ![submit-for-review](/images/docs/appstore/application-lifecycle-management/submit-for-review.jpg)

    {{< notice note >}}
    

The version number must start with a number and contain decimal points.

{{</ notice >}}

11. After the app is submitted, the app status will change to **Submitted**. Now app reviewers can review it.

    ![submitted-app](/images/docs/appstore/application-lifecycle-management/submitted-app.jpg)

### Step 3: Review the application

1. Log out and log back in KubeSphere as `reviewer`. Click **Platform** in the top left corner and select **App Store Management**. On the **App Review** page, the app submitted in the previous step displays under the tab **Unprocessed**.

   ![app-to-be-reviewed](/images/docs/appstore/application-lifecycle-management/app-to-be-reviewed.jpg)

2. To review this app, click it to inspect the app information, introduction, chart file and update logs from the pop-up window.

   ![reviewing](/images/docs/appstore/application-lifecycle-management/reviewing.jpg)

3. It is the responsibility of the reviewer to decide whether the app meets the criteria to be released to the App Store. Click **Pass** to approve it or **Reject** to deny an app submission.

### Step 4: Release the application to the App Store

After the app is approved, `isv` can release the Redis application to the App Store, allowing all users on the platform to find and deploy this application.

1. Log out and log back in KubeSphere as `isv`. Go to your workspace and click Redis on the **App Templates** page. On its detail page, expand the version menu, then click **Release to Store**. In the pop-up prompt, click **OK** to confirm.

   ![app-templates-page](/images/docs/appstore/application-lifecycle-management/app-templates-page.jpg)

2. Under **Audit Records**, you can see the app status. **Active** means it is available in the App Store.

   ![app-active](/images/docs/appstore/application-lifecycle-management/app-active.jpg)

3. Click **View in Store** to go to its **App Info** page in the App Store. Alternatively, click **App Store** in the top left corner and you can also see the app.

   ![redis](/images/docs/appstore/application-lifecycle-management/redis.jpg)

   {{< notice note >}}

   You may see two Redis apps in the App Store, one of which is a built-in app in KubeSphere. Note that a newly-released app displays at the beginning of the list in the App Store.

   {{</ notice >}} 

4. Now, users in the workspace can deploy Redis from the App Store. To deploy the app to Kubernetes, click the app to go to its **App Info** page, and click **Deploy**.

   ![deploy-redis](/images/docs/appstore/application-lifecycle-management/deploy-redis.jpg)

### Step 5: Create an app category

`reviewer` can create multiple categories for different types of applications based on their function and usage. It is similar to setting tags and categories can be used in the App Store as filters, such as Big Data, Middleware, and IoT.

1. Log in to KubeSphere as `reviewer`. To create a category, go to the **App Store Management** page and click the plus icon in **App Categories**.

   ![app-category](/images/docs/appstore/application-lifecycle-management/app-category.jpg)

2. Set a name and icon for the category in the dialog, then click **OK**. For Redis, you can input `Database` for the field **Category Name**.

   ![set-app-type](/images/docs/appstore/application-lifecycle-management/set-app-type.jpg)

   {{< notice note >}}

   Usually, an app reviewer creates necessary categories in advance and ISVs select the category in which an app appears before submitting it for review. A newly-created category has no app in it.

   {{</ notice >}} 

3. As the category is created, you can assign the category to your app. In **Uncategorized**, select Redis and click **Change Category**. 

   ![set-category-for-app](/images/docs/appstore/application-lifecycle-management/set-category-for-app.jpg)

4. In the dialog, select the category (**Database**) from the drop-down list and click **OK**.

   ![confirm-category](/images/docs/appstore/application-lifecycle-management/confirm-category.jpg)

5. The app displays in the category as expected.

   ![app-in-category-list-expected](/images/docs/appstore/application-lifecycle-management/app-in-category-list-expected.jpg)

### Step 6: Add a new version

To allow workspace users to upgrade apps, you need to add new app versions to KubeSphere first. Follow the steps below to add a new version for the example app.

1. Log in to KubeSphere as `isv` again and navigate to **App Templates**. Click the app Redis in the list.

   ![redis-new-version](/images/docs/appstore/application-lifecycle-management/redis-new-version.jpg)

2. Download [Redis 12.0.0](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-12.0.0.tgz), which is a new version of Redis for demonstration in this tutorial. In the tab **Versions**, click **New Version** on the right to upload the package you just downloaded.

   ![new-version-redis](/images/docs/appstore/application-lifecycle-management/new-version-redis.jpg)

3. Click **Upload Helm Chart Package** and click **OK** after it is uploaded.

   ![upload-new-redis-version](/images/docs/appstore/application-lifecycle-management/upload-new-redis-version.jpg)

4. The new app version displays in the version list. You can click it to expand the menu and test the new version. Besides, you can also submit it for review and release it to the App Store, which is the same as the steps shown above.

   ![uploaded-new-version](/images/docs/appstore/application-lifecycle-management/uploaded-new-version.jpg)

   ![see-new-version](/images/docs/appstore/application-lifecycle-management/see-new-version.jpg)

### Step 7: Upgrade

After a new version is released to the App Store, all users can upgrade this application to the new version.

{{< notice note >}}

To follow the steps below, you must deploy an app of one of its old versions first. In this example, Redis 11.3.4 was already deployed in the project `demo-project` and its new version 12.0.0 was released to the App Store.

{{</ notice >}} 

1. Log in to KubeSphere as `project-regular`, navigate to the **Applications** page of the project, and click the app to be upgraded.

   ![app-to-be-upgraded](/images/docs/appstore/application-lifecycle-management/app-to-be-upgraded.jpg)

2. Under **App Template**, select **Version Info**. You can see all released app versions in the list. The app version you are using currently is marked with **Current Version**. To upgrade your app to a specific version, click **Upgrade** on the right of the version number.

   {{< notice note >}}

   You must move your cursor onto the app version to see the **Upgrade** button.

   {{</ notice >}} 

   ![upgrade-an-app](/images/docs/appstore/application-lifecycle-management/upgrade-an-app.jpg)

3. On the **Applications** page, you can see that the app is being upgraded. The status will change to **active** when the upgrade finishes.

   ![version-upgraded](/images/docs/appstore/application-lifecycle-management/version-upgraded.jpg)

   ![upgrade-finish](/images/docs/appstore/application-lifecycle-management/upgrade-finish.jpg)

### Step 8: Suspend the application

You can choose to remove an app entirely from the App Store or suspend a specific app version.

1. Log in to KubeSphere as `reviewer`. Click **Platform** in the top left corner and go to **App Store Management**. On the **App Store** page, click Redis.

   ![remove-app](/images/docs/appstore/application-lifecycle-management/remove-app.jpg)

2. On the detail page, click **Suspend App** and select **OK** in the dialog to confirm the operation to remove the app from the App Store.

   ![suspend-app](/images/docs/appstore/application-lifecycle-management/suspend-app.jpg)

   {{< notice note >}}

   Removing an app from the App Store does not affect tenants who are using the app.

   {{</ notice >}} 

3. To make the app available in the App Store again, click **Activate App**.

   ![activate-app](/images/docs/appstore/application-lifecycle-management/activate-app.jpg)

4. To suspend a specific app version, expand the version menu and click **Suspend Version**. In the dialog that appears, click **OK** to confirm.

   ![suspend-version](/images/docs/appstore/application-lifecycle-management/suspend-version.jpg)

   {{< notice note >}}

   After an app version is suspended, this version is not available in the App Store. Suspending an app version does not affect tenants who are using this version.

   {{</ notice >}}

5. To make the app version available in the App Store again, click **Activate Version**.

   ![activate-version](/images/docs/appstore/application-lifecycle-management/activate-version.jpg)

   

   

   

   

