import { IncomingMessage, ServerResponse } from 'http'

import { logger } from '../logger.js'

import { ROUTES } from './routes/index.js'
import { notFoundRoute } from './routes/not-found.js'
import { statusRoute } from './routes/status.js'
import { buildUrl, pipeResponse } from './utils.js'

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
