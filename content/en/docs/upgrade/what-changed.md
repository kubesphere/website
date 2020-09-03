---
title: "Changes after Upgrade"
keywords: "Kubernetes, upgrade, KubeSphere, v3.0.0"
description: "Understand what will be changed after upgrade."

linkTitle: "Changes after Upgrade"
weight: 4025
---

This section covers the changes after upgrade for existing settings in previous versions. If you want to know all the new features and enhancements in KubeSphere 3.0.0, see [Release Notes for 3.0.0](../../release/release-v300/) directly.

## Access Control

The definition of custom roles has been simplified. Some closely-related permission items have been aggregated into permission groups. Custom roles will not change during the upgrade and can be used directly after the upgrade if they conform to new policy rules for authorization assignment. Otherwise, you need to modify them manually by adding authorization to these roles.

