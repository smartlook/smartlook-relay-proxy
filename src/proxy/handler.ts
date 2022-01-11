import { IncomingMessage, ServerResponse } from 'http'

import * as undici from 'undici'

import { logger } from '../logger'

import { ROUTES } from './routes'
import {
	bufferToJson,
	compressJson,
	decompressResponse,
	prepareHeaders,
	stripPrefix,
} from './utils'

export const handler = async (
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	if (!req.url) {
		res.end()
		return
	}

	// status
	if (req.url === '/status') {
		res.writeHead(200, {
			'Content-Type': 'application/json',
		})
		res.write(
			JSON.stringify({
				status: 'ok',
			})
		)
		res.end()
		return
	}

	for (const route of ROUTES) {
		// check method
		if (route.method !== req.method) {
			continue
		}

		// check path
		const matchPath = route.proxyPrefix
			? `${route.proxyPrefix}${route.targetPath}`
			: route.targetPath

		if (
			!(route.pathPrefixMatch
				? req.url.startsWith(matchPath)
				: req.url === matchPath)
		) {
			continue
		}

		const url = `${route.targetHost}${stripPrefix(
			req.url,
			route.proxyPrefix
		)}`

		logger.trace({ url, headers: req.headers }, 'Request')

		// just pipe the response to client if no processign is needed
		if (!route.jsonPostProcess) {
			await undici.stream(
				url,
				{
					opaque: { url, res },
					method: req.method,
					headers: prepareHeaders(
						req.headers,
						req.socket.remoteAddress
					),
					// eslint-disable-next-line no-undefined
					body: req.method === 'POST' ? req : undefined,
				},
				({ headers, opaque, statusCode }) => {
					const { url: reqUrl, res: rawRes } = opaque as {
						url: string
						res: ServerResponse
					}

					logger.trace(
						{ url: reqUrl, headers, statusCode },
						'Response'
					)

					rawRes.writeHead(statusCode, headers)

					return rawRes
				}
			)
			return
		}

		// force compression to gzip and decompress the response
		req.headers['accept-encoding'] = 'gzip'

		const response = await undici.request(url, {
			method: req.method,
			headers: prepareHeaders(req.headers, req.socket.remoteAddress),
			// eslint-disable-next-line no-undefined
			body: req.method === 'POST' ? req : undefined,
		})

		logger.trace(
			{ url, headers: response.headers, statusCode: response.statusCode },
			'Response'
		)

		if (
			response.statusCode !== 200 ||
			!response.headers['content-type']?.startsWith('application/json')
		) {
			res.writeHead(response.statusCode, response.headers)
			response.body.pipe(res, { end: true })
			return
		}

		const body = await decompressResponse(response.body)
		const json = bufferToJson(body)

		if (json) {
			const finalJson = route.jsonPostProcess(json, req.headers.host)
			const finalBody = await compressJson(finalJson)
			response.headers['content-length'] = finalBody.length.toString()
			res.writeHead(response.statusCode, response.headers)
			res.end(finalBody)
		} else {
			res.writeHead(response.statusCode, response.headers)
			res.end(body)
		}

		return
	}

	// Not Found
	res.writeHead(404, { 'Content-Type': 'application/json' })
	res.write(
		JSON.stringify({
			error: '[relay]: Not Found',
			message: `URL not found: ${req.method} - ${req.url}`,
		})
	)
	res.end()
}
