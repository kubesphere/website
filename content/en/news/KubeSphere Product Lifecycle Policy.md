---
title: 'KubeSphere Product Lifecycle Policy'
tag: 'Product News'
keywords: 'KubeSphere, Lifecycle Policy'
description: 'The KubeSphere community has released the Product Lifecycle Management Policy, detailing the lifecycle management of KubeSphere cloud-native products, including version definitions, support levels, and lifecycle stages.'
createTime: '2025-02-14'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere%20Product%20Lifecycle%20Policy%20en.png'
---


> Document Versio:  v1.0
> Last Updated: February 14, 2025

## Overview

In a rapidly evolving market, KubeSphere, the product from QingCloud Technologies, has established this Product Lifecycle Policy to ensure that our cloud-native products and services consistently meet customer expectations. By proactively phasing out products that no longer align with market demands, we provide clear termination guidelines, mitigate business risks, and enhance customer trust. Our commitment to technological innovation drives sustainable growth while delivering maximum value to customers.

## Scope

This policy applies to the following KubeSphere cloud-native products:
- **KubeSphere Community Edition** (Versions: v1, v2, v3, v4)
- **KubeSphere Enterprise Edition** (Including legacy QKCP; Versions: v1, v2, v3, v4)


## Version Definitions
KubeSphere uses semantic versioning (Major, Minor, Patch.) to indicate release stages and scope:

|**Version Type**|**Definition**|**Resetting Rules**|**Example**|
| :-: | :-: | :-: | :-: |
|Major Version|Indicates significant changes, such as a **new product architecture**, **major features**, **revamped user experience**, or incompatibility with previous versions. |Minor and Patch versions reset to 0 (e.g., v4.0.0).|v3.4.1 → v4.0.0|
|Minor Version|Introduces **new features**, **performance improvements**, **security upgrades**,** or **compatibility enhancements**.|Patch version resets to 0; Major version remains unchanged.|v4.1.2 → v4.2.0|
|Patch Version|Addresses minor fixes or optimizations, such as **bug fixes**, **stability improvements**, or **product experience enhancements**. Patch Versions do not initiate a new product lifecycle and do not affect the Major or Minor Version.|Major and Minor versions remain unchanged.|v4.1.2 → v4.1.3|
|HotFix|Provides **emergency fixes** for critical issues like **blocking bugs** or **severe security vulnerabilities** that disrupt customer operations without temporary solutions. It involves targeted fixes and testing, unlike full releases, and serves as a temporary measure—upgrading to a formal release remains the best practice. HotFixes typically don’t change the main version number, and may be formally included in the next Patch or Minor Version.|No version numbers altered. Incrementally appended to the existing version.|v3.5.0 → 3.5.0-hotfix-001|

<center><span style="color: #00A971;">KubeSphere Product Version Definitions</span></center>

## Service & Support Tiers

KubeSphere cloud-native products and services offer two support tiers: **FS (Full Support)** and **ES (Extended Support)**. The table below uses "Y" (Yes) and "N" (No) to indicate availability. Numbered annotations refer to detailed explanations following the table.

|**Service & Support Type**|**FS**|**ES**|
| :-: | :-: | :-: |
|Duration|12-36 months|6-24 months (max 2 renewals)|
|Root-Cause Analysis<sup>(1)</sup>|Y|Y|
|New Features|Y|N|
|Version Upgrades<sup>(2), (3)</sup> |Y|Y<sup>(2)</sup> |
|Feature/UX Enhancements|Y|N|
|General Bug Fixes|Y|N|
|Critical Bug Fixes<sup>(4)</sup>|Y|Y|
|Critical Security Fixes<sup>(5)</sup>|Y|Y|
|Compatibility Support<sup>(6)</sup>|N<sup>(7)</sup> |N|
|Migration Support    |N|N|

<center><span style="color: #00A971;">KubeSphere Service and Support Tiers</span></center>

**Footnotes**

- (1)  Root-Cause Analysis: Applies only to issues caused by third-party software/hardware (e.g., customer-developed systems, non-QingCloud hardware). QingCloud provides diagnostic assistance but does not guarantee resolution.
- (2) Version Upgrades: Includes upgrades for Major, Minor, Patch versions, or HotFixes. Under ES tier, only HotFix upgrades are provided for "Critical Bug Fixes" and "Critical Security Fixes".
- (3)  Sequential Upgrades: Upgrades must follow version sequence—skipping major or minor versions is not supported. For assistance or custom upgrade plans, contact QingCloud support or after-sales services.
- (4)  Critical Bugs: Defined as issues impacting business continuity, stability, or reliability. Jointly confirmed by customers, product managers, and engineers.
- (5) Critical Security Vulnerabilities: CVSS score ≥7.
- (6)  Compatibility Support: Limited to versions/architectures validated at release. No new compatibility support during FS/ES.
- (7)  Compatibility in FS: No additional compatibility updates post-GA.

#### **Additional Rules**
- **ES Eligibility**: 
  - Available only for Enterprise editions.
  - Requires explicit approval from QingCloud.
  - Maximum two renewals (24 months total).
