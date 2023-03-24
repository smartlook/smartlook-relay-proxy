import { config } from './config.js'
import { logger } from './logger.js'
import { registerProcessHandlers } from './process-handlers.js'
import { initApp } from './proxy/index.js'

function main(): void {
	logger.info('Starting Relay Proxy')

	const app = initApp()

	registerProcessHandlers(app)

	const port = config.get('proxy.port')

	app.listen(port, () => {
		logger.info(`Relay Proxy started on port ${port}`)
	})
}

main()
