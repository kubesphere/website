---
title: 'KubeSphere v4.1.3 Open Source Edition Released'
tag: 'Product News'
keyword: 'open source, Kubernetes, KubeSphere, K8s, release, news, AI, GPU'
description: 'KubeSphere 4.1.3 Open Source Edition is officially released.'
createTime: '2025-03-26'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-4.1.3-ga.png'
---

KubeSphere 4.1.3 Open Source Edition is officially released, featuring multiple functionality optimizations and bug fixes to further enhance security and usability.

## Feature Optimizations

- **Optimized the cascading delete logic for enterprise spaces**
The cascading delete strategy for enterprise spaces has been changed from passive to active to avoid accidental operations.
- **Adjusted authorization rules for platform roles and enterprise space roles**
Further refined RBAC (Role-Based Access Control) authorization rules to improve security.
- **Optimized data display on the Pod list page**
Resource status information is displayed more intuitively, improving usability.
- **Allow users to associate multiple identity providers**
Users can now bind multiple identity providers (IdP) at the same time, improving flexibility and compatibility.
- **Support for manually triggering application repository updates**
Users can now manually refresh the application repository to ensure the latest application version information is retrieved.
- **New “Access Denied” page**
Invalid page requests are redirected to an "Access Denied" page.

## Bug Fixes
- Fixed an issue where application instances could not be upgraded.
- Fixed compatibility issues with pre-release Kubernetes versions.
- Fixed configuration issues with LDAP identity providers.
- Fixed issues where images could not be searched from Docker Hub and Harbor.
- Fixed issues with handling special characters in application versions.
- Fixed issues preventing the creation of Ingress when the gateway extension is not installed.

## Installation and Upgrade
We welcome all users to download and experience this release, and provide valuable feedback.

### Important Notes

For more update details, please refer to the 
[KubeSphere 4.1.3 Release ](https://kubesphere.io/docs/v4.1/20-release-notes/release-v413/).

For installation and upgrade instructions, refer to the  [Installation Guide](https://kubesphere.io/docs/v4.1/03-installation-and-upgrade/).

**Note:** Direct upgrades from v3.x to v4.x are not yet supported but are planned to be available in the version update later in April.

### Feedback Channels:
Submit Issues: [GitHub Issues](https://github.com/kubesphere/kubesphere/issues/new/choose)


## Future Outlook

In future version updates, the KubeSphere team will continue to focus on the needs and feedback from the open-source community. We are committed to staying true to our original vision and providing a more stable, secure, and efficient product experience for open-source users. As KubeSphere evolves, we will continue to optimize the platform’s performance and features, especially in terms of usability, security, and multi-cloud environment support, ensuring that users stay ahead in the rapidly changing technological landscape.

We are grateful for the support and contributions of every KubeSphere user, and we will keep working hard to bring you more surprises and useful features. We look forward to growing and progressing with you in future versions.
