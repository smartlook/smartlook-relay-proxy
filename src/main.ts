import { config, initConfig } from './config.js'
import { initLogger, logger } from './logger.js'
import { registerProcessHandlers } from './process-handlers.js'
import { initHTTPServer } from './proxy/http-server.js'

export function main(): void {
	initConfig()

	initLogger({ name: config.projectName })

	logger.info('Starting Smartlook Relay Proxy')

	logger.debug(config, 'Config')

	const server = initHTTPServer()

	registerProcessHandlers(server)

	const { port } = config

	server.listen(port, () => {
		logger.info(`Smartlook Relay Proxy running on port ${port}`)
	})
}

main()
