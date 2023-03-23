import { type IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http'

import undici from 'undici'

import { logger } from '../logger.js'

import type { IProxyRouteConfig, IStreamOpaque } from './types.js'

export const buildUrl = (route: IProxyRouteConfig, reqUrl: string): string => {
	if (route.stripPrefix) {
		return `${route.targetHost}${reqUrl.substring(route.prefix.length)}`
	}
	return `${route.targetHost}${reqUrl}`
}

export const prepareHeaders = (
	host: string,
	originalHeaders: IncomingHttpHeaders,
	remoteAddress?: string
): IncomingHttpHeaders => {
	// filter out forbidden client headers
	const filteredHeaders = {
		...originalHeaders,
		'x-forwarded-for': originalHeaders['x-forwarded-for'] ?? remoteAddress,
		'x-forwarded-host': host,
		host,
	}
	delete filteredHeaders.connection
	delete filteredHeaders.upgrade
	return filteredHeaders
}

export const pipeResponse = async (
	routeTargetHost: string,
	url: string,
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	const host = routeTargetHost.replace('https://', '')

	// eslint-disable-next-line import/no-named-as-default-member
	await undici.stream(
		url,
		{
			opaque: { url, res },
			method: req.method as undici.Dispatcher.HttpMethod,
			headers: prepareHeaders(
				host,
				req.headers,
				req.socket.remoteAddress
			),
			// eslint-disable-next-line
			body: (req.method === 'POST' ? req : undefined) as any,
		},
		({ headers, opaque, statusCode }) => {
			const { url: reqUrl, res: rawRes } = opaque as IStreamOpaque

			logger.trace({ url: reqUrl, headers, statusCode }, 'Response')

			rawRes.writeHead(statusCode, headers)

			return rawRes
		}
	)
}
