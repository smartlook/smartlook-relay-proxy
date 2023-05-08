import { type IncomingHttpHeaders, type ServerResponse } from 'http'

export interface RouteMapping {
    name: 'manager' | 'assets' | 'webWriter' | 'sdkWriter' | 'webSdk'
    targetHost: string
    prefix: `/${string}`
}

export interface IStreamOpaque {
    url: string
    res: ServerResponse
    outgoingHeaders: IncomingHttpHeaders
}
