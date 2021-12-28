---
title: 'Monitoring X.509 Certificates Expiration in Kubernetes Clusters with a Prometheus Exporter'  
keywords: x509-certificate-exporter, Prometheus, Kubernetes, Helm, KubeSphere, Certificate Monitoring 
description: This article details how to deploy x509-certificate-exporter in Kubernetes and monitor component certificates of a Kubernetes cluster using a custom alerting policy on KubeSphere.
createTime: '2021-11-01'  
author: 'Yang Chuansheng, Bettygogo'  
snapshot: '/images/blogs/en/x509-certificate-exporter/x509-certificate-exporter-cover-image.png'
---

KubeSphere offers a developer-friendly wizard that simplifies the operations & maintenance of Kubernetes, but it is essentially built on Kubernetes. Kubernetes' TLS certificates are valid for only one year, so we need to update the certificates every year, which is unavoidable even though the cluster is installed by the powerful and lightweight installation tool [KubeKey](https://github.com/kubesphere/kubekey). To prevent possible risks arising from certificate expiration, we need to find a way to monitor certificate validity of Kubernetes components.

Some of you may have heard of [ssl-exporter](https://github.com/ribbybibby/ssl_exporter), which exports metrics for SSL certificates collected from various sources, such as the HTTPS certificate, file certificate, Kubernetes Secret, and kubeconfig file. Basically, ssl-exporter can meet our needs, but it does not have a wealth of metrics. Here, I will share a more powerful Prometheus Exporter: [x509-certificate-exporter](https://github.com/enix/x509-certificate-exporter) with you.

Unlike ssl-exporter, x509-certificate-exporter only focuses on expiration monitoring of certificates of Kubernetes clusters, such as the file certificates of each component, Kubernetes TLS Secret, and kubeconfig file. Moreover, it provides more metrics. Next, I'll show you how to deploy x509-certificate-exporter on KubeSphere to monitor all certificates of the cluster.

## Prepare a KubeSphere App Template

With [OpenPitrix](https://github.com/openpitrix/openpitrix), a multicloud application management platform, [KubeSphere](https://kubesphere.io/) is capable of managing the full lifecycle of apps and allowing you to intuitively deploy and manage apps using the App Store and app templates. For an app that has not been published in the App Store, you can import its Helm chart to the public repository of KubeSphere, or import it to a private app repository to provide an app template.

Here, we use a KubeSphere app template to deploy x509-certificate-exporter.

To deploy an app using an app template, you need to create a workspace, a project, and two users (`ws-admin` and `project-regular`), and assign platform role `workspace-admin` in the workspace to `ws-admin`, and role `operator` in the project to `project-regular`. To begin with, let's review the multi-tenant architecture of KubeSphere.

### Multi-tenant Kubernetes Architecture

KubeSphere's multi-tenant system is divided into three levels: cluster, workspace, and project (equivalent to [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) of Kubernetes).

As the system workspace runs system resources, most of which are viewable only, it is suggested that you create a new [workspace](https://kubesphere.com.cn/en/docs/workspace-administration/what-is-workspace/). For security reasons, we strongly recommend you granting different permissions to different tenants when they are collaborating in a workspace.

You can create multiple workspaces in a KubeSphere cluster. In each workspace, you can create multiple projects. By default, KubeSphere has several built-in roles for each level. Additionally, KubeSphere allows you to create roles with customized permissions. Overall speaking, KubeSphere's multi-tenant architecture is ideal for enterprises and organizations who are yearning for role-based management.

### Create a User

After you have installed KubeSphere, you need to create users with different roles so that they can work within the authorized scope. Initially, the system has a default user `admin`, which has been assigned role `platform-admin`. In the following, we will create a user named `user-manager`, which will be used to create new users.

1. Log in to the KubeSphere web console as user `admin` and the default password is `P@88w0rd`.

> For account security, it is highly recommended that you change your password the first time you log in to the console. To change your password, click **User Settings** in the drop-down list in the upper-right corner. In **Password Settings**, set a new password. You also can change the language of the console in **User Settings**.

2. Click **Platform** in the upper-left corner, and then click **Access Control**.
   
   ![00-access-control](/images/blogs/en/x509-certificate-exporter/00-access-control.png)
   
   
   
   In the left navigation pane, click **Platform Roles**, and you will find four available built-in roles. Assign role `users-manager` to the first user you create.
   
   | Built-in Roles| Description|
   |----------|----------|
   | `workspaces-manager`| Workspace manager who can manage all workspaces on the KubeSphere platform.|
   | `users-manager`| User manager who can manage all users on the KubeSphere platform.|
   | `platform-regular`| Regular user who has no access to any resources before joining a workspace.|
   | `platform-admin`| Administrator who can manage all resources on the KubeSphere platform.|


3. In **Users**, click **Create**. In the displayed dialog box, provide all the necessary information (marked with *) and select `users-manager` for **Platform Role**. 
   
   ![01-create-user](/images/blogs/en/x509-certificate-exporter/01-create-user.png)
   
   Click ****OK****. In **Users**, you can find the newly created user in the user list.
   
4. Log out of the console and log back as user `user-manager` to create another three users listed in the following table.
   
   | User| Role| Description|
   |----------|----------|----------|
   | `ws-manager`| `workspaces-manager`| Creates and manages all workspaces.|
   | `ws-admin`| `platform-regular`| Manages all resources in a specified workspace (used to invite the `project-regular` user to the workspace).|
   | `project-regular`| `platform-regular`| Creates workloads, pipelines, and other resources in a specified project.|


5. In **Users**, you can view the three users you just created.
   
   ![02-three-users](/images/blogs/en/x509-certificate-exporter/02-three-users.png)

### Create a Workspace

In this section, you need to use user `ws-manager` created in the previous step to create a workspace. As a basic logic unit for the management of projects, workload creation, and organization members, workspaces underpin the multi-tenant system of KubeSphere.

1. Log in to KubeSphere as `ws-manager`, who has the permission to manage all workspaces on the platform. Click **Platform** in the upper-left corner and select **Access Control**. In **Workspaces**, you can see there is only one default workspace `system-workspace`, where system-related components and services run. You are not allowed to delete this workspace.
   
   ![03-ws-manager](/images/blogs/en/x509-certificate-exporter/03-ws-manager.png)
   
2. Click **Create** on the right, set a name for the new workspace (for example, `demo-workspace`) and set user `ws-admin` as the workspace administrator.
   
   ![04-create-workspace](/images/blogs/en/x509-certificate-exporter/04-create-workspace.png)
   
   Click **Create** after you finish.
   
3. Log out of the console, and log back in as `ws-admin`. In **Workspace Settings**, select **Workspace Members**, and then click **Invite**.

   ![05-invite-member](/images/blogs/en/x509-certificate-exporter/05-invite-member.png)

4. Invite `project-regular` to the workspace, assign it role `workspace-viewer`, and then click **OK**.

   > The actual role name follows a naming convention: \<workspace name>-\<role name>. For example, in workspace `demo-workspace`, the actual role name of role `viewer` is `demo-workspace-viewer`.

   ![06-assign-role](/images/blogs/en/x509-certificate-exporter/06-assign-role.png)

5. After you add `project-regular` to the workspace, click ****OK****. In **Workspace Members**, you can see two members listed.

   | User| Role| Description|
   |----------|----------|----------|
   | `ws-admin`| `workspace-admin`| Manages all resources under a workspace (Here, it is used to invite new members to the workspace and create a project).|
   | `project-regular`| `workspace-viewer`| Creates workloads and other resources in a specified project.|



### Create a Project

In this section, you need to use the previously created user `ws-admin` to create a project. A project in KubeSphere is the same as a namespace in Kubernetes, which provides virtual isolation for resources. For more information, see [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).

1. Log in to the KubeSphere web console as `ws-admin`. In **Projects**, click **Create**.
   
   ![07-create-project](/images/blogs/en/x509-certificate-exporter/07-create-project.png)
   
2. Enter a project name (for example, `exporter`) and click **OK**. You can also add an alias and description for the project.
   
   ![08-enter-project-name](/images/blogs/en/x509-certificate-exporter/08-enter-project-name.png)
   
3. In **Projects**, click the project name to view its details.
   
   ![09-view-project-info](/images/blogs/en/x509-certificate-exporter/09-view-project-info.png)
   
4. In **Project Settings**, select **Project Members**, click **Invite** to invite `project-regular` to the project, and assign role `operator` to `project regular`. 
   
   ![10-invite-project-member](/images/blogs/en/x509-certificate-exporter/10-invite-project-member.png)
   
   ![11-assign-project-role](/images/blogs/en/x509-certificate-exporter/11-assign-project-role.png)
   
   > Users with role `operator` are project maintainers who can manage resources other than users and roles in the project.

### Add an App Repository

1. Log in to the web console of KubeSphere as user `ws-admin`. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.
   
   ![12-add-repo](/images/blogs/en/x509-certificate-exporter/12-add-repo.png)

2. In the displayed dialog box, specify an app repository name (for example, `enix`) and add your repository URL (for example, `https://charts.enix.io`). Click **Validate** to validate the URL, and then click **OK**.

   ![13-add-repo2](/images/blogs/en/x509-certificate-exporter/13-add-repo2.png)

3. In **App Repositories**, you can view the created app repository.

   ![14-view-repo](/images/blogs/en/x509-certificate-exporter/14-view-repo.png)

## Deploy x509-certificate-exporter

After importing the app repository of x509-certificate-exporter, you can use the app template to deploy x509-certificate-exporter.

1. Log out of the KubeSphere web console and log in to the console as user `project-regular`. Click the project you created to go to the project page. Go to **Apps** under **Application Workloads**, and click **Create**.
   
   ![15-create-app](/images/blogs/en/x509-certificate-exporter/15-create-app.png)

2. In the displayed dialog box, select **From App Template**.
   
   ![16-create-app2](/images/blogs/en/x509-certificate-exporter/16-create-app2.png)
   
   **From App Store**: Chooses a built-in app or app uploaded as Helm charts.
   
   **From App Template**: Chooses an app from a private app repository or the current workspace.
   
4. In the drop-down list, select private app repository `enix` you just uploaded.
   
   ![17-select-enix](/images/blogs/en/x509-certificate-exporter/17-select-enix.png)
   
5. Select x509-certificate-exporter for deployment.
   
   ![18-select-x509](/images/blogs/en/x509-certificate-exporter/18-select-x509.png)
   
6. In the drop-down list of **Version**, select an app version, and then click **Deploy**. Meantime, you can view the app information and manifest.
   
   ![19-deploy-x590](/images/blogs/en/x509-certificate-exporter/19-deploy-x590.png)
   
7. Set an app name, confirm the app version and deployment location, and click **Next**.
   
   ![20-set-app-name](/images/blogs/en/x509-certificate-exporter/20-set-app-name.png)
   
8. In **App Settings**, you need to manually edit the manifest and specify the path to the certificate file.
   
   ![21-app-settings](/images/blogs/en/x509-certificate-exporter/21-app-settings.png)

   ```yaml
     daemonSets:
       master:
         nodeSelector:
           node-role.kubernetes.io/master: ''
         tolerations:
           - effect: NoSchedule
             key: node-role.kubernetes.io/master
             operator: Exists
         watchFiles:
           - /var/lib/kubelet/pki/kubelet-client-current.pem
           - /etc/kubernetes/pki/apiserver.crt
           - /etc/kubernetes/pki/apiserver-kubelet-client.crt
           - /etc/kubernetes/pki/ca.crt
           - /etc/kubernetes/pki/front-proxy-ca.crt
           - /etc/kubernetes/pki/front-proxy-client.crt
         watchKubeconfFiles:
           - /etc/kubernetes/admin.conf
           - /etc/kubernetes/controller-manager.conf
           - /etc/kubernetes/scheduler.conf
       nodes:
         tolerations:
           - effect: NoSchedule
             key: node-role.kubernetes.io/ingress
             operator: Exists
         watchFiles:
           - /var/lib/kubelet/pki/kubelet-client-current.pem
           - /etc/kubernetes/pki/ca.crt
   ```
   
   Two `DaemonSets` are created, where the master runs on the controller node and the nodes run on the compute node.
   
   ```bash
   $ kubectl -n exporter get ds
   
   NAME                                    DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                     AGE
   x509-x509-certificate-exporter-master   1         1         1       1            1           node-role.kubernetes.io/master=   3d14h
   x509-x509-certificate-exporter-nodes    3         3         3       3            3           <none>                            3d14h
   ```
   
   Here are how the parameters are defined:
   
   + **watchFiles:** Specifies the path to the certificate file.
   + **watchKubeconfFiles:** Specifies the path to the kubeconfig file.
   
    ![22-explain-parameters](/images/blogs/en/x509-certificate-exporter/22-explain-parameters.png)
   
10. Click **Install** and wait until the app is created successfully and runs.

![23-view-created-app](/images/blogs/en/x509-certificate-exporter/23-view-created-app.png)

## Integrate the Monitoring System

After you deploy the app using the app template, a `ServiceMonitor` will also be created along with two DaemonSets.

```bash
$ kubectl -n exporter get servicemonitor
NAME                             AGE
x509-x509-certificate-exporter   3d15h
```

Open the web UI of Prometheus, and you can see that the corresponding `Targets` are ready.

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629142812.png)

x509-certificate-exporter officially provides a [Grafana Dashboard](https://grafana.com/grafana/dashboards/13922), as shown in the following figure.[](https://grafana.com/grafana/dashboards/13922)

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629143502.jpg)

It can be seen that all metrics are crystal clear. Generally, we only need to focus on certificates that have expired and are about to expire. Suppose you want to know validity of a certificate, use the `(x509_cert_not_after{filepath!=""} - time()) / 3600 / 24` expression.

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629160148.png)

Additionally, you can create alerting policies so that the O\&M personnel can receive notifications when a certificate is about to expire and update the certificate in time. To create an alerting policy, perform the following steps:

1. Go to **Alerting Policies** under **Monitoring & Alerting**, and click **Create**.

![24-monitoring-alerting](/images/blogs/en/x509-certificate-exporter/24-monitoring-alerting.png)

2. Enter a name for the alerting policy, set the severity, and click **Next**.

![25-create-alerting-policy](/images/blogs/en/x509-certificate-exporter/25-create-alerting-policy.png)

3. Click the **Custom Rule** tab, and enter `(x509_cert_not_after{filepath!=""} - time()) / 3600 / 24 < 30` for **Rule Expression**.

![26-custom-rule](/images/blogs/en/x509-certificate-exporter/26-custom-rule.png)

4. Click **Next**. On the **Message Settings** page, fill in the summary and details of the alert.

![27-message-settings](/images/blogs/en/x509-certificate-exporter/27-message-settings.png)

5. Click **Create**, and the alerting policy is created.

![28-view-created-alerting-rule](/images/blogs/en/x509-certificate-exporter/28-view-created-alerting-rule.png)

## Summary

KubeSphere 3.1 has supported the built-in alerting policies for certificate expiration. To view the policies, go to **Alerting Policies**, click **Bulit-in Policies**, and enter `expir` in the search box.

![29-built-in-alerting-policy](/images/blogs/en/x509-certificate-exporter/29-built-in-alerting-policy.png)

Click the alerting policy name to view its rule expression.

![30-view-alerting-rule](/images/blogs/en/x509-certificate-exporter/30-view-alerting-rule.png)

Metrics in the rule expression is exposed by the API Server component, and does not contain certificates of all components of the cluster. To monitor certificates of all components, it is recommended that you create a custom alerting policy on KubeSphere while deploying x509-certificate-exporter. Trust me, you will be hassle-free from certificate expiration.