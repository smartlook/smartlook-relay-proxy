FROM nginx:1-alpine

ARG COMMIT_SHA="unknown"

COPY ./nginx/templates /etc/nginx/templates

ENV COMMIT_SHA=${COMMIT_SHA}
ENV PROXY_PORT=8000
ENV CLIENT_MAX_BODY_SIZE=20m
ENV ERROR_LOG_LEVEL=error
ENV WEB_SDK_HOST=web-sdk.smartlook.com
ENV MANAGER_HOST=manager.eu.smartlook.cloud
ENV ASSETS_PROXY_HOST=assets-proxy.smartlook.cloud
ENV WEB_SDK_WRITER_HOST=web-writer.eu.smartlook.cloud
ENV MOBILE_SDK_WRITER_HOST=sdk-writer.eu.smartlook.cloud

EXPOSE ${PROXY_PORT}
