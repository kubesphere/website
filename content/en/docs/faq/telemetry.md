---
title: "Telemetry in KubeSphere"
keywords: "Installer, Telemetry, KubeSphere, Kubernetes"
description: "Telemetry collects aggregate information of KubeSphere installation."

Weight: 7100
---

Telemetry collects aggregate information about the size of KubeSphere clusters installed, KubeSphere and Kubernetes versions, components enabled, cluster running time, error logs, etc. KubeSphere promises that the information is only used by the KubeSphere community to improve products and will not be shared with any third parties.

## What Information Is Collected

- External network IP
- Download date
- Kubernetes version
- KubeSphere version
- Kubernetes cluster size
- The type of the operating system
- Installer error logs
- Components enabled
- The running time of Kubernetes clusters
- The running time of KubeSphere clusters
- Cluster ID
- Machine ID

## Disable Telemetry

Telemetry is enabled by default. To disable Telemetry, follow the steps below after you install KubeSphere.

1. Log in the console as `admin` and click **Platform** in the top left corner.
2. Select **Clusters Management** and navigate to **CRDs**.

{{< notice note >}}

If you have enabled [the multi-cluster feature](../../multicluster-management/), you need to select a cluster first.

{{</ notice >}} 

3. Input `clusterconfiguration` in the search bar and click the result to go to its detail page.

![edit-crd](/images/docs/faq/telemetry-in-kubesphere/edit-crd.jpg)

4. Click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-ks-installer](/images/docs/faq/telemetry-in-kubesphere/edit-ks-installer.jpg)

5. Scroll down to the bottom of the file and add the value `telemetry_enabled: false`. When you finish, click **Update**.

![enable-telemetry](/images/docs/faq/telemetry-in-kubesphere/enable-telemetry.jpg)

{{< notice note >}}

If you want to enable Telemetry again, you can update `ks-installer` by deleting the value  `telemetry_enabled: false` or changing it to  `telemetry_enabled: true`.

{{</ notice >}}