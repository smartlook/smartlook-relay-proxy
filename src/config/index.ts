import convict from 'convict'

import { IManagerBody, IProxyRouteConfig } from '../proxy/types'

export const config = convict({
	env: {
		doc: 'Application environment',
		format: ['production', 'development', 'test'],
		env: 'NODE_ENV',
		default: 'development',
	},
	proxy: {
		port: {
			doc: 'Proxy port',
			format: Number,
			env: 'PROXY_PORT',
			default: 9000,
		},
		hosts: {
			relayProxy: {
				doc: 'Relay proxy host',
				format: String,
				env: 'RELAY_PROXY_HOST',
				default: null,
			},
			webSdk: {
				doc: 'Web SDK host',
				format: String,
				env: 'WEB_SDK_HOST',
				default: 'https://web-sdk.smartlook.com',
			},
			assetsProxy: {
				doc: 'Assets Proxy host',
				format: String,
				env: 'ASSETS_PROXY_HOST',
				default: 'https://assets-proxy.smartlook.cloud',
			},
			webSdkWriter: {
				doc: 'Web Writer host',
				format: String,
				env: 'WEB_WRITER_HOST',
				default: 'https://web-writer.eu.smartlook.cloud',
			},
			mobileSdkWriter: {
				doc: 'Mobile Writer host',
				format: String,
				env: 'MOBILE_SDK_HOST',
				default: 'https://sdk-writer.eu.smartlook.cloud',
			},
			manager: {
				doc: 'Manager host',
				format: String,
				env: 'MANAGER_HOST',
				default: 'https://manager.smartlook.com',
			},
		},
	},
	logger: {
		level: {
			doc: 'Logger level',
			format: [
				'trace',
				'debug',
				'info',
				'warn',
				'error',
				'fatal',
				'silent',
			],
			env: 'LOGGER_LEVEL',
			default: 'info',
		},
	},
})

export const ROUTES: IProxyRouteConfig[] = [
	{
		name: 'webSdkRecorder',
		targetHost: config.get('proxy.hosts.webSdk'),
		targetPath: '/recorder.js',
		method: 'GET',
		pathPrefixMatch: false,
	},
	{
		name: 'webSdkES6',
		targetHost: config.get('proxy.hosts.webSdk'),
		targetPath: '/es6/',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'webSdkES5',
		targetHost: config.get('proxy.hosts.webSdk'),
		targetPath: '/es5/',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'webSdkPicker',
		targetHost: config.get('proxy.hosts.webSdk'),
		targetPath: '/picker',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'webSdkPolyfill',
		targetHost: config.get('proxy.hosts.webSdk'),
		targetPath: '/polyfills',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'managerSetupRecordingWebsite',
		targetHost: config.get('proxy.hosts.manager'),
		targetPath: '/rec/setup-recording/website',
		method: 'POST',
		pathPrefixMatch: true,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		jsonPostProcess(body: IManagerBody, host?: string): any {
			if (typeof body !== 'object') {
				return body
			}
			if (body?.recording?.assetsHost) {
				body.recording.assetsHost =
					config.get('proxy.hosts.relayProxy') ?? host
			}
			if (body?.recording?.writerHost) {
				body.recording.writerHost =
					config.get('proxy.hosts.relayProxy') ?? host
			}
			return body
		},
	},
	{
		name: 'managerSessionActive',
		targetHost: config.get('proxy.hosts.manager'),
		targetPath: '/rec/sessions/',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'managerSetupRecordingMobile',
		targetHost: config.get('proxy.hosts.manager'),
		targetPath: '/rec/setup-recording/mobile',
		method: 'POST',
		pathPrefixMatch: true,
	},
	{
		name: 'managerLog',
		targetHost: config.get('proxy.hosts.manager'),
		targetPath: '/rec/log',
		method: 'POST',
		pathPrefixMatch: true,
	},
	{
		name: 'assetsCache',
		targetHost: config.get('proxy.hosts.assetsProxy'),
		targetPath: '/cache',
		method: 'POST',
		pathPrefixMatch: false,
	},
	{
		name: 'assetsProxyGetAsset',
		targetHost: config.get('proxy.hosts.assetsProxy'),
		targetPath: '/proxy',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'webWriterWrite',
		targetHost: config.get('proxy.hosts.webSdkWriter'),
		targetPath: '/rec/v2/write',
		method: 'POST',
		pathPrefixMatch: true,
	},
	{
		name: 'webWriterGetRecord',
		targetHost: config.get('proxy.hosts.webSdkWriter'),
		targetPath: '/v2/record',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'sdkWriterWrite',
		targetHost: config.get('proxy.hosts.mobileSdkWriter'),
		targetPath: '/write',
		method: 'POST',
		pathPrefixMatch: true,
	},
]
