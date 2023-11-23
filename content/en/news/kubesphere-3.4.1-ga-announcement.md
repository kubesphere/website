---
title: 'KubeSphere 3.4.1 Released: fixed bugs'
tag: 'Product News'
keyword: 'open source, Kubernetes, KubeSphere, K8s, release, news, AI, GPU'
description: 'KubeSphere 3.4.1 is a patch to KubeSphere 3.4.0, focusing on Console and DevOps enhancements and fixes.'
createTime: '2023-11-15'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4.1-ga.png'
---

We are pleased to announce the official release of KubeSphere 3.4.1!

This release was made possible by 15 contributors and we thank you for your support and contributions to the KubeSphere project!

KubeSphere 3.4.1 is a patch to KubeSphere 3.4.0, focusing on Console and DevOps enhancements and fixes.

## Console

- Fix inaccurate Chinese translations in some page fields.
- Fix the issue on the project overview page where help information is missing.
- Fix the issue on the list page where the custom content button displays incomplete content.
- Fix the issue of resource creation failing in higher versions of Kubernetes.


## DevOps
- Fix the problem where you can’t view the details of a pipeline.
- Fix the issue with incorrect parameter passing in Jenkins.
- Fix the issue where graphical shell editing is not effective. 
- Fix bug of gc pipelineruns.
- Fix the issue of some application resources not being deleted when cascade delete multiple applications.
- Fix the failure to set a timeout. 


## Observability
- Fix the issue of CPU and memory statistics charts not displaying.
- Fix the log receiver page displaying as blank.

## Authentication & Authorization
- Fix LDAP login failure.

## App Store
- Fix the error that appears on the application repository page. 

## Other Optimisation
- Fix the issue that some components failed to be upgraded.

The full Release Notes can be viewed by visiting the link below:

https://github.com/kubesphere/kubesphere/releases/tag/v3.4.1。