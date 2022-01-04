import { IncomingMessage, ServerResponse } from 'http'
import config from '../../config'
import { routes } from '../constants'
import { post } from '../request'
import { getBodyAsBuffer, stripUrl } from '../utils'

const handler = async (
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	const url = `${config.get('proxy.hosts.mobileSDK')}/${stripUrl(
		req.url as string,
		routes.sdkWriter
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

export default handler
