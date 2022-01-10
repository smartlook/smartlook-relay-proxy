import { createServer, Server } from 'http'

import { handler as rootHandler } from './handler'

export const initApp = (): Server => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	return createServer(rootHandler)
}
