# Smartlook Relay Proxy

This service relays HTTP requests from your domain/subdomain to
Smartlook's recording domains, allowing you to bypass Ad blockers used
by your visitors.

## Environment variables

Defined in `.env` file.

| Name               | Type     | Default value |
| ------------------ | -------- | ------------- |
| `RELAY_PROXY_HOST` | `string` | `null`        |

## Installation and deployment

```sh
# See all available commands
make help

# Build image
make build

# Run
# Do not forget to configure environment variables in .env
make up port=<number>
```

You should then point your domain/subdomain to specified port using a reverse proxy of your choice.

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
