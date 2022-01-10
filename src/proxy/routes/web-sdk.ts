import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http'

import { cacheResponse, CACHE_CONFIGURED, getCachedResponse } from '../../cache'
import { config } from '../../config'
import { logger } from '../../logger'
import { get } from '../request'

export const handler = async (
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	const url = `${config.get('proxy.hosts.webSdk')}${req.url as string}`

	if (CACHE_CONFIGURED) {
		const cached = await getCachedResponse(url)

		if (cached) {
			logger.debug({ url }, 'returned from cache')
			res.writeHead(
				Number(cached.status),
				JSON.parse(cached.headers as string) as OutgoingHttpHeaders
			)
			res.write(cached.body as Buffer)
			res.end()
			return
		}
	}

	const { statusCode, headers, body } = await get(
		{
			url,
			originalHeaders: req.headers,
		},
		true
	)

	if (CACHE_CONFIGURED) {
		await cacheResponse(url, statusCode, headers, body)
	}

	res.writeHead(statusCode, headers)
	res.write(body)
	res.end()
}
