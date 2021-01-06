---
title: "Secrets"
keywords: 'KubeSphere, Kubernetes, Secrets'
description: 'How to create a Secret in KubeSphere.'
linkTitle: "Secrets"
weight: 10410
---

A Kubernetes [Secret](https://kubernetes.io/docs/concepts/configuration/secret/) is used to store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys. To use a Secret, a Pod needs to reference it in one of [the following ways](https://kubernetes.io/docs/concepts/configuration/secret/#overview-of-secrets).

- As a file in a volume mounted and consumed by containerized applications running in a Pod.
- As environment variables used by containers in a Pod.
- As image registry credentials when images are pulled for the Pod by the kubelet.

This tutorial demonstrates how to create a Secret in KubeSphere.

## Prerequisites

You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project).

## Create a Secret

### Step 1: Open the dashboard

Log in to the console as `project-regular`. Go to **Configurations** of a project, choose **Secrets** and click **Create**.

![create-secrets](/images/docs/project-user-guide/configurations/secrets/create-secrets.jpg)

### Step 2: Input basic information

Specify a name for the Secret (e.g. `demo-secret`) and click **Next** to continue.

{{< notice tip >}}

You can see the Secret's manifest file in YAML format by enabling **Edit Mode** in the top right corner. KubeSphere allows you to edit the manifest file directly to create a Secret. Alternatively, you can follow the steps below to create a Secret via the dashboard.

{{</ notice >}} 

![set-secret](/images/docs/project-user-guide/configurations/secrets/set-secret.jpg)

### Step 3: Set a Secret

