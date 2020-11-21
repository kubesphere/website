---
title: "Deploy GitLab on KubeSphere"
keywords: 'Kubernetes, KubeSphere, GitLab, app-store'
description: 'How to deploy GitLab on KubeSphere'
linkTitle: "Deploy GitLab on KubeSphere"
weight: 2240
---

## Objective

This tutorial shows you how to quickly deploy a [GitLab](https://gitlab.com/gitlab-org/gitlab) application using templates from KubeSphere Helm repo. The demonstration includes importing application repository, sharing and deploying apps within a workspace.

## Prerequisites

- You have enabled [OpenPitrix](/docs/pluggable-components/app-store/).
- You have completed the tutorial of [Create Workspace, Project, Account and Role](/docs/quick-start/create-workspace-and-project/). Namely, you must have a workspace, a project, and two accounts (`ws-admin` and `project-regular`). `ws-admin` must have the role of `workspace-admin` in the workspace and `project-regular` must be invited to the project with the role of `operator`

## Hands-on Lab

### Step 1: Add an App Repository

1. Log in the web console of KubeSphere as `ws-admin`. In your workspace, go to **App Repos** under **Apps Management**, and then click **Add Repo**.

   ![import-repo](/images/docs/appstore/external-apps/gitlab-app/import-repo.jpg)

2. In the dialogue that appears, specify an app repository name (e.g. `demo-repository`) and add your repository URL. This tutorial uses `https://charts.kubesphere.io/main` as the private repository, which contains the app GitLab. 

3. After you specify required fields, click **Validate** to verify the URL. You will see a green check mark next to the URL if it is available and click **OK** to finish.

   ![validate-link](/images/docs/appstore/external-apps/gitlab-app/validate-link.jpg)

   {{< notice note >}}

   After the repository is imported, you can deploy apps in the repository as app templates in all projects in this workspace.

   {{</ notice >}}

4. You can see that the repository displays in the list as below.

   ![repository-list](/images/docs/appstore/external-apps/gitlab-app/repository-list.jpg)

### Step 2: Deploy GitLab

1. Log out of KubeSphere and log back in as `project-regular`. In your project, choose **Applications** under **Application Workloads** and click **Deploy New Application**.

   ![deploy-app](/images/docs/appstore/external-apps/gitlab-app/deploy-app.jpg)

2. Select **From App Templates** from the pop-up dialogue.

   ![from-app-templates](/images/docs/appstore/external-apps/gitlab-app/from-app-templates.jpg)

3. Select `demo-repository` from the drop-down list, which is the private app repository just uploaded, and click GitLab.

   ![select-repo](/images/docs/appstore/external-apps/gitlab-app/select-repo.jpg)

4. You can view its app information and configuration files. Under **Versions**, select a version number from the list and click **Deploy**.

   ![gitlab-config](/images/docs/appstore/external-apps/gitlab-app/gitlab-config.jpg)

5. Set an app name and confirm the version and deployment location. Click **Next** to continue.

   ![confirm-name](/images/docs/appstore/external-apps/gitlab-app/confirm-name.jpg)

6. On the **App Config** page, specify the domain name of GitLab which will be used later to access the app. For example, set `.global.hosts.domain` to `demo-project.svc.cluster.local`.

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

   - For the domain name, it follows the internal NDS suffix of Kubernetes for the access within the cluster. The leading `demo-project` in the domain name in this example refers to the project name. Make sure you replace it with your own project name.

   - Set `.gitlab-runner.install` to `false` as the tutorial does not demonstrate CI/CD jobs.

   - Set `.gitlab.webservice.helmTests.enabled` to `false` as the tutorial does not need to test the deployment.

   {{</ notice >}} 

7. After you finish editing the configuration, click **Deploy**. Wait for a few minutes, then you will see the application `git` showing `active` in the application list.

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
