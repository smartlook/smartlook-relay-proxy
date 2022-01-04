import { IncomingMessage, ServerResponse } from 'http'
import config from '../../config'
import { routes } from '../constants'
import { get, post } from '../request'
import { getBodyAsBuffer, stripUrl } from '../utils'

const handler = async (
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	const url = `${config.get('proxy.hosts.manager')}/${stripUrl(
		req.url as string,
		routes.manager
	)}`

	if (req.method === 'POST') {
		const requestBody = await getBodyAsBuffer(req)
		const { statusCode, headers, body } = await post(
			{
				url,
				originalHeaders: req.headers,
				requestBody,
			},
			true
		)

		const bodyAsJson = JSON.parse(body.toString())

		bodyAsJson['recording'] = {
			writerHost: `${req.headers.host}${routes.webWriter}`,
			assetsHost: `${req.headers.host}${routes.assetsProxy}`,
		}

		res.writeHead(statusCode, headers)
		res.write(Buffer.from(JSON.stringify(bodyAsJson)))
		res.end()
	} else if (req.method === 'GET') {
		const { statusCode, headers, body } = await get(
			{
				url,
				originalHeaders: req.headers,
			},
			false
		)

		res.writeHead(statusCode, headers)
		body.pipe(res)
		res.end()
	}
}

export default handler
