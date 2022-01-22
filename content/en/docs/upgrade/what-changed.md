---
title: "Changes after Upgrade"
keywords: "Kubernetes, upgrade, KubeSphere, 3.2.1"
description: "Understand what will be changed after the upgrade."

linkTitle: "Changes after Upgrade"
weight: 7600
---

This section covers the changes after upgrade for existing settings in previous versions. If you want to know all the new features and enhancements in KubeSphere 3.2.1, see [Release Notes for 3.2.1](../../release/release-v321/).

## Access Control

The definition of custom roles has been simplified. Some closely-related permission items have been aggregated into permission groups. Custom roles will not change during the upgrade and can be used directly after the upgrade if they conform to new policy rules for authorization assignment. Otherwise, you need to modify them manually by adding authorization to these roles.

