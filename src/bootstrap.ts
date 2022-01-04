import config from './config'
import logger from './logger'
import { initApp } from './proxy'

export const bootstrap = (): void => {
	const app = initApp()

	app.listen(config.get('proxy.port'))
	logger.info('Proxy started')
}
