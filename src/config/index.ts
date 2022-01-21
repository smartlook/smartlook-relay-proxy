import convict from 'convict'

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