- **Delivery Mode**: FS/ES support is provided remotely (ticketing, email, WeChat, etc.). On-site support requires separate agreements.
- **SLA**: The final service scope is defined in QingCloud’s official SLA documentation.

## Lifecycle Stages

### Standard Product Versions

|**Stage**|**Name**|**Definition**|**Service & Support Tiers**|**Customer Impact**|
| :-: | :-: | :-: | :-: | :-: |
|**GA**|General Availability|<p>(1) Marks the official start of the product lifecycle.</p><p>(2) Indicates commercial availability for deployment to customer production environments.</p>|FS|<p>(1) Production-ready with full support.</p><p>(2) Eligible for all FS services.</p>|
|**EoFS**|End of Full Support|<p>(1) Termination of Full Support: No new Patch versions will be released. Only HotFixes for critical bugs/security vulnerabilities.</p><p>(2) The product (Major/Minor versions) is no longer sold.</p>|ES|<p>(1) Avoid new deployments/scaling on EoFS versions.</p><p>(2) Cannot access new Patch releases.</p><p>(3) Upgrades to newly GA’d versions are recommended.</p><p>(4) ES subscription is required for extended support.</p>|
|**EoES**|End of Extended Support|<p>(1) Termination of all support except migration guidance.</p><p>(2) No HotFixes for critical issues.</p><p>(3) Mandatory version upgrade is required.</p>|---|<p>(1) Immediate upgrade enforced.</p><p>(2) No SLA guarantees.</p><p>(3) Official documentation/artifacts (e.g., charts, images) will soon be deprecated.</p>|
|**EoL**|End of Life|<p>(1) Complete termination of all activities: No sales, upgrades (including HotFixes), or support.</p><p>(2) QingCloud assumes no liability for post-EoL issues.</p>|---|<p>(1) Official documentation/artifacts become inaccessible.</p><p>(2) Maintain or migrate business environments on your own.</p><p>(3) Purchase new versions for continued service.</p>|

<center><span style="color: #00A971;">KubeSphere Product Lifecycle Stages</span></center>

### **Preview Products and Extensions Versions**
In KubeSphere’s cloud-native products and services, **Preview** products and extensions versions are not for sale or commercial use. They are intended solely for lab, development, and testing purposes in non-production environments and do not come with SLA or EOS commercial guarantees. Typically, the lifecycle of Preview product versions and extension components is **6 months**.

## Lifecycle Timeline
### KubeSphere Enterprise Edition (Including QKCP)

|**Version**|**Type**|**GA**|**EoFS**|**EoES**|**EoL**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|KSE v4.2|Standard|Jul 14, 2025|Jul 14, 2028|Jan 14, 2030|Mar 14, 2030|
|KSE v4.1|Standard|Apr 16, 2024|Apr 16, 2027|Oct 16, 2028|Dec 16, 2028|
|KSE v4.0|Preview|Aug 16, 2023|---|---|Jun 28, 2024|
|KSE v3.5|Standard|Oct 13, 2023|Jul 13, 2025|Jan 13, 2026|Mar 13, 2026|
|KSE v3.4|Standard|Apr 25, 2023|May 25, 2025|Nov 25, 2025|Dec 25, 2025|
|KSE v3.3|Standard|---|Mar 31, 2025|Sep 30, 2025|Oct 31, 2025|
|QKCP v3.2 & earlier|Standard|---|---|---|Mar 31, 2025|

<center><span style="color: #00A971;">KubeSphere Enterprise Edition Product Lifecycle Timeline</span></center>

**Notes**:

- **Extensions post KSE v4.2**: May release independently but share the same lifecycle as KSE.
- **Preview Releases**: Non-commercial, lab/testing-only versions with a 6-month lifecycle (no SLA).

### KubeSphere Community Edition

|**Version**|**Type**|**GA**|**EoL**|
| :-: | :-: | :-: | :-: |
|KubeSphere v4.2|Standard|---|---|
|KubeSphere v4.1|Standard|Sep 12, 2024|Sep 12, 2027|
|KubeSphere v3.4|Standard|---|Dec 25, 2025|
|KubeSphere v3.3 & earlier|Standard|---|Oct 31, 2025|

<center><span style="color: #00A971;">KubeSphere Community Edition Product Lifecycle Timeline</span></center>

## Supplementary Notes
- **Third-Party Extensions**: KubeSphere v4 may include third-party ecosystem extensions. For lifecycle policies, refer to the respective provider’s documentation.
- **Version Discrepancies**: Due to regulatory requirements (e.g., software copyright, tax refunds), the version in QingCloud’s sales catalog or contracts may differ from the actual delivered version. The licensed and deployed version at first purchase shall prevail.
- **Permanent Licenses & Multi-Year Support**: For permanent licenses or multi-year FS/ES, the applicable version may not align with the version available at purchase. The licensed and deployed version shall prevail.
- **Dynamic Timeline Adjustments**: The "KubeSphere Lifecycle Timeline" reflects minimum commitments. EoFS, EoES, or EoL dates may be adjusted based on version quality, deployment scale, or new product development. Updates will be announced separately.
