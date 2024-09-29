---
title: "Release Notes for 3.4.1"
keywords: "Kubernetes, KubeSphere, Release Notes"
description: "KubeSphere 3.4.1 Release Notes"
linkTitle: "Release Notes - 3.4.1"
weight: 18093
---

## App Store

### Bug Fixes

- Fix the error on the application repository page. 
- Fix the error in the application approval process.
- Support "select" in Appdeploy schemaform.


## Console

### Bug Fixes

- Fix the issue of losing status when modifying a CRD.
- Fix the incorrect style for IsolateInfo and RuleInfo in the Network Policy panel.
- Fix inaccurate Chinese translations on some pages.
- Fix the resource creation failure issue in higher versions of Kubernetes.
- Fix the issue in the dashboard where the names in Recently Access are obscured.
- Fix the issue on the list page where the Customize Columns button displays incomplete content.
- Fix the display error of pod status.
- Fix the issue on the PVC page where the capacity selection numbers are displayed incorrectly.
- Fix the issue when adding containers on the Create Deployment page, using tags to search for images is not working.
- Support building ARM64 images.

## Multi Cluster

### Bug Fixes

- Fix the issue where CD-related clusters are displayed incorrectly in a multi-cluster environment.
- Fix the issue of mistakenly adding a host cluster as a member cluster of another cluster.


## Observability

### Bug Fixes

- Fix the issue that CPU and memory statistics charts are not displaying.
- Fix API call errors on the notification channel page.
- Fix the blank log receiver page.
- Fix the issue on the new notification channel page where conditional filtering values are missing.


## Authentication & Authorization

### Bug Fixes

- Fix LDAP login failure.

## DevOps

### Bug Fixes

- Fix the issue where shell is not effective in graphical editing.
- When a cluster is not ready or does not install DevOps, DevOps projects are unavailable.
- Fix the incorrect parameter passing in Jenkins.
- Fix the issue that clicking the replay button pops up an error prompt.
- Fix the issue that the details of a pipeline cannot be viewed.
-  Fix the run error due to the large DevOps pipeline logs.
- Fix Jenkins image vulnerability.
- Fix the issue that failed to upgrade DevOps to 3.4.0.
- Fix the error in the cleanup task.
- Fix the failure to set a timeout.
- Fix the bug with downloading multi-branch-pipeline artifacts.
- Fix the issue that disabling discarded history pipelineruns doesn't work.
- Fix the issue that some application resources are not deleted when cascade deleting multiple applications.

### Enhancements & Updates

- Display the git repo link on the Pipeline page.
- Improve the API documentation for DevOps.

## User Experience

### Bug Fixes

- Fix the issue on the Statefuls page where the Pod Grace Period parameter is missing.
- Fix the issue where the cluster gateway is not displayed in cluster management.
- Fix the error when creating an application route.
- Add pagination for listing repository tags.


## Monitoring

### Bug Fixes

- Fix the issue that the Monitoring Target field is displayed blank.

For more information about issues and contributors of KubeSphere 3.4.1, see [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.4.1.md).