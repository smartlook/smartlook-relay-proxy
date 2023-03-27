import { ServerResponse } from 'http'

import fjs from 'fast-json-stringify'

import { config } from '../../config.js'

const stringify = fjs({
	title: 'Status route',
	type: 'object',
	properties: {
		app: { type: 'string' },
		version: { type: 'string' },
	},
	required: ['app', 'version'],
	additionalProperties: false,
})

export function statusRoute(res: ServerResponse): void {
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf-8',
	})
	res.write(
		stringify({
			app: config.projectName,
			version: config.commitSha,
		})
	)
	res.end()
}
