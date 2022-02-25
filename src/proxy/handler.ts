import { IncomingMessage, ServerResponse } from 'http'

import { config } from '../config'
import { logger } from '../logger'

import { ROUTES } from './routes'
import { notFoundRoute } from './routes/not-found'
import { statusRoute } from './routes/status'
import { buildUrl, pipeResponse } from './utils'

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
		statusRoute(res)
		return
	}

	logger.trace({ url: req.url, headers: req.headers }, 'Request')

	for (const route of ROUTES) {
		// Legacy routes, will be removed
		if (req.url.startsWith('/record') || req.url.startsWith('/v2/record')) {
			const targetHost = config.get('proxy.hosts.webSdkWriter')
			const url = `${targetHost}${req.url}`
			await pipeResponse(targetHost, url, req, res)
			return
		}

		if (!req.url.startsWith(route.prefix)) {
			continue
		}

		const url = buildUrl(route, req.url)

		await pipeResponse(route.targetHost, url, req, res)

		return
	}

	// Not Found
	notFoundRoute(req, res)
}
