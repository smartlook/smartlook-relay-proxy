import { createServer, Server } from 'http'

import { initUndiciDispatcher, handler } from './handler.js'
import { initRouteMappings } from './routes/route-mappings.js'

export function initHTTPServer(): Server {
	const routeMappings = initRouteMappings()
	initUndiciDispatcher()

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	return createServer(async (req, res) => {
		return handler(req, res, routeMappings)
	})
}

export async function stopHTTPServer(server: Server): Promise<void> {
	if (!server.listening) {
		return
	}

	return new Promise((resolve, reject) => {
		server.close((err) => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}
