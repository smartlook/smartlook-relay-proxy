import { config } from '../../config'
import { IManagerBody, IProxyRouteConfig } from '../types'
import { buildHostUrl } from '../utils'

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
				body.recording.assetsHost = buildHostUrl() ?? host
			}
			if (body?.recording?.writerHost) {
				body.recording.writerHost = buildHostUrl() ?? host
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
		name: 'managerConsent',
		targetHost: config.get('proxy.hosts.manager'),
		targetPath: '/rec/consent',
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