---
title: "Import a Google GKE Cluster"
keywords: 'Kubernetes, KubeSphere, multicluster, Google GKE'
description: 'Learn how to import a Google Kubernetes Engine cluster.'
titleLink: "Import a Google GKE Cluster"
weight: 5330
---

This tutorial demonstrates how to import a GKE cluster through the [direct connection](../../../multicluster-management/enable-multicluster/direct-connection/) method. If you want to use the agent connection method, refer to [Agent Connection](../../../multicluster-management/enable-multicluster/agent-connection/).

## Prerequisites

- You have a Kubernetes cluster with KubeSphere installed, and prepared this cluster as the host cluster. For more information about how to prepare a host cluster, refer to [Prepare a host cluster](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-host-cluster).
- You have a GKE cluster to be used as the member cluster.

## Import a GKE Cluster

### Step 1: Deploy KubeSphere on your GKE cluster

You need to deploy KubeSphere on your GKE cluster first. For more information about how to deploy KubeSphere on GKE, refer to [Deploy KubeSphere on GKE](../../../installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-gke/).

### Step 2: Prepare the GKE member cluster

1. To manage the member cluster from the host cluster, you need to make `jwtSecret` the same between them. Therefore, get it first by executing the following command on your host cluster.

   ```bash
   kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret
   ```

   The output is similar to the following:

   ```yaml
   jwtSecret: "QVguGh7qnURywHn2od9IiOX6X8f8wK8g"
   ```

2. Log in to the KubeSphere console on GKE as `admin`. Click **Platform** in the upper-left corner and then select **Cluster Management**.

3. Go to **CRDs**, enter `ClusterConfiguration` in the search bar, and then press **Enter** on your keyboard. Click **ClusterConfiguration** to go to its detail page.

4. Click <img src="/images/docs/multicluster-management/import-cloud-hosted-k8s/import-gke/three-dots.png" height="20px"> on the right and then select **Edit YAML** to edit `ks-installer`. 

5. In the YAML file of `ks-installer`, change the value of `jwtSecret` to the corresponding value shown above and set the value of `clusterRole` to `member`.

   ```yaml
   authentication:
     jwtSecret: QVguGh7qnURywHn2od9IiOX6X8f8wK8g
   ```

   ```yaml
   multicluster:
     clusterRole: member
   ```

   {{< notice note >}}

   Make sure you use the value of your own `jwtSecret`. You need to wait for a while so that the changes can take effect.

   {{</ notice >}}

### Step 3: Create a new kubeconfig file

1. Run the following commands on your GKE Cloud Shell Terminal:

   ```bash
   TOKEN=$(kubectl -n kubesphere-system get secret $(kubectl -n kubesphere-system get sa kubesphere -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 -d)
   kubectl config set-credentials kubesphere --token=${TOKEN}
   kubectl config set-context --current --user=kubesphere
   ```

