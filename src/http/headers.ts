import type { IncomingHttpHeaders } from 'node:http'

import type { FastifyRequest } from 'fastify'

import { config } from '../config.js'

export function rewriteRequestHeaders({
    headers,
    request,
    host,
}: {
    headers: IncomingHttpHeaders
    request: FastifyRequest
    host: string
}): IncomingHttpHeaders {
    const filteredHeaders: IncomingHttpHeaders = {
        ...headers,
        'x-forwarded-for': headers['x-forwarded-for'] ?? request.ip,
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
