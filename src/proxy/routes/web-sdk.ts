import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http'

import { cacheResponse, getCachedResponse } from '../../cache'
import { config } from '../../config'
import { logger } from '../../logger'
import { get } from '../request'

export const handler = async (
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	const url = `${config.get('proxy.hosts.webSdk')}${req.url as string}`

	const cached = await getCachedResponse(url)

	if (cached) {
		logger.info({ url }, 'returned from cache')
		res.writeHead(
			Number(cached[0]),
			JSON.parse(cached[1] as string) as OutgoingHttpHeaders
		)
		res.write(cached[2] as Buffer)
		res.end()
		return
	}

	const { statusCode, headers, body } = await get(
		{
			url,
			originalHeaders: req.headers,
		},
		true
	)

	await cacheResponse(url, statusCode, headers, body)

	res.writeHead(statusCode, headers)
	res.write(body)
	res.end()
}
