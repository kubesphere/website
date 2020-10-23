---
title: "Harbor App"
keywords: 'Kubernetes, KubeSphere, Harbor, app-store'
description: 'How to use built-in Harbor registry'


weight: 2242
---
From the [Introduction](../../_index) section, you know there was uncounted application could be installed by helm. [kubesphere\'s App Store](https://charts.kubesphere.io/main/) also added some popular application.

This tutorial walks you through an example of how to deploy [Harbor](https://goharbor.io/) with several click in kubesphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). We will deploy Harbor from the App Store.
- You need to create a [workspace, a project, and a user account](https://kubesphere.io/docs/quick-start/create-workspace-and-project/) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `demo` in the workspace `demo-wp`.

## Hands-on Lab

### Common steps

1. To begin with, you deploy Harbor from the App Store. Please make sure you are landing on the **Overview** page of the project `demo`.

![overview_of_demo_project](/images/docs/appstore/harbor/overview_of_demo_project.png)

2. List your deployed apps. If it is empty, click the button `Deploy New Application`.

![new_app_deploy](/images/docs/appstore/harbor/new_app_deploy.png)

3. Choose harbor template `From App Store`.

![choose_app_from_store](/images/docs/appstore/harbor/choose_app_from_store.png)

4. Find harbor in App Store.

![overview_of_apps](/images/docs/appstore/harbor/overview_of_apps.png)

5. Choose harbor **version** and **deployment location**, then click `Next`.

![deploy_set_of_harbor](/images/docs/appstore/harbor/deploy_set_of_harbor.png)

6. Config harbor yaml, then click `Deploy`. There was an example yaml in section **FAQ**.

![config_of_harbor_deploy](/images/docs/appstore/harbor/config_of_harbor_deploy.png)

{{< notice warning >}}
Don't forget to edit **externalURL**.
{{</ notice >}}

7. Check the status of deployment, then try to login harbor.

![active_of_harbor](/images/docs/appstore/harbor/active_of_harbor.png)

![overview_of_harbor_login](/images/docs/appstore/harbor/overview_of_harbor_login.png)

### FAQ

1. How to enable http login ?

* set `tls.enabled` as false in step 6.
* keywords in example yaml

```yaml
## NOTICE 172.23.5.6 is the test host ip, should use your ip
expose:
  type: nodePort
  tls:
    enabled: false
    secretName: ""
    notarySecretName: ""
    # commonName should modify
    commonName: "172.23.5.6"
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

externalURL: https://172.23.5.6:30003

# The initial password of Harbor admin. Change it from portal after launching Harbor
harborAdminPassword: "Harbor12345"
# The secret key used for encryption. Must be a string of 16 chars.
secretKey: "not-a-secure-key"
```

2. How to enable https login ?

* set `tls.enabled` as true in step 6, and edit **externalURL** properly.
* ca certificates is in pod `harbor-core` \'s `/etc/core/ca`.
* trust the ca certificates by your host first, then restart docker.
