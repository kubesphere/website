---
title: "Deploy GitLab on KubeSphere"
keywords: 'KubeSphere, Kubernetes, GitLab, App Store'
description: 'Learn how to deploy GitLab on KubeSphere and access its service.'
linkTitle: "Deploy GitLab on KubeSphere"
weight: 14310
---

[GitLab](https://about.gitlab.com/) is an open-source end-to-end software development platform with built-in version control, issue tracking, code review, CI/CD, and more.

This tutorial demonstrates how to deploy GitLab on KubeSphere.

## Prerequisites

- You need to enable [the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and two accounts (`ws-admin` and `project-regular`) for this tutorial. The account `ws-admin` must be granted the role of `workspace-admin` in the workspace, and the account `project-regular` must be invited to the project with the role of `operator`. If they are not ready, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Add an app repository

1. Log in to KubeSphere as `ws-admin`. In your workspace, go to **App Repositories** under **App Management**, and then click **Add**.

   ![add-repo](/images/docs/appstore/external-apps/deploy-gitlab/add_repo.png)

2. In the displayed dialog box, enter `main` for the app repository name and `https://charts.kubesphere.io/main` for the app repository URL. Click **Validate** to verify the URL and you will see a green check mark next to the URL if it is available. Click **OK** to continue.

   ![add-main-repo](/images/docs/appstore/external-apps/deploy-gitlab/add-main_repo.png)

3. The repository is displayed in the list after successfully imported to KubeSphere.

   ![added-main-repo](/images/docs/appstore/external-apps/deploy-gitlab/added-main_repo.png)

### Step 2: Deploy GitLab

1. Log out of KubeSphere and log back in as `project-regular`. In your project, go to **Apps** under **Application Workloads** and click **Deploy New App**.

   ![deploy-app](/images/docs/appstore/external-apps/deploy-gitlab/deploy_app.png)

2. In the displayed dialog box, select **From App Templates**.

   ![from-app-templates](/images/docs/appstore/external-apps/deploy-gitlab/from-app_templates.png)

3. Select `main` from the drop-down list, then click **gitlab**.

   ![click-gitlab](/images/docs/appstore/external-apps/deploy-gitlab/click_gitlab.png)

4. On the **App Information** tab and the **Chart Files** tab, you can view the default configuration from the console. Click **Deploy** to continue.

   ![view-config](/images/docs/appstore/external-apps/deploy-gitlab/view_config.png)

5. On the **Basic Information** page, you can view the app name, app version, and deployment location. This tutorial uses the version `4.2.3 [13.2.2]`. Click **Next** to continue.

   ![basic-info](/images/docs/appstore/external-apps/deploy-gitlab/basic_info.png)

6. On the **App Configurations** page, use the following configurations to replace the default configurations, and then click **Deploy**.

   ```yaml
   global:
     hosts:
       domain: demo-project.svc.cluster.local
   gitlab-runner:
     install: false
   gitlab:
     webservice:
       helmTests:
         enabled: false
   ```
   
   ![change-value](/images/docs/appstore/external-apps/deploy-gitlab/change_value.png)

   {{< notice note >}}

   `demo-project` refers to the project name where GitLab is deployed. Make sure you use your own project name.

   {{</ notice >}}

7. Wait for GitLab to be up and running.

   ![gitlab-running](/images/docs/appstore/external-apps/deploy-gitlab/gitlab_running.png)

8. Go to **Workloads**, and you can see all the Deployments and StatefulSets created for GitLab.

   ![deployments-running](/images/docs/appstore/external-apps/deploy-gitlab/deployments_running.png)

   ![statefulsets-running](/images/docs/appstore/external-apps/deploy-gitlab/statefulsets_running.png)

   {{< notice note >}}

   It may take a while before all the Deployments and StatefulSets are up and running.

   {{</ notice >}}

### Step 3: Get the root user's password

1. Go to **Secrets** under **Configurations**, enter `gitlab-initial-root-password` in the search box, and then press **Enter** on your keyboard to search the Secret.

   ![search-secret](/images/docs/appstore/external-apps/deploy-gitlab/search_secret.png)

2. Click the Secret to go to its detail page, and then click <img src="/images/docs/appstore/external-apps/deploy-gitlab/eye-icon.png" width="20px" /> in the upper-right corner to view the password. Make sure you copy it.

   ![password](/images/docs/appstore/external-apps/deploy-gitlab/initial_password.png)

### Step 4: Edit the hosts file

1. Find the hosts file on your local machine.

   {{< notice note >}}

   The path of hosts file is `/etc/hosts` for Linux, or `c:\windows\system32\drivers\etc\hosts` for Windows.

   {{</ notice >}}

2. Add the following item into the hosts file.

   ```
   192.168.4.3  gitlab.demo-project.svc.cluster.local
   ```

   {{< notice note >}}

   - `192.168.4.3` and `demo-project` refer to the NodeIP and project name respectively where GitLab is deployed. Make sure you use your own NodeIP and project name.
   - You can use any IP address of the nodes in your Kubernetes cluster.

   {{</ notice >}}

### Step 5: Access GitLab

1. Go to **Services** under **Application Workloads**, enter `nginx-ingress-controller` in the search box, and then press **Enter** on your keyboard to search the Service. You can see the Service is being exposed through port `31246`, which you can use to access GitLab.

   ![search-service](/images/docs/appstore/external-apps/deploy-gitlab/search_service.png)

   {{< notice note >}}

   The port number shown on your console may be different. Make sure you use your own port number.

   {{</ notice >}}

2. Access GitLab through `http://gitlab.demo-project.svc.cluster.local:31246` using the root account and its initial password (`root/ojPWrWECLWN0XFJkGs7aAqtitGMJlVfS0fLEDE03P9S0ji34XDoWmxs2MzgZRRWF`).

   ![access-gitlab](/images/docs/appstore/external-apps/deploy-gitlab/access_gitlab.png)

   ![gitlab-console](/images/docs/appstore/external-apps/deploy-gitlab/gitlab_console.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.
   
   {{</ notice >}}
