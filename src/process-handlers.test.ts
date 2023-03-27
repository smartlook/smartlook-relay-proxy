import { config, initConfig } from './config.js'
import { initLogger } from './logger.js'
import { registerProcessHandlers } from './process-handlers.js'
import { initHTTPServer } from './proxy/http-server.js'

describe('Process handlers', () => {
	const port = 8003

	beforeEach(() => {
		initConfig()
		initLogger({ name: config.projectName })
	})

	it('Should handle SIGTERM and gracefully shut down', () => {
		const server = initHTTPServer().listen(port)

		registerProcessHandlers(server)

		const processEmitMock = vi.spyOn(process, 'emit')
		vi.spyOn(process, 'exit').mockReturnValue(null as never)

		process.emit('SIGTERM')

		expect(processEmitMock).toHaveBeenCalledTimes(2)
		expect(processEmitMock).toHaveBeenNthCalledWith(1, 'SIGTERM')
		expect(processEmitMock).toHaveBeenNthCalledWith(2, 'beforeExit', 0)

		expect(server.listening).toBe(false)
	})
})
