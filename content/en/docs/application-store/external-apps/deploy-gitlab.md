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
- You need to create a workspace, a project, and two user accounts (`ws-admin` and `project-regular`) for this tutorial. The account `ws-admin` must be granted the role of `workspace-admin` in the workspace, and the account `project-regular` must be invited to the project with the role of `operator`. If they are not ready, refer to [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Add an app repository

1. Log in to KubeSphere as `ws-admin`. In your workspace, go to **App Repos** under **Apps Management**, and then click **Add Repo**.

   ![add-repo](/images/docs/appstore/external-apps/deploy-gitlab/add-repo.PNG)

2. In the dialog that appears, enter `main` for the app repository name and `https://charts.kubesphere.io/main` for the app repository URL. Click **Validate** to verify the URL and you will see a green check mark next to the URL if it is available. Click **OK** to continue.

   ![add-main-repo](/images/docs/appstore/external-apps/deploy-gitlab/add-main-repo.PNG)

3. The repository displays in the list after successfully imported to KubeSphere.

   ![added-main-repo](/images/docs/appstore/external-apps/deploy-gitlab/added-main-repo.PNG)

### Step 2: Deploy GitLab

1. Log out of KubeSphere and log back in as `project-regular`. In your project, go to **Applications** under **Application Workloads** and click **Deploy New Application**.

   ![deploy-app](/images/docs/appstore/external-apps/deploy-gitlab/deploy-app.PNG)

2. In the dialog that appears, select **From App Templates**.

   ![from-app-templates](/images/docs/appstore/external-apps/deploy-gitlab/from-app-templates.PNG)

3. Select `main` from the drop-down list, then click **gitlab**.

   ![click-gitlab](/images/docs/appstore/external-apps/deploy-gitlab/click-gitlab.PNG)

4. On the **App Info** tab and the **Chart Files** tab, you can view the default configuration from the console. Click **Deploy** to continue.

   ![view-config](/images/docs/appstore/external-apps/deploy-gitlab/view-config.PNG)

5. On the **Basic Info** page, you can view the app name, app version, and deployment location. Click **Next** to continue.

   ![basic-info](/images/docs/appstore/external-apps/deploy-gitlab/basic-info.PNG)

6. On the **App Config** page, use the following configurations to replace the default configurations, and then click **Deploy**.

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

   ![change-value](/images/docs/appstore/external-apps/deploy-gitlab/change-value.PNG)

   {{< notice note >}}

   `demo-project` refers to the project name where GitLab is deployed. Make sure you use your own project name.

   {{</ notice >}}

7. Wait for GitLab to be up and running.

   ![gitlab-running](/images/docs/appstore/external-apps/deploy-gitlab/gitlab-running.PNG)

8. Go to **Workloads**, and you can see all the Deployments and StatefulSets created for GitLab.

   ![deployments-running](/images/docs/appstore/external-apps/deploy-gitlab/deployments-running.PNG)

   ![statefulsets-running](/images/docs/appstore/external-apps/deploy-gitlab/statefulsets-running.PNG)

   {{< notice note >}}

   It may take a while before all the Deployments and StatefulSets are up and running.

   {{</ notice >}}

### Step 3: Get the root user's password

1. Go to **Secrets** under **Configurations**, enter `gitlab-initial-root-password` in the search bar, and then press **Enter** on your keyboard to search the Secret.

   ![search-secret](/images/docs/appstore/external-apps/deploy-gitlab/search-secret.PNG)

2. Click the Secret to go to its detail page, and then click the eye icon in the upper-right corner to view the password. Make sure you copy it.

   ![click-eye-icon](/images/docs/appstore/external-apps/deploy-gitlab/click-eye-icon.PNG)

   ![password](/images/docs/appstore/external-apps/deploy-gitlab/password.PNG)

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

1. Go to **Services** under **Application Workloads**, enter `nginx-ingress-controller` in the search bar, and then press **Enter** on your keyboard to search the Service. You can see the Service is being exposed through port `32618`, which you can use to access GitLab.

   ![search-service](/images/docs/appstore/external-apps/deploy-gitlab/search-service.PNG)

   {{< notice note >}}

   The port number shown on your console may be different. Make sure you use your own port number.

   {{</ notice >}}

2. Access GitLab through `http://gitlab.demo-project.svc.cluster.local:32618` using the root account and its initial password (`root/LAtonWwrzFvbAW560gaZ0oty6slpkCcywzzCCpeqql9bxIjJBMSGys43zSwq3d9I`).

   ![access-gitlab](/images/docs/appstore/external-apps/deploy-gitlab/access-gitlab.PNG)

   ![gitlab-console](/images/docs/appstore/external-apps/deploy-gitlab/gitlab-console.PNG)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.
   
   {{</ notice >}}
