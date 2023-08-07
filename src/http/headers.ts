import type { IncomingHttpHeaders } from 'node:http'

import type { FastifyRequest } from 'fastify'

import { config } from '../config.js'
import { logger } from '../logger.js'

function parseIp(
    headers: IncomingHttpHeaders,
    request: FastifyRequest
): string | undefined {
    try {
        const xForwardedFor = headers['x-forwarded-for']

        if (xForwardedFor) {
            return Array.isArray(xForwardedFor)
                ? xForwardedFor[0]
                : xForwardedFor.includes(',')
                ? xForwardedFor.split(',')[0]
                : xForwardedFor
        }

        return request.ip
    } catch (err) {
        logger.warn({ err }, 'Failed to parse IP address from request')
        return undefined
    }
}

export function rewriteRequestHeaders({
    headers,
    request,
    host,
}: {
    headers: IncomingHttpHeaders
    request: FastifyRequest
    host: string
}): IncomingHttpHeaders {
    const ip = parseIp(headers, request)

    const filteredHeaders: IncomingHttpHeaders = {
        ...headers,
        ...(ip && { 'x-forwarded-for': ip }),
        'x-forwarded-host': host,
        'x-forwarded-by': config.appName,
        host,
    }

    const expectsPayload =
        request.method === 'PUT' ||
        request.method === 'POST' ||
        request.method === 'PATCH'

    if (!expectsPayload) {
        delete filteredHeaders['content-length']
        delete filteredHeaders['content-type']
        delete filteredHeaders['transfer-encoding']
    }

    // {@link https://github.com/smartlook/smartlook-relay-proxy/pull/106}
    delete filteredHeaders.connection
    delete filteredHeaders.upgrade

    return filteredHeaders
}
