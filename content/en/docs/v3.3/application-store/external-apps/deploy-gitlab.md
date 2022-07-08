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

2. In the displayed dialog box, enter `main` for the app repository name and `https://charts.kubesphere.io/main` for the app repository URL. Click **Validate** to verify the URL and you will see a green check mark next to the URL if it is available. Click **OK** to continue.

3. The repository displays in the list after it is successfully imported to KubeSphere.

### Step 2: Deploy GitLab

1. Log out of KubeSphere and log back in as `project-regular`. In your project, go to **Apps** under **Application Workloads** and click **Create**.

2. In the dialog box that appears, select **From App Template**.

3. Select `main` from the drop-down list, then click **gitlab**.

4. On the **App Information** tab and the **Chart Files** tab, you can view the default settings on the console. Click **Install** to continue.

5. On the **Basic Information** page, you can view the app name, app version, and deployment location. This tutorial uses the version `4.2.3 [13.2.2]`. Click **Next** to continue.

6. On the **App Settings** page, use the following settings to replace the default ones, and then click **Install**.

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

   {{< notice note >}}

   `demo-project` refers to the project name where GitLab is deployed. Make sure you use your own project name.

   {{</ notice >}}

7. Wait for GitLab to be up and running.

8. Go to **Workloads**, and you can see all the Deployments and StatefulSets created for GitLab.

   {{< notice note >}}

   It may take a while before all the Deployments and StatefulSets are up and running.

   {{</ notice >}}

### Step 3: Get the root user's password

1. Go to **Secrets** under **Configuration**, enter `gitlab-initial-root-password` in the search box, and then press **Enter** on your keyboard to search the Secret.

2. Click the Secret to go to its detail page, and then click <img src="/images/docs/v3.3/appstore/external-apps/deploy-gitlab/eye-icon.png" width="20px" alt="icon" /> in the upper-right corner to view the password. Make sure you copy it.

### Step 4: Edit the hosts file

1. Find the `hosts` file on your local machine.

   {{< notice note >}}

   The path of the `hosts` file is `/etc/hosts` for Linux, or `c:\windows\system32\drivers\etc\hosts` for Windows.

   {{</ notice >}}

2. Add the following item into the `hosts` file.

   ```
   192.168.4.3  gitlab.demo-project.svc.cluster.local
   ```

   {{< notice note >}}

   - `192.168.4.3` and `demo-project` refer to the NodeIP and project name respectively where GitLab is deployed. Make sure you use your own NodeIP and project name.
   - You can use any IP address of the nodes in your Kubernetes cluster.

   {{</ notice >}}

### Step 5: Access GitLab

1. Go to **Services** under **Application Workloads**, enter `nginx-ingress-controller` in the search box, and then press **Enter** on your keyboard to search the Service. You can see the Service has been exposed through port `31246`, which you can use to access GitLab.

   {{< notice note >}}

   The port number shown on your console may be different. Make sure you use your own port number.

   {{</ notice >}}

2. Access GitLab through `http://gitlab.demo-project.svc.cluster.local:31246` using the root account and its initial password (`root/ojPWrWECLWN0XFJkGs7aAqtitGMJlVfS0fLEDE03P9S0ji34XDoWmxs2MzgZRRWF`).

   ![access-gitlab](/images/docs/v3.3/appstore/external-apps/deploy-gitlab/access_gitlab.png)

   ![gitlab-console](/images/docs/v3.3/appstore/external-apps/deploy-gitlab/gitlab_console.png)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on where your Kubernetes cluster is deployed.
   
   {{</ notice >}}
