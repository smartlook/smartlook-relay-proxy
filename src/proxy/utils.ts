import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http'

import undici from 'undici'
import { HttpMethod } from 'undici/types/dispatcher'

import { config } from '../config'
import { logger } from '../logger'

import { IProxyRouteConfig, IStreamOpaque } from './types'

export const buildUrl = (route: IProxyRouteConfig, reqUrl: string): string => {
	if (route.stripPrefix) {
		return `${route.targetHost}${reqUrl.substring(route.prefix.length)}`
	}
	return `${route.targetHost}${reqUrl}`
}

export const prepareHeaders = (
	url: string,
	originalHeaders: IncomingHttpHeaders,
	remoteAddress?: string
): IncomingHttpHeaders => {
	const webWriterHost = config
		.get('proxy.hosts.webSdkWriter')
		.split('https://')[1]

	const host = url.includes('/rec/v2/write')
		? webWriterHost
		: // Next line bypasses: [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames.
		  ''

	return {
		...originalHeaders,
		'x-forwarded-for': originalHeaders['x-forwarded-for'] ?? remoteAddress,
		'x-forwarded-host': host,
		host,
	}
}

export const pipeResponse = async (
	url: string,
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	await undici.stream(
		url,
		{
			opaque: { url, res },
			method: req.method as HttpMethod,
			headers: prepareHeaders(url, req.headers, req.socket.remoteAddress),
			// eslint-disable-next-line no-undefined
			body: req.method === 'POST' ? req : undefined,
		},
		({ headers, opaque, statusCode }) => {
			const { url: reqUrl, res: rawRes } = opaque as IStreamOpaque

			logger.trace({ url: reqUrl, headers, statusCode }, 'Response')

			rawRes.writeHead(statusCode, headers)

			return rawRes
		}
	)
}
