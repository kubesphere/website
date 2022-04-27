---
title: "Release Notes for 3.3.0"
keywords: "Kubernetes, KubeSphere, release notes"
description: "KubeSphere Release Notes for 3.3.0"
linkTitle: "Release Notes - 3.3.0"
weight: 18099
---

## Enhancements and Bug Fixes

### Enhancements

- Add support for filtering Pods by status. ([#4434](https://github.com/kubesphere/kubesphere/pull/4434), [@iawia002](https://github.com/iawia002), [#2620](https://github.com/kubesphere/console/pull/2620), [@weili520](https://github.com/weili520))
- Add a tip in the image builder creation dialog box, which indicates that containerd is not supported. ([#2734](https://github.com/kubesphere/console/pull/2734), [@weili520](https://github.com/weili520))
- Add information about available quotas in the **Edit Project Quotas** dialog box. ([#2619](https://github.com/kubesphere/console/pull/2619), [@weili520](https://github.com/weili520))

### Bug Fixes

- Change the password verification rules to prevent passwords without uppercase letters. ([#4481](https://github.com/kubesphere/kubesphere/pull/4481), [@live77](https://github.com/live77))
- Fix a login issue, where a user from an LDAP identity provider cannot log in if information about the user does not exist on KubeSphere. ([#4436](https://github.com/kubesphere/kubesphere/pull/4436), [@RolandMa1986](https://github.com/RolandMa1986))
- Fix an issue where cluster gateway metrics cannot be obtained. ([#4457](https://github.com/kubesphere/kubesphere/pull/4457), [@RolandMa1986](https://github.com/RolandMa1986))
- Fix incorrect access modes displayed in the volume list. ([#2686](https://github.com/kubesphere/console/pull/2686), [@weili520](https://github.com/weili520))
- Remove the **Update** button on the **Gateway Settings** page. ([#2608](https://github.com/kubesphere/console/pull/2608), [@weili520](https://github.com/weili520))
- Fix a display error of the time range selection drop-down list. ([#2715](https://github.com/kubesphere/console/pull/2715), [@weili520](https://github.com/weili520))
- Fix an issue where Secret data text is not displayed correctly when the text is too long. ([#2600](https://github.com/kubesphere/console/pull/2600), [@weili520](https://github.com/weili520))
- Fix an issue where StatefulSet creation fails when a volume template is mounted. ([#2730](https://github.com/kubesphere/console/pull/2730), [@weili520](https://github.com/weili520))
- Fix an issue where cluster gateway information fails to be obtained when the user does not have permission to view cluster information. ([#2695](https://github.com/kubesphere/console/pull/2695), [@harrisonliu5](https://github.com/harrisonliu5))
- Fix an issue where status and run records of pipelines are not automatically updated. ([#2594](https://github.com/kubesphere/console/pull/2594), [@harrisonliu5](https://github.com/harrisonliu5))
- Add a tip for the kubernetesDeply pipeline step, which indicates that the step is about to be deprecated. ([#2660](https://github.com/kubesphere/console/pull/2660), [@harrisonliu5](https://github.com/harrisonliu5))
- Fix an issue where HTTP registry addresses of image registry Secrets cannot be validated. ([#2795](https://github.com/kubesphere/console/pull/2795), [@harrisonliu5](https://github.com/harrisonliu5))
- Fix the incorrect URL of the Harbor image. ([#2784](https://github.com/kubesphere/console/pull/2784), [@harrisonliu5](https://github.com/harrisonliu5))
- Fix a display error of log search results. ([#2598](https://github.com/kubesphere/console/pull/2598), [@weili520](https://github.com/weili520))
- Fix an error in the volume instance YAML configuration. ([#2629](https://github.com/kubesphere/console/pull/2629), [@weili520](https://github.com/weili520))
- Fix incorrect available workspace quotas displayed in the **Edit Project Quotas** dialog box. ([#2613](https://github.com/kubesphere/console/pull/2613), [@weili520](https://github.com/weili520))
- Fix an issue in the **Monitoring** dialog box, where the time range selection drop-down list does not function properly. ([#2722](https://github.com/kubesphere/console/pull/2722), [@weili520](https://github.com/weili520))
- Fix incorrect available quotas displayed in the Deployment creation page. ([#2668](https://github.com/kubesphere/console/pull/2668), [@weili520](https://github.com/weili520))
- Change the documentation address to [kubesphere.io](http://kubesphere.io/) and [kubesphere.com.cn](http://kubesphere.com.cn/). ([#2628](https://github.com/kubesphere/console/pull/2628), [@weili520](https://github.com/weili520))
- Fix an issue where Deployment volume settings cannot be modified. ([#2656](https://github.com/kubesphere/console/pull/2656), [@weili520](https://github.com/weili520))
- Fix an issue where the container terminal cannot be accessed when the browser language is not English, Simplified Chinese, or Traditional Chinese. ([#2702](https://github.com/kubesphere/console/pull/2702), [@weili520](https://github.com/weili520))
- Fix incorrect volume status displayed in the Deployment editing dialog box. ([#2622](https://github.com/kubesphere/console/pull/2622), [@weili520](https://github.com/weili520))
- Remove labels displayed on the credential details page. ([#2621](https://github.com/kubesphere/console/pull/2621), [@123liubao](https://github.com/123liubao))
- Fix the problem caused by non-ASCII branch names. ([#399](https://github.com/kubesphere/ks-devops/pull/399))
- Fix the wrong handling of the choice parameter in Pipeline. ([#378](https://github.com/kubesphere/ks-devops/pull/378))
- Fix the problem that could not proceed or break the pipeline created by others. [#408](https://github.com/kubesphere/ks-devops/pull/408)
- Fix messy sequence of pipeline run records. [#394](https://github.com/kubesphere/ks-devops/pull/394)
- Fix pipeline triggered by non-admin user but still display "Started by user admin". [#384](https://github.com/kubesphere/ks-devops/pull/384)
