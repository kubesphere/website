---
title: "Overview"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Overview'

linkTitle: "Overview"
weight: 2130
---

This section introduces dashboard features. You will learn how to visualize metric data on KubeSphere for your custom applications. If you do not know how to integrate your application metrics into KubeSphere monitoring system, you should read [Introduction](../../introduction) first.

## Create Dashboard

To create new dashboards for your application metrics, you should navigate to **Custom Monitoring** on the Project Overview page. There are three ways to create dashboards. For MySQL, Elasticsearch, and Redis, you can use built-in templates. These templates are for demonstration purposes and are updated with KubeSphere releases. Besides, you can choose to customize dashboards from scratch.

KubeSphere dashboard is simply a YAML configuration file. The data model is heavily inspired by [Grafana](https://github.com/grafana/grafana), an open-source tool for monitoring and observability. Please find KubeSphere monitoring dashboard data model design in [kubesphere/monitoring-dashboard](https://github.com/kubesphere/monitoring-dashboard). The configuration file is portable and sharable. You are welcomed to contribute dashboard templates to KubeSphere community via [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery). 

![new-dashboard](/images/docs/project-user-guide/custom-application-monitoring/new-dashboard.PNG)

### From builtin templates

For a quick start, KubeSphere provides built-in templates for MySQL, Elasticsearch, and Redis. If you want to create dashboards from built-in templates, select the template then click **Create**.

### From scratch

To start with a blank template, click **Create**. 

### From YAML file

Toggle to **Edit Mode** on the right top then paste your dashboard YAML files.

![new-dashboard-2](/images/docs/project-user-guide/custom-application-monitoring/new-dashboard-2.PNG)

## Dashboard Layout

The dashboard layout is composed of four parts. On the top is for a global setting. The left-most column is for text-based charts showing the current value of metrics. The middle column places line chart collections for visualizing metrics over a specific period. The rightmost column presents detailed information on graph charts.

### Top bar

On the top bar, you can configure the following setting: title, theme, time range, and refresh interval.

![dashboard-layout](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout.PNG)

### Text chart column

You can add new text charts on the left-most column.

![dashboard-layout-2](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout-2.PNG)

### Graph chart column

You can view graph charts on the middle column.

![dashboard-layout-3](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout-3.PNG)

### Detail column

You can view graph chart details on the right-most column. It shows the max, min, avg and last value of metrics within the specific period.

![dashboard-layout-4](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout-4.PNG)

## Edit Dashboard

Switch to edit mode by clicking **Edit Template**.

### Add panel

To add text charts, click **plug sign** on the left column. To add graph chart, click **Add Monitoring Item** on the bottom of the right column.

![edit-dashboard](/images/docs/project-user-guide/custom-application-monitoring/edit-dashboard.PNG)

### Add group

To group monitoring items, you can drag the item into the target group. To add a new group, click **Add Monitoring Group**.

## Open Dashboard

Find and share dashboard templates to [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery). It is a place for KubeSphere community users to contribute their masterpieces! 