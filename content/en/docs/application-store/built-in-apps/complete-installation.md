---
title: "Install All Optional Components"
keywords: 'kubesphere, kubernetes, docker, devops, service mesh, openpitrix'
description: 'Install KubeSphere with all optional components enabled on Linux machine'


weight: 2260
---

The installer only installs required components (i.e. minimal installation) by default since v2.1.0. Other components are designed to be pluggable, which means you can enable any of them before or after installation. If your machine meets the following minimum requirements, we recommend you to **enable all components before installation**. A complete installation gives you an opportunity to comprehensively discover the container platform.

<font color="red">  
Minimum Requirements

- CPU: 8 cores in total of all machines
- Memory: 16 GB in total of all machines

</font>

> Note:
>
> - If your machines do not meet the minimum requirements of a complete installation, you can enable any of components at your will. Please refer to [Enable Pluggable Components Installation](../pluggable-components).
> - It works for [All-in-One](../all-in-one) and [Multi-Node](../multi-node).

This tutorial will walk you through how to enable all components of KubeSphere.

## Download Installer Package

If you do not have the package yet, please run the following commands to download Installer 2.1.1 and unpack it, then enter `conf` folder.

```bash
$ curl -L https://kubesphere.io/download/stable/v2.1.1 > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.1/conf
```

## Enable All Components

Edit `conf/common.yaml`, reference the following changes with values being `true` which are `false` by default.

```yaml
# LOGGING CONFIGURATION
# logging is an optional component when installing KubeSphere, and
# Kubernetes builtin logging APIs will be used if logging_enabled is set to false.
# Builtin logging only provides limited functions, so recommend to enable logging.
logging_enabled: true # Whether to install logging system
elasticsearch_master_replica: 1  # total number of master nodes, it's not allowed to use even number
elasticsearch_data_replica: 2  # total number of data nodes
elasticsearch_volume_size: 20Gi # Elasticsearch volume size
log_max_age: 7 # Log retention time in built-in Elasticsearch, it is 7 days by default.
elk_prefix: logstash # the string making up index names. The index name will be formatted as ks-<elk_prefix>-log
kibana_enabled: false # Kibana Whether to install built-in Grafana
#external_es_url: SHOULD_BE_REPLACED # External Elasticsearch address, KubeSphere supports integrate with Elasticsearch outside the cluster, which can reduce the resource consumption.
#external_es_port: SHOULD_BE_REPLACED # External Elasticsearch service port

#DevOps Configuration
devops_enabled: true # Whether to install built-in DevOps system (Supports CI/CD pipeline, Source/Binary to image)
jenkins_memory_lim: 8Gi # Jenkins memory limit, it is 8 Gi by default
jenkins_memory_req: 4Gi # Jenkins memory request, it is 4 Gi by default
jenkins_volume_size: 8Gi # Jenkins volume size, it is 8 Gi by default
jenkinsJavaOpts_Xms: 3g # Following three are JVM parameters
jenkinsJavaOpts_Xmx: 6g
jenkinsJavaOpts_MaxRAM: 8g
sonarqube_enabled: true # Whether to install built-in SonarQube
#sonar_server_url: SHOULD_BE_REPLACED # External SonarQube address, KubeSphere supports integrate with SonarQube outside the cluster, which can reduce the resource consumption.
#sonar_server_token: SHOULD_BE_REPLACED  # SonarQube token

# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
openpitrix_enabled: true       # KubeSphere application store
metrics_server_enabled: true   # For KubeSphere HPA to use
servicemesh_enabled: true      # KubeSphere service mesh system(Istio-based)
notification_enabled: true     # KubeSphere notification system
alerting_enabled: true         # KubeSphere alerting system
```

Save it, then you can continue the installation process.
