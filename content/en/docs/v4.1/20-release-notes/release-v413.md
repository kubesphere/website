---
title: "Release Notes for 4.1.3"
linkTitle: "Release Notes - 4.1.3"
keywords: "Kubernetes, KubeSphere, Release Notes"
description: "KubeSphere 4.1.3 Release Notes"
weight: 43
---

## KubeSphere

### Enhancements

- Refine the cascading deletion logic for workspace.
- Adjust the authorization rules for certain platform roles and workspace roles.
- Optimize the data display on the Pod list page.
- Allow users to link with multiple identity providers.
- Support manual triggering of application repository updates.
- Add a "Access Denied" page.
- Adjust the cluster role configuration method in the Helm Chart.

### Bug Fixes

- Fix the potential privilege escalation vulnerability in web kubectl.
- Fix the issue where the application release cannot be upgraded.
- Fix the compatibility issue with the prerelease K8s version number.
- Fix the configuration issue with LDAP Identity Provider for LDAPS and STARTTLS.
- Fix the issue where images could not be searched from Docker Hub and Harbor.
- Fix the issue with handling special characters in the Application Version.
- Fix the issue of unable to create ingress when the gateway extension is not installed.
