---
title: "Edit System Resources on the Console"
keywords: "system, resources, KubeSphere, Kubernetes"
description: "Enable the editing function of system resources on the console."
linkTitle: 'Edit System Resources on the Console'
Weight: 16520
---

When you install KubeSphere, the workspace `system-workspace` is created where all KubeSphere system projects and Kubernetes system projects run. To avoid any misoperation on both systems, you are not allowed to edit resources in the workspace directly on the console. However, you can still make adjustments to resources using `kubectl`.

This tutorial demonstrates how to enable the editing function of `system-workspace` resources.

{{< notice warning >}}

Editing resources in `system-workspace` may cause unexpected results, such as KubeSphere system and node failures, and your business may be affected. Please be extremely careful about the operation.

{{</ notice >}}

## Edit the Console Configuration

1. Log in to KubeSphere as `admin`. Click <img src="/images/docs/v3.3/common-icons/hammer.png" height="25" width="25" alt="icon" /> in the lower-right corner and select **Kubectl**.

2. Execute the following command:

   ```bash
   kubectl -n kubesphere-system edit cm ks-console-config
   ```

3. Add the `systemWorkspace` field under `client` and save the file.

   ```yaml
       client:
         version:
           kubesphere: v3.3.1
           kubernetes: v1.21.5
           openpitrix: v3.3.0
         enableKubeConfig: true
         systemWorkspace: "$"  # Add this line manually.
   ```

4. Redeploy `ks-console` by executing the following command and wait for Pods to be recreated.

   ```bash
   kubectl -n kubesphere-system rollout restart deployment ks-console
   ```

5. Refresh the KubeSphere console and you can see that editing buttons in projects in `system-workspace` appear.

6. If you want to disable the editing function on the console, delete the field `systemWorkspace` by following the same steps above. 

