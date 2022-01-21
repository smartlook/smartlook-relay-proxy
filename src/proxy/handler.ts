import { IncomingMessage, ServerResponse } from 'http'

import { logger } from '../logger'

import { ROUTES } from './routes'
import { notFoundRoute } from './routes/not-found'
import { statusRoute } from './routes/status'
import { buildUrl, pipeResponse, processBody } from './utils'

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

	for (const route of ROUTES) {
		// check method
		if (route.method !== req.method) {
			continue
		}

		// check path
		const matchPath = route.proxyPrefix
			? `${route.proxyPrefix}${route.targetPath}`
			: route.targetPath

		if (
			!(route.pathPrefixMatch
				? req.url.startsWith(matchPath)
				: req.url === matchPath)
		) {
			continue
		}

		const url = buildUrl(route, req.url)

		logger.trace({ url, headers: req.headers }, 'Request')

		if (!route.jsonPostProcess) {
			// no processing needed, just pipe the response to client
			await pipeResponse(url, req, res)
		} else {
			await processBody(route, url, req, res)
		}

		return
	}

	// Not Found
	notFoundRoute(req, res)
}
