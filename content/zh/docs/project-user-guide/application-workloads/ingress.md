---
title: "路由"
keywords: "kubesphere, kubernetes, 路由, 应用路由"
description: "如何在 KubeSphere 中创建路由"

weight: 10270
---

Route is the kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#what-is-ingress).

路由就是 kubernetes 的 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#what-is-ingress)（应用路由）。

A Route provides a way to aggregate services, and you can expose the cluster's internal services to the outside through an externally accessible IP address.

路由提供了一种聚合服务的方式，您可以通过外部访问的 IP 地址将集群的内部服务暴露给外部。

## 准备工作

- 您需要创建一个企业空间、一个项目以及 `project-regular` 帐户。若还未创建好，请参考[创建企业空间、项目、帐户和角色](../../../quick-start/create-workspace-and-project)。

- 您需要以 `project-admin` 帐户登录KubeSphere 控制台，并邀请 `project-regular` 进入相应的项目。若还未准备好，请参考[邀请成员](../../../quick-start/create-workspace-and-project#task-3-create-a-project)。

- Before creating a route, the gateway of the project should be configured. Please refer to [Set Gateway](#set-gateway)

  在创建路由之前，需要对项目的网关进行配置。请参考[设置网关](#set-gateway)。

## 创建路由

### 步骤 1：Open Modal

1. Go to **Application Workloads** and click **Routes**.
2. Click **Create** button to open the modal.

### Step 2: Basic Info

Enter the basic information.

- **Name**: The name of the route, which is also the unique identifier.
- **Alias**: The alias name of the route, making resources easier to identify.

### Step 3: Route Rules

Setting the route's rules. KubeSphere provides two ways to configure a route rule, **Auto Generate** and **Specify Domain**.

#### Auto Generate

Kubesphere can automatically generate an available route based on the service name.
The generation rule is: `{serviceName}.{gatewayAddress}.nip.io:{servicePort}`.

- **path**: Ingress matches the corresponding service according to the path.
- **service**: The backend service name.
- **port**: Service port, could be a port name or a port number.

![](/images/docs/route-set-rule-auto.png)

#### Specify Domain

You can also use a specified domain to access the service. Beside the path parameters, you also need to specify the hostname and the protocol.

- **HostName**  
  The access domain name of the application rule, and finally use this domain name to access the corresponding service.  
  If the access entry is enabled by **NodePort**, you need to ensure that the Host can be correctly resolved to the cluster working node on the client;  
  If it is enabled by **LoadBalancer**, you need to ensure that the Host is correctly resolved to the IP of the load balancer.

- **Protocol**  
  Supports http and https protocols.

  - **http**: A Host configuration item (Hostname) and a Path list. Each Path is associated with a backend service. If the loadbalancer is used to forward traffic to the backend, all inbound requests must first match the Host and Path.
  - **https**: In addition to the configuration contained in http, a secret is also required. The secret can be specified to contain a TLS private key and certificate to encrypt Ingress, and the TLS secret must contain keys named tls.crt and tls.key.

![](/images/docs/route-set-rule-domain.png)

### Step 4: Advanced Settings

You can edit the metadata info of the route in Advanced Settings.

Ingress provides annotations to customize behavior. Please refer to [Ingress Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/).

![](/images/docs/route-create-annotations.png)

## Access the Route

After the route is created, make sure that the domain name can be resolved to the IP address of the external network access entrance, and you can use the domain name access. For example, in a private environment, you can modify the local hosts file to use the route. E.g:

|Domain|Path|Access Type|Port/IP|Cluster Node IP|
----|---|---|---|---
|demo.kubesphere.io|/|NodePort|32586,31920|192.168.0.4,192.168.0.3,192.168.0.2|
|demo2.kubesphere.io|/|LoadBalancer|139.198.1.1|192.168.0.4,192.168.0.3,192.168.0.2

As shown in the above table, two route rules have been created, using NodePort and LoadBalancer access entries respectively.

- **NodePort**

    For services with internet access set to NodePort, if it is in a private environment, you can directly add records in the hosts file of the host to resolve the domain name to the corresponding IP. For example, for `demo.kubesphere.io`, add the following records:

    ```
    192.168.0.4 demo.kubesphere.io
    ```

    It is necessary to ensure that the client and the cluster working node `192.168.0.4` network can communicate, and the IP of other working nodes can be used. As long as the client and the working node network are connected, after setting, use `http://demo.kubesphere.io:32586` to access the backend service.

- **LoadBalancer**

    For services with internet access set to LoadBalancer, for `demo2.kubesphere.io`, in addition to adding records in the hosts file by referring to the **NodePort**, you can also use `nip.io` as the domain name resolution for routing. `nip.io` is a free domain name resolution service, which can resolve the corresponding ip of the domain name in the following format, which can be used as a resolution service for routing, eliminating the need to configure the local hosts file.

    ```
    10.0.0.1.nip.io maps to 10.0.0.1  
    app.10.0.0.1.nip.io maps to 10.0.0.1
    customer1.app.10.0.0.1.nip.io maps to 10.0.0.1
    customer2.app.10.0.0.1.nip.io maps to 10.0.0.1
    otherapp.10.0.0.1.nip.io maps to 10.0.0.1
    ```

## Check Route detail

### Route Operations

- **Edit Info**: Edit the basic information except `Name` of the Route, .
- **Edit YAML**: Edit the route's specification in YAML format.
- **Edit Rules**: Edit the route's rules.
- **Edit Annotations**: Customize the ingress annotations.
- **Delete**: Delete the route, and return to the route list page.

![](/images/docs/route-detail.png)

### Resource Status

Resource status contains route rules information. You can access the service by clicking `Click to visit`.

![](/images/docs/route-detail-resource.png)

***Unable to access ?***  

* Make sure that the domain name you set can be resolved to the IP address of the access portal.  
* If you are in a private cloud environment, modify the local host file and then access it via `{$domain name}:{$node port}`.  
* By configuring DNS access, you need to modify the domain name to `{$hostname}.{$gateway address}.nip.io`, and then access the service via `{$hostname}.{$gateway address}.nip.io:{$NodePort}`.  
* If the access is blocked when you use the domain name, please confirm if your domain name exists and has been registered.  

## Set Gateway

Enter to **Project Settings** => **Advanced Settings** => **Internet Access**, click **Set Gateway**.

![](/images/docs/set-gateway.png)
