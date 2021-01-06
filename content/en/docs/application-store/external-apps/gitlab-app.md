---
title: "GitLab App"
keywords: 'kubernetes, kubesphere, gitlab, app-store'
description: 'How to deploy GitLab'


weight: 14310
---

## Objective

This tutorial shows you how to quickly deploy a [GitLab](https://gitlab.com/gitlab-org/gitlab) application using templates from KubeSphere Helm repo. The demonstration includes importing application repository, sharing and deploying apps within a workspace.

## Prerequisites

- You have enabled [OpenPitrix](/docs/pluggable-components/app-store/).
- You have completed the tutorial [Create Workspaces, Projects, Accounts and Roles](/docs/quick-start/create-workspace-and-project/). The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, we'll work in the project `apps` of the workspace `apps`.

## Hands-on Lab

### Step 1: Add an Application Repository

1.1. Sign in as workspace admin account (`apps-admin` for this guide), click **View Workspace** and navigate to **Apps Management → App Repos**, then click **Add Repo**.

  ![Add Repo](/images/docs/appstore/gitlab/add-repo.png)

1.2. Fill in the basic information, name it `main` and input the URL https://charts.kubesphere.io/main. You can validate if this URL is available, and choose OK when you have done.

  {{< notice note >}}
  It will automatically import all of the applications from the Helm repository into KubeSphere. You can browse those app templates in each project.
  {{</ notice >}}

  ![Add KS Repo](/images/docs/appstore/gitlab/add-ks-repo.png)

### Step 2: Browse App Templates

2.1. Switch to use workspace regular account to log in (`apps-regular` for this guide), then enter into project `apps`.

2.2. Click **Application Workloads → Applications**, click **Deploy New Application**.

  ![Deploy App](/images/docs/appstore/gitlab/deploy-app.png)

2.3. Choose **From App Templates** and select `main` from the dropdown list. Click `gitlab`.

  ![Deploy GitLab](/images/docs/appstore/gitlab/deploy-gitlab.png)

### Step 3: Deploy GitLab Application

3.1. Click **Deploy** at the top right, customize app name if needed, and then click **Next**.

  ![Deploy GitLab Info](/images/docs/appstore/gitlab/deploy-gitlab-info.png)

3.2. Customize App Config, and then click **Deploy**.

Generally we need to customize the domain name, and we'll use `apps.svc.cluster.local` here, which follows K8s internal DNS suffix for in-cluster access (the leading `apps` means the project `apps`, you can use your own project name accordingly).

  ```yaml
  global:
    hosts:
      domain: apps.svc.cluster.local

  gitlab-runner:
    install: false

  gitlab:
    webservice:
      helmTests:
        enabled: false
  ```

  ![GitLab configuration](/images/docs/appstore/gitlab/deploy-gitlab-conf.png)

3.3. Wait for a few minutes, then you will see the application `git` showing `active` in the application list.

  ![GitLab Active](/images/docs/appstore/gitlab/deploy-gitlab-done.png)

### Step 4: Expose GitLab Service

Set up a record `gitlab.<project>.svc.<k8s domain>` in the DNS server, or simply put it in `hosts` file.

```shell
172.24.2.3    gitlab.apps.svc.cluster.local
```

{{< notice note >}}

- The hosts file is `/etc/hosts` for Linux or `c:\windows\system32\drivers\etc\hosts` for Windows.
- You can use the IP address of any K8s master/worker node.

{{</ notice >}}

### Step 5: Access the GitLab Service

5.1. Enter kubectl CLI by clicking the button in popup menu at the right bottom of KubeSphere console.

  ![kubectl](/images/docs/appstore/gitlab/kubectl.png)

5.2. Retrieve and decode the root user's password.

  ```bash
  kubectl -n apps get secrets git-gitlab-initial-root-password -o jsonpath="{.data.password}" | base64 -d; echo
  ```

  ![GitLab Password](/images/docs/appstore/gitlab/gitlab-password.png)

5.3. Find the port of Nginx.

  ![Nginx Port](/images/docs/appstore/gitlab/nginx-port.png)

5.4. Accessed GitLab `http://gitlab.apps.svc.cluster.local:<nginx port>` with the password.

  ![Sign in GitLab](/images/docs/appstore/gitlab/signin-gitlab.png)
