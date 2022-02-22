import { ServerResponse } from 'http'

export interface IProxyRouteConfig {
	name: string
	targetHost: string
	prefix: string
	stripPrefix: boolean
}

export interface IStreamOpaque {
	url: string
	res: ServerResponse
}
