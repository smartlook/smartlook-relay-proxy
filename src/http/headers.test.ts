import type { FastifyRequest, HTTPMethods } from 'fastify'

import { config, initConfig } from '../config.js'

import { rewriteRequestHeaders } from './headers.js'

describe('HTTP server', () => {
    const ip = '64.248.69.64'
    const host = 'example.com'

    function getMockRequest(
        method?: HTTPMethods,
        headers?: Record<string, string | string[]>
    ): FastifyRequest {
        return {
            ip,
            method,
            headers,
        } as FastifyRequest
    }

    beforeEach(() => {
        initConfig()
    })

    it('Should keep existing headers', () => {
        const originalHeaders = {
            referer: 'https://www.test.com',
        }

        const headers = rewriteRequestHeaders({
            headers: originalHeaders,
            request: getMockRequest(),
            host,
        })

        expect(headers).toEqual({
            ...originalHeaders,
            'x-forwarded-for': ip,
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host,
        })
    })

    it('Should delete forbidden HTTP2 headers', () => {
        const originalHeaders = {
            referer: 'https://www.test.com',
        }

        const headers = rewriteRequestHeaders({
            headers: {
                ...originalHeaders,
                connection: 'keep-alive',
                upgrade: 'websocket',
            },
            request: getMockRequest(),
            host,
        })

        expect(headers).toEqual({
            ...originalHeaders,
            'x-forwarded-for': ip,
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host,
        })
    })

    it('Should respect x-forwarded-for', () => {
        const originalHeaders = {
            referer: 'https://www.test.com',
        }

        const headers = rewriteRequestHeaders({
            headers: {
                ...originalHeaders,
                'x-forwarded-for': '127.0.0.1',
            },
            request: getMockRequest(),
            host,
        })

        expect(headers).toEqual({
            ...originalHeaders,
            'x-forwarded-for': '127.0.0.1',
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host,
        })
    })

    it('Should handle x-forwarded-for as an array', () => {
        const originalHeaders = {
            'x-forwarded-for': [
                '91.69.97.18',
                '100.254.100.215',
                '162.157.33.117',
            ],
        }

        const headers = rewriteRequestHeaders({
            headers: originalHeaders,
            request: getMockRequest('GET', originalHeaders),
            host,
        })

        expect(headers).toEqual({
            'x-forwarded-for': originalHeaders['x-forwarded-for'][0],
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host,
        })
    })

    it('Should handle x-forwarded-for as a string array', () => {
        const originalHeaders = {
            'x-forwarded-for': '91.69.97.18, 100.254.100.215, 162.157.33.117',
        }

        const headers = rewriteRequestHeaders({
            headers: originalHeaders,
            request: getMockRequest('GET', originalHeaders),
            host,
        })

        expect(headers).toEqual({
            'x-forwarded-for': '91.69.97.18',
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host,
        })
    })

    describe('Should remove content headers if method is not PUT, PATCH or POST', () => {
        for (const method of ['GET', 'HEAD', 'OPTIONS', 'DELETE']) {
            it(`Should remove content headers if method is ${method}`, () => {
                const originalHeaders = {
                    referer: 'https://www.test.com',
                    'x-forwarded-for': '127.0.0.1',
                    'content-type': 'application/json',
                    'content-length': '123',
                    'transfer-encoding': 'chunked',
                }

                const headers = rewriteRequestHeaders({
                    headers: originalHeaders,
                    request: { ip, method } as FastifyRequest,
                    host,
                })

                expect(headers).toEqual({
                    referer: originalHeaders.referer,
                    'x-forwarded-for': '127.0.0.1',
                    'x-forwarded-by': config.appName,
                    'x-forwarded-host': 'example.com',
                    host,
                })
            })
        }
    })
})
