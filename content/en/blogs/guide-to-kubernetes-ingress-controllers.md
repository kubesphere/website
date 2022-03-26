---
title: 'Guide to Kubernetes Ingress Controllers'  
tag: 'Kubernetes, Ingress, Ingress Controller'  
keywords: Kubernetes, Ingress, Ingress Controller  
description: This article dives deeper into what an ingress is, and gives a brief overview of different types of ingress controllers.   
createTime: '2022-03-23'  
author: 'Yitaek Hwang'  
snapshot: 'https://i.imgur.com/K80I4gN.png'
---

[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is a Kubernetes API object that manages how external traffic is routed to services in a Kubernetes cluster. An ingress can be configured to define external URLs, load balance incoming traffic, terminate TLS, and route traffic based on path or prefix. An ingress controller is the component responsible for fulfilling ingress API requests. 

In this article, we will dive deeper into what an ingress is, give a brief overview of different types of ingress controllers, and examine how they are used in KubeSphere. 


## Ingress vs. Ingress Controller

In Kubernetes, there are three ways to configure a Service:

1. **ClusterIP**: adds an internal endpoint for in-cluster communication
2. **NodePort**: exposes a static port on each of the Kubernetes nodes to route external traffic to internal services
3. **LoadBalancer**: creates an external load balancer to route traffic into the cluster

As such, NodePort and LoadBalancer can be used to expose internal services to external traffic. So why is an ingress necessary? 

First off, ingress can consolidate multiple routing rules in a single resource for multiple services. Instead of creating expensive load balancers per service, ingress can work with a single load balancer and route traffic based on the rules that it is configured with. Also, various ingress controllers can provide other routing logic (e.g. IP whitelisting, throttling, HTTPS redirect) that is not given by other Kubernetes services. 

![](https://i.imgur.com/K80I4gN.png)
Image Credit: [Kubernetes Documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/)

In order to fulfill API requests for Kubernetes ingress objects, an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) must be configured. Unlike other Kubernetes controllers, an ingress controller is not started by default, unless it is provided as a service by a managed Kubernetes provider (e.g. [GCE Ingress](https://github.com/kubernetes/ingress-gce/blob/master/README.md#readme) for GKE). Kubernetes officially supports and maintains [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://github.com/kubernetes/ingress-gce/blob/master/README.md#readme), and [nginx ingress ](https://github.com/kubernetes/ingress-nginx/blob/main/README.md#readme) controllers, but other third-party controllers can be used as well. 

## Ingress Controller Options

Because Kubernetes maintains `ingress-nginx`, it is one of the most popular ingress controller options. Underneath the hood, it uses [NGINX](https://nginx.org/) as a reverse proxy and load balancer. It is important to note that `ingress-nginx` is not the same as [NGINX Ingress Controller](https://github.com/nginxinc/kubernetes-ingress) that is maintained by [NGINX](https://nginx.org/) the company. There is the open-source option from NGINX as well as the paid version that includes commercial support. The key differences are documented on the [GitHub page](https://github.com/nginxinc/kubernetes-ingress/blob/master/docs/content/intro/nginx-ingress-controllers.md). 

For managed Kubernetes users, using the cloud provider-specific ingress makes sense as the underlying load balancer that an ingress controller will provision would be using the cloud provider's load balancer (e.g. ALB/NLB for AWS, GCE for GCP). For GKE users, since GCE ingress comes preinstalled, it makes for a great option if a simple HTTP/S routing solution is all you need. 

As for other options, we have:

- [Ambassador](https://www.getambassador.io/): API Gateway based on Envoy with community/commercial support from Datawire
- [Voyager](https://voyagermesh.com/): HAProxy based Ingress Controller from AppsCode
- [Contour](https://projectcontour.io/): Envoy based Ingress Controller from Heptio (acquired by VMWare)
- [Gloo](https://docs.solo.io/gloo-edge/latest/): Envoy based API Gateway with enterprise support from solo.io
- [Citrix](https://www.citrix.com/products/citrix-adc/cpx-express.html): Ingress Controller for MPX, VPX, and CPX ADC products
- [F5](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/): Supports F5’s BIG-IP Container Ingress Services
- [HAProxy](https://haproxy-ingress.github.io/): Community-driven HAProxy Ingress Controller as well as enterprise offering from HAProxy Tech
- [Istio](https://istio.io/): Ingress Gateway for Istio-enabled clusters
- [Kong](https://github.com/Kong/kubernetes-ingress-controller): nginx-based API gateway with community/enterprise options from KongHQ
- [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/): HTTP router and reverse proxy from Zalando
- [Traefik](https://github.com/traefik/traefik): HTTP reverse proxy with commercial support from Containous

For a deep dive into the different options, you can [review the comprehensive comparison](https://docs.google.com/spreadsheets/d/191WWNpjJ2za6-nbG4ZoUMXMpUK8KlCIosvQB0f-oq3k/edit#gid=907731238) maintained by learnk8s.io or the [Kubernetes Ingress Controller Overview](https://medium.com/swlh/kubernetes-ingress-controller-overview-81abbaca19ec). 

As a general rule of thumb, **ingress-nginx** is a safe bet for most users since nginx is a tried-and-true solution and also the officially supported ingress controller from Kubernetes project. If you are using Istio for service mesh, ingress gateway from Istio is a natural fit. For other service mesh users relying on Consul or Linkerd, an envoy-based ingress controller like Ambassador, Contour, or Gloo may be a fit. 

## How to Install an Ingress Controller

Installing an ingress controller is simple. Most ingress controller providers support both Helm and `kubectl apply` methods. Taking `ingress-nginx` as an example:

Install via Helm:

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

or install via YAML manifests:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/cloud/deploy.yaml
```

The only caveat is that if you are running Kubernetes v1.22 or upgrading an existing cluster to v1.22, you need to be mindful of the deprecated ingress API objects, namely:

- `extensions/v1beta1`
- `networking.k8s.io/v1beta1`

For Kubernetes clusters newer than v1.22, ingress is only accessible via the stable `networking.k8s.io/v1` as explained on the [official blog](https://kubernetes.io/blog/2021/07/26/update-with-ingress-nginx/). 

The underlying implication of this change is that an `IngressClass` must be configured so that different ingress controllers know which ingress object they are responsible for. 

If you only have a single ingress controller, add `ingressclass.kubernetes.io/is-default-class: "true"` to the default IngressClass:

```yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  labels:
    app.kubernetes.io/component: controller 
  name: nginx
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
spec:
  controller: k8s.io/ingress-nginx
```

or utilize the Helm chart annotation `.controller.ingressClassResource.default: true` in the values file. 

If you have multiple ingress controllers (e.g. you want to separate by namespaces or serve TCP traffic with a different ingress controller), then you must create an IngressClass per controller and specify IngressClassName in the ingress objects.

## How Ingress Controller is Used in KubeSphere

KubeSphere uses `ingress-nginx` underneath the hood as the default ingress controller. Thus, any ingress object can be configured to the same way `ingress-nginx` is used. 

An ingress is also known as a `Route` in KubeSphere. So to control how external traffic is routed to services on KubeSphere, a Route must be configured. 

First, login as an `admin` and select **Gateway Settings** and click **Enable Gateway**. The access mode should be set to NodePort or LoadBalancer. 

Then, on each project, choose **Routes** under **Application Workloads** on the navigation bar. Add the name (uuid), alias, and description of the route. Then configure the **Routing Rule**, which can be auto-generated via nip.io or manually specified with HTTPS support as long as a secret containing the `tls.crt` or `tls.key` is added. 

Finally, we can add the various nginx annotations to control our ingress behavior such as affinity mode, canary, proxy, and SSL settings. For example, if you would like to use canary releases, you can add the following annotations:

```yaml
nginx.ingress.kubernetes.io/canary-by-header
nginx.ingress.kubernetes.io/canary-by-header-value
nginx.ingress.kubernetes.io/canary-weight
nginx.ingress.kubernetes.io/canary-by-cookie
```

For more information, check out [Canary Release in Kubernetes with Nginx Ingress](https://kubesphere.io/blogs/canary-release-with-nginx-ingress/).

Alternatively, ingress objects can be natively applied to KubeSphere:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: canary
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "30"
spec:
  rules:
  - host: kubesphere.io
    http:
      paths:
      - backend:
          serviceName: canary
          servicePort: 80
```

Note that since Kubernetes v1.22 is still in experimental support, `extensions/v1beta1` will still work in KubeSphere for v1.21 or lower clusters. 

## Recap

In this article, we looked at what an ingress controller does in Kuberentes. We then went over the different options for ingress controllers and ended with how nginx is used in KubeSphere to control routes. Ingress controllers play a critical role in exposing your services for others to interact, so get comfortable with configuring and using an ingress controller. 