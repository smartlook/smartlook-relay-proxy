import { config } from '../../config.js'
import type { RouteMapping } from '../types.js'

export function initRouteMappings(): RouteMapping[] {
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
			stripPrefix: true,
		},
		{
			name: 'assets',
			targetHost: assetsProxyHost,
			prefix: '/assets',
			stripPrefix: true,
		},
		{
			name: 'webWriter',
			targetHost: webSdkWriterHost,
			prefix: '/web-writer',
			stripPrefix: true,
		},
		{
			name: 'sdkWriter',
			targetHost: mobileSdkWriterHost,
			prefix: '/sdk-writer',
			stripPrefix: true,
		},
		// Request without prefix -> Web SDK
		{
			name: 'webSdk',
			targetHost: webSdkHost,
			prefix: '/',
			stripPrefix: false,
		},
	]
}
