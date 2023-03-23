import { ServerResponse } from 'http'

export const statusRoute = (res: ServerResponse): void => {
	res.writeHead(200, {
		'Content-Type': 'application/json',
	})
	res.write(
		JSON.stringify({
			ok: true,
			version: process.env['COMMIT_SHA'] ?? '',
		})
	)
	res.end()
}
