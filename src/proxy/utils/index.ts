import { IncomingMessage } from 'http'

export const getBodyAsBuffer = async (
	req: IncomingMessage
): Promise<Buffer> => {
	const buffers = []

	for await (const chunk of req) {
		buffers.push(chunk)
	}

	return Buffer.concat(buffers)
}

export const stripUrl = (reqUrl: string, by: string): string => {
	return reqUrl.split(by)[1]
}
