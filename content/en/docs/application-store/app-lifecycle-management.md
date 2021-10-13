---
title: "Kubernetes Application Lifecycle Management"
keywords: 'Kubernetes, KubeSphere, app-store'
description: 'Manage your app across the entire lifecycle, including submission, review, test, release, upgrade and removal.'
linkTitle: 'Application Lifecycle Management'
weight: 14100
---

KubeSphere integrates [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source multi-cloud application management platform, to set up the App Store, managing Kubernetes applications throughout their entire lifecycle. The App Store supports two kinds of application deployment:

- **App templates** provide a way for developers and independent software vendors (ISVs) to share applications with users in a workspace. You can also import third-party app repositories within a workspace.
- **Composing apps** help users quickly build a complete application using multiple microservices to compose it. KubeSphere allows users to select existing services or create new services to create a composing app on the one-stop console.

![app-store](/images/docs/appstore/application-lifecycle-management/app-store.png)

Using [Redis](https://redis.io/) as an example application, this tutorial demonstrates how to manage the Kubernetes app throughout the entire lifecycle, including submission, review, test, release, upgrade and removal.

## Prerequisites

- You need to enable the [KubeSphere App Store (OpenPitrix)](../../pluggable-components/app-store/).
- You need to create a workspace, a project and a user (`project-regular`). For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Create a customized role and account

You need to create two accounts first, one for ISVs (`isv`) and the other (`reviewer`) for app technical reviewers.

1. Log in to the KubeSphere console with the account `admin`. Click **Platform** in the top-left corner and select **Access Control**. In **Account Roles**, click **Create**.

   ![create-role](/images/docs/appstore/application-lifecycle-management/create-role.png)

2. Set a name for the role, such as `app-review`, and click **Edit Permissions**.

   ![app-review-name](/images/docs/appstore/application-lifecycle-management/app-review-name.png)

3. In **App Management**, choose **App Template Management** and **App Template Viewing** in the permission list, then click **OK**.

   ![create-roles](/images/docs/appstore/application-lifecycle-management/create-roles.png)

   {{< notice note >}}

   The account granted the role `app-review` is able to view the App Store on the platform and manage apps, including review and removal.

   {{</ notice >}} 

4. As the role is ready now, you need to create a user and grant the role of `app-review` to it. In **Accounts**, click **Create**. Provide the required information and click **OK**.

   ![create-review-role](/images/docs/appstore/application-lifecycle-management/create-review-role.png)

5. Similarly, create another account `isv`, and grant the role of `platform-regular` to it.

   ![account-ready](/images/docs/appstore/application-lifecycle-management/account-ready.png)

6. Invite both accounts created above to an existing workspace such as `demo-workspace`, and grant them the role of `workspace-admin`.

### Step 2: Upload and submit an application

1. Log in to KubeSphere as `isv` and go to your workspace. You need to upload the example app Redis to this workspace so that it can be used later. First, download the app [Redis 11.3.4](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-11.3.4.tgz) and click **Upload Template** in **App Templates**.

   ![upload-app](/images/docs/appstore/application-lifecycle-management/upload-app.png)

   {{< notice note >}}

   In this example, a new version of Redis will be uploaded later to demonstrate the upgrade feature.

   {{</ notice >}} 

2. In the dialog that appears, click **Upload Helm Chart Package** to upload the chart file. Click **OK** to continue.

   ![upload-template](/images/docs/appstore/application-lifecycle-management/upload-template.png)

3. Basic information of the app displays under **App Information**. To upload an icon for the app, click **Upload icon**. You can also skip it and click **OK** directly.

   {{< notice note >}}

   Maximum accepted resolutions of the app icon: 96 x 96 pixels.

   {{</ notice >}} 

   ![upload-icon](/images/docs/appstore/application-lifecycle-management/upload-icon.png)

4. The app displays in the template list with the status **Draft** after successfully uploaded, which means this app is under development. The uploaded app is visible to all members in the same workspace.

   ![app-draft](/images/docs/appstore/application-lifecycle-management/app-draft.png)

5. Go to the detail page of the app template by clicking Redis from the list. You can edit the basic information of this app by clicking **Edit Information**.

   ![edit-app-template](/images/docs/appstore/application-lifecycle-management/edit-app-template.png)

6. You can customize the app's basic information by specifying the fields in the pop-up window.

   ![edit-app-information](/images/docs/appstore/application-lifecycle-management/edit-app-information.png)

7. Click **OK** to save your changes, then you can test this application by deploying it to Kubernetes. Click the draft version to expand the menu and select **Test Deployment**.

   ![test-deployment](/images/docs/appstore/application-lifecycle-management/test-deployment.png)

   {{< notice note >}} 

   If you don't want to test the app, you can submit it for review directly. However, it is recommended that you test your app deployment and function first before you submit it for review, especially in a production environment. This helps you detect any problems in advance and accelerate the review process. 

   {{</ notice >}} 

8. Select the cluster and project to which you want to deploy the app, set up different configurations for the app, and then click **Deploy**.

   ![deployment-place](/images/docs/appstore/application-lifecycle-management/deployment-place.png)

   ![deploying-app](/images/docs/appstore/application-lifecycle-management/deploying-app.png)

   {{< notice note >}}

   Some apps can be deployed with all configurations set in a form. You can use the toggle switch to see its YAML file, which contains all parameters you need to specify in the form. 

   {{</ notice >}} 

9. Wait for a few minutes, then switch to the tab **Deployed Instances**. You will find that Redis has been deployed successfully.

   ![deployed-instance-success](/images/docs/appstore/application-lifecycle-management/deployed-instance-success.png)

10. After you test the app with no issues found, you can click **Submit for Review** to submit this application for review.

    ![submit-for-review](/images/docs/appstore/application-lifecycle-management/submit-for-review.png)

    {{< notice note >}}

The version number must start with a number and contain decimal points.

{{</ notice >}}

11. After the app is submitted, the app status will change to **Submitted**. Now app reviewers can review it.

    ![submitted-app](/images/docs/appstore/application-lifecycle-management/submitted-app.png)

### Step 3: Review the application

1. Log out of KubeSphere and log back in as `reviewer`. Click **Platform** in the top-left corner and select **App Store Management**. On the **App Review** page, the app submitted in the previous step displays under the tab **Unprocessed**.

   ![app-to-be-reviewed](/images/docs/appstore/application-lifecycle-management/app-to-be-reviewed.png)

2. To review this app, click it to inspect the app information, introduction, chart file and update logs from the pop-up window.

   ![reviewing](/images/docs/appstore/application-lifecycle-management/reviewing.png)

3. It is the responsibility of the reviewer to decide whether the app meets the criteria to be released to the App Store. Click **Pass** to approve it or **Reject** to deny an app submission.

### Step 4: Release the application to the App Store

After the app is approved, `isv` can release the Redis application to the App Store, allowing all users on the platform to find and deploy this application.

1. Log out of KubeSphere and log back in as `isv`. Go to your workspace and click Redis on the **App Templates** page. On its detail page, expand the version menu, then click **Release to Store**. In the pop-up prompt, click **OK** to confirm.

   ![app-templates-page](/images/docs/appstore/application-lifecycle-management/app-templates-page.png)

2. Under **App Review**, you can see the app status. **Active** means it is available in the App Store.

   ![app-active](/images/docs/appstore/application-lifecycle-management/app-active.png)

3. Click **View in Store** to go to its **App Information** page in the App Store. Alternatively, click **App Store** in the top-left corner and you can also see the app.

   ![redis](/images/docs/appstore/application-lifecycle-management/redis.png)

   {{< notice note >}}

   You may see two Redis apps in the App Store, one of which is a built-in app in KubeSphere. Note that a newly-released app displays at the beginning of the list in the App Store.

   {{</ notice >}} 

4. Now, users in the workspace can deploy Redis from the App Store. To deploy the app to Kubernetes, click the app to go to its **App Information** page, and click **Deploy**.

   ![deploy-redis](/images/docs/appstore/application-lifecycle-management/deploy-redis.png)
   
   {{< notice note >}}
   
   If you have trouble deploying an application and the **Status** column shows **Failed**, you can hover your cursor over the **Failed** icon to see the error message.
   
   {{</ notice >}}

### Step 5: Create an app category

`reviewer` can create multiple categories for different types of applications based on their function and usage. It is similar to setting tags and categories can be used in the App Store as filters, such as Big Data, Middleware, and IoT.

1. Log in to KubeSphere as `reviewer`. To create a category, go to the **App Store Management** page and click <img src="/images/docs/appstore/application-lifecycle-management/plus.png" height="20px"> in **App Categories**.

   ![app-category](/images/docs/appstore/application-lifecycle-management/app-category.png)

2. Set a name and icon for the category in the dialog, then click **OK**. For Redis, you can enter `Database` for the field **Category Name**.

   ![set-app-type](/images/docs/appstore/application-lifecycle-management/set-app-type.png)

   {{< notice note >}}

   Usually, an app reviewer creates necessary categories in advance and ISVs select the category in which an app appears before submitting it for review. A newly-created category has no app in it.

   {{</ notice >}} 

3. As the category is created, you can assign the category to your app. In **Uncategorized**, select Redis and click **Change Category**. 

   ![set-category-for-app](/images/docs/appstore/application-lifecycle-management/set-category-for-app.png)

4. In the dialog, select the category (**Database**) from the drop-down list and click **OK**.

   ![confirm-category](/images/docs/appstore/application-lifecycle-management/confirm-category.jpg)

5. The app displays in the category as expected.

   ![app-in-category-list-expected](/images/docs/appstore/application-lifecycle-management/app-in-category-list-expected.png)

### Step 6: Add a new version

To allow workspace users to upgrade apps, you need to add new app versions to KubeSphere first. Follow the steps below to add a new version for the example app.

1. Log in to KubeSphere as `isv` again and navigate to **App Templates**. Click the app Redis in the list.

2. Download [Redis 12.0.0](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-12.0.0.tgz), which is a new version of Redis for demonstration in this tutorial. On the tab **Versions**, click **New Version** on the right to upload the package you just downloaded.

   ![new-version-redis](/images/docs/appstore/application-lifecycle-management/new-version-redis.png)

3. Click **Upload Helm Chart Package** and click **OK** after it is uploaded.

   ![upload-new-redis-version](/images/docs/appstore/application-lifecycle-management/upload-new-redis-version.png)

4. The new app version displays in the version list. You can click it to expand the menu and test the new version. Besides, you can also submit it for review and release it to the App Store, which is the same as the steps shown above.

   ![uploaded-new-version](/images/docs/appstore/application-lifecycle-management/uploaded-new-version.png)

   ![see-new-version](/images/docs/appstore/application-lifecycle-management/see-new-version.png)

### Step 7: Upgrade

After a new version is released to the App Store, all users can upgrade this application to the new version.

{{< notice note >}}

To follow the steps below, you must deploy an app of one of its old versions first. In this example, Redis 11.3.4 was already deployed in the project `demo-project` and its new version 12.0.0 was released to the App Store.

{{</ notice >}} 

1. Log in to KubeSphere as `project-regular`, navigate to the **Apps** page of the project, and click the app to be upgraded.

   ![app-to-be-upgraded](/images/docs/appstore/application-lifecycle-management/app-to-be-upgraded.png)

2. Click **More** and select **Edit Template** from the drop-down menu.

   ![edit-template](/images/docs/appstore/application-lifecycle-management/edit-template.png)

3. In the window that appears, you can see the YAML file of application configurations. Select the new version from the drop-down list on the right. You can customize the YAML file of the new version. In this tutorial, click **Update** to use the default configurations directly.

   ![upgrade-app](/images/docs/appstore/application-lifecycle-management/upgrade-app.png)

   {{< notice note >}}

   You can select the same version from the drop-down list on the right as that on the left to customize current application configurations through the YAML file.

   {{</ notice >}}

4. On the **Apps** page, you can see that the app is being upgraded. The status will change to **Running** when the upgrade finishes.

   ![version-upgraded](/images/docs/appstore/application-lifecycle-management/version-upgraded.png)

   ![upgrade-finish](/images/docs/appstore/application-lifecycle-management/upgrade-finish.png)

### Step 8: Suspend the application

You can choose to remove an app entirely from the App Store or suspend a specific app version.

1. Log in to KubeSphere as `reviewer`. Click **Platform** in the top-left corner and select **App Store Management**. On the **App Store** page, click Redis.

   ![remove-app](/images/docs/appstore/application-lifecycle-management/remove-app.png)

2. On the detail page, click **Suspend App** and select **OK** in the dialog to confirm the operation to remove the app from the App Store.

   ![suspend-app](/images/docs/appstore/application-lifecycle-management/suspend-app.png)

   {{< notice note >}}

   Removing an app from the App Store does not affect tenants who are using the app.

   {{</ notice >}} 

3. To make the app available in the App Store again, click **Activate App**.

   ![activate-app](/images/docs/appstore/application-lifecycle-management/activate-app.png)

4. To suspend a specific app version, expand the version menu and click **Suspend Version**. In the dialog that appears, click **OK** to confirm.

   ![suspend-version](/images/docs/appstore/application-lifecycle-management/suspend-version.png)

   {{< notice note >}}

   After an app version is suspended, this version is not available in the App Store. Suspending an app version does not affect tenants who are using this version.

   {{</ notice >}}

5. To make the app version available in the App Store again, click **Activate Version**.

   ![activate-version](/images/docs/appstore/application-lifecycle-management/activate-version.png)

   

   

   

   

