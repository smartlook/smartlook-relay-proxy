import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http'
import { Readable } from 'stream'
import * as zlib from 'zlib'

import undici from 'undici'

import { logger } from '../logger'

import { IProxyRouteConfig, IProxyRouteMethod } from './types'

export const bufferToJson = (buffer: Buffer): unknown => {
	try {
		return JSON.parse(buffer.toString('utf-8'))
	} catch (err) {
		logger.error(
			{ err, buffer: buffer.toString('utf-8') },
			'Failed to parse json'
		)
		return null
	}
}

const jsonToBuffer = (json: unknown): Buffer => {
	try {
		return Buffer.from(JSON.stringify(json))
	} catch (err) {
		logger.error({ err, json }, 'Failed to stringify json')
		return Buffer.from('{ "error": "Failed to process upstream response" }')
	}
}

export const compressJson = async (json: unknown): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		zlib.gzip(jsonToBuffer(json), (err, buffer) => {
			if (err) {
				logger.error({ err, json }, 'Failed to compress json')
				reject(err)
			}
			resolve(buffer)
		})
	})
}

export const decompressResponse = async (stream: Readable): Promise<Buffer> => {
	const gunzip = zlib.createGunzip()
	stream.pipe(gunzip)
	return new Promise((resolve) => {
		const buffers: Buffer[] = []

		gunzip
			.on('data', (chunk: Buffer) => {
				buffers.push(chunk)
			})
			.on('end', () => {
				resolve(Buffer.concat(buffers))
			})
			.on('error', (err: Error) => {
				logger.error({ err }, 'Failed to decompress response')
				resolve(
					Buffer.from('{ "error": "Failed to decompress response" }')
				)
			})
	})
}

const stripPrefix = (reqUrl: string, prefix?: string): string => {
	if (prefix && reqUrl.startsWith(prefix)) {
		return reqUrl.substring(prefix.length)
	}

	return reqUrl
}

export const prepareHeaders = (
	originalHeaders: IncomingHttpHeaders,
	remoteAddress?: string
): IncomingHttpHeaders => {
	return {
		...originalHeaders,
		'X-Forwarded-For': originalHeaders['x-forwarded-for'] ?? remoteAddress,
		// Next line bypasses: [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames.
		host: '',
	}
}

export const buildUrl = (route: IProxyRouteConfig, url: string): string => {
	return `${route.targetHost}${stripPrefix(url, route.proxyPrefix)}`
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
