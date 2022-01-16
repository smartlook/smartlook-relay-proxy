import { IncomingMessage, ServerResponse } from 'http'

import * as undici from 'undici'

import { logger } from '../logger'

import { IProxyRouteConfig, IProxyRouteMethod } from './types'
import {
	bufferToJson,
	compressJson,
	decompressResponse,
	prepareHeaders,
} from './utils'

export const status = (res: ServerResponse): void => {
	res.writeHead(200, {
		'Content-Type': 'application/json',
	})
	res.write(
		JSON.stringify({
			ok: true,
			version: process.env.COMMIT_SHA ?? '',
		})
	)
	res.end()
}

export const notFound = (req: IncomingMessage, res: ServerResponse): void => {
	res.writeHead(404, { 'Content-Type': 'application/json' })
	res.write(
		JSON.stringify({
			error: '[smartlook-proxy-relay]: Not Found',
			message: `URL not found: ${req.method} - ${req.url}`,
		})
	)
	res.end()
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
			method: req.method as IProxyRouteMethod,
			headers: prepareHeaders(req.headers, req.socket.remoteAddress),
			// eslint-disable-next-line no-undefined
			body: req.method === 'POST' ? req : undefined,
		},
		({ headers, opaque, statusCode }) => {
			const { url: reqUrl, res: rawRes } = opaque as {
				url: string
				res: ServerResponse
			}

			logger.trace({ url: reqUrl, headers, statusCode }, 'Response')

			rawRes.writeHead(statusCode, headers)

			return rawRes
		}
	)
}

export const processBody = async (
	route: IProxyRouteConfig,
	url: string,
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	// force compression to gzip and decompress the response
	req.headers['accept-encoding'] = 'gzip'

	const response = await undici.request(url, {
		method: req.method as IProxyRouteMethod,
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
		response.body.pipe(res)
		return
	}

	const body = await decompressResponse(response.body)
	const json = bufferToJson(body)

	if (json && route.jsonPostProcess) {
		const finalJson = route.jsonPostProcess(json, req.headers.host)
		const finalBody = await compressJson(finalJson)
		response.headers['content-length'] = finalBody.length.toString()
		res.writeHead(response.statusCode, response.headers)
		res.end(finalBody)
	} else {
		res.writeHead(response.statusCode, response.headers)
		res.end(body)
	}
}
