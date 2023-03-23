import { IncomingMessage, ServerResponse } from 'http'

export const notFoundRoute = (
	req: IncomingMessage,
	res: ServerResponse
): void => {
	res.writeHead(404, { 'Content-Type': 'application/json' })
	res.write(
		JSON.stringify({
			error: '[smartlook-proxy-relay]: Not Found',
			message: `URL not found: ${req.method ?? ''} - ${req.url ?? ''}`,
		})
	)
	res.end()
}
