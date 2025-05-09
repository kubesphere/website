---
title: 'KubeSphere Gateway Component (ingress-nginx) Security Vulnerability Announcement'
tag: 'Product News'
keyword: 'open source, Kubernetes, KubeSphere,Ingress-Nginx Controller, Security Vulnerability'
description: 'This article summarizes critical security vulnerabilities in the KubeSphere Gateway component (ingress-nginx) and provides remediation suggestions.'
createTime: '2025-04-03'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/ingress-nginx-en-2025.png'
---

Recently, multiple critical vulnerabilities were discovered in the Ingress-Nginx controller maintained by Kubernetes, including privilege escalation, information disclosure, security bypass, and directory traversal issues. These vulnerabilities affect multiple versions of KubeSphere and KSE. Attackers could exploit these vulnerabilities to execute arbitrary code, access sensitive information, or even fully control the cluster without authorization.

Given the severity of these vulnerabilities, it is strongly recommended that affected users take immediate action to ensure the security of their clusters.

## 1. Vulnerability Overview

### Affected Versions:
- All versions of KubeSphere & KSE v3.x
- All versions of KubeSphere & KSE v4.1.x

### Vulnerability Severity: Critical
### Vulnerability Types:
Privilege Escalation, Information Disclosure, Security Bypass, Directory Traversal

### Summary of Related Vulnerabilities:

