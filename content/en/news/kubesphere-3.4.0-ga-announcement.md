---
title: 'KubeSphere 3.4.0 Released: Support K8s v1.26'
tag: 'Product News'
keyword: 'open source, Kubernetes, KubeSphere, K8s, release, news, AI, GPU'
description: 'KubeSphere 3.4.0 has officially released, bringing noteworthy new features and enhancements.'
createTime: '2023-07-28'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere-3.4.0-GA.png'
---

On July 26, 2023, KubeSphere 3.4.0 is officially released!

Let's briefly review the major changes in the previous three releases:

- KubeSphere 3.1.0 introduced new features such as "Edge Computing" and "Metering and Billing," expanding Kubernetes from the cloud to the edge.
- KubeSphere 3.2.0 added support for "GPU Resource Scheduling and Management" and GPU usage monitoring, further enhancing the user experience in cloud-native AI scenarios.
- KubeSphere 3.3.0 added a continuous deployment solution based on GitOps, further optimizing the user experience of DevOps.

KubeSphere 3.4.0 has officially released, bringing noteworthy new features and enhancements. Here are some highlights:

- Expanded support for Kubernetes, with stable support to v1.26.
- Restructured the alert policy architecture, decoupling it into alerting rules and rule groups.
- Improved the display weight of cluster aliases, reducing management issues caused by unchangeable cluster names.
- Upgraded KubeEdge to v1.13.

Additionally, numerous fixes, optimizations, and enhancements have been made to further improve the interactive design and enhance the user experience.

Many thanks to all the participants and contributors to this release!

## Major Updates

### Optimize alerting configurations

KubeSphere 3.4.0 has optimized alerting configurations by introducing different scopes of alerting rule groups:

-  A single alerting policy has been split into multiple rule groups, allowing for configuring alerts at a more granular level.
- Editing, disabling, and resetting built-in alerting rules are now supported.

![](https://pek3b.qingstor.com/kubesphere-community/images/rulegroup-1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/rulegroup-2.png)

### Improve the display weight of cluster aliases

Operations personnel often have to manage clusters with different purposes and geographic locations by cluster names. In previous versions, clusters could only be named when being managed by host clusters, which are not convenient for operations personnel.

To address this issue, KubeSphere 3.4.0 has increased the display weight of cluster aliases, which ensures that cluster aliases are managed at the same level as cluster names. Users can now use cluster aliases to perform all the operations previously done with cluster names, and change cluster aliases for flexible cluster management.

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-cluster-alias.png)

### Set a default image repository

In private environments, it is often necessary to replace the default Docker Hub with a private repository. In previous versions, specifying a default repository was not supported, and users had to manually select the repository, which could lead to errors if there were multiple private repositories.

In KubeSphere 3.4.0, we have added support for setting a default image repository, making operations simpler and more convenient for users.

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-image-repo-1.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-image-repo-2.png)

### Others
In addition to the mentioned major features, KubeSphere 3.4.0 includes several optimizations and enhancements:

* Support for Kubernetes v1.26.
* Upgraded KubeEdge to v1.13.
* Use OpenSearch v2.6.0 instead of Elasticsearch as the internal log storage by default.
* Support for pod grace period configuration.
* Upgraded Notification Manager to v2.3.0.
* Upgraded Go version to v1.19.
* Improved user experience for multi-branch pipelines.
* Fixed pagination query issues in helm repo.
* Fixed the validation error for gateway upgrade.
* Fixed the abnormal display of cluster gateway logs and resource status.

For more details, please refer to the [release note](https://github.com/kubesphere/kubesphere/releases/tag/v3.4.0)。

## Installation and Upgrade

KubeSphere has synchronized and backed up all v3.4.0 images to domestic image repositories, providing a more user-friendly installation experience for users in China.

If any bugs are found, welcome to submit an [Issue](https://github.com/kubesphere/kubesphere/issues).

## Acknowledgements

Here are the contributors who made outstanding contributions to this release. Thank you all!

* leoendless
* yazhouio
* Bettygogo2021
* weili520
* harrisonliu5
* junotx
* smartcat999
* wansir
* imjoey
* sekfung
* renyunkang
* Fritzmomoto
* snowgo
* hongzhouzi
* chuan-you
* zhou1203
* iawia002
* sologgfun
* testwill
* LQBing
* littlejiancc
* wenchajun

Certificates will be issued to new contributors in the [community biweekly report](https://ask.kubesphere.io/forum/t/ks-beweekly), and updated to [the certificate wall](https://ask.kubesphere.io/forum/d/9280-kubesphere) in the forum promptly. If there are any omissions, please contact us for re-issuance.