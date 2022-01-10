import { IncomingMessage, ServerResponse } from 'http'

import { config } from '../../config'
import { routes } from '../constants'
import { post } from '../request'
import { getBodyAsBuffer, stripUrl } from '../utils'

export const handler = async (
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	const url = `${config.get('proxy.hosts.assetsProxy')}/${stripUrl(
		req.url as string,
		routes.assetsProxy
	)}`

	const requestBody = await getBodyAsBuffer(req)

	const { statusCode, headers, body } = await post(
		{
			url,
			originalHeaders: req.headers,
			requestBody,
		},
		false
	)

	res.writeHead(statusCode, headers)
	body.pipe(res)
}
