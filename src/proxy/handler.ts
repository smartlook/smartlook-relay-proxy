import { IncomingMessage, ServerResponse } from 'http'

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
		if (!req.url.startsWith(route.prefix)) {
			continue
		}

		const url = buildUrl(route, req.url)

		await pipeResponse(url, req, res)

		return
	}

	// Not Found
	notFoundRoute(req, res)
}
