import { pino } from 'pino'

import { config } from './config.js'

export let logger: pino.Logger

export function initLogger({ name }: { name: string }): void {
	logger = pino({
		name,
		level: config.logLevel,
	})

	logger.useLevelLabels = true

	logger.debug('Logger initialized')
}
