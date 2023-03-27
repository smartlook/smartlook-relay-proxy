import { type IncomingHttpHeaders } from 'http'

import { config } from '../config.js'

import type { RouteMapping } from './types.js'

export function buildUrl(route: RouteMapping, reqUrl: string): string {
	if (route.stripPrefix) {
		return `${route.targetHost}${reqUrl.substring(route.prefix.length)}`
	}
	return `${route.targetHost}${reqUrl}`
}

export function prepareHeaders(
	host: string,
	originalHeaders: IncomingHttpHeaders,
	remoteAddress?: string
): IncomingHttpHeaders {
	const filteredHeaders = {
		...originalHeaders,
		'x-forwarded-for': originalHeaders['x-forwarded-for'] ?? remoteAddress,
		'x-forwarded-host': host,
		'x-forwarded-by': config.projectName,
		host,
	}

	// {@link https://github.com/smartlook/smartlook-relay-proxy/pull/106}
	delete filteredHeaders.connection
	delete filteredHeaders.upgrade

	return filteredHeaders
}
