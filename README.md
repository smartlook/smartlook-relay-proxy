# Smartlook Relay Proxy

This service relays HTTP requests from your subdomain to
Smartlook's recording domains, allowing you to bypass potential
browser settings or extensions used by your visitors configured to limit data capture.

> **Note**
> Only web recording is currently supported.

## Installation and deployment

> **Warning**
> Relay Proxy is only for advanced users. If you're not sure what you're doing, please contact your developer.

Images are available on [Docker Hub](https://hub.docker.com/r/smartlook/relay-proxy) and [GitHub Packages](https://github.com/smartlook/smartlook-relay-proxy/pkgs/container/relay-proxy).

1. Run the image and configure environment variables according to your needs.  
   **All variables are optional, default values are listed in the table below**.

```bash
docker run --name="smartlook-relay-proxy" \
  -p <port>:8000 \  # runs on port 8000 by default
  smartlook/relay-proxy:latest
```

2. Create a new subdomain (e.g. `sl.yourdomain.com`) and point it to the container.

3. Replace URLs in Smartlook script and fill in your project key:

```diff
<script>
 window.smartlook ||
   (function (d) {
   var o = (smartlook = function () {
     o.api.push(arguments)
   }), h = d.getElementsByTagName('head')[0];
   var c = d.createElement('script');
   o.api = new Array();
   c.async = true;
   c.crossOrigin = 'anonymous';
   c.type = 'text/javascript';
   c.charset = 'utf-8';
+  c.src = 'https://<your-relay-proxy-host>/recorder.js';
   h.appendChild(c);
 })(document);
+ smartlook('init', <project-key>, { host: '<your-relay-proxy-host>' });
</script>
```

4. You're done! Visit your site and check the network tab to make sure the requests are sent through your subdomain.
   ![network tab screenshot](https://raw.githubusercontent.com/smartlook/smartlook-relay-proxy/main/network.png)

## Environment variables

| Name                  | Type      | Default value                           | Description                                                                                        |
| --------------------- | --------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `LOGGER_LEVEL`        | `string`  | `info`                                  | One of `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`                                |
| `PROXY_PORT`          | `number`  | `8000`                                  | Port which will the HTTP server listen on                                                          |
| `WEB_SDK_HOST`        | `string`  | `https://web-sdk.smartlook.com`         | Smartlook Web SDK host                                                                             |
| `MANAGER_HOST`        | `string`  | `https://manager.eu.smartlook.cloud`    | Smartlook Manager host                                                                             |
| `WEB_SDK_WRITER_HOST` | `string`  | `https://web-writer.eu.smartlook.cloud` | Smartlook Web Writer host                                                                          |
| `ASSETS_PROXY_HOST`   | `string`  | `https://assets-proxy.smartlook.cloud`  | Smartlook Assets Proxy host                                                                        |
| `LOG_REQUESTS`        | `boolean` | `false`                                 | Log all requests (useful for debugging)                                                            |
| `TRUST_PROXY`         | `boolean` | `true`                                  | See Fastify's [trustProxy](https://www.fastify.io/docs/latest/Reference/Server/#trustproxy) option |

## Region-specific setup

Smartlook servers are located in four regions:

1. EU (Frankfurt)
1. North America (Oregon)
1. South America (São Paulo)
1. Asia (Singapore)

**By default, all requests are sent to the EU region**. If most of your visitors are located in a different region and you want to reduce the network latency, you can set the following environment variables to point to the region closest to your visitors. **Note that this will only affect the network latency, not the data storage location**. For more information about data storage, see the [Regional data storage setup](#regional-data-storage-setup) section below.

#### North America

| Name                  | Value                                     |
| --------------------- | ----------------------------------------- |
| `MANAGER_HOST`        | `https://manager.us.smartlook.cloud`      |
| `WEB_SDK_WRITER_HOST` | `https://web-writer.us.smartlook.cloud`   |
| `ASSETS_PROXY_HOST`   | `https://assets-proxy.us.smartlook.cloud` |

#### South America

> **Note**
> For this region, only the `WEB_SDK_WRITER_HOST` is available.

| Name                  | Value                                   |
| --------------------- | --------------------------------------- |
| `WEB_SDK_WRITER_HOST` | `https://web-writer.br.smartlook.cloud` |

#### Asia

> **Note**
> For this region, only the `WEB_SDK_WRITER_HOST` is available.

| Name                  | Value                                   |
| --------------------- | --------------------------------------- |
| `WEB_SDK_WRITER_HOST` | `https://web-writer.sg.smartlook.cloud` |

### Regional data storage setup

Smartlook offers two regions for data storage: **EU** and **US**. Note that this is different from the region-specific setup described above, which only affects the network latency, but not the data storage location.

**By default, all data is stored in the EU**. However, if your Smartlook organization is set up to store data in US (you must contact Smartlook support to set it up), you need to set the environment variables as described in region-specific setup [above](#north-america).

## Development

```bash
# See all available commands
make help
```

## License

[MIT](LICENSE)
