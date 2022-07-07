---
_build:
    render: false
---

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in the cluster.
- If your network configuration uses firewall rules or security groups, you must ensure infrastructure components can communicate with each other through specific ports. It is recommended that you turn off the firewall. For more information, see {{< contentLink "docs/v3.3/installing-on-linux/introduction/port-firewall/" "Port Requirements" >}}.
- Supported CNI plugins: Calico and Flannel. Others (such as Cilium and Kube-OVN) may also work but note that they have not been fully tested.