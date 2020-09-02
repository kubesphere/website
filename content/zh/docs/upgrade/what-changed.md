---
title: "What Changed in 3.0.0"
keywords: "kubernetes, upgrade, kubesphere, v3.0.0"
description: "KubeSphere Upgrade"

linkTitle: "What Changed in 3.0.0"
weight: 200
---

There are some changes in access control in 3.0. We simplified the definition of custom roles, aggregated some closely related permission items into permission groups. The custom role will not change during the upgrade, custom roles that match the new policy rules can be used directly, otherwise you need to manually modify them according to the document.
