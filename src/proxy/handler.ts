/* eslint-disable import/no-named-as-default-member */
import { IncomingMessage, ServerResponse, type IncomingHttpHeaders } from 'http'

import undici from 'undici'

import { config } from '../config.js'
import { logger } from '../logger.js'

import { internalError } from './internal-error.js'
import { notFoundRoute } from './routes/not-found-route.js'
import { statusRoute } from './routes/status-route.js'
import type { IStreamOpaque, RouteMapping } from './types.js'
import { buildUrl, prepareHeaders } from './utils.js'

export function initUndiciDispatcher(): void {
	undici.setGlobalDispatcher(
		new undici.Agent({ connect: { timeout: config.undiciConnectTimeout } })
	)
}

async function pipeResponse(
	routeTargetHost: string,
	url: string,
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> {
	const host = routeTargetHost.replace('https://', '')

	const outgoingHeaders = prepareHeaders(
		host,
		req.headers,
		req.socket.remoteAddress
	)

	try {
		await undici.stream(
			url,
			{
				opaque: { url, res, outgoingHeaders },
				method: req.method as undici.Dispatcher.HttpMethod,
				headers: outgoingHeaders,
				// eslint-disable-next-line
				body: (req.method === 'POST' ? req : undefined) as any,
			},
			({ headers: incomingHeaders, opaque, statusCode }) => {
				const {
					url: reqUrl,
					res: rawRes,
					outgoingHeaders: rawHeaders,
				} = opaque as IStreamOpaque

				logger.trace(
					{
						url: reqUrl,
						outgoingHeaders: rawHeaders,
						incomingHeaders,
						statusCode,
					},
					'Piping response'
				)

				rawRes.writeHead(statusCode, incomingHeaders)

				return rawRes
			}
		)
	} catch (err) {
		handleStreamError(url, outgoingHeaders, res, err)
	}
}

function handleStreamError(
	url: string,
	outgoingHeaders: IncomingHttpHeaders,
	res: ServerResponse,
	err: unknown
): void {
	if (
		err &&
		(err as Record<string, unknown>)['code'] === 'ECONNRESET' &&
		(err as Record<string, unknown>)['message'] === 'aborted'
	) {
		logger.debug(
			{
				url,
				outgoingHeaders,
				err,
			},
			'Request aborted by the client. Smartlook Web SDK will retry the request later'
		)
	} else {
		logger.warn(
			{
				url,
				outgoingHeaders,
				err,
			},
			'Request could not be satisfied. This is just a warning and you can safely ignore it, since Smartlook Web SDK will retry the request later'
		)
	}

	internalError(res)
}

export async function handler(
	req: IncomingMessage,
	res: ServerResponse,
	routeMappings: RouteMapping[]
): Promise<void> {
	logger.trace({ url: req.url, headers: req.headers }, 'Incoming request')

	if (!req.url) {
		res.end()
		return
	}

	if (req.url === '/status') {
		logger.trace({ url: req.url, headers: req.headers }, 'Status route hit')

		statusRoute(res)
		return
	}

	for (const route of routeMappings) {
		if (!req.url.startsWith(route.prefix)) {
			continue
		}

		const url = buildUrl(route, req.url)

		await pipeResponse(route.targetHost, url, req, res)

		logger.trace(
			{
				originalUrl: req.url,
				originalHeaders: req.headers,
				finalUrl: url,
				targetHost: route.targetHost,
			},
			'Response piped'
		)

		return
	}

	logger.trace({ url: req.url, headers: req.headers }, 'Route not found')

	notFoundRoute(req, res)
}
