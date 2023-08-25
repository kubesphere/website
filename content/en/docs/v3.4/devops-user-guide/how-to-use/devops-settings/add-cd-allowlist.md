---
title: "Add a Continuous Deployment Allowlist"
keywords: 'Kubernetes, GitOps, KubeSphere, CI/CD, Allowlist'
description: 'Describe how to add a continuous deployment allowlist on KubeSphere.'
linkTitle: "Add a Continuous Deployment Allowlist"
weight: 11243
---
In KubeSphere 3.3, you can set an allowlist so that only specific code repositories and deployment locations can be used for continuous deployment.

## Prerequisites

- You have a workspace, a DevOps project and a user (`project-regular`) invited to the DevOps project with the `operator` role. If they are not ready yet, please refer to [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

- You need to [enable the KubeSphere DevOps system](../../../../pluggable-components/devops/).

- You need to [import an code repository](../../../../devops-user-guide/how-to-use/code-repositories/import-code-repositories/).

## Procedures

1. Log in to the KubeSphere console as `project-regular`. In the navigation pane on the left, click **DevOps Projects**.

2. On the **DevOps Projects** page, click the DevOps project you created.

3. In the navigation pane on the left, choose **DevOps Project Settings > Basic Information**.

4. In **Continuous Deployment Allowlist** on the right, click **Enable Allowlist**.

5. In the **Edit Allowlist** dialog box, choose a code repository and the cluster and project where the code deployment will be deployed, and then click **OK**. You can click **Add** to add multiple code repositories and deployment locations.