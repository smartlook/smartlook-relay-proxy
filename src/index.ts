import { config } from './config'
import { logger } from './logger'
import { initApp } from './proxy'

const start = (): void => {
	const app = initApp()

	app.listen(config.get('proxy.port'))
	logger.info('Proxy started')
}

start()
