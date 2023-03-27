import type { Logger } from 'pino'

import { initConfig } from './config.js'
import { logger, initLogger } from './logger.js'

describe('Logger', () => {
	beforeEach(() => {
		initConfig()
	})

	it('Should initialize logger', () => {
		initLogger({ name: 'test-name' })

		expect(logger).toBeDefined()
		expectTypeOf(logger).toEqualTypeOf<Logger>()
	})

	it('Should not fail when initialized twice', () => {
		initLogger({ name: 'test-name' })
		initLogger({ name: 'test-name' })

		expect(logger).toBeDefined()
		expectTypeOf(logger).toEqualTypeOf<Logger>()
	})
})
