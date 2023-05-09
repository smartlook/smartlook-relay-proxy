import type { IncomingHttpHeaders } from 'node:http'

import { config } from '../config.js'

export function rewriteRequestHeaders(
    headers: IncomingHttpHeaders,
    ip: string,
    host: string
): IncomingHttpHeaders {
    const filteredHeaders: IncomingHttpHeaders = {
        ...headers,
        'x-forwarded-for': headers['x-forwarded-for'] ?? ip,
        'x-forwarded-host': host,
        'x-forwarded-by': config.appName,
        host,
    }

    // {@link https://github.com/smartlook/smartlook-relay-proxy/pull/106}
    delete filteredHeaders.connection
    delete filteredHeaders.upgrade

    return filteredHeaders
}
