# Smartlook Relay Proxy

This service relays HTTP requests from your domain/subdomain to
Smartlook's recording domains, allowing you to bypass Ad blockers used
by your visitors.

## Environment variables

Defined in `.env` file.

| Name                         | Type     | Default value |
| ---------------------------- | -------- | ------------- |
| `REDIS_HOST`                 | `string` | `null`        |
| `REDIS_PORT`                 | `number` | `null`        |
| `REDIS_CACHE_EXPIRY_SECONDS` | `number` | `600`         |

If `REDIS_HOST` and `REDIS_PORT` are not set (default), the responses from Smartlook backend **will not** be cached.

## Instalation and deployment

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
make up-dev-build
```

## License

See [LICENSE](LICENSE).
