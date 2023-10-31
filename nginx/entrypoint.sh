#!/bin/sh

set -e

nginx_conf=/etc/nginx/conf.d/default.conf

echo -e "\n\nSmartlook Relay Proxy - initializing..."

if [ "$LISTEN_IPV6" = "true" ]; then
    echo -e "\nEnvironment variable LISTEN_IPV6 is set to \`${LISTEN_IPV6}\`, enabling IPv6 support."
    sed -i "/server {/a \    listen [::]:${PROXY_PORT};" $nginx_conf
fi

if [ -n "$DNS_RESOLVER" ]; then
    echo -e "\nEnvironment variable DNS_RESOLVER is set to \`${DNS_RESOLVER}\`, replacing default resolver."
    sed -i "s/resolver .*/resolver ${DNS_RESOLVER};/" $nginx_conf
fi

echo -e "\nSmartlook Relay Proxy - initialization finished. Starting nginx...\n\n"
