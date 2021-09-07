---
title: "Deploy Harbor on KubeSphere"
keywords: 'Kubernetes, KubeSphere, Harbor, app-store'
description: 'Learn how to deploy Harbor from the App Store of KubeSphere and access its service.'
linkTitle: "Deploy Harbor on KubeSphere"
weight: 14220
---
[Harbor](https://goharbor.io/) is an open-source registry that secures artifacts with policies and role-based access control, ensures images are scanned and free from vulnerabilities, and signs images as trusted.

This tutorial walks you through an example of deploying [Harbor](https://goharbor.io/) from the App Store of KubeSphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](../../../pluggable-components/app-store/).
- You need to create a workspace, a project, and a user account for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-regular` and work in the project `demo-project` in the workspace `demo-workspace`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).

## Hands-on Lab

### Step 1: Deploy Harbor from the App Store

1. On the **Overview** page of the project `demo-project`, click **App Store** in the top-left corner.

   ![app-store](/images/docs/appstore/built-in-apps/harbor-app/app-store.png)

2. Find Harbor and click **Deploy** on the **App Information** page.

   ![find-harbor](/images/docs/appstore/built-in-apps/harbor-app/find-harbor.png)

   ![click-deploy](/images/docs/appstore/built-in-apps/harbor-app/click-deploy.png)

3. Set a name and select an app version. Make sure Harbor is deployed in `demo-project` and click **Next**.

   ![deploy-harbor](/images/docs/appstore/built-in-apps/harbor-app/deploy-harbor.png)

4. On the **App Configurations** page, edit the configuration file of Harbor. Pay attention to the following fields.

   `type`: The method you use to access the Harbor Service. This example uses `nodePort`.

   `tls`: Specify whether you want to enable HTTPS. Set it to `false` for most cases.

   `externalURL`: The URL exposed to tenants.

   ![harbor-config](/images/docs/appstore/built-in-apps/harbor-app/harbor-config.png)

   {{< notice note >}}

   - Don't forget to specify `externalURL`. This field can be very helpful if you have trouble accessing Harbor.

   - Make sure you use the HTTP protocol and its corresponding `nodePort` in this tutorial. For more information, see [the example configuration](#faq) in FAQ.

   {{</ notice >}} 

   When you finish editing the configuration, click **Deploy** to continue.

5. Wait until Harbor is up and running.

   ![creating-harbor](/images/docs/appstore/built-in-apps/harbor-app/creating-harbor.png)

### Step 2: Access Harbor

1. Based on the field `expose.type` you set in the configuration file, the access method may be different. As this example uses `nodePort` to access Harbor, visit `http://<NodeIP>:30002` as set in the previous step.

   ![harbor-login](/images/docs/appstore/built-in-apps/harbor-app/harbor-login.jpg)

   {{< notice note >}}

   You may need to open the port in your security groups and configure related port forwarding rules depending on your where your Kubernetes cluster is deployed.

   {{</ notice >}} 

2. Log in to Harbor using the default account and password (`admin/Harbor12345`). The password is defined in the field `harborAdminPassword` in the configuration file.

   ![harbor-dashboard](/images/docs/appstore/built-in-apps/harbor-app/harbor-dashboard.jpg)

## FAQ

1. How to enable HTTP login?

   Set `tls.enabled` to `false` in step 1 above. The protocol of `externalURL` must be the same as `expose.nodePort.ports`.

   If you use Docker login, set `externalURL` to one of `insecure-registries` in `daemon.json`, then reload Docker.

   Here is an example configuration file for your reference. Pay special attention to the comments.

   ```yaml
   ## NOTICE 192.168.0.9 is the example IP address and you must use your own.
   expose:
     type: nodePort
     tls:
       enabled: false
       secretName: ""
       notarySecretName: ""
       commonName: "192.168.0.9"  # Change commonName to your own.
     nodePort:
       # The name of NodePort service
       name: harbor
       ports:
         http:
           # The service port Harbor listens on when serving with HTTP
           port: 80
           # The node port Harbor listens on when serving with HTTP
           nodePort: 30002
         https:
           # The service port Harbor listens on when serving with HTTPS
           port: 443
           # The node port Harbor listens on when serving with HTTPS
           nodePort: 30003
         # Only needed when notary.enabled is set to true
         notary:
           # The service port Notary listens on
           port: 4443
           # The node port Notary listens on
           nodePort: 30004
   
   externalURL: http://192.168.0.9:30002 # Use your own IP address.
   
   # The initial password of Harbor admin. Change it from portal after launching Harbor
   harborAdminPassword: "Harbor12345"
   # The secret key used for encryption. Must be a string of 16 chars.
   secretKey: "not-a-secure-key"
   ```

2. How to enable HTTPS login?

    a. Use self-signed certificates.
      * Set `tls.enabled` to `true` in the configuration file in step 1, and edit `externalURL` accordingly.
      * Copy the CA certificates stored in the Pod `harbor-core` \'s `/etc/core/ca` to your host.
      * Trust the CA certificates by your host first, then restart Docker.

    b. Use public SSL.
      * Add certificates as a Secret.
      * Set `tls.enabled` to `true` in the configuration file in step 1, and edit `externalURL` accordingly.
      * Edit `tls.secretName`.

For more information, see [the documentation of Harbor](https://goharbor.io/docs/2.1.0/).