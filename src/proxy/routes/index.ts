import { config } from '../../config'
import { IProxyRouteConfig } from '../types'

export const ROUTES: IProxyRouteConfig[] = [
	{
		name: 'manager',
		targetHost: config.get('proxy.hosts.manager'),
		prefix: '/manager',
		stripPrefix: true,
	},
	{
		name: 'assets',
		targetHost: config.get('proxy.hosts.assetsProxy'),
		prefix: '/assets',
		stripPrefix: true,
	},
	{
		name: 'webWriter',
		targetHost: config.get('proxy.hosts.webSdkWriter'),
		prefix: '/web-writer',
		stripPrefix: true,
	},
	//
	// {
	// 	name: 'sdkWriter',
	// 	targetHost: config.get('proxy.hosts.mobileSdkWriter'),
	// 	prefix: '/sdk-writer',
	// 	stripPrefix: true,
	// },
	//
	// Request without prefix -> web-sdk
	{
		name: 'webSdk',
		targetHost: config.get('proxy.hosts.webSdk'),
		prefix: '/',
		stripPrefix: false,
	},
]