| Vulnerability ID    | Type       | CVSS Score | Summary                                                | Details    |
|---------------------|------------|------------|--------------------------------------------------------|------------|
| CVE-2025-1097       | Configuration Injection | 8.8 (Critical) | Malicious configuration injection via `auth-tls-match-cn` annotation, leading to arbitrary code execution and information disclosure | [Official Link](https://github.com/kubernetes/kubernetes/issues/131007) |
| CVE-2025-24514      | Configuration Injection | 8.8 (Critical) | Malicious configuration injection via `auth-url` annotation, leading to arbitrary code execution and information disclosure | [Official Link](https://github.com/kubernetes/kubernetes/issues/131006) |
| CVE-2025-24513      | Directory Traversal     | 4.8 (Moderate) | File path traversal in Admission Controller, potentially leading to denial of service and information disclosure | [Official Link](https://github.com/kubernetes/kubernetes/issues/131005)|
| CVE-2025-1974       | Remote Code Execution    | 9.8 (Critical) | Unauthorized remote code execution vulnerability over Pod network, potentially allowing full cluster control | [Official Link](https://github.com/kubernetes/kubernetes/issues/131009)|
| CVE-2025-1098       | Configuration Injection | 8.8 (Critical) | Malicious configuration injection via `mirror-target` and `mirror-host` annotations, leading to arbitrary code execution and information disclosure | [Official Link](https://github.com/kubernetes/kubernetes/issues/131008) |

## 2. Vulnerability Impact Analysis

These vulnerabilities primarily impact the system in the following ways:
- **Risk of Code Execution**: CVE-2025-1097, CVE-2025-24514, CVE-2025-1098, and CVE-2025-1974 may allow arbitrary code execution within the ingress-nginx controller context.
- **Information Disclosure**: By default, the ingress-nginx controller has access to all namespaces' Secrets within the cluster, potentially exposing sensitive credentials.
- **Unauthorized Access**: Particularly with CVE-2025-1974, attackers with access to the Pod network can gain cluster control without authentication, with a CVSS score of 9.8 (Critical).
- **Mitigation Condition**: For CVE-2025-24514, if the `enable-annotation-validation` parameter is enabled (default from v1.12.0), the system is not affected by this vulnerability.

## 3. How to Verify if You Are Affected

Please follow the steps below to check if your system is impacted:

**Confirm if ingress-nginx is in use:**

```
kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx
```

If the command returns results, you are using ingress-nginx.

**Check the installed ingress-nginx version:**
`kubectl exec -it -n ingress-nginx deploy/ingress-nginx-controller -- /nginx-ingress-controller --version`


Affected versions:
- `< v1.11.0`
- `v1.11.0 - v1.11.4`
- `v1.12.0`

**Note**: If you are using an affected version, immediately follow the solutions or mitigations provided in this document.

## 4. Solutions

### 1. Upgrade (Recommended by Nginx Community)

Upgrade to one of the following secure versions:
- v1.11.5
- v1.12.1 or higher

### 2. Upgrade Fix (KubeSphere Gateway)

**For KS/KSE v4.1.3, follow the steps below to upgrade the Gateway.**

- **Before KS/KSE v4.1.3**: First, upgrade to v4.1.3.
- **Upgrade KubeSphere Gateway to v1.0.4** (Ingress-Nginx controller version v1.12.1).

For the upgrade method of Gateway extension components, refer to the [Gateway Upgrade Guide](https://dev.to/palapala/upgrade-gateway-to-v104-fie).

### 3. Temporary Mitigations

If an immediate upgrade is not possible, apply the following temporary mitigations:

**CVE-2025-1097 Mitigation**
- Check and remove any `auth-tls-match-cn` annotation in all Ingress resources:
```

# Check
kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_TLS_MATCH_CN:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-tls-match-cn'

# Remove
kubectl annotate ingress -n <namespace> <IngressName> nginx.ingress.kubernetes.io/auth-tls-match-cn-
```

**CVE-2025-24514 Mitigation**
- Check and remove any `auth-url` annotation in all Ingress resources:

```
# Check
kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_URL:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-url'

# Remove
kubectl annotate ingress -n <namespace> <IngressName> nginx.ingress.kubernetes.io/auth-url-
```

- Or enable the `enable-annotation-validation` parameter (enabled by default since v1.12.0, but needs manual configuration in older versions):


```
# Check if annotation validation is enabled
kubectl get deployment -n ingress-nginx ingress-nginx-controller -o yaml | grep enable-annotation-validation

# If not enabled, edit the deployment to add the parameter
kubectl edit deployment -n ingress-nginx ingress-nginx-controller
# Add --enable-annotation-validation=true
# Save, and the controller will restart automatically
```


**CVE-2025-24513 and CVE-2025-1974 Mitigation**

KubeSphere Gateway does not enable Admission Controller by default. Use the following methods to check whether your gateway has enabled the Admission Controller.

**Check all releases:**


`helm list -n A | grep kubesphere-router`

**Check if Admission Controller is enabled in any release:**

`helm get values [RELEASE_NAME] -n [RELEASE_NAMESPACE]`


If `controller.admissionWebhooks.enabled` is true, immediately contact QingCloud technical support for resolution.

If you installed ingress-nginx manually, use the following method to check and resolve the issue.

- Disable Admission Controller (Note: This is a temporary mitigation. If upgraded to secure versions v1.11.5 or v1.12.1, you do not need to disable it):

**If using Helm to install ingress-nginx:**



```
# Reinstall with Helm parameters to disable admission webhook
helm upgrade [RELEASE_NAME] ingress-nginx/ingress-nginx \
  --set controller.admissionWebhooks.enabled=false \
  -n ingress-nginx
```

**If manually installing ingress-nginx:**


```
# Method 1: Delete ValidatingWebhookConfiguration
kubectl delete validatingwebhookconfigurations ingress-nginx-admission

# Method 2: Edit Deployment or DaemonSet to remove --validating-webhook parameter
kubectl edit deployment -n ingress-nginx ingress-nginx-controller
# Find the containers.args section and delete the --validating-webhook related lines
```

**Important**: Upgrading to a secure version (v1.11.5, v1.12.1, or higher) is the complete fix for all vulnerabilities. Disabling Admission Controller is only a temporary measure when an upgrade is not possible. Keep Admission Controller enabled after upgrading to ensure proper functionality.

**CVE-2025-1098 Mitigation**
- Check and remove any `mirror-target` and `mirror-host` annotations in all Ingress resources:



```
# Check
kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,MIRROR_TARGET:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-target,MIRROR_HOST:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-host'

# Remove
kubectl annotate ingress -n <namespace> <IngressName> nginx.ingress.kubernetes.io/mirror-target- kubectl annotate ingress -n <namespace> <IngressName> nginx.ingress.kubernetes.io/mirror-host-

```

## 5. Detection Methods

### Detect Suspicious Configurations and Activities
Use the following commands to check for suspicious configurations or activities:

1. Check for potentially exploited `auth-tls-match-cn` annotations (CVE-2025-1097):

`kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_TLS_MATCH_CN:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-tls-match-cn'`

- Check for suspicious content, especially annotations with special characters such as `#`, `}}`, newline characters, etc.

2. Check for potentially exploited `auth-url` annotations (CVE-2025-24514):

`kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_URL:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-url'`

- Check for suspicious content, especially URLs containing `#;` or newline characters.

 3. Check if Admission Controller is enabled (relevant for CVE-2025-24513 and CVE-2025-1974):

`kubectl get validatingwebhookconfigurations -l app.kubernetes.io/name=ingress-nginx`

- If results return, Admission Controller is enabled, which could pose a risk of attack.

4. Check for potentially exploited `mirror-target` or `mirror-host` annotations (CVE-2025-1098):

`kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,MIRROR_TARGET:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-target,MIRROR_HOST:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-host'`

-  Check for suspicious content.

5. Check Pod logs for suspicious activities:

`kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=1000 | grep -E "error|warn|critical|suspicious|unauthorized"`


- If suspicious configurations or activities are detected, isolate affected resources immediately and contact the security team for further analysis.

## 6. Security Best Practices
- Implement strict gateway access control.
- Configure gateway routing isolation policies.
- Enable TLS.
- Restrict Ingress resource access.
- Enable audit logging and monitoring.
- Implement RBAC with least privilege.
- Regularly check and upgrade the ingress-nginx controller.
- Ensure Admission Controller is not exposed externally.
- Implement network policies to limit Pod network communication.

## 7. Technical Support

If evidence of exploitation is found or technical support is needed, please contact:

- KubeSphere Security Team: security@kubesphere.io
- GitHub Issues: [KubeSphere GitHub Issues](https://github.com/kubesphere/kubesphere/issues)

## 8. Reference Information
- [Ingress-Nginx Upgrade Documentation](https://kubernetes.github.io/ingress-nginx/deploy/upgrade/)
- [Wiz Research: IngressNightmare Vulnerability Analysis](https://www.wiz.io/blog/ingress-nginx-kubernetes-vulnerabilities)
- [Kubernetes Official Blog: Introduction to CVE-2025-1974](https://kubernetes.io/blog/2025/03/24/ingress-nginx-cve-2025-1974/)
