---
title: "Auditing Log Query"
keywords: "Kubernetes, KubeSphere, auditing, log, query"
description: "Understand how you can perform quick auditing log queries to keep track of the latest auditing information of your cluster."
linkTitle: "Auditing Log Query"
weight: 15330
---

KubeSphere supports the query of auditing logs among isolated tenants. This tutorial demonstrates how to use the query function, including the interface, search parameters, and detail pages.

## Prerequisites

You need to enable [KubeSphere Auditing Logs](../../../pluggable-components/auditing-logs/).

## Enter the Query Interface

1. Log in to the console with any account, hover over the <img src="/images/docs/toolbox/auditing-query/toolbox-icon.png" width="20" /> icon in the lower-right corner and select **Auditing Operating**.

   {{< notice note >}} 

Any account has the authorization to query auditing logs, while the logs each account is able to see are different.

- If an account has the authorization of viewing resources in a project, it can see the auditing log that happens in this project, such as workload creation in the project.
- If an account has the authorization of listing projects in a workspace, it can see the auditing log that happens in this workspace but not in projects, such as project creation in the workspace.
- If an account has the authorization of listing projects in a cluster, it can see the auditing log that happens in this cluster but not in workspaces and projects, such as workspace creation in the cluster.

{{</ notice >}} 

2. In the pop-up window, you can see trends in the total number of auditing logs in the last 12 hours. 

   The **Auditing Operating** console supports the following query parameters:

   <table border='1'>
     <tbody>
       <tr>
         <th width='150'>Parameter</th>
         <th>Description</th>
       </tr>
       <tr>
         <td>Cluster</td>
         <td>Cluster where the operation happens. It is enabled if the <a href='../../../multicluster-management/'>multi-cluster feature</a> is turned on.</td>
       </tr>
       <tr>
         <td>Project</td>
         <td>Project where the operation happens. It supports exact query and fuzzy query.</td>
       </tr>
       <tr>
         <td>Workspace</td>
         <td>Workspace where the operation happens. It supports exact query and fuzzy query.</td>
       </tr><tr>
         <td>Resource Type</td>
         <td>Type of resource associated with the request. It supports fuzzy query.</td>
       </tr><tr>
         <td>Resource Name</td>
         <td>Name of the resource associated with the request. It supports fuzzy query.</td>
       </tr><tr>
         <td>verb</td>
         <td>Kubernetes verb associated with the request. For non-resource requests, this is the lowercase HTTP method. It supports exact query.</td>
       </tr><tr>
         <td>Status Code</td>
         <td>HTTP response code. It supports exact query.</td>
       </tr><tr>
         <td>Operation Account</td>
         <td>User who calls this request. It supports exact and fuzzy query.</td>
       </tr><tr>
         <td>Source IP</td>
         <td>IP address from where the request originated and intermediate proxies. It supports fuzzy query.</td>
       </tr>
       <tr>
         <td>Time Range</td>
         <td>Period when the request reaches the apiserver.</td>
       </tr>
     </tbody>
   </table>

   {{< notice note >}} 

- Fuzzy query supports case-insensitive fuzzy matching and retrieval of full terms by the first half of a word or phrase based on Elasticsearch segmentation rules.
- KubeSphere stores logs for the last 7 days by default. You can modify the retention period in the ConfigMap `elasticsearch-logging-curator`.

{{</ notice >}} 

## Enter Query Parameters

1. Select a filter and enter the keyword you want to search. For example, query auditing logs containing the information of `services` created as shown in the following screenshot:

   ![user-changed](/images/docs/toolbox/auditing-query/user-changed.png)

2. Click any one of the results from the list to see details of the auditing log.

   ![auditing-log-detail](/images/docs/toolbox/auditing-query/auditing-log-detail.png)
