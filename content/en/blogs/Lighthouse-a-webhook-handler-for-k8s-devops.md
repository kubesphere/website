---
title: 'Lighthouse: A Webhook Handler for Kubernetes DevOps'
keywords: Kubernetes, KubeSphere, DevOps, Lighthouse, ChatOPs
description: A brief introduction to Lighthouse.
tag: 'KubeSphere, Kubernetes, DevOps, Lighthouse, ChatOPs'
createTime: '2021-04-25'
author: 'Shaowen Chen, Serena'
snapshot: '/images/blogs/en/lighthouse-a-webhook-handler-for-k8s-devops/lighthouse.png'
---

In this blog, I will introduce a lightweight ChatOps tool named [Lighthouse](https://github.com/jenkins-x/lighthouse). As a derivation of [Prow](https://github.com/kubernetes/test-infra/tree/master/prow), a GitHub-specific CI/CD system based on Kubernetes, Lighthouse supports multiple Git providers, making it way more convenient for contributors to cooperate.

## What Is Lighthouse

Lighthouse is a ChatOps based lightweight webhook handler that can trigger pipelines and tasks on pipeline engines like Jenkins, Jenkins X, and Tekton through webhooks from Git repositories. Besides, it also supports multiple Git providers such as GitHub, GitHub Enterprise, BitBucket Server, and GitLab.

## Lighthouse Vs Prow: Which Is Better?

Lighthouse is originally derived from Prow. Currently, Lighthouse supports the common Prow plugins as it reuses the Prow plugin source code, allowing it to handle webhooks pushed from branches to trigger specific pipelines. Similar to Prow, Lighthouse also uses `config.yaml` and `plugins.yaml` for configuration, so that it is easier to migrate from Prow to Lighthouse and vice versa.

The differences between these two tools lie in the following two aspects:

- Lighthouse uses `jenkins-x/go-scm`, which supports more Git providers, not just limited to GitHub.
- Lighthouse uses its own `LighthouseJob` CRD rather than a `ProwJob` CRD.

## Prerequisites

- You have a Kubernetes cluster with [Helm](https://helm.sh/docs/intro/install/) (v2 or v3) installed.

## Get Started

Lighthouse uses Helm Chart packages for external release. 

1. Run the following command to add the `jenkins-x` helm charts repo.

   ```bash
   helm repo add jenkins-x http://chartmuseum.jenkins-x.io
   
   helm repo update
   ```

2. Use the following commands to install or upgrade Lighthouse.

   ```bash
   # Helm v2
   helm upgrade --install my-lighthouse --namespace lighthouse jenkins-x/lighthouse
   
   # Helm v3
   helm upgrade --install my-lighthouse --namespace lighthouse jenkins-x/lighthouse
   ```

## Uninstall Lighthouse

You can simply run the following command to uninstall the chart.

```bash
# Helm v2
helm delete --purge my-lighthouse

# Helm v3
helm uninstall my-lighthouse --namespace lighthouse
```

{{< notice note >}}

Lighthouse provides detailed installation and configuration documentation for Jenkins and Tekton. For more information, refer to [Install Lighthouse with Tekton](https://github.com/jenkins-x/lighthouse/blob/main/docs/install_lighthouse_with_tekton.md) and [Install Lighthouse with Jenkins](https://github.com/jenkins-x/lighthouse/blob/main/docs/install_lighthouse_with_jenkins.md) respectively.

{{< /notice >}}

## How to Port Prow Plugins to Lighthouse

If you have any Prow plugins you wish to use but have not yet ported to Lighthouse, there's a simple and easy way for it.

Since Lighthouse reuses the Prow plugin source code and configuration files, the logic to follow in porting plugins is to switch imports of `k8s.io/test-infra/prow` to `github.com/jenkins-x/lighthouse/pkg/prow`, and then modify the structs form of GitHub Client. For example, change `github.PullRequest` to `scm.PullRequest`.

Although most structures in GitHub Client map 1-1 to `jenkins-x/go-scm`, the `go-scm` API returns slices to pointers to resources by default. Also, there are some naming differences when it comes to the API part. For example, the `githubClient` API for Prow lgtm and Lighthouse lgtm vary.

## Reference

[Jenkins X Lighthouse](https://github.com/jenkins-x/lighthouse)