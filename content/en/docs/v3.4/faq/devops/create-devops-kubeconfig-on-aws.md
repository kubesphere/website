---
title: "Create a DevOps Kubeconfig on AWS"
keywords: "KubeSphere, Kubernetes, DevOps, Kubeconfig, AWS"
description: "How to create a DevOps kubeconfig on AWS"
linkTitle: "Create a DevOps Kubeconfig on AWS"
Weight: 16820
version: "v3.4"
---

If you have trouble deploying applications into your project when running a pipeline on your AWS cluster with KubeSphere installed, it may be caused by the issue of DevOps kubeconfig. This tutorial demonstrates how to create a DevOps kubeconfig on AWS.

## Prerequisites

- You have an AWS cluster with KubeSphere installed. For more information about how to install KubeSphere on AWS, refer to [Deploy KubeSphere on AWS EKS](../../../installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/).
- You have enabled [the KubeSphere DevOps system](../../../pluggable-components/devops/).
- You have a project available for deploying applications. This tutorial uses the project `kubesphere-sample-dev` as an example.

## Create a DevOps Kubeconfig

### Step 1: Create a Service Account

1. Create a `devops-deploy.yaml` file on your AWS cluster and enter the following contents.

   ```yaml
   ---
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: devops-deploy
     namespace: kubesphere-sample-dev
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: devops-deploy-role
     namespace: kubesphere-sample-dev
   rules:
   - apiGroups:
     - "*"
     resources:
     - "*"
     verbs:
     - "*"
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: devops-deploy-rolebinding
     namespace: kubesphere-sample-dev
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: Role
     name: devops-deploy-role
   subjects:
   - kind: ServiceAccount
     name: devops-deploy
     namespace: kubesphere-sample-dev
   ```

2. Run the following command to apply the YAML file.

   ```bash
   kubectl apply -f devops-deploy.yaml
   ```

### Step 2: Get the Service Account Token

1. Run the following command to get the Service Account token.

   ```bash
   export TOKEN_NAME=$(kubectl -n kubesphere-sample-dev get sa devops-deploy -o jsonpath='{.secrets[0].name}')
   kubectl -n kubesphere-sample-dev get secret "${TOKEN_NAME}" -o jsonpath='{.data.token}' | base64 -d
   ```

2. The output is similar to the following:

   ![get-token](/images/docs/v3.x/faq/devops/create-devops-kubeconfig-on-aws/get-token.jpg)

### Step 3: Create a DevOps kubeconfig

1. Log in to your KubeSphere console of the AWS cluster and go to your DevOps project. Go to **Credentials** under **DevOps Project Settings**, and then click **Create**. You can name this kubeconfig based on your needs.

2. In the **Content** text box, pay attention to the following contents:

   ```
   user:
       client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FUR...
       client-key-data: LS0tLS1CRUdJTiBQUk...
   ```

   You have to replace them with the token retrieved in step 2, then click **OK** to create the kubeconfig.

   ```bash
   user:
     token:eyJhbGciOiJSUzI1NiIsImtpZCI6Ikl3UkhCay13dHpPY2Z6LW9VTlZKQVR6dVdmb2FHallJQ2E4VzJULUNjUzAifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlc3BoZXJlLXNhbXBsZS1kZXYiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoiZGV2b3BzLWRlcGxveS10b2tlbi1kcGY2ZiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJkZXZvcHMtZGVwbG95Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMjM0ZTI4OTUtMjM3YS00M2Y5LTkwMTgtZDg4YjY2YTQyNzVmIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmVzcGhlcmUtc2FtcGxlLWRldjpkZXZvcHMtZGVwbG95In0.Ls6mkpgAU75zVw87FkcWx-MLEXGcJjlnb4rUVtT61Jmc_G6jkn4X45MK1V_HuLje3JZMFjL80QUl5ljHLiCUPQ7oE5AUZaUCdqZVdDYEhqeFuGQb_7Qlh8-UFVGGg8vrb0HeGiOlS0qq5hzwKc9C1OmsXHS92yhNwz9gIOujZRafnGKIsG6TL2hEVY2xI0vvmseDKmKg5o0TbeaTMVePHvECju9Qz3Z7TUYsr7HAOvCPtGutlPWLqGx5uOHenOdeLn71x5RoS98xguZoxYVollciPKCQwBlZ4zWK2hzsLSNNLb9cZpxtgUVyHE0AB0e86IHRngnnNrzpp1_pDxL5jw/
   ```

   {{< notice note >}}

   Make sure you use your own token.

   {{</ notice >}}





