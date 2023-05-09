import type { Logger } from 'pino'

import { initConfig } from './config.js'
import { logger, initLogger } from './logger.js'

describe('Logger', () => {
    beforeEach(() => {
        initConfig()
    })

    it('Should initialize logger', () => {
        initLogger()

        expect(logger).toBeDefined()
        expectTypeOf(logger).toEqualTypeOf<Logger>()
    })

    it('Should not fail when initialized twice', () => {
        initLogger()
        initLogger()

        expect(logger).toBeDefined()
        expectTypeOf(logger).toEqualTypeOf<Logger>()
    })
})
