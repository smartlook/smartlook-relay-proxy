#!/bin/sh

set -e

nginx_conf=/etc/nginx/conf.d/default.conf

if [ "$LISTEN_IPV6" = "true" ]; then
    echo ""
    echo "Smartlook Relay Proxy"
    echo "Environment variable LISTEN_IPV6 is set to ${LISTEN_IPV6}, enabling IPv6 support."
    echo "Adding listen directive to nginx configuration."
    echo ""
    sed -i "/server {/a \    listen [::]:${PROXY_PORT};" $nginx_conf
fi
