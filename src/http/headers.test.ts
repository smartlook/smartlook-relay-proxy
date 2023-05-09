import { config, initConfig } from '../config.js'

import { rewriteRequestHeaders } from './headers.js'

describe('HTTP server', () => {
    beforeEach(() => {
        initConfig()
    })

    it('Should keep existing headers', () => {
        const ip = '192.168.1.1'

        const headers = rewriteRequestHeaders(
            {
                referer: 'https://www.test.com',
            },
            ip,
            'example.com'
        )

        expect(headers).toEqual({
            referer: 'https://www.test.com',
            'x-forwarded-for': ip,
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host: 'example.com',
        })
    })

    it('Should delete forbidden headers', () => {
        const ip = '192.168.1.1'

        const headers = rewriteRequestHeaders(
            {
                referer: 'https://www.test.com',
                connection: 'keep-alive',
                upgrade: 'websocket',
            },
            ip,
            'example.com'
        )

        expect(headers).toEqual({
            referer: 'https://www.test.com',
            'x-forwarded-for': ip,
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host: 'example.com',
        })
    })

    it('Should respect x-forwarded-for', () => {
        const ip = '192.168.1.1'

        const headers = rewriteRequestHeaders(
            {
                referer: 'https://www.test.com',
                'x-forwarded-for': '127.0.0.1',
            },
            ip,
            'example.com'
        )

        expect(headers).toEqual({
            referer: 'https://www.test.com',
            'x-forwarded-for': '127.0.0.1',
            'x-forwarded-by': config.appName,
            'x-forwarded-host': 'example.com',
            host: 'example.com',
        })
    })
})
