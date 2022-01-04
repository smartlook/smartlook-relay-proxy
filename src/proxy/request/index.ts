import { request } from 'undici'
import config from '../../config'
import {
	IGetRequest,
	IPostRequest,
	IResponseBuffer,
	IResponseReadable,
} from './types'

export const get = async <T extends boolean>(
	{ url, originalHeaders }: IGetRequest,
	convertResponseBodyToBuffer: T
): Promise<T extends true ? IResponseBuffer : IResponseReadable> => {
	const { statusCode, headers, body } = await request(url, {
		method: 'GET',
		headers: {
			...originalHeaders,
			'X-Forwarded-Host': originalHeaders.host,
			// Next line bypasses: [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames.
			...(config.get('env') === 'development' && { host: '' }),
		},
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
		headers: {
			...originalHeaders,
			'X-Forwarded-Host': originalHeaders.host,
			// Next line bypasses: [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames.
			...(config.get('env') === 'development' && { host: '' }),
		},
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
