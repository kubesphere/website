---
title: "Panels"
keywords: 'monitoring, prometheus, prometheus operator'
description: 'Panels'

linkTitle: "Panels"
weight: 2140
---

KubeSphere currently supports two kinds of charts: text charts and graph charts.

## Text

A text chart is preferable for displaying a single metric value. The editing window for the text chart is composed of two parts. The upper part displays the real-time metric value, and the lower part is for editing. You can input a PromQL expression to fetch a single metric value.

- **Chart Name**: the name of the text chart.
- **Unit**: the metric data unit.
- **Decimal Places**: accept an integer.
- **Monitoring Metrics**: a list of available Prometheus metrics.

![text-chart-1](/images/docs/project-user-guide/custom-application-monitoring/text-chart-1.jpg)

## Graph

A graph chart is preferable for displaying multiple metric values. The editing window for the graph chart is composed of three parts. The upper part displays real-time metric values. The left part is for setting the graph theme. The right part is for editing metrics and chart descriptions.

- **Graph Types**: support line charts and stacked charts.
- **Chart Colors**: change line colors.
- **Chart Name**: the name of the text chart.
- **Description**: the chart description.
- **Add Button**: add a new query editor.
- **Metric Name**: legend for the line. It supports variables. For example, `{{pod}}` means using the value of the Prometheus metric label `pod` to name this line.
- **Interval**: the step value between two data points.
- **Monitoring Metrics**: a list of available Prometheus metrics.
- **Unit**: the metric data unit.
- **Decimal Places**: accept an integer.

![graph-chart](/images/docs/project-user-guide/custom-application-monitoring/graph-chart.jpg)