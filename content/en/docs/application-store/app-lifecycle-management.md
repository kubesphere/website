---
title: "Application Lifecycle Management"
keywords: 'Kubernetes, KubeSphere, app-store'
description: 'App Lifecycle Management'
linkTitle: 'Application Lifecycle Management'
weight: 2240
---

KubeSphere integrates [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source multi-cloud application management platform, to set up the App Store, managing applications throughout their entire lifecycle. The App Store supports two kinds of application deployment as follows:

- **App template** provides a way for developers and independent software vendors (ISVs) to share applications with users in a workspace. You can also import third-party app repositories within a workspace.
- **Composing app** means users can quickly build a complete application using multiple microservices to compose it. KubeSphere allows users to select existing services or create new services to create a composing app on the one-stop console.

![app-store](/images/docs/appstore/application-lifecycle-management/app-store.png)

## Objective

This tutorial demonstrates how to use [EMQ X](https://www.emqx.io/) as an example application to manage apps throughout the entire lifecycle, including submission, review, test, release, upgrade and deletion. 



demonstrate the **global application store** and **application lifecycle management** including upload / submit / review / test / release / upgrade / delete application templates.

## Prerequisites

- You need to enable [KubeSphere App Store (OpenPitrix)](../../pluggable-components/app-store).
- You need to create a workspace and a project. For more information, see [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Create Customized Role and Account

You need to create two accounts first, one for ISVs (`isv`) and the other (`reviewer`) for app technical reviewers.

1. Log in the KubeSphere console with the account `admin`. Click **Platform** in the top left corner and select **Access Control**. In **Account Roles**, click **Create**.

   ![create-role](/images/docs/appstore/application-lifecycle-management/create-role.jpg)

2. Set a name for the role, such as `app-review`, and click **Edit Authorization**.

   ![app-review-name](/images/docs/appstore/application-lifecycle-management/app-review-name.jpg)

3. In **Apps Management**, choose **App Templates Management** and **App Templates View**  in the authorization settings list, then click **OK**.

   ![create-roles](/images/docs/appstore/application-lifecycle-management/create-roles.png)

   {{< notice note >}}

   The account granted the role `app-review` is able to view the App Store on the platform and manage apps, including release, removal, and review.

   {{</ notice >}} 

4. As the role is ready now, you need to create an account and grant the role of `app-review` to it. In **Accounts**, click **Create**. Provide the required information and click **OK**.

   ![create-review-role](/images/docs/appstore/application-lifecycle-management/create-review-role.jpg)

5. Similarly, create another account `isv`, and grant the role of `platform-regular` to it.

   ![account-ready](/images/docs/appstore/application-lifecycle-management/account-ready.jpg)

6. Invite both accounts created above to an existing workspace such as `demo-workspace`, and grant them the role of `workspace-admin`.

### Step 2: Upload and Submit Application

1. Log in KubeSphere as `isv` and go to your workspace. You need to upload the example app EMQ X to this workspace so that it can be used later. First, download the app [EMQ X chart v1.0.0](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v1.0.0-rc.1.tgz) and click **Upload Template** in **App Templates**.

   ![upload-app](/images/docs/appstore/application-lifecycle-management/upload-app.jpg)

   {{< notice note >}}

   In this example, a new version of EMQ X will be uploaded later to demonstrate the upgrade feature.

   {{</ notice >}} 

2. In the dialogue that appears, click **Upload Helm Chart Package** to upload the chart file. Click **OK** to continue.

   ![upload-templates](/images/docs/appstore/application-lifecycle-management/upload-templates.png)

3. Basic information of the app displays under **App Info**. To upload an icon for the app, click **Upload icon**. You can also skip it and click **OK** directly.

   {{< notice note >}}

   Maximum accepted resolutions of the app icon: 96 x 96 pixels.

   {{</ notice >}} 

   ![upload-icons](/images/docs/appstore/application-lifecycle-management/upload-icons.png)

4. The app displays in the template list after successfully uploaded with the status **draft**, which means this app is under development. The uploaded app is visible to all members in the same workspace.

   ![app-templates-draft](/images/docs/appstore/application-lifecycle-management/app-templates-draft.png)

5. Go to the detail page of the app template by clicking EMQ X from the list. You can edit the basic information of this app by clicking **Edit Info**.

   ![edit-template](/images/docs/appstore/application-lifecycle-management/edit-template.png)

6. You can customize the app's basic information by specifying the fields in the pop-up window.

   ![edit-app-info](/images/docs/appstore/application-lifecycle-management/edit-app-info.jpg)

7. Save your changes, then you can test this application by deploying it to Kubernetes. Click the draft version to expand the menu and select **Test Deploy**.

   ![test-deploy](/images/docs/appstore/application-lifecycle-management/test-deploy.jpg)

   {{< notice note >}} 

   If you don't want test the app, you can submit it for review directly. However, it is recommended that you test your app deployment and function first before you submit it for review, especially in a production environment. This helps you detect any problems in advance and accelerate the review process. 

   {{</ notice >}} 

8. Select the cluster and project to which you want to deploy the app, check the app configuration, and then click **Deploy**.

   ![select-project](/images/docs/appstore/application-lifecycle-management/select-project.jpg)

   ![app-deploy](/images/docs/appstore/application-lifecycle-management/app-deploy.jpg)

9. Wait for a few minutes, then switch to the tab **Deployed Instances**. You will find EMQ X has been deployed successfully.

   ![deployed-instance](/images/docs/appstore/application-lifecycle-management/deployed-instance.jpg)

10. Click **Submit Review** to submit this application for review.

    ![submit-for-app-review](/images/docs/appstore/application-lifecycle-management/submit-for-app-review.jpg)

    {{< notice note >}}
    

The version number automatically created cannot be used directly here. You need to set a version number manually, such as `1.0.0`. Note that it must start with a number and contain decimal points.

{{</ notice >}}

11. After the app is submitted, the app status will change to **Submitted**. Now app reviewers can review it.

    ![submitted-status](/images/docs/appstore/application-lifecycle-management/submitted-status.jpg)

### Step 3: Review Application

1. Log out and log back in KubeSphere as `reviewer`. Click **Platform** in the top left corner and select **App Store Management**. The app submitted in the previous step displays under the tab **Unprocessed**.

   ![app-unprocessed](/images/docs/appstore/application-lifecycle-management/app-processing.jpg)

2. To review this app, click it to inspect the app information, introduction, chart file and update logs from the pop-up window.

   ![review](/images/docs/appstore/application-lifecycle-management/review.jpg)

3. It is the responsibility of the reviewer to decide whether the app meets the criteria to be released to the App Store. Click **Pass** to approve it or **Reject** to deny an app submission.

### Step 4: Release Application to Store

After the app is approved, `isv` can release the EMQ X application to the App Store, allowing all users on the platform to find and deploy this application.

1. Log out and log back in KubeSphere as `isv`. Go to your workspace and navigate to the EMQ X app from the template list. On its detail page, expand the version menu, then click **Release to Store**. In the pop-up prompt, click **OK** to confirm.

   ![release-to-store](/images/docs/appstore/application-lifecycle-management/release-to-store.jpg)

2. Under **Audit Records**, you can see the app status. **Active** means it is available in the App Store.

   ![audit-records](/images/docs/appstore/application-lifecycle-management/audit-records.jpg)

3. Click **View in Store** to go to its **App Info** page in the App Store. Alternatively, click **App Store** in the top left corner and you can also see the app.

   ![emqx](/images/docs/appstore/application-lifecycle-management/emqx.jpg)

4. Now, users in the workspace can deploy EMQ X from the App Store. To deploy the app to Kubernetes, click the app to go to its **App Info** page, and click **Deploy**.

   ![deploy-emqx](/images/docs/appstore/application-lifecycle-management/deploy-emqx.png)

### Step 5: Create App Category

`Reviewer` can create multiple categories for different types of applications based on their function and usage. It is similar to setting tags and categories can be used in the App Store as filters, such as Big Data, Middleware, and IoT.

1. To create a category, go to the **App Store Management** page and click the plus icon in **App Categories**.

   ![app-category](/images/docs/appstore/application-lifecycle-management/app-category.jpg)

2. Set a name and icon for the category in the dialogue, then click **OK**. For EMQ X, you can input `IoT` for the field **Category Name**.

   ![app-category-1](/images/docs/appstore/application-lifecycle-management/app-category-1.jpg)

   {{< notice note >}}

   Usually, an app reviewer creates necessary categories in advance and ISVs select the category in which an app appears before submitting it for review. A newly created category has no app in it.

   {{</ notice >}} 

3. As the category is created, you can assign the category to your app. In **Uncategorized**, select EMQ X and click **Change Category**. 

   ![assign-category](/images/docs/appstore/application-lifecycle-management/assign-category.jpg)

4. In the dialogue, select the category (**IoT**) from the drop-down list and click **OK**.

   ![category-select](/images/docs/appstore/application-lifecycle-management/category-select.jpg)

5. The app displays in the category as expected.

   ![app-in-category-list](/images/docs/appstore/application-lifecycle-management/app-in-category-list.jpg)

### Step 6: Add New Version

To allow workspace users to upgrade apps, you need to add new app versions to KubeSphere first. Follow the steps below to add a new version for the example app.

1. Log in KubeSphere as `isv` again and navigate to **App Templates**. Click the app EMQ X in the list.

   ![template-list-one-app](/images/docs/appstore/application-lifecycle-management/template-list-one-app.jpg)

2. Download [EMQ X v4.0.2](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v4.0.2.tgz), which is the new version of EMQ X. In the tab **Versions**, click **New Version** on the right to upload the package you just downloaded.

   ![create-new-version](/images/docs/appstore/application-lifecycle-management/create-new-version.jpg)

3. Click **Upload Helm Chart Package** and click **OK** after it is uploaded.

   ![upload-new-version](/images/docs/appstore/application-lifecycle-management/upload-new-version.jpg)

4. The new app version displays in the version list. You can click it to expand the menu and test the new version. Besides, you can also submit it for review and release it to the App Store, which is the same as the steps shown above.

   ![new-version-draft](/images/docs/appstore/application-lifecycle-management/new-version-draft.jpg)

   ![test-new-version](/images/docs/appstore/application-lifecycle-management/test-new-version.jpg)

### Step 7: Upgrade

After the new version has been released to application store, all users can upgrade from this application.