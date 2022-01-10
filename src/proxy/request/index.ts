import { IncomingHttpHeaders } from 'http'

import { request } from 'undici'

import {
	IGetRequest,
	IPostRequest,
	IResponseBuffer,
	IResponseReadable,
} from './types'

const prepareHeaders = (
	originalHeaders: IncomingHttpHeaders
): IncomingHttpHeaders => {
	return {
		...originalHeaders,
		'X-Forwarded-Host': originalHeaders.host,
		// Next line bypasses: [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames.
		host: '',
	}
}

export const get = async <T extends boolean>(
	{ url, originalHeaders }: IGetRequest,
	convertResponseBodyToBuffer: T
): Promise<T extends true ? IResponseBuffer : IResponseReadable> => {
	const { statusCode, headers, body } = await request(url, {
		method: 'GET',
		headers: prepareHeaders(originalHeaders),
	})

	return {
		statusCode,
		headers,
		body: (convertResponseBodyToBuffer
			? Buffer.from(await body.arrayBuffer())
			: body) as never,
	}
}

export const post = async <T extends boolean>(
	{ url, originalHeaders, requestBody }: IPostRequest,
	convertResponseBodyToBuffer: T
): Promise<T extends true ? IResponseBuffer : IResponseReadable> => {
	const { statusCode, headers, body } = await request(url, {
		method: 'POST',
		headers: prepareHeaders(originalHeaders),
		body: requestBody,
	})

	return {
		statusCode,
		headers,
		body: (convertResponseBodyToBuffer
			? Buffer.from(await body.arrayBuffer())
			: body) as never,
	}
}
