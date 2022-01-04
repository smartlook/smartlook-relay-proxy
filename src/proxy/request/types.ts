import { IncomingHttpHeaders } from 'http'
import internal from 'stream'

export interface IGetRequest {
	url: string
	originalHeaders: IncomingHttpHeaders
}

export interface IPostRequest extends IGetRequest {
	requestBody: Buffer
}

export interface IResponseBuffer {
	statusCode: number
	headers: IncomingHttpHeaders
	body: Buffer
}

export interface IResponseReadable {
	statusCode: number
	headers: IncomingHttpHeaders
	body: internal.Readable
}
