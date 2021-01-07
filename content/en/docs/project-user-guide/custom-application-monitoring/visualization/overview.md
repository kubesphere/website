---
title: "Overview"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Overview'
linkTitle: "Overview"
weight: 10815
---

This section introduces dashboard features. You will learn how to visualize metric data in KubeSphere for your custom applications. If you do not know how to integrate your application metrics into KubeSphere monitoring system, read [Introduction](../../introduction) first.

## Create a Monitoring Dashboard

To create new dashboards for your application metrics, navigate to **Custom Monitoring** on the project **Overview** page. There are three ways to create dashboards. For MySQL, Elasticsearch, and Redis, you can use built-in templates. These templates are for demonstration purposes and are updated with KubeSphere releases. Besides, you can choose to customize dashboards from scratch.

A KubeSphere custom monitoring dashboard can be seen as simply a YAML configuration file. The data model is heavily inspired by [Grafana](https://github.com/grafana/grafana), an open-source tool for monitoring and observability. Please find KubeSphere monitoring dashboard data model design in [kubesphere/monitoring-dashboard](https://github.com/kubesphere/monitoring-dashboard). The configuration file is portable and sharable. You are welcome to contribute dashboard templates to the KubeSphere community via [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery). 

![new-dashboard](/images/docs/project-user-guide/custom-application-monitoring/new-dashboard.jpg)

### From built-in templates

For a quickstart, KubeSphere provides built-in templates for MySQL, Elasticsearch, and Redis. If you want to create dashboards from built-in templates, select a template then click **Create**.

### From scratch

To start with a blank template, click **Create**. 

### From YAML

Toggle to **Edit Mode** in the top right corner then paste your dashboard YAML files.

![new-dashboard-2](/images/docs/project-user-guide/custom-application-monitoring/new-dashboard-2.jpg)

## Dashboard Layout

The dashboard layout is composed of four parts. Global settings are on the top of the page. The left-most column is for text-based charts showing the current value of metrics. The middle column places line chart collections for visualizing metrics over a specific period. The right-most column presents detailed information in charts.

### Top bar

On the top bar, you can configure the following settings: title, theme, time range, and refresh interval.

![dashboard-layout](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout.jpg)

### Text chart column

You can add new text charts in the left-most column.

![dashboard-layout-2](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout-2.jpg)

### Chart display column

You can view charts in the middle column.

![dashboard-layout-3](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout-3.jpg)

### Detail column

You can view chart details in the right-most column. It shows the **max**, **min**, **avg** and **last** value of metrics within the specific period.

![dashboard-layout-4](/images/docs/project-user-guide/custom-application-monitoring/dashboard-layout-4.jpg)

## Edit the monitoring dashboard

You can edit an existing template by clicking **Edit Template** in the top right corner.

### Add a panel

To add text charts, click the **add icon** in the left column. To add charts, click **Add Monitoring Item** in the bottom right corner.

![edit-dashboard](/images/docs/project-user-guide/custom-application-monitoring/edit-dashboard.jpg)

### Add a group

To group monitoring items, you can drag the item into the target group. To add a new group, click **Add Monitoring Group**.

## Dashboard Templates

Find and share dashboard templates in [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery). It is a place for KubeSphere community users to contribute their masterpieces.