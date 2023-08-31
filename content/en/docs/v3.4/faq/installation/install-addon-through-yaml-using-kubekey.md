---
title: "Install an Add-on through YAML Using KubeKey"
keywords: "Installer, KubeKey, KubeSphere, Kubernetes, add-ons"
description: "Understand why the installation may fail when you use KubeKey to install an add-on through YAML."
linkTitle: "Install an Add-on through YAML Using KubeKey"
Weight: 16400
---

When you use KubeKey to install add-ons, you put the add-on information (Chart or YAML) under the `addons` field in the configuration file (`config-sample.yaml` by default). If the add-on configuration is provided as a YAML file, in some cases, you may see an error message similar to this during the installation:

```bash
Error from server: failed to create typed patch object: xxx: element 0: associative list with keys has an element that omits key field "protocol"
```

This is a [known issue of Kubernetes itself](https://github.com/kubernetes-sigs/structured-merge-diff/issues/130), caused by the flag `--server-side`. To solve this issue, do not add your add-on in the configuration file. Instead, you can apply your YAML file after KubeSphere is deployed. For example:

```bash
kubectl apply -f xxx.yaml # Use your own YAML file.
```