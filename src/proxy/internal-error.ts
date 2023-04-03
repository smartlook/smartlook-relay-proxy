import { ServerResponse } from 'http'

import fjs from 'fast-json-stringify'

import { config } from '../config.js'

const stringify = fjs({
	title: 'Internal Server Error',
	type: 'object',
	properties: {
		error: { type: 'string' },
		message: { type: 'string' },
	},
	required: ['error', 'message'],
	additionalProperties: false,
})

export function internalError(res: ServerResponse): void {
	res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
	res.write(
		stringify({
			error: `[${config.projectName}]: Internal Server Error`,
			message: 'An error occurred while processing your request',
		})
	)
	res.end()
}
