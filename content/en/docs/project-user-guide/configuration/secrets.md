---
title: "Secrets"
keywords: 'KubeSphere, kubernetes, docker, Secrets'
description: 'Create a KubeSphere Secret'

linkTitle: "Secrets"
weight: 2120
---

A Kubernets [Secret](https://kubernetes.io/docs/concepts/configuration/secret/) is used to store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys. To use a Secret, a Pod needs to reference it in one of [the following ways](https://kubernetes.io/docs/concepts/configuration/secret/#overview-of-secrets).

- As a file in a volume mounted and consumed by containerized applications running in a Pod.
- As environment variable used by containers in a Pod.
- As image registry crendential when pulling images for the Pod by the kubelet.

There are various types of Secret. For more information please refer to [Types of Secret
](https://kubernetes.io/docs/concepts/configuration/secret/#secret-types).

## Prerequisites

- You need to create a workspace, a project and an account (`project-regular`). Please refer to [Create Workspace, Project, Account and Role](../../../quick-start/create-workspace-and-project) if they are not ready yet.
- You need to sign in with the `project-admin` account and invite `project-regular` to the corresponding project. Please refer to [the steps to invite a member](../../../quick-start/create-workspace-and-project#task-3-create-a-project).

## Create a Secret

### Step 1: Open Dashboard

Log in the console as `project-regular`. Go to **Configurations** of a project, choose **Secrets** and click **Create**.

![secret](/images/docs/project-user-guide/workloads/deployments.png)

### Step 2: Input Basic Information

Specify a name for the Secret (e.g. `demo-secret`) and click **Next** to continue.

![basic-info](/images/docs/project-user-guide/workloads/deployments_form_1.jpg)

### Step 3: Input Secret Values

Under the tab **Secret Settings**, choose Secret type, then input data as indicated. Here we take the Default type as an example by clicking **Add Data** and input a key-value pair. Click **√** in the bottom right corner and continue adding data if needed.

![add-data](/images/docs/project-user-guide/workloads/deployments_form_1.jpg)

In KubeSphere you can create the following types of Secret.

- **Default**, the type of [Opaque](https://kubernetes.io/docs/concepts/configuration/secret/#opaque-secrets) in Kubernetes, which is also the defaullt Secret type in Kubernetes. You can create arbitrary user-defined data for this type of Secret.
- **TLS**, the type of [kubernetes.io/tls](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) in Kubernetes, which is for storing a certificate and its associated key that are typically used for TLS.
- **[Image Registry Secret](../image-registry/)**, the type of [kubernetes.io/dockerconfigjson](https://kubernetes.io/docs/concepts/configuration/secret/#docker-config-secrets) in Kubernetes, which is used to store the credentials for accessing a Docker registry for images.
- **Accout Password Secret**, the type of [kubernetes.io/basic-auth](https://kubernetes.io/docs/concepts/configuration/secret/#basic-authentication-secret) in Kubernetes, which is used to store credentials needed for basic authentication.
- **Custom**, you can input any type supported by Kubernetes in the edit box.

When finished, click **Create** to generate the Secret.

## Check Secret Details

### Detail Page

1. After a Secret is created, it displays in the list as below. You can click the three dots on the right and select the operation from the menu to modify it.

    ![secrets](/images/docs/project-user-guide/workloads/deployments_list.png)

    - **Edit**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Edit Seret**: Modify the key-value pairs of the Secret.
    - **Delete**: Delete the Secret.

2. Click the name of the Secret and you can go to its detail page.

    ![secret-detail](/images/docs/project-user-guide/workloads/deployments_detail.png)

3. Click **More** to display what operations about this Secret you can do.

    ![secret-dropdown-menu](/images/docs/project-user-guide/workloads/deployments_detail_operation_btn.png)

    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Edit Secret**: Modify the key-value pairs of the Secret.
    - **Delete**: Delete the Secret, and return to the list page.

4. Click the **Eidt Info** to view and edit the basic information.

    ![edit-secret](/images/docs/project-user-guide/workloads/deployments_detail_state.png)

