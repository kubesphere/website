---
title: "Upload Apps to the KubeSphere GitHub Repository"
keywords: "Kubernetes, helm, KubeSphere, application"
description: "Upload your own apps to the GitHub repository of KubeSphere."
linkTitle: "Upload Apps to the KubeSphere GitHub Repository"
weight: 9320
version: "v3.3"
---

KubeSphere provides an app repository for testing and development. Users can upload their apps to the repository, which will serve as available app templates once approved.

## Upload Your App

Build your app first based on [the Helm documentation](https://helm.sh/docs/topics/charts/). You can refer to the existing apps in the KubeSphere app repository. Official apps are stored in [src/main](https://github.com/kubesphere/helm-charts/tree/master/src/main) and apps being tested are stored in [src/test](https://github.com/kubesphere/helm-charts/tree/master/src/test).

### Step 1: Develop an app

1. [Fork the app repository of KubeSphere](https://github.com/kubesphere/helm-charts/fork).

2. Install Helm based on [the Helm documentation](https://helm.sh/docs/intro/install/).

3. Execute the following command to initialize the Helm client.

   ```bash
   helm init --client-only
   ```

4. Create your app. For example, you create an app named `mychart` in the directory `src/test`.

   ```bash
   cd src/test
   helm create mychart
   cd mychart
   ```

5. You can see that Helm has created related templates in the directory. For more information, see [Create an App](../../../application-store/app-developer-guide/helm-developer-guide/#create-an-app).

### Step 2: Submit an app

When you finish the development, submit a pull request to [the official repository of KubeSphere](https://github.com/kubesphere/helm-charts) for review.

### Step 3: Deploy your app

After your pull request is approved, your app will be available to use. For more information, refer to [Import a Helm Repository](../import-helm-repository/) to add `https://charts.kubesphere.io/main` to KubeSphere.

