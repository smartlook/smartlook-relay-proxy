# Smartlook Relay Proxy

The Smartlook relay proxy relays HTTP requests from your subdomain to Smartlook's recording domains, allow you to bypass potential browser settings or extensions configured to limit data capture.

> **Note**
> Only web recording is currently supported.

## Installation and deployment

> **Warning**
> Relay Proxy is only for advanced users. If you're not sure what you're doing, please contact your developer.

Images are available on [Docker Hub](https://hub.docker.com/r/smartlook/relay-proxy) and [GitHub Packages](https://github.com/smartlook/smartlook-relay-proxy/pkgs/container/relay-proxy).

1. Run the image and configure environment variables to your needs.  
   **All variables are optional, default values are listed in the table below**.

```bash
docker run --name="smartlook-relay-proxy" -d \
  # can be also set with "--env-file"
  -e LOGGER_LEVEL=<level> \
  -e MANAGER_HOST=<host> \
  -e WEB_SDK_WRITER_HOST=<host> \
  -e ASSETS_PROXY_HOST=<host> \
  -p <port>:8000 \  # internally runs on port 8000
  smartlook/relay-proxy:latest # or smartlook/relay-proxy:<version>
```

2. Create a subdomain and point it to the container. It is best to use a subdomain of your website's domain.

3. Deploy the following script. Be sure to replace any URLs with your own URLs. Do not set `region`:

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

You have now installed and deployed the Smartlook relay proxy. You can check if the relay proxy is working correctly by seeing requests sent through your subdomain in the Network tab of your browser DevTools.
   ![network tab screenshot](https://raw.githubusercontent.com/smartlook/smartlook-relay-proxy/main/network.png)

## Environment variables
All variables are optional. Default values are listed in the table:

| Name                  | Type     | Default value                           | Description                                                         | Notes              |
| --------------------- | -------- | --------------------------------------- | ------------------------------------------------------------------- |--------------------|
| `LOGGER_LEVEL`        | `string` | `info`                                  | One of `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent` | Can be overridden |
| `PROXY_PORT`          | `number` | `8000`                                  | Port which will the HTTP server listen on                           | Can be overriden |
| `MANAGER_HOST`        | `string` | `https://manager.eu.smartlook.cloud`    | Smartlook Manager host                                              | Only edit this value if using a region other than EU, or if instructed by customer support |
| `WEB_SDK_WRITER_HOST` | `string` | `https://web-writer.eu.smartlook.cloud` | Smartlook Web Writer host                                           | Only edit this value if using a region other than EU, or if instructed by customer support |
| `ASSETS_PROXY_HOST`   | `string` | `https://assets-proxy.smartlook.cloud`  | Smartlook Assets Proxy host                                         | Only edit this value if using a region other than EU, or if instructed by customer support |

## Regional data storage setup

If your Smartlook organization is set up to store data in a region other than the EU, you must set the environment variables based on your location.

Example environment variables if based in the US:

| Name                  | Value                                     |
| --------------------- | ----------------------------------------- |
| `MANAGER_HOST`        | `https://manager.us.smartlook.cloud`      |
| `WEB_SDK_WRITER_HOST` | `https://web-writer.us.smartlook.cloud`   |
| `ASSETS_PROXY_HOST`   | `https://assets-proxy.us.smartlook.cloud` |

## Development

```bash
# See all available commands
make help
```

## License

[MIT](LICENSE)
