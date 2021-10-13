---
title: "Project Network Isolation"
keywords: 'KubeSphere, Kubernetes, Calico, Network Policy'
description: 'Understand the concept of network isolation and how to configure network policies for a project.'
linkTitle: "Project Network Isolation"
weight: 13300
---

KubeSphere project network isolation lets project administrators enforce which network traffic is allowed using different rules. This tutorial demonstrates how to enable network isolation among projects and set rules to control network traffic.

## Prerequisites

- You have already enabled [Network Policies](../../pluggable-components/network-policy/).
- You must have an available project and a user of the `admin` role (`project-admin`) at the project level. For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

{{< notice note >}}

For the implementation of the Network Policy, you can refer to [KubeSphere NetworkPolicy](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md).

{{</ notice >}}

## Enable/Disable Project Network Isolation

1. Log in to KubeSphere as `project-admin`. Go to your project and select **Network Isolation** in **Project Settings**. By default, project network isolation is disabled.

   ![project-network-isolation](/images/docs/project-administration/project-network-isolation/project-network-isolation.png)

2. To enable project network isolation, click **On**.

   {{< notice note >}}

   When network isolation is turned on, egress traffic will be allowed by default, while ingress traffic will be denied for different projects. But when you add an egress network policy, only traffic that matches your policy will be allowed to go out.

   {{</ notice >}}

3. You can also disable network isolation on this page.

   ![isolation-off](/images/docs/project-administration/project-network-isolation/isolation-off.png)

   {{< notice note >}}

   When network isolation is turned off, any previously created network policies will be deleted as well.

   {{</ notice >}}

## Set a Network Policy

If the default policy does not meet your needs when network isolation is enabled, you can customize your network policy to meet your needs. Currently, you can add custom network policies in KubeSphere for traffic within the cluster or incoming traffic outside the cluster.

### For internal traffic within the cluster

Network policies at the project level within a cluster are used to control whether resources in this project can be accessed by other projects within the same cluster, and which Services you can access.

Assume an NGINX Deployment workload has been created in another project `demo-project-2` and is exposed via the Service `nginx` on the port `80` with `TCP`. Here is an example of how to set ingress and egress traffic rules.

{{< notice note >}}

For more information about how to create workloads, see [Deployments](../../project-user-guide/application-workloads/deployments/) and [Services](../../project-user-guide/application-workloads/services/) respectively.

{{</ notice >}} 

#### Allow ingress traffic from workloads in a different project

1. On the **Network Isolation** page of your current project, select **Cluster Internal Allowlist**.

2. Click **Add Allowlist**.

3. Select **Ingress** under **Direction**.

4. Select the tab **Project** under **Type**.

5. Select the project `demo-project-2`.

   ![ingress-rule](/images/docs/project-administration/project-network-isolation/ingress-rule.png)

6. Click **OK** and you can see that the project is now in the allowlist.

   ![ingress-rule-added](/images/docs/project-administration/project-network-isolation/ingress-rule-added.png)

{{< notice note >}}

If the network is not accessible after you set the network policy, then you need to check whether the peer project has a corresponding egress rule in it.

{{</ notice >}}

#### Allow egress traffic to Services in a different project

1. On the **Network Isolation** page of your current project, select **Cluster Internal Allowlist**.

2. Click **Add Allowlist**.

3. Select **Egress** under **Direction**.

4. Select the tab **Service** under **Type**.

5. Select the project `demo-project-2` from the drop-down list.

6. Select the Service that is allowed to receive egress traffic. In this case, select `nginx`.

   ![engress-rule](/images/docs/project-administration/project-network-isolation/engress-rule.png)

7. Click **OK** and you can see that the Service is now in the allowlist.

   ![egress-rule-added](/images/docs/project-administration/project-network-isolation/egress-rule-added.png)

{{< notice note >}}

When creating a Service, you must make sure that the selectors of the Service are not empty.

{{</ notice >}}

### For incoming traffic outside the cluster

KubeSphere uses CIDR to distinguish between peers. Assume a Tomcat Deployment workload has been created in your current project and is exposed via the `NodePort` Service `demo-service` on the NodePort `80` with `TCP`. For an external client with the IP address `192.168.1.1` to access this Service, you need to add a rule for it.

#### Allow ingress traffic from an client outside the cluster

1. On the **Network Isolation** page of your current project, select **Cluster External IP Address** and click **Add Rule**.

2. Select **Ingress** under **Direction**.

3. Enter `192.168.1.1/32` for **CIDR**.

4. Select the protocol `TCP` and enter `80` as the port number.

   ![ingress-CIDR](/images/docs/project-administration/project-network-isolation/ingress-CIDR.png)

5. Click **OK** and you can see that the rule has been added.

   ![ingress-cidr-set](/images/docs/project-administration/project-network-isolation/ingress-cidr-set.png)

{{< notice note >}}

It is recommended to set `spec.externalTrafficPolicy` in the Service configuration to `local`, so that the source address of the packet will not change. Namely, the source address of the packet is the source address of the client.

{{</ notice >}}

Assume the IP address of an external client is `http://10.1.0.1:80`, then you need to set a rule for the egress traffic so that the internal Service can access it.

#### Allow egress traffic to Services outside the cluster

1. On the **Network Isolation** page of your current project, select **Cluster External IP Address** and click **Add Rule**.

2. Select **Egress** under **Direction**.

3. Enter `10.1.0.1/32` for **CIDR**.

4. Select the protocol `TCP` and enter `80` as the port number.

   ![egress-CIDR](/images/docs/project-administration/project-network-isolation/egress-CIDR.png)

5. Click **OK** and you can see that the rule has been added.

   ![egress-CIDR-added](/images/docs/project-administration/project-network-isolation/egress-CIDR-added.png)

{{< notice note >}}

In step 4, when you select **SCTP**, you must make sure SCTP is [enabled](https://kubernetes.io/docs/concepts/services-networking/network-policies/#sctp-support).

{{</ notice >}}

### Best practices

To ensure that all Pods in a project are secure, a best practice is to enable network isolation. When network isolation is on, the project cannot be accessed by other projects. If your workloads need to be accessed by others, you can follow these steps:

1. Set a [gateway](../project-gateway/) in **Project Settings**.
2. Expose workloads that need to be accessed to a gateway via a Service.
3. Allow ingress traffic from the namespace where your gateway locates.

If egress traffic is controlled, you should have a clear plan of what projects, Services, and IP addresses can be accessed, and then add them one by one. If you are not sure about what you want, it is recommended that you keep your network policy unchanged.

## FAQs

Q: Why can't the custom monitoring system of KubeSphere get data after I enabled network isolation?

A: After you enabled custom monitoring, the KubeSphere monitoring system will access the metrics of the Pod. You need to allow ingress traffic for the KubeSphere monitoring system. Otherwise, it cannot access Pod metrics.

KubeSphere provides a configuration item `allowedIngressNamespaces` to simplify similar configurations, which allows all projects listed in the configuration.

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

Q: Why can't I access a Service even after setting a network policy through the Service?

A: When you add a network policy and access the Service via the cluster IP address, if the network is not
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

Q: How do I determine the CIDR when I set the ingress rule?

A: In Kubernetes, the source IP address of the packet is often handled by NAT, so you need to figure out what the source address of the packet will be before you add the rule. For more information, refer to [Source IP](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md#source-ip).
