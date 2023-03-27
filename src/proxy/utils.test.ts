import { initConfig, config } from '../config.js'

import { type RouteMapping } from './types.js'
import { buildUrl, prepareHeaders } from './utils.js'

describe('Utils', () => {
	beforeEach(() => {
		initConfig()
	})

	describe('buildUrl', () => {
		it('Should build URL without prefix', () => {
			const route: RouteMapping = {
				name: 'manager',
				prefix: '/api',
				targetHost: 'https://example.com',
				stripPrefix: true,
			}

			const reqUrl = '/api/users'
			const url = buildUrl(route, reqUrl)

			expect(url).toEqual('https://example.com/users')
		})

		it('Should build URL with prefix', () => {
			const route: RouteMapping = {
				name: 'webSdk',
				prefix: '/api',
				targetHost: 'https://example.com',
				stripPrefix: false,
			}

			const reqUrl = '/api/users'
			const url = buildUrl(route, reqUrl)

			expect(url).toEqual('https://example.com/api/users')
		})
	})

	describe('prepareHeaders', () => {
		it('Should prepare headers', () => {
			const host = 'example.com'
			const originalHeaders = {
				'some-header': 'some-value',
			}

			const headers = prepareHeaders(host, originalHeaders)

			expect(headers).toEqual({
				'some-header': 'some-value',
				'x-forwarded-host': host,
				'x-forwarded-by': config.projectName,
				host,
			})
		})

		it('Should prepare headers with remote address', () => {
			const host = 'example.com'
			const originalHeaders = {
				'some-header': 'some-value',
			}
			const remoteAddress = '99.197.86.235'

			const headers = prepareHeaders(host, originalHeaders, remoteAddress)

			expect(headers).toEqual({
				'some-header': 'some-value',
				'x-forwarded-for': remoteAddress,
				'x-forwarded-host': host,
				'x-forwarded-by': config.projectName,
				host,
			})
		})

		it('Should prepare headers with existing x-forwarded-for header', () => {
			const host = 'example.com'
			const originalHeaders = {
				'some-header': 'some-value',
				'x-forwarded-for': '99.197.86.235',
			}

			const headers = prepareHeaders(host, originalHeaders)

			expect(headers).toEqual({
				'some-header': originalHeaders['some-header'],
				'x-forwarded-for': originalHeaders['x-forwarded-for'],
				'x-forwarded-host': host,
				'x-forwarded-by': config.projectName,
				host,
			})
		})

		it('Should delete HTTP2 headers', () => {
			const host = 'example.com'
			const originalHeaders = {
				'some-header': 'some-value',
				connection: 'keep-alive',
				upgrade: 'h2c',
			}

			const headers = prepareHeaders(host, originalHeaders)

			expect(headers).toEqual({
				'some-header': originalHeaders['some-header'],
				'x-forwarded-host': host,
				'x-forwarded-by': config.projectName,
				host,
			})
		})
	})
})
