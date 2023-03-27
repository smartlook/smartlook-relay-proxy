import { IncomingMessage, ServerResponse } from 'http'

import fjs from 'fast-json-stringify'

import { config } from '../../config.js'

const stringify = fjs({
	title: 'Not found route',
	type: 'object',
	properties: {
		error: { type: 'string' },
		message: { type: 'string' },
	},
	required: ['error', 'message'],
	additionalProperties: false,
})

export function notFoundRoute(req: IncomingMessage, res: ServerResponse): void {
	res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
	res.write(
		stringify({
			error: `[${config.projectName}]: Not Found`,
			message: `URL not found: ${req.method ?? ''} - ${req.url ?? ''}`,
		})
	)
	res.end()
}
