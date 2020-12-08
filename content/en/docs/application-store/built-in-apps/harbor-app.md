---
title: "Harbor App"
keywords: 'Kubernetes, KubeSphere, Harbor, app-store'
description: 'How to use built-in Harbor registry'


weight: 14220
---
From the [Introduction](../../_index) section, you know there was uncounted application could be installed by helm. [kubesphere\'s App Store](https://charts.kubesphere.io/main/) also added some popular application.

This tutorial walks you through an example of how to deploy [Harbor](https://goharbor.io/) with several click in kubesphere.

## Prerequisites

- Please make sure you [enable the OpenPitrix system](https://kubesphere.io/docs/pluggable-components/app-store/). We will deploy Harbor from the App Store.
- You need to create a [workspace, a project, and a user account](https://kubesphere.io/docs/quick-start/create-workspace-and-project/) for this tutorial. The account needs to be a platform regular user and to be invited as the project operator with the `operator` role. In this tutorial, you log in as `project-operator` and work in the project `demo` in the workspace `demo-wp`.

## Hands-on Lab

### Common steps

1. Choose harbor template `From App Store`.

![choose_app_from_store](/images/docs/appstore/harbor/choose_app_from_store.png)

2. Choose harbor **version** and **deployment location**, then click `Next`.

![deploy_set_of_harbor](/images/docs/appstore/harbor/deploy_set_of_harbor.png)

3. Config harbor yaml, then click `Deploy`. There was an example yaml in section **FAQ**.

![config_of_harbor_deploy](/images/docs/appstore/harbor/config_of_harbor_deploy.png)

> `type` : how to expose the service. It\'s related to kubernetes service.  
> `tls` : means whether to enable https. Simply set it as **false** for common scenario.  
> `externalURL` : the url exposed to user.  

{{< notice warning >}}
Don't forget to edit **externalURL**, if you have trouble in login after harbor deployed, edit this may helpful.
{{</ notice >}}

4. Check the status of deployment, then try to login harbor by use the `expose.type` you defined.

For this example, we use `http://172.23.5.6:30002` to access to harbor which defined at step 3.

![active_of_harbor](/images/docs/appstore/harbor/active_of_harbor.png)

![overview_of_harbor_login](/images/docs/appstore/harbor/overview_of_harbor_login.png)

### FAQ

1. How to enable http login ?

* set `tls.enabled` as false in step 3. `externalURL` \'s protocol should be as same as the `expose.type.ports`.
* if use docker login, set `externalURL` as one of `insecure-registries` in **daemon.json**, then reload docker.
* the keywords showed in the yaml below, you should notice.

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

externalURL: http://172.23.5.6:30002

# The initial password of Harbor admin. Change it from portal after launching Harbor
harborAdminPassword: "Harbor12345"
# The secret key used for encryption. Must be a string of 16 chars.
secretKey: "not-a-secure-key"
```

2. How to enable https login ?

    a. use self signed certificates.
      * set `tls.enabled` as true in step 3, and edit **externalURL** properly.
      * copy the ca certificates stored in pod `harbor-core` \'s `/etc/core/ca` to your host.
      * trust the ca certificates by your host first, then restart docker.

    b. use public ssl.
      * add certificates as a secrets.
      * set `tls.enabled` as true in step 3, and edit **externalURL** properly.
      * edit `tls.secretName`.