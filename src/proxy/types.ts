import { type IncomingHttpHeaders, ServerResponse } from 'http'

export interface RouteMapping {
	name: 'manager' | 'assets' | 'webWriter' | 'sdkWriter' | 'webSdk'
	targetHost: string
	prefix: `/${string}`
	stripPrefix: boolean
}

export interface IStreamOpaque {
	url: string
	res: ServerResponse
	outgoingHeaders: IncomingHttpHeaders
}
