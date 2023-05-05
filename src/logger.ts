import { pino } from 'pino'

import { config } from './config.js'

export let logger: pino.Logger

export function initLogger(): void {
	const { appName, logLevel } = config

	logger = pino({
		name: appName,
		level: logLevel,
	})

	logger.debug({ logLevel, appName }, 'Logger initialized')
}
