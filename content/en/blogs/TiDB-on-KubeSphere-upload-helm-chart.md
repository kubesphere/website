---
title: 'TiDB on KubeSphere: Release a Cloud-Native Distributed Database to the KubeSphere App Store'
keywords: Kubernetes, KubeSphere, TiDB, QingCloud Kubernetes Engine
description: This blog demonstrates how to add a PingCap repository to KubeSphere to deploy tidb-operator and tidb-cluster.
tag: 'TiDB, Kubernetes, QKE'
createTime: '2020-11-30'
author: 'Will, Feynman, Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/tidb-architecture.png'
---

[My last blog](https://kubesphere.io/blogs/tidb-on-kubesphere-using-qke/) talked about how to deploy TiDB Operator and a TiDB cluster on KubeSphere. After you add an app repository to KubeSphere, apps within the repository are provided as app templates on the [container platform](https://kubesphere.io/). Tenants in the same workspace can deploy these app templates if they have necessary permissions. However, if you want these apps to be available to all workspace tenants, I recommend you release apps to the public repository of KubeSphere, also known as the KubeSphere App Store.

In this article, I will demonstrate another way to upload an app to KubeSphere and release it to the App Store.

## Before You Begin

- You have [prepared the environment with KubeSphere installed](https://kubesphere.io/blogs/tidb-on-kubesphere-using-qke/#preparing-environments).

- You have [enabled the KubeSphere App Store](https://kubesphere.io/docs/pluggable-components/app-store/).

## Preparing TiDB Helm Charts

As I will upload individual Helm charts of TiDB later, I need to first download them using [Helm](https://helm.sh/). Helm helps you create, install and manage Kubernetes applications.

1. If you have not installed Helm, refer to [the Helm documentation](https://helm.sh/docs/intro/install/) to install it or execute the following command directly.

   ```bash
   curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
   ```

2. Add the PingCAP TiDB Helm repository.

   ```bash
   helm repo add pingcap https://charts.pingcap.org/
   ```

3. View all the Helm charts in this repository.

   ```bash
   $ helm search repo pingcap --version=v1.1.6
   NAME                    CHART VERSION   APP VERSION     DESCRIPTION                            
   pingcap/tidb-backup     v1.1.6                          A Helm chart for TiDB Backup or Restore
   pingcap/tidb-cluster    v1.1.6                          A Helm chart for TiDB Cluster          
   pingcap/tidb-drainer    v1.1.6                          A Helm chart for TiDB Binlog drainer.  
   pingcap/tidb-lightning  v1.1.6                          A Helm chart for TiDB Lightning        
   pingcap/tidb-operator   v1.1.6          v1.1.6          tidb-operator Helm chart for Kubernetes
   pingcap/tikv-importer   release-1.1                     A Helm chart for TiKV Importer
   ```

   Note that the version I use in this article is v1.1.6. PingCAP released the v1.1.7 of the TiDB Operator recently, which is available in [its GitHub repository](https://github.com/pingcap/tidb-operator/releases).

4. Download the charts you need locally. For example:

   ```bash
   helm pull pingcap/tidb-operator --version=v1.1.6
   helm pull pingcap/tidb-cluster --version=v1.1.6
   ```

5. Make sure they have been successfully pulled.

   ```bash
   $ ls | grep tidb
   tidb-cluster-v1.1.6.tgz
   tidb-operator-v1.1.6.tgz
   ```


## Uploading Helm Charts to KubeSphere

Now that you have Helm charts ready, you can upload them to KubeSphere as app templates.

1. Log in to the web console of KubeSphere. As I described in my last blog, you need to create a workspace before you create any resources in it. You can see [the official documentation of KubeSphere](https://kubesphere.io/docs/quick-start/create-workspace-and-project/) to learn how to create a workspace.

   ![create-workspace](https://ap3.qingstor.com/kubesphere-website/docs/20201026192648.png)

2. Go to your workspace, and you can see that KubeSphere provides two methods to add Helm charts. My last blog explained detailed steps of importing an app repository to KubeSphere and deploying apps in it. Let's upload Helm charts as app templates this time. From the navigation bar, select **App Templates** and click **Upload Template** on the right.

   ![upload-tidb-chart-file](https://ap3.qingstor.com/kubesphere-website/docs/upload-tidb-chart-file.jpg)

3. Select the Helm chart you want to upload to KubeSphere. They will appear in the list below after successfully uploaded.

   ![tidb-file-uploaded](https://ap3.qingstor.com/kubesphere-website/docs/20201130142335.png)

## Deploying TiDB Operator and a TiDB Cluster

1. To deploy apps, you need to [create a project](https://kubesphere.io/docs/quick-start/create-workspace-and-project/#task-3-create-a-project) (i.e. namespace) where all workloads of an app run.

   ![create-project](https://ap3.qingstor.com/kubesphere-website/docs/20201026193410.png)

2. After the project is created, navigate to **Applications** and click **Deploy New Application**.

   ![deploy-new-app](https://ap3.qingstor.com/kubesphere-website/docs/20201026193632.png)

3. Select **From App Templates**.

   ![app-template](https://ap3.qingstor.com/kubesphere-website/docs/20201026193657.png)

4. All Helm charts uploaded individually as app templates will appear in **From workspace**. If you add an app repository to KubeSphere to provide app templates, they will display in other repositories in the drop-down list, which is exactly what I demonstrated in my last blog. Select **From workspace** here and click **tidb-cluster** and **tidb-operator** respectively to deploy them. For more information about how to configure them, see [my last blog](https://kubesphere.io/blogs/tidb-on-kubesphere-using-qke/).

   ![deploy-tidb](https://ap3.qingstor.com/kubesphere-website/docs/20201201141406.png)

## Releasing Apps to the App Store

[App templates](https://kubesphere.io/docs/project-user-guide/application/app-template/) enable users to deploy and manage apps in a visualized way. Internally, they play an important role as shared resources (e.g. databases, middleware and operating systems) created by enterprises for the coordination and cooperation within teams.

You can release apps you have uploaded to KubeSphere to the public repository, also known as the App Store. In this way, all tenants on the platform can see these apps and deploy them if they have necessary permissions regardless of the workspace they belong to.

1. Click **Platform** in the top-left corner and select **Access Control**.

2. On the **Workspaces** page, click the workspace where you have uploaded the Helm charts above.

   ![workspace-list](https://ap3.qingstor.com/kubesphere-website/docs/20201201145849.png)

3. Click **App Templates** from the navigation bar and you can see the apps uploaded. Now I will use TiDB Operator as an example to demonstrate how to release it to the App Store. Click **tidb-operator**.

   ![app-template-list](https://ap3.qingstor.com/kubesphere-website/docs/20201201150748.png)

4. On the detail page, click the version number to expand the menu where you can delete the version, deploy the app to test it, or submit it for review. KubeSphere allows you to manage an app across its entire lifecycle. For an enterprise, this is very useful when different tenants need to be isolated from each other and are only responsible for their own part as they manage an app version. For demonstration purposes, I will use the user `admin` to perform all the operations. As we do not need to test the app, click **Submit Review** directly.

   ![detail-page](https://ap3.qingstor.com/kubesphere-website/docs/20201201150948.png)

5. After the app is submitted for review, I need to approve it before it can be released to the App Store. Click **Platform** in the top-left corner and select **App Store Management**.

   ![app-store-management](https://ap3.qingstor.com/kubesphere-website/docs/20201201152220.png)

6. In **App Review** from the navigation bar, click the app submitted just now.

   ![review-app](https://ap3.qingstor.com/kubesphere-website/docs/20201201152456.png)

7. In the dialog that appears, inspect app information and chart files. Approve the app by clicking **Pass** if you think it is ready to be delivered.

   ![approve-app](https://ap3.qingstor.com/kubesphere-website/docs/20201201152734.png)

8. After the app is approved, you can release it to the App Store. Click **Platform** in the top-left corner,  select **Access Control**, and go back to your workspace. Select **App Templates** from the navigation bar and click **tidb-operator**.

   ![tidb-operator-app-template](https://ap3.qingstor.com/kubesphere-website/docs/20201201153102.png)

9. On the detail page, click the version number again and you can see that the status has reached **Passed** with the button **Submit Review** changed to **Release to Store**. Click **Release to Store**.

10. Click **OK** to confirm in the pop-up dialog.

    ![release-prompt](https://ap3.qingstor.com/kubesphere-website/docs/20201201153423.png)

11. To view the app released, click **App Store** in the top-left corner and you can see it in the App Store. Likewise, you can deploy **tidb-cluster** to the App Store by following the same step.

    ![tidb-operator](https://ap3.qingstor.com/kubesphere-website/docs/20201201154211.png)

    For more information about how to deploy an app from the App Store, see the [KubeSphere documentation](https://kubesphere.io/docs/project-user-guide/application/deploy-app-from-appstore/). You can also see [Application Lifecycle Management](https://kubesphere.io/docs/application-store/app-lifecycle-management/) to know more about how an app is managed across its entire lifecycle.

## Summary

Both TiDB and KubeSphere are powerful tools for us as we deploy containerized applications and use the distributed database on the cloud. As a big fan of open source, I hope both sides can continue to deliver efficient and effective cloud-native tools for us in production.

If you have any questions, don’t hesitate to contact us in [Slack](https://join.slack.com/t/kubesphere/shared_invite/zt-1ilxbsp39-t4ES4xn5OI0eF5hvOoAhEw) or [GitHub](https://github.com/kubesphere).

## References

[KubeSphere GitHub](https://github.com/kubesphere/kubesphere)

[TiDB GitHub](https://github.com/pingcap/TiDB)

[TiDB Operator Documentation](https://docs.pingcap.com/tidb-in-kubernetes/stable/tidb-operator-overview)

[KubeSphere Documentation](https://kubesphere.io/docs/)
