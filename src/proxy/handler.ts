import { IncomingMessage, ServerResponse } from 'http'

import { routes } from './constants'
import { handler as assetsProxyHandler } from './routes/assets-proxy'
import { handler as managerHandler } from './routes/manager'
import { handler as sdkWriterHandler } from './routes/sdk-writer'
import { handler as webSdkHandler } from './routes/web-sdk'
import { handler as webWriterHandler } from './routes/web-writer'

export const handler = async (
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	if (!req.url) {
		res.end()
		return
	}

	// web-sdk
	if (
		(req.url === routes.webSdk.recorder ||
			req.url.startsWith(routes.webSdk.es6)) &&
		req.method === 'GET'
	) {
		await webSdkHandler(req, res)
		return
	}

	// assets-proxy
	if (req.url.startsWith(routes.assetsProxy) && req.method === 'POST') {
		await assetsProxyHandler(req, res)
		return
	}

	// web-writer
	if (req.url.startsWith(routes.webWriter) && req.method === 'POST') {
		await webWriterHandler(req, res)
		return
	}

	// sdk-writer
	if (req.url.startsWith(routes.sdkWriter) && req.method === 'POST') {
		await sdkWriterHandler(req, res)
		return
	}

	// manager
	if (
		req.url.startsWith(routes.manager) &&
		(req.method === 'POST' || req.method === 'GET')
	) {
		await managerHandler(req, res)
		return
	}

	// Not Found
	res.writeHead(404, {
		'Content-Type': 'application/json',
	})
	res.write(
		JSON.stringify({
			error: '[relay]: not-found',
			message: `URL not found: ${req.method} - ${req.url}`,
		})
	)
	res.end()
}