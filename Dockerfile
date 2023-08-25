FROM nginx:1-alpine

COPY ./nginx/templates /etc/nginx/templates

ENV PROXY_PORT=8000
ENV CLIENT_MAX_BODY_SIZE=20m
ENV ERROR_LOG_LEVEL=error
ENV WEB_SDK_HOST=https://web-sdk.smartlook.com
ENV MANAGER_HOST=https://manager.eu.smartlook.cloud
ENV ASSETS_PROXY_HOST=https://assets-proxy.smartlook.cloud
ENV WEB_SDK_WRITER_HOST=https://web-writer.eu.smartlook.cloud
ENV MOBILE_SDK_WRITER_HOST=https://sdk-writer.eu.smartlook.cloud

EXPOSE ${PROXY_PORT}
