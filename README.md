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
1. Get the Smartlook relay proxy image. Images are available on [Docker Hub](https://hub.docker.com/r/smartlook/relay-proxy) and [GitHub Packages](https://github.com/smartlook/smartlook-relay-proxy/pkgs/container/relay-proxy).

2. Run the image and configure environment variables according to your needs.  
   **All variables are optional, default values are listed in the table below**.

```bash
docker run --name="smartlook-relay-proxy" \
  -p <port>:8000 \  # runs on port 8000 by default
  smartlook/relay-proxy:latest
```

3. Create a subdomain and point it to the container. It is best to use a subdomain of your website's domain.

4. Deploy the following script. Be sure to replace any URLs with your own URLs. Do not set `region`.

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

You have now installed and deployed the Smartlook relay proxy. You can check if the relay proxy is working correctly by seeing requests sent through your subdomain in the _Network_ tab of your browser DevTools.
   ![network tab screenshot](https://raw.githubusercontent.com/smartlook/smartlook-relay-proxy/main/network.png)

## Environment variables

| Name                  | Type      | Default value                           | Description                                                                                        | Notes                                |
| --------------------- | --------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------- |
| `LOGGER_LEVEL`        | `string`  | `info`                                  | One of `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`                                | Can be overridden |
| `PROXY_PORT`          | `number`  | `8000`                                  | Port which will the HTTP server listen on                                                          | Can be overridden |
| `WEB_SDK_HOST`        | `string`  | `https://web-sdk.smartlook.com`         | Smartlook Web SDK host                                                                             | Only edit this value if using a region other than EU, or if instructed by customer support |
| `MANAGER_HOST`        | `string`  | `https://manager.eu.smartlook.cloud`    | Smartlook Manager host                                                                             | Only edit this value if using a region other than EU, or if instructed by customer support |
| `WEB_SDK_WRITER_HOST` | `string`  | `https://web-writer.eu.smartlook.cloud` | Smartlook Web Writer host                                                                          | Only edit this value if using a region other than EU, or if instructed by customer support |
| `ASSETS_PROXY_HOST`   | `string`  | `https://assets-proxy.smartlook.cloud`  | Smartlook Assets Proxy host                                                                        | Only edit this value if using a region other than EU, or if instructed by customer support |
| `LOG_REQUESTS`        | `boolean` | `false`                                 | Log all requests (useful for debugging)                                                            |  |
| `TRUST_PROXY`         | `boolean` | `true`                                  | See Fastify's [trustProxy](https://www.fastify.io/docs/latest/Reference/Server/#trustproxy) option |  |

## Regional setup
Smartlook offers two regions for data storage: EU and US. By default, all projects are set to the EU region. To change your data storage region, contact Smartlook Support.

If your project is set to the US data region, you need to set the variables as follows:

| Name                  | Value                                     |
| --------------------- | ----------------------------------------- |
| `MANAGER_HOST`        | `https://manager.us.smartlook.cloud`      |
| `WEB_SDK_WRITER_HOST` | `https://web-writer.us.smartlook.cloud`   |
| `ASSETS_PROXY_HOST`   | `https://assets-proxy.us.smartlook.cloud` |

If most of your visitors are located in a different region, you can set environment variables to reduce network latency. Smartlook servers are located in four regions:

- EU (Frankfurt)
- North America (Oregon)
- South America (São Paulo)
- Asia (Singapore)

To set up for other regions:

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

**By default, all data is stored in the EU**. However, if your Smartlook organization is set up to store data in US (you must contact Smartlook support to set it up), you need to set the environment variables as described in region-specific setup [above](#north-america).

## Development

```bash
# See all available commands
make help
```

## License

[MIT](LICENSE)
