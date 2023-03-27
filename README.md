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
docker run --name="smartlook-relay-proxy" -d \
  # can be also set with "--env-file"
  -e LOGGER_LEVEL=<level> \
  -e MANAGER_HOST=<host> \
  -e WEB_SDK_WRITER_HOST=<host> \
  -e ASSETS_PROXY_HOST=<host> \
  -p <port>:8000 \  # internally runs on port 8000
  smartlook/relay-proxy:latest # or smartlook/relay-proxy:<version>
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

| Name                  | Type     | Default value                           | Description                                                         |
| --------------------- | -------- | --------------------------------------- | ------------------------------------------------------------------- |
| `LOGGER_LEVEL`        | `string` | `info`                                  | One of `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent` |
| `PROXY_PORT`          | `number` | `8000`                                  | Port which will the HTTP server listen on                           |
| `MANAGER_HOST`        | `string` | `https://manager.eu.smartlook.cloud`    | Smartlook Manager host                                              |
| `WEB_SDK_WRITER_HOST` | `string` | `https://web-writer.eu.smartlook.cloud` | Smartlook Web Writer host                                           |
| `ASSETS_PROXY_HOST`   | `string` | `https://assets-proxy.smartlook.cloud`  | Smartlook Assets Proxy host                                         |

## Regional data storage setup

If your Smartlook organization is set up to store data in a different region than EU, you must set the environment variables accordingly.

Example configuration for US region:

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
