# Smartlook Relay Proxy

This service relays HTTP requests from your domain/subdomain to
Smartlook's recording domains, allowing you to bypass Ad blockers used
by your visitors.

## Environment variables

| Name               | Type     | Default value | Description                                                         |
| ------------------ | -------- | ------------- | ------------------------------------------------------------------- |
| `RELAY_PROXY_HOST` | `string` | `null`        | Hostname on which will the proxy run on                             |
| `LOGGER_LEVEL`     | `string` | `'info'`      | One of `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent` |

## Installation and deployment

Production-ready image is available on [Docker Hub](https://hub.docker.com/r/smartlook/relay-proxy).

1. Run the image

```sh
docker run --name="smartlook-relay-proxy" -d \
  # can be also set with "--env-file"
  -e RELAY_PROXY_HOST=<hostname> \
  -e LOGGER_LEVEL=<level> \
  -p <port>:8000 \
  smartlook/relay-proxy:latest
```

2. Point your subdomain/reverse proxy to specified port

3. Replace URLs in tracking code

```html
<script>
  window.smartlook||(function(d) {
    var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
    var c=d.createElement('script');o.api=new Array();c.async=true;c.crossOrigin='anonymous';c.type='text/javascript';
    c.charset='utf-8';c.src="https://<RELAY_PROXY_HOST>/recorder.js";h.appendChild(c);
  })(document);
  smartlook('init', <KEY>, {
    "host": <RELAY_PROXY_HOST>,
    "options": {
      "recordConsole": true,
      "recordNetwork": true
    }
  });
</script>

<!-- If you are using next-gen -->
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
    c.src = 'https://<RELAY_PROXY_HOST>/recorder.js';
    h.appendChild(c);
  })(document);
  smartlook('init', <KEY>, {
    host: <RELAY_PROXY_HOST>,
    loggingLevel: 1,
    forceSetupData: {
    recording: {
      disableApi: false,
      disableForms: false,
      maskEmails: false,
      maskNumbers: false,
      recordConsole: true,
      recordNetwork: true,
      signedDpa: true,
    },
    consent: {
      api: true,
      forms: true,
      ip: true,
    }
  }
  });
</script>
```

4. You're done! Visit your site and check the network tab to make sure the requests are sent through your subdomain.

## Development

```sh
# See all available commands
make help

# Build and start development server (port 80 by default)
# Do not forget to configure environment variables in docker-compose.dev.yml
make dev # add `build=yes` for rebuild
```

## License

See [LICENSE](LICENSE).
