---
title: "Pipeline Settings"
keywords: 'KubeSphere, Kubernetes, Docker, Jenkins, Pipelines'
description: 'Understand various pipeline properties in a DevOps project.'
linkTitle: "Pipeline Settings"
weight: 11280
---

When you create a pipeline, you can customize its configurations through various settings. This document illustrates these settings in detail.

## Prerequisites

- You need to create a workspace, a DevOps project and a user (`project-regular`). This user must be invited to the DevOps project with the `operator` role. For more information, refer to [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to [enable the KubeSphere DevOps System](../../../pluggable-components/devops/).

## Basic Information

On the **Basic Information** tab, you can customize the following information:

- **Name**. The name of the pipeline. Pipelines in the same DevOps project must have different names.

- **DevOps Project**. The DevOps project to which the pipeline belongs.

- **Description**. The additional information to describe the pipeline. Description is limited to 256 characters.

- **Code Repository (optional)**. You can select a code repository as the code source for the pipeline. You can select GitHub, GitLab, Bitbucket, Git, and SVN as the code source.

  {{< tabs >}}

  {{< tab "GitHub" >}}

  If you select **GitHub**, you have to specify the credential for accessing GitHub. If you have created a credential with your GitHub token in advance, you can select it from the drop-down list, or you can click **Create Credential** to create a new one. Click **OK** after selecting the credential and you can view your repository on the right. Click the **√** icon after you finish all operations.

  {{</ tab >}}

  {{< tab "GitLab" >}}

  If you select **GitLab**, you have to specify the GitLab server address, project group/owner, and code repository. You also need to specify a credential if it is needed for accessing the code repository. Click the **√** icon after you finish all operations.

  {{</ tab >}}

  {{< tab "Bitbucket" >}}

  If you select **Bitbucket**, you have to enter your Bitbucket server address. You can create a credential with your Bitbucket username and password in advance and then select the credential from the drop-down list, or you can click **Create Credential** to create a new one. Click **OK** after entering the information, and you can view your repository on the right. Click the **√** icon after you finish all operations.

  {{</ tab >}}

  {{< tab "Git" >}}

  If you select **Git**, you have to specify the repository URL. You need to specify a credential if it is needed for accessing the code repository. You can also click **Create Credential** to create a new credential. Click the **√** icon after you finish all operations.

  {{</ tab >}}

  {{< tab "SVN" >}}

  If you select **SVN**, you have to specify the repository URL and the credential. You can also specify the branch included and excluded based on your needs. Click the **√** icon after you finish all operations.

  {{</ tab >}}

  {{</ tabs >}}

## Advanced Settings with Code Repository Specified

If you specify a code repository, you can customize the following configurations on the **Advanced Settings** tab:

### Branch Settings

**Delete outdated branches**. Delete outdated branches automatically. The branch record is deleted all together. The branch record includes console output, archived artifacts and other relevant metadata of specific branches. Fewer branches mean that you can save the disk space that Jenkins is using. KubeSphere provides two options to determine when old branches are discarded:

- **Branch Retention Period (days)**. Branches that exceeds the retention period are deleted.

- **Maximum Branches**. When the number of branches exceeds the maximum number, the earliest branch is deleted.

  {{< notice note >}}

  **Branch Retention Period (days)** and **Maximum Branches** apply to branches at the same time. As long as a branch meets the condition of either field, it will be discarded. For example, if you specify 2 as the number of retention days and 3 as the maximum number of branches, any branches that exceed either number will be discarded. KubeSphere prepopulates these two fields with 7 and 5 by default respectively.

  {{</ notice >}}

### Strategy Settings

In **Strategy Settings**, KubeSphere offers four strategies by default. As a Jenkins pipeline runs, the Pull Request (PR) submitted by developers will also be regarded as a separate branch.

**Discover Branches**

- **Exclude branches filed as PRs**. The branches filed as PRs are excluded.
- **Include only branches filed as PRs**. Only pull the branches filed as PRs.
- **Include all branches**. Pull all the branches from the repository.

**Discover Tags**

- **Enable tag discovery**. The branch with a specific tag is scanned.
- **Disable tag discovery**. The branch with a specific tag is not scanned.

**Discover PRs from Origin**

- **Pull the code with the PR merged**. A pipeline is created and runs based on the source code after the PR is merged into the target branch.
- **Pull the code at the point of the PR**. A pipeline is created and runs based on the source code of the PR itself.
- **Create two pipelines respectively**. KubeSphere creates two pipelines, one based on the source code after the PR is merged into the target branch, and the other based on the source code of the PR itself.

**Discover PRs from Forks**

- **Pull the code with the PR merged**. A pipeline is created and runs based on the source code after the PR is merged into the target branch.
- **Pull the code at the point of the PR**. A pipeline is created and runs based on the source code of the PR itself.
- **Create two pipelines respectively**. KubeSphere creates two pipelines, one based on the source code after the PR is merged into the target branch, and the other based on the source code of the PR itself.
- **Contributors**. The users who make contributions to the PR.
- **Everyone**. Every user who can access the PR.
- **Users with the admin or write permission**. Only from users with the admin or write permission to the PR.
- **None**. If you select this option, no PR will be discovered despite the option you select in **Pull Strategy**.

### Filter by Regex

Select the checkbox to specify a regular expression to filter branches, PRs, and tags.

### Script Path

The **Script Path** parameter specifies the Jenkinsfile path in the code repository. It indicates the repository’s root directory. If the file location changes, the script path also needs to be changed.

### Scan Trigger

Select **Scan periodically** and set the scan interval from the drop-down list.

### Build Trigger

You can select a pipeline from the drop-down list for **Trigger on Pipeline Creation** and **Trigger on Pipeline Deletion** so that when a new pipeline is created or a pipeline is deleted, the tasks in the specified pipeline can be automatically triggered.

### Clone Settings

- **Clone Depth**. The number of commits to fetch when you clone.
- **Clone Timeout Period (min)**. The number of minutes before which the cloning process has to complete.
- **Enable shallow clone**. Enable the shallow clone or not. If you enable it, the codes cloned will not contain tags.

### Webhook

**Webhook** is an efficient way to allow pipelines to discover changes in the remote code repository and automatically trigger a new running. Webhook should be the primary method to trigger Jenkins automatic scanning for GitHub and Git (for example, GitLab). 

## Advanced Settings with No Code Repository Specified

If you do not specify a code repository, you can customize the following configurations on the **Advanced Settings** tab:

### Build Settings

**Delete outdated build records**. Determine when the build records under the branch are deleted. The build record includes the console output, archived artifacts, and other metadata related to a particular build. Keeping fewer builds saves disk space used by Jenkins. KubeSphere provides two options to determine when old builds are deleted:

- **Build Record Retention Period (days)**. Build records that exceed the retention period are deleted.

- **Maximum Build Records**. When the number of build records exceeds the maximum number, the earliest build record is deleted.

  {{< notice note >}}

  These two conditions apply to the build at the same time. If either one is met first, the build will be discarded.

  {{</ notice >}}

- **No concurrent builds**. If you select this option, you cannot run multiple builds concurrently.

### Build Parameters

The parameterized build process allows you to pass in one or more parameters when you start to run a pipeline. KubeSphere provides five types of parameters by default, including **String**, **Multi-line string**, **Boolean**, **Options**, and **Password**. When you parameterize a project, the build is replaced with a parameterized build, which prompts the user to enter a value for each defined parameter.

### Build Trigger

**Build periodically**. It enables builds with a specified schedule. Click **Learn More** to see the detailed CRON syntax.







