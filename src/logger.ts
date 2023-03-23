import { pino } from 'pino'

import { config } from './config.js'

export const logger = pino({
	level: config.get('logger.level'),
})
