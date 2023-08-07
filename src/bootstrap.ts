import { fastifyHttpProxy } from '@fastify/http-proxy'
import {
    fastify,
    type FastifyInstance,
    type FastifyRequest,
    type RawReplyDefaultExpression,
    type RawRequestDefaultExpression,
    type RawServerDefault,
} from 'fastify'

import { config } from './config.js'
import { rewriteRequestHeaders } from './http/headers.js'
import { logger } from './logger.js'
import { getRouteMappings } from './route-mappings.js'

export async function bootstrap(): Promise<
    FastifyInstance<
        RawServerDefault,
        RawRequestDefaultExpression,
        RawReplyDefaultExpression,
        typeof logger
    >
> {
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
                        return rewriteRequestHeaders({
                            request: request as FastifyRequest,
                            headers,
                            host: targetHost.replace('https://', ''),
                        })
                    },
                },
            })
        )
    }

    await Promise.all(registerProxies)

    return server
}
