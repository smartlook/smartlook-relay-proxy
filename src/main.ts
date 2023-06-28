import { onExit } from 'gracy'

import { bootstrap } from './bootstrap.js'
import { initConfig, config } from './config.js'
import { initLogger, logger } from './logger.js'

export async function main(): Promise<void> {
    initConfig()
    initLogger()

    logger.info('Starting Smartlook Relay Proxy')

    logger.debug(config, 'Config')

    const server = await bootstrap()

    onExit({ logger }, async () => {
        logger.info('Shutting down Smartlook Relay Proxy')

        await server.close()
    })

    await server.listen({ port: config.port, host: '::' })

    logger.info('Smartlook Relay Proxy started')
}

void main()
