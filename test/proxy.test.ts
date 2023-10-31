/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type StatusResponse = {
    ok: boolean
    version: string
}

type CommonStatusResponse = [StatusResponse, StatusResponse]

describe('Proxy server', () => {
    it('Should return relay proxy status on /proxy/status', async () => {
        const response = await fetch('http://localhost:80/proxy/status')

        const json = await response.json()

        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('application/json')
        expect(json).toEqual({
            app: process.env['APP_NAME'],
            version: process.env['COMMIT_SHA'],
        })
    })

    it('Should return manager status on /manager/status', async () => {
        const [ogResponse, proxyResponse] = await Promise.all([
            fetch('https://manager.eu.smartlook.cloud/status'),
            fetch('http://localhost:80/manager/status'),
        ])

        const [ogResponseJson, proxyResponseJson] = (await Promise.all([
            ogResponse.json(),
            proxyResponse.json(),
        ])) as CommonStatusResponse

        expect(ogResponse.status).toBe(200)
        expect(proxyResponse.status).toBe(200)
        expect(ogResponse.headers.get('content-type')).toBe(
            'application/json; charset=utf-8',
        )
        expect(proxyResponse.headers.get('content-type')).toBe(
            'application/json; charset=utf-8',
        )

        expect(ogResponseJson.ok).toBe(proxyResponseJson.ok)
        expect(ogResponseJson.version).toBe(proxyResponseJson.version)
    })

    it('Should return assets proxy status on /assets/status', async () => {
        const [ogResponse, proxyResponse] = await Promise.all([
            fetch('https://assets-proxy.smartlook.cloud/status'),
            fetch('http://localhost:80/assets/status'),
        ])

        const [ogResponseJson, proxyResponseJson] = (await Promise.all([
            ogResponse.json(),
            proxyResponse.json(),
        ])) as CommonStatusResponse

        expect(ogResponse.status).toBe(200)
        expect(proxyResponse.status).toBe(200)
        expect(ogResponse.headers.get('content-type')).toBe('application/json')
        expect(proxyResponse.headers.get('content-type')).toBe(
            'application/json',
        )

        expect(ogResponseJson.ok).toBe(proxyResponseJson.ok)
        expect(ogResponseJson.version).toBe(proxyResponseJson.version)
    })

    it('Should return web writer status on /web-writer/status', async () => {
        const [ogResponse, proxyResponse] = await Promise.all([
            fetch('https://web-writer.eu.smartlook.cloud/status'),
            fetch('http://localhost:80/web-writer/status'),
        ])

        const [ogResponseJson, proxyResponseJson] = (await Promise.all([
            ogResponse.json(),
            proxyResponse.json(),
        ])) as CommonStatusResponse

        expect(ogResponse.status).toBe(200)
        expect(proxyResponse.status).toBe(200)
        expect(ogResponse.headers.get('content-type')).toBe(
            'application/json; charset=utf-8',
        )
        expect(proxyResponse.headers.get('content-type')).toBe(
            'application/json; charset=utf-8',
        )

        expect(ogResponseJson.ok).toBe(proxyResponseJson.ok)
        expect(ogResponseJson.version).toBe(proxyResponseJson.version)
    })

    it('Should return sdk writer status on /sdk-writer/status', async () => {
        const [ogResponse, proxyResponse] = await Promise.all([
            fetch('https://sdk-writer.eu.smartlook.cloud/status'),
            fetch('http://localhost:80/sdk-writer/status'),
        ])

        const [ogResponseJson, proxyResponseJson] = (await Promise.all([
            ogResponse.json(),
            proxyResponse.json(),
        ])) as CommonStatusResponse

        expect(ogResponse.status).toBe(200)
        expect(proxyResponse.status).toBe(200)
        expect(ogResponse.headers.get('content-type')).toBe(
            'application/json; charset=utf-8',
        )
        expect(proxyResponse.headers.get('content-type')).toBe(
            'application/json; charset=utf-8',
        )
        expect(ogResponseJson.ok).toBe(proxyResponseJson.ok)
        expect(ogResponseJson.version).toBe(proxyResponseJson.version)
    })

    it('Should return web sdk status on /status', async () => {
        const [ogResponse, proxyResponse] = await Promise.all([
            fetch('https://web-sdk.smartlook.com/status'),
            fetch('http://localhost:80/status'),
        ])

        const [ogResponseJson, proxyResponseJson] = (await Promise.all([
            ogResponse.json(),
            proxyResponse.json(),
        ])) as CommonStatusResponse

        expect(ogResponse.status).toBe(200)
        expect(proxyResponse.status).toBe(200)
        expect(ogResponse.headers.get('content-type')).toBe('application/json')
        expect(proxyResponse.headers.get('content-type')).toBe(
            'application/json',
        )
        expect(ogResponseJson.ok).toBe(proxyResponseJson.ok)
        expect(ogResponseJson.version).toBe(proxyResponseJson.version)
    })

    it('Should return web sdk recorder on /recorder.js', async () => {
        const [ogResponse, proxyResponse] = await Promise.all([
            fetch('https://web-sdk.smartlook.com/recorder.js'),
            fetch('http://localhost:80/recorder.js'),
        ])

        const [ogResponseText, proxyResponseText] = await Promise.all([
            ogResponse.text(),
            proxyResponse.text(),
        ])

        expect(ogResponse.status).toBe(200)
        expect(proxyResponse.status).toBe(200)
        expect(ogResponse.headers.get('content-type')).toBe(
            'application/javascript',
        )
        expect(proxyResponse.headers.get('content-type')).toBe(
            'application/javascript',
        )
        expect(ogResponseText).toEqual(proxyResponseText)
    })
})
