---
title: "Telemetry in KubeSphere"
keywords: "Installer, Telemetry, KubeSphere, Kubernetes"
description: "Understand what Telemetry is and how to enable or disable it in KubeSphere."
linkTitle: "Telemetry in KubeSphere"
Weight: 16300
---

Telemetry collects aggregate information about the size of KubeSphere clusters installed, KubeSphere and Kubernetes versions, components enabled, cluster running time, error logs and so on. KubeSphere promises that the information is only used by the KubeSphere community to improve products and will not be shared with any third parties.

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

Telemetry is enabled by default when you install KubeSphere, while you also have the option to disable it either before or after the installation.

### Disable Telemetry before installation

When you install KubeSphere on an existing Kubernetes cluster, you need to download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) for cluster settings. If you want to disable Telemetry, do not run `kubectl apply -f` directly for this file.

{{< notice note >}}

If you install KubeSphere on Linux, see [Disable Telemetry After Installation](../telemetry/#disable-telemetry-after-installation) directly.

{{</ notice >}}

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it:

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, scroll down to the bottom of the file and add `telemetry_enabled: false` as follows:

    ```yaml
      openpitrix:
        store:
          enabled: false
      servicemesh:
        enabled: false
      telemetry_enabled: false # Add this line manually to disable Telemetry.
    ```

3. Save the file and run the following commands to start installation.

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

### Disable Telemetry after installation

1. Log in to the console as `admin` and click **Platform** in the upper-left corner.

2. Select **Cluster Management** and navigate to **CRDs**.

    {{< notice note >}}
If you have enabled [the multi-cluster feature](../../../multicluster-management/), you need to select a cluster first.
    {{</ notice >}}

3. Enter `clusterconfiguration` in the search bar and click the result to go to its detail page.

4. Click <img src="/images/docs/v3.3/faq/installation/telemetry-in-kubesphere/three-dots.png" height="20px" alt="icon"> on the right of `ks-installer` and select **Edit YAML**.

5. Scroll down to the bottom of the file, add `telemetry_enabled: false`, and then click **OK**.


{{< notice note >}}

If you want to enable Telemetry again, you can update `ks-installer` by deleting `telemetry_enabled: false` or changing it to `telemetry_enabled: true`.

{{</ notice >}}
