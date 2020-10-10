---
title: "Panels"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Panels'

linkTitle: "Panels"
weight: 2140
---

KubeSphere currently supports two kinds of charts: text charts and graph charts.

## Text

Text chart is preferable for displaying a single metric value. The editing window for the text chart is composed of two parts. The upper part displays the real-time metric value, and the lower part is for editing. You can input a PromQL expression to fetch a single metric value.

- **Chart Name**: the name of the text chart
- **Unit**: metric data unit
- **Decimal Places**: accepts an integer
- **Monitoring Metrics**: list of available Prometheus metrics

![text-chart-1](/images/docs/project-user-guide/custom-application-monitoring/text-chart-1.PNG)

## Graph

Graph chart is preferable for displaying multiple metric values. The editing window for the graph chart is composed of three parts. The upper displays real-time metric values. The left part is for setting the graph theme. The right part is for editing metrics and chart description.

- **Graph Types**: support line charts and stacked charts
- **Chart Colors**: change line colors
- **Chart Name**: the name of the text chart
- **Description**: chart description
- **Add Button**: add a new query editor
- **Metrics Name**: legend for the line. It supports variables. For example, `{{pod}}` means using the value of the Prometheus metric label `pod` to name this line.
- **Interval**: step between two data points
- **Monitoring Metrics**: list of available Prometheus metrics
- **Unit**: metric data unit
- **Decimal Places**: accepts an integer

![graph-chart](/images/docs/project-user-guide/custom-application-monitoring/graph-chart.PNG)