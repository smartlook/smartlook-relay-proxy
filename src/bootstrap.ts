import { fastifyHttpProxy } from '@fastify/http-proxy'
import { fastify, type FastifyInstance } from 'fastify'

import { config } from './config.js'
import { rewriteRequestHeaders } from './http/headers.js'
import { logger } from './logger.js'
import { getRouteMappings } from './route-mappings.js'

export async function bootstrap(): Promise<FastifyInstance> {
    const server = fastify({
        logger,
        trustProxy: config.trustProxy,
        disableRequestLogging: !config.logRequests,
    })

    server.route({
        method: 'GET',
        url: '/status',
        handler: async (_request, response) => {
            return response.status(200).send({
                app: config.appName,
                version: config.commitSha,
            })
        },
    })

    const registerProxies = []

    for (const { targetHost, prefix } of getRouteMappings()) {
        registerProxies.push(
            server.register(fastifyHttpProxy, {
                disableRequestLogging: !config.logRequests,
                upstream: targetHost,
                prefix,
                http2: false,
                replyOptions: {
                    rewriteRequestHeaders: (request, headers) => {
                        return rewriteRequestHeaders(
                            headers,
                            request.ip,
                            targetHost.replace('https://', '')
                        )
                    },
                },
            })
        )
    }

    await Promise.all(registerProxies)

    return server
}