2. Retrieve the new kubeconfig file by running the following command:

   ```bash
   cat ~/.kube/config
   ```

   The output is similar to the following:

   ```yaml
   apiVersion: v1
   clusters:
   - cluster:
       certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURLekNDQWhPZ0F3SUJBZ0lSQUtPRUlDeFhyWEdSbjVQS0dlRXNkYzR3RFFZSktvWklodmNOQVFFTEJRQXcKTHpFdE1Dc0dBMVVFQXhNa1pqVTBNVFpoTlRVdFpEZzFZaTAwWkdZNUxXSTVNR1V0TkdNeE0yRTBPR1ZpWW1VMwpNQjRYRFRJeE1ETXhNVEl5TXpBMU0xb1hEVEkyTURNeE1ESXpNekExTTFvd0x6RXRNQ3NHQTFVRUF4TWtaalUwCk1UWmhOVFV0WkRnMVlpMDBaR1k1TFdJNU1HVXROR014TTJFME9HVmlZbVUzTUlJQklqQU5CZ2txaGtpRzl3MEIKQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdkVHVGtKRjZLVEl3QktlbXNYd3dPSnhtU3RrMDlKdXh4Z1grM0dTMwpoeThVQm5RWEo1d3VIZmFGNHNWcDFzdGZEV2JOZitESHNxaC9MV3RxQk5iSlNCU1ppTC96V3V5OUZNeFZMS2czCjVLdnNnM2drdUpVaFVuK0tMUUFPdTNUWHFaZ2tTejE1SzFOSU9qYm1HZGVWSm5KQTd6NTF2ZkJTTStzQWhGWTgKejJPUHo4aCtqTlJseDAvV0UzTHZEUUMvSkV4WnRCRGFuVFU0anpHMHR2NGk1OVVQN2lWbnlwRHk0dkFkWm5mbgowZncwVnplUXJqT2JuQjdYQTZuUFhseXZubzErclRqakFIMUdtU053c1IwcDRzcEViZ0lXQTNhMmJzeUN5dEJsCjVOdmJKZkVpSTFoTmFOZ3hoSDJNenlOUWVhYXZVa29MdDdPN0xqYzVFWlo4cFFJREFRQUJvMEl3UURBT0JnTlYKSFE4QkFmOEVCQU1DQWdRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVUVyVkJrc3MydGV0Qgp6ZWhoRi92bGdVMlJiM2N3RFFZSktvWklodmNOQVFFTEJRQURnZ0VCQUdEZVBVa3I1bDB2OTlyMHZsKy9WZjYrCitBanVNNFoyOURtVXFHVC80OHBaR1RoaDlsZDQxUGZKNjl4eXFvME1wUlIyYmJuTTRCL2NVT1VlTE5VMlV4VWUKSGRlYk1oQUp4Qy9Uaks2SHpmeExkTVdzbzVSeVAydWZEOFZob2ZaQnlBVWczajdrTFgyRGNPd1lzNXNrenZ0LwpuVUlhQURLaXhtcFlSSWJ6MUxjQmVHbWROZ21iZ0hTa3MrYUxUTE5NdDhDQTBnSExhMER6ODhYR1psSi80VmJzCjNaWVVXMVExY01IUHd5NnAwV2kwQkpQeXNaV3hZdFJyV3JFWUhZNVZIanZhUG90S3J4Y2NQMUlrNGJzVU1ZZ0wKaTdSaHlYdmJHc0pKK1lNc3hmalU5bm5XYVhLdXM5ZHl0WG1kRGw1R0hNU3VOeTdKYjIwcU5RQkxhWHFkVmY0PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
       server: https://130.211.231.87
     name: gke_grand-icon-307205_us-central1-c_cluster-3
   contexts:
   - context:
       cluster: gke_grand-icon-307205_us-central1-c_cluster-3
       user: gke_grand-icon-307205_us-central1-c_cluster-3
     name: gke_grand-icon-307205_us-central1-c_cluster-3
   current-context: gke_grand-icon-307205_us-central1-c_cluster-3
   kind: Config
   preferences: {}
   users:
   - name: gke_grand-icon-307205_us-central1-c_cluster-3
     user:
       auth-provider:
         config:
           cmd-args: config config-helper --format=json
           cmd-path: /usr/lib/google-cloud-sdk/bin/gcloud
           expiry-key: '{.credential.token_expiry}'
           token-key: '{.credential.access_token}'
         name: gcp
   - name: kubesphere
     user:
       token: eyJhbGciOiJSUzI1NiIsImtpZCI6InNjOFpIb3RrY3U3bGNRSV9NWV8tSlJzUHJ4Y2xnMDZpY3hhc1BoVy0xTGsifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlc3BoZXJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrdWJlc3BoZXJlLXRva2VuLXpocmJ3Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6Imt1YmVzcGhlcmUiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIyMGFmZGI1Ny01MTBkLTRjZDgtYTAwYS1hNDQzYTViNGM0M2MiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXNwaGVyZS1zeXN0ZW06a3ViZXNwaGVyZSJ9.ic6LaS5rEQ4tXt_lwp7U_C8rioweP-ZdDjlIZq91GOw9d6s5htqSMQfTeVlwTl2Bv04w3M3_pCkvRzMD0lHg3mkhhhP_4VU0LIo4XeYWKvWRoPR2kymLyskAB2Khg29qIPh5ipsOmGL9VOzD52O2eLtt_c6tn-vUDmI_Zw985zH3DHwUYhppGM8uNovHawr8nwZoem27XtxqyBkqXGDD38WANizyvnPBI845YqfYPY5PINPYc9bQBFfgCovqMZajwwhcvPqS6IpG1Qv8TX2lpuJIK0LLjiKaHoATGvHLHdAZxe_zgAC2cT_9Ars3HIN4vzaSX0f-xP--AcRgKVSY9g
   ```

### Step 4: Import the GKE member cluster

1. Log in to the KubeSphere console on your host cluster as `admin`. Click **Platform** in the upper-left corner and then select **Cluster Management**. On the **Cluster Management** page, click **Add Cluster**.

2. Enter the basic information based on your needs and click **Next**.

3. In **Connection Method**, select **Direct connection**. Fill in the new kubeconfig file of the GKE member cluster and then click **Create**.

4. Wait for cluster initialization to finish.