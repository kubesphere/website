---
title: "Customize Cluster Name in Notification Messages"
keywords: 'KubeSphere, Kubernetes, Platform, Notification'
description: 'Learn how to customize cluster name in notification messages sent by KubeSphere.'
linkTitle: "Customize Cluster Name in Notification Messages"
weight: 8721
---

This document describes how to customize your cluster name in notification messages sent by KubeSphere.

## Prerequisites

You need to have a user with the `platform-admin` role, for example, the `admin` user. For more information, see [Create Workspaces, Projects, Users and Roles](../../../../quick-start/create-workspace-and-project/).

## Customize Cluster Name in Notification Messages

1. Log in to the KubeSphere console as `admin`.

2. Click <img src="/images/docs/v3.3/common-icons/hammer.png" width="15" /> in the lower-right corner and select **Kubectl**.

3. In the displayed dialog box, run the following command:

   ```bash
   kubectl edit nm notification-manager
   ```

4. Add a field `cluster` under `.spec.receiver.options.global` to customize your cluster name:

   ```yaml
   spec:
     receivers:
       options:
         global:
           cluster: <Cluster name>
   ```
   
5. When you finish, save the changes.



