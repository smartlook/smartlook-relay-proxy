/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from '../config'
export interface IProxyRouteConfig {
	name: string
	targetHost: string
	targetPath: string
	pathPrefixMatch: boolean
	proxyPrefix?: string
	method: 'GET' | 'POST'
	jsonPostProcess?: (json: any, host?: string) => any
}

export const ROUTES: IProxyRouteConfig[] = [
	{
		name: 'webSdkRecorder',
		targetHost: config.get('proxy.hosts.webSdk'),
		targetPath: '/recorder.js',
		method: 'GET',
		pathPrefixMatch: false,
	},
	{
		name: 'webSdkRecorder',
		targetHost: config.get('proxy.hosts.webSdk'),
		targetPath: '/es6/',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'managerSetupRecordingWebsite',
		targetHost: config.get('proxy.hosts.manager'),
		targetPath: '/rec/setup-recording/website',
		method: 'POST',
		pathPrefixMatch: true,
		jsonPostProcess(
			body: { recording: { assetsHost?: string; writerHost?: string } },
			host?: string
		): any {
			if (typeof body !== 'object') {
				return body
			}
			if (body?.recording?.assetsHost) {
				body.recording.assetsHost =
					config.get('proxy.hosts').relayProxy ?? host
			}
			if (body?.recording?.writerHost) {
				body.recording.writerHost =
					config.get('proxy.hosts').relayProxy ?? host
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
		targetHost: config.get('proxy.hosts.webWriter'),
		targetPath: '/rec/v2/write',
		method: 'POST',
		pathPrefixMatch: true,
	},
	{
		name: 'webWriterGetRecord',
		targetHost: config.get('proxy.hosts.webWriter'),
		targetPath: '/v2/record',
		method: 'GET',
		pathPrefixMatch: true,
	},
	{
		name: 'sdkWriterWrite',
		targetHost: config.get('proxy.hosts.mobileSdk'),
		targetPath: '/write',
		method: 'POST',
		pathPrefixMatch: true,
	},
]
