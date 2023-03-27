/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest'

import { config, initConfig } from '../config.js'
import { initLogger } from '../logger.js'

import { initHTTPServer, stopHTTPServer } from './http-server.js'
import * as routeMappings from './routes/route-mappings.js'
import { type RouteMapping } from './types.js'

describe('Proxy handler', () => {
	const port = 8002

	beforeEach(() => {
		initConfig()
		initLogger({ name: config.projectName })
	})

	it('Should handle status route', async () => {
		const server = initHTTPServer().listen(port)

		const response = await request(server)
			.get('/status')
			.set('Accept', 'application/json')

		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		)
		expect(response.status).toBe(200)
		expect(response.body).toEqual({
			app: config.projectName,
			version: config.commitSha,
		})

		await stopHTTPServer(server)
	})

	it('Should handle not found route', async () => {
		const routeMappingsMock: RouteMapping[] = []

		const initRouteMappingsMock = vi
			.spyOn(routeMappings, 'initRouteMappings')
			.mockReturnValue(routeMappingsMock)

		const server = initHTTPServer().listen(port)

		const response = await request(server)
			.get('/non-existing-route')
			.set('Accept', 'application/json')

		expect(initRouteMappingsMock).toHaveBeenCalledTimes(1)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		)
		expect(response.status).toBe(404)
		expect(response.body).toEqual({
			error: `[${config.projectName}]: Not Found`,
			message: 'URL not found: GET - /non-existing-route',
		})

		await stopHTTPServer(server)
	})

	it('Should proxy request according to route mappings (without prefix)', async () => {
		const routeMappingsMock: RouteMapping[] = [
			{
				name: 'manager',
				targetHost: config.managerHost,
				prefix: '/manager',
				stripPrefix: true,
			},
			{
				name: 'webSdk',
				targetHost: config.webSdkHost,
				prefix: '/',
				stripPrefix: false,
			},
		]

		const initRouteMappingsMock = vi
			.spyOn(routeMappings, 'initRouteMappings')
			.mockReturnValue(routeMappingsMock)

		const server = initHTTPServer().listen(port)

		expect(initRouteMappingsMock).toHaveBeenCalledTimes(1)

		const response = await request(server).get('/recorder.js')

		expect(response.status).toBe(200)
		expect(response.headers['content-type']).toContain(
			'application/javascript'
		)
		expect(response.text.length).toBeGreaterThan(100)

		await stopHTTPServer(server)
	})

	it('Should proxy request according to route mappings (with prefix)', async () => {
		const routeMappingsMock: RouteMapping[] = [
			{
				name: 'manager',
				targetHost: config.managerHost,
				prefix: '/manager',
				stripPrefix: true,
			},
			{
				name: 'webSdk',
				targetHost: config.webSdkHost,
				prefix: '/',
				stripPrefix: false,
			},
		]

		const initRouteMappingsMock = vi
			.spyOn(routeMappings, 'initRouteMappings')
			.mockReturnValue(routeMappingsMock)

		const server = initHTTPServer().listen(port)

		expect(initRouteMappingsMock).toHaveBeenCalledTimes(1)

		const response = await request(server).get('/manager/status')

		expect(response.status).toBe(200)
		expect(response.headers['content-type']).toContain('application/json')
		expect(response.body).toEqual(
			expect.objectContaining({
				ok: true,
			})
		)

		await stopHTTPServer(server)
	})
})
