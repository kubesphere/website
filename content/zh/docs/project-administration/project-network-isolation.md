---
title: "Project Network Isolation"
keywords: 'KubeSphere, kubernetes, Calico, Network Policy'
description: 'Project Network Isolation'

linkTitle: "Project Network Isolation"
weight: 2130
---

KubeSphere project network isolation lets project administrators enforce which network traffic is allowed using rules.

## Prerequisites

- You have already enabled Network Policy. Please refer to [network-policy](../../pluggable-components/network-policy) if it is not ready yet.
- Use an account of the `admin` role at the project level. For example, use the account `project-admin` created in [Create Workspace, Project, Account and Role](../../quick-start/create-workspace-and-project/).

{{< notice note >}}
For the implementation of the Network Policy, you can refer to [kubesphere-network-policy](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md).
{{</ notice >}}

## Enable/Disable Project Network Isolation

By default project network isolation is disabled, you can turn on network isolation via **Project Settings/Network Isolation**
![network-isolation-on](/images/docs/project-administration/network-isolation-on.png)

{{< notice note >}}
When network isolation is turned on, egress traffic will be allowed by default, while ingress traffic will be denied for
 different projects. But when you add an egress network policy, only traffic that matches your policy will be allowed to go out.
{{</ notice >}}

You can also disable network isolation via this path.
![network-isolation-off](/images/docs/project-administration/network-isolation-off.png)

{{< notice note >}}
When network isolation is turned off, any previously created network policies will be deleted as well.
{{</ notice >}}

## Setting Network Policy

If the default policy does not meet your needs when network isolation is enabled, you can customize your network policy
to meet your needs. Currently, you can add custom network policies in KubeSphere from two perspectives:

- Cluster Internal
- Cluster External

### Cluster Internal

Network policies at the project level within a cluster are used to control whether resources in this project can be accessed by other projects within the same cluster, and which services you can access.

Suppose a `nginx deployment` workload has been created in the other project `testProject` and is exposed via service `testService` on port `80` with `TCP`.

#### Allow ingress traffic from workloads in a different project

1. Select **Cluster Internal Allowlist**
2. Click **Add Allowlist**
3. Select type **Project**
4. Select project `testProject`
5. Select direction **Ingress**
6. Click **OK**

{{< notice note >}}
If the network still doesn't work after you set the network policy, then you need to check if peer has set the corresponding egress rule.
{{</ notice >}}

#### Allow egress traffic to workloads selected by service

1. Select **Cluster Internal Allowlist**
2. Click **Add Allowlist**
3. Select type **Service**
4. Select the project `testProject`
5. Select the service `testService` that you want to allow
6. Select direction **Egress**
7. Click **OK**

{{< notice note >}}
When creating a service you must make sure that the selectors of the service are not empty.
{{</ notice >}}

### Cluster External

Outside the cluster we distinguish between the peers by CIDR.

Suppose a `tomcat deployment` workload has been created in this project  and is exposed via `NodePort` service `testService` on NodePort `80` with `TCP`.
A client with ip address `192.168.1.1` will access this service, and the service will have access to the address `http://10.1.0.1:80`.

#### Allow ingress traffic from client outside the cluster

1. Select **Cluster External IP Address**
2. Select direction **Ingress**
3. Fill CIDR `192.168.1.1/32`
4. Select protocol `TCP` and fill port `80`
5. Click **OK**

{{< notice note >}}
It is best to set `spec.externalTrafficPolicy` in the service configuration to `local`, so that the source address of the packet will not change, i.e. the source address of the packet is the source address of the client.
{{</ notice >}}

#### Allow egress traffic to service outside the cluster

1. Select **Cluster External IP Address**
2. Select direction **Egress**
3. Fill CIDR `10.1.0.1/32`
4. Select protocol `TCP` and fill port `80`
5. Click **OK**

{{< notice note >}}
In step 4, when you select **SCTP**, you must make sure the SCTP is [enabled](https://kubernetes.io/docs/concepts/services-networking/network-policies/#sctp-support).
{{</ notice >}}

### Best Practices

To ensure that all Pods in the project are secure, a best practice is to enable network isolation.

When network isolation is on, the project cannot be accessed by other projects.  If your workloads need to be accessed by others, you can follow these steps:

1. Set gateway via **[Project Settings/Advanced Settings](../project-gateway/)**.
2. Expose workloads that need to be accessed to a gateway via a service.
3. Allow ingress traffic from the namespace where you gateway locate.

If egress traffic is controlled, you should have a clear plan of what projects, services, and IP addresses can be accessed, and then add them one by one.
If you're not sure what you want, then you'd better keep your network policy unchanged.

## FAQs

Q: **Why can't the custom monitoring system of KubeSphere get data after I enabled network isolation?**

A: After you enabled custom monitoring, KubeSphere monitoring system will access the metrics of the Pod. You need to allow ingress traffic for KubeSphere monitoring system. Otherwise, it cannot access Pod metrics.

Here KubeSphere provides a configuration item `allowedIngressNamespaces`to simplify similar configurations, which allows you to allow all projects
 listed in the configuration.

```yaml
root@node1:~# kubectl get -n kubesphere-system clusterconfigurations.installer.kubesphere.io  ks-installer -o yaml
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  ...
  name: ks-installer
  namespace: kubesphere-system
  ...
spec:
  ...
  networkpolicy:
    enabled: true
    nsnpOptions:
      allowedIngressNamespaces:
        - kubesphere-system
        - kubesphere-monitoring-system
  ...
```

Q: **Why can't I access the service even after setting network policy through the service?**

A: When you add a network policy and access the service via cluster ip, if the network is not
   working, check the kube-proxy configuration to see if `masqueradeAll` is `false`.

   ```yaml
   root@node1:~# kubectl get cm -n kube-system kube-proxy -o yaml
   apiVersion: v1
   data:
     config.conf: |-
       ...
       iptables:
         masqueradeAll: false
       ...  
     ...
   kind: ConfigMap
   metadata:
     ...
     labels:
       app: kube-proxy
     name: kube-proxy
     namespace: kube-system
     ...
   ```

Q: **How do I determine the CIDR when I set the ingress policy?**

A: In K8s, the source ip address of the packet is often handled by nat,
   so you need to figure out what the source address of the packet will be before you add the rule.
   Here you can refer to [Source IP](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md#source-ip).
