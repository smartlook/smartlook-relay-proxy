import { IncomingHttpHeaders } from 'http'
import { Readable } from 'stream'
import * as zlib from 'zlib'

import { config } from '../config'
import { logger } from '../logger'

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

export const stripPrefix = (reqUrl: string, prefix?: string): string => {
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
		'X-Forwarded-Host': originalHeaders.host,
		'X-Forwarded-For': originalHeaders['x-forwarded-for'] ?? remoteAddress,
		// Next line bypasses: [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames.
		...(config.get('env') === 'development' && { host: '' }),
	}
}