1. Under the tab **Secret Settings**, you must choose a Secret type. In KubeSphere, you can create the following types of Secrets, indicated by the `type` field.

   ![secret-type](/images/docs/project-user-guide/configurations/secrets/secret-type.jpg)

   {{< notice note >}}

   For all Secret types, values for all keys under the field `data` in the manifest must be base64-encoded strings. After you specify values on the KubeSphere dashboard, KubeSphere converts them into corresponding base64 character values in the YAML file. For example, if you input `password` and `hello123` for **Key** and **Value** respectively on the **Edit Data** page when you create the default type of Secret, the actual value displaying in the YAML file is `aGVsbG8xMjM=` (i.e. `hello123` in base64 format), automatically created by KubeSphere.

   {{</ notice >}} 

   - **Default**. The type of [Opaque](https://kubernetes.io/docs/concepts/configuration/secret/#opaque-secrets) in Kubernetes, which is also the default Secret type in Kubernetes. You can create arbitrary user-defined data for this type of Secret.

     ![default-secret](/images/docs/project-user-guide/configurations/secrets/default-secret.jpg)

   - **TLS**. The type of [kubernetes.io/tls](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) in Kubernetes, which is used to store a certificate and its associated key that are typically used for TLS, such as TLS termination of Ingress resources. You must specify **Credential** and **Private Key** for it, indicated by `tls.crt` and `tls.key` in the YAML file respectively.

     ![tls](/images/docs/project-user-guide/configurations/secrets/tls.jpg)

   - **Image Registry Secret**. The type of [kubernetes.io/dockerconfigjson](https://kubernetes.io/docs/concepts/configuration/secret/#docker-config-secrets) in Kubernetes, which is used to store the credentials for accessing a Docker registry for images. For more information, see [Image Registries](../image-registry/).

     ![image-registry-secret](/images/docs/project-user-guide/configurations/secrets/image-registry-secret.jpg)

   - **Account Password Secret**. The type of [kubernetes.io/basic-auth](https://kubernetes.io/docs/concepts/configuration/secret/#basic-authentication-secret) in Kubernetes, which is used to store credentials needed for basic authentication. You must specify **User Name** and **Password** for it, indicated by `username` and `password` in the YAML file respectively.

     ![account-password-secret](/images/docs/project-user-guide/configurations/secrets/account-password-secret.jpg)

   - **Custom**. You can input [any type of Secrets supported by Kubernetes](https://kubernetes.io/docs/concepts/configuration/secret/#secret-types) in the box. Click **Add Data** to add key-value pairs for it.

     ![custom-secret](/images/docs/project-user-guide/configurations/secrets/custom-secret.jpg)

2. For this tutorial, select the default type of Secret. Click **Add Data** and input the **Key** (`MYSQL_ROOT_PASSWORD`) and **Value** (`123456`) as below to specify a Secret for MySQL. 

   ![add-data](/images/docs/project-user-guide/configurations/secrets/add-data.jpg)

   ![input-key](/images/docs/project-user-guide/configurations/secrets/input-key.jpg)

3. Click **√** in the bottom right corner to confirm. You can continue to add key-value pairs to the Secret or click **Create** to finish the creation. For more information about how to use the Secret, see [Compose and Deploy WordPress](../../../quick-start/wordpress-deployment/#task-3-create-an-application).

## Check Secret Details

1. After a Secret is created, it displays in the list as below. You can click the three dots on the right and select the operation from the menu to modify it.

    ![secret-list](/images/docs/project-user-guide/configurations/secrets/secret-list.jpg)

    - **Edit**: View and edit the basic information.
    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Edit Seret**: Modify the key-value pair of the Secret.
    - **Delete**: Delete the Secret.

2. Click the name of the Secret and you can go to its detail page. Under the tab **Detail**, you can see all the key-value pairs you have added for the Secret.

    ![secret-detail-page](/images/docs/project-user-guide/configurations/secrets/secret-detail-page.jpg)

    {{< notice note >}}

As mentioned above, KubeSphere automatically converts the value of a key into its corresponding base64 character value. To see the actual decoded value, click the eye icon on the right.

{{</ notice >}} 

3. Click **More** to display what operations about this Secret you can do.

    ![secret-dropdown-menu](/images/docs/project-user-guide/configurations/secrets/secret-dropdown-menu.jpg)

    - **Edit YAML**: View, upload, download, or update the YAML file.
    - **Edit Secret**: Modify the key-value pair of the Secret.
    - **Delete**: Delete the Secret, and return to the list page.


## Use a Secret

Generally, you need to use a Secret when you create workloads, [Services](../../../project-user-guide/application-workloads/services/), [Jobs](../../../project-user-guide/application-workloads/jobs/) or [CronJobs](../../../project-user-guide/application-workloads/cronjob/). For example, you can select a Secret for a code repository. For more information, see [Image Registries](../image-registry/).

![use-secret-repository](/images/docs/project-user-guide/configurations/secrets/use-secret-repository.jpg)

Alternatively, you may need to add environment variables for containers. On the **Container Image** page, check **Environment Variables** and click **Use ConfigMap or Secret** to use a Secret from the list.

![use-secret-image](/images/docs/project-user-guide/configurations/secrets/use-secret-image.jpg)

## Create the Most Common Secrets

This section shows how to create Secrets from your Docker Hub account and GitHub account.

### Create the Docker Hub Secret

1. Log in to KubeSphere as `project-regular` and go to your project. Select **Secrets** from the navigation bar and click **Create** on the right.

   ![secret-create](/images/docs/project-user-guide/configurations/secrets/secret-create.jpg)

2. Set a name, such as `dockerhub-id`, and click **Next**. On the **Secret Settings** page, fill in the following fields and click **Validate** to verify whether the information provided is valid.

   **Type**: Select **Image Registry Secret**.

   **Registry Address**: Enter the Docker Hub registry address, such as `docker.io`.

   **User Name**: Enter your Docker ID.

   **Password**: Enter your Docker Hub password.

   ![docker-hub-secret](/images/docs/project-user-guide/configurations/secrets/docker-hub-secret.jpg)

3. Click **Create** to finish.

### Create the GitHub Secret

1. Log in to KubeSphere as `project-regular` and go to your project. Select **Secrets** from the navigation bar and click **Create** on the right.

   ![secret-create](/images/docs/project-user-guide/configurations/secrets/secret-create.jpg)

2. Set a name, such as `github-id`, and click **Next**. On the **Secret Settings** page, fill in the following fields.

   **Type**: Select **Account Password Secret**.

   **User Name**: Enter your GitHub account.

   **Password**: Enter your GitHub password.

   ![github-secret](/images/docs/project-user-guide/configurations/secrets/github-secret.jpg)

3. Click **Create** to finish.