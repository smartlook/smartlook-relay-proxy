import convict from 'convict'

const config = convict({
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
			webSDK: {
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
			webWriter: {
				doc: 'Web Writer host',
				format: String,
				env: 'WEB_WRITER_HOST',
				default: 'https://web-writer.eu.smartlook.cloud',
			},
			mobileSDK: {
				doc: 'Mobile SDK host',
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
	redis: {
		host: {
			doc: 'Redis host',
			format: String,
			env: 'REDIS_HOST',
			default: 'redis',
		},
		port: {
			doc: 'Redis port',
			format: Number,
			env: 'REDIS_PORT',
			default: 6379,
		},
	},
})

export default config
