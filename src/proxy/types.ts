export type IProxyRouteMethod = 'GET' | 'POST'

export interface IProxyRouteConfig {
	name: string
	targetHost: string
	targetPath: string
	pathPrefixMatch: boolean
	proxyPrefix?: string
	method: IProxyRouteMethod
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	jsonPostProcess?: (json: any, host?: string) => any
}

interface IManagerRecording {
	assetsHost?: string
	writerHost?: string
}

export interface IManagerBody {
	recording: IManagerRecording
}
