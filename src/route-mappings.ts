import { config } from './config.js'
import type { RouteMapping } from './types.js'

export function getRouteMappings(): RouteMapping[] {
	const {
		managerHost,
		assetsProxyHost,
		webSdkWriterHost,
		mobileSdkWriterHost,
		webSdkHost,
	} = config

	return [
		{
			name: 'manager',
			targetHost: managerHost,
			prefix: '/manager',
		},
		{
			name: 'assets',
			targetHost: assetsProxyHost,
			prefix: '/assets',
		},
		{
			name: 'webWriter',
			targetHost: webSdkWriterHost,
			prefix: '/web-writer',
		},
		{
			name: 'sdkWriter',
			targetHost: mobileSdkWriterHost,
			prefix: '/sdk-writer',
		},
		// Request without prefix -> Web SDK
		{
			name: 'webSdk',
			targetHost: webSdkHost,
			prefix: '/',
		},
	]
}
