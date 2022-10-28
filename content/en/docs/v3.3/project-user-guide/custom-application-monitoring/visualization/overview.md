---
title: "Monitoring Dashboard — Overview"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Understand the general steps of creating a monitoring dashboard as well as its layout.'
linkTitle: "Overview"
weight: 10815
---

This section introduces monitoring dashboard features. You will learn how to visualize metric data in KubeSphere for your custom apps. If you do not know how to integrate your app metrics into the KubeSphere monitoring system, read [Introduction](../../introduction/) first.

## Create a Monitoring Dashboard

To create new dashboards for your app metrics, navigate to **Custom Monitoring** under **Monitoring & Alerting** in a project. There are three ways to create monitoring dashboards: built-in templates, blank templates for customization and YAML files.

Built-in templates include MySQL, Elasticsearch, Redis, and more. These templates are for demonstration purposes and are updated with KubeSphere releases. Besides, you can choose to customize monitoring dashboards.

A KubeSphere custom monitoring dashboard can be seen as simply a YAML configuration file. The data model is heavily inspired by [Grafana](https://github.com/grafana/grafana), an open-source tool for monitoring and observability. Please find KubeSphere monitoring dashboard data model design in [kubesphere/monitoring-dashboard](https://github.com/kubesphere/monitoring-dashboard). The configuration file is portable and sharable. You are welcome to contribute dashboard templates to the KubeSphere community via [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery). 

### From a built-in template

To help you quickly get started, KubeSphere provides built-in templates for MySQL, Elasticsearch, and Redis. If you want to create dashboards from built-in templates, select a template and then click **Next**.

### From a blank template

To start with a blank template, click **Next**.

### From a YAML file

Turn on **Edit YAML** in the upper-right corner and then paste your dashboard YAML file.

## Dashboard Layout

The monitoring dashboard is composed of four parts. Global settings are on the top of the page. The left-most column is for text-based charts showing the current value of metrics. The middle column contains chart collections for visualizing metrics over a specific period. The right-most column presents detailed information in charts.

### Top bar

On the top bar, you can configure the following settings: title, theme, time range, and refresh interval.

### Text chart column

You can add new text charts in the left-most column.

### Chart display column

You can view charts in the middle column.

### Detail column

You can view chart details in the right-most column. It shows the **max**, **min**, **avg**, and **last** value of metrics within the specific period.

## Edit the monitoring dashboard

You can modify an existing template by clicking **Edit Template** in the upper-right corner.

### Add a chart

To add text charts, click ➕ in the left column. To add charts in the middle column, click **Add Monitoring Item** in the lower-right corner.

### Add a monitoring group

To group monitoring items, you can click <img src="/images/docs/v3.3/project-user-guide/custom-application-monitoring/visualization/overview/six-dots.png" width="20px" alt="icon" /> to drag and drop an item into the target group. To add a new group, click **Add Monitoring Group**. If you want to change the place of a group, hover over a group and click <img src="/images/docs/v3.3/project-user-guide/custom-application-monitoring/visualization/overview/up-arrow.png" width="20px" align="center" /> or <img src="/images/docs/v3.3/project-user-guide/custom-application-monitoring/visualization/overview/down-arrow.png" width="20px" align="center" /> arrow on the right.

{{< notice note >}}

The place of group on the right is consistent with the place of charts in the middle. In other words, if you change the order of groups, the place of their respective charts will also change accordingly.

{{</ notice >}} 

## Dashboard Templates

Find and share dashboard templates in [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery). It is a place for KubeSphere community users to contribute their masterpieces.
