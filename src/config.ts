import { createConfig, type EnveySchema, type InferEnveyConfig } from 'envey'
import { z } from 'zod'

const configSchema = {
	nodeEnv: {
		env: 'NODE_ENV',
		format: z
			.enum(['production', 'test', 'development'])
			.default('production'),
	},
	logLevel: {
		env: 'LOGGER_LEVEL',
		format: z
			.enum([
				'fatal',
				'error',
				'warn',
				'info',
				'debug',
				'trace',
				'silent',
			])
			.default('info'),
	},
	commitSha: {
		env: 'COMMIT_SHA',
		format: z.string(),
	},
	appName: {
		env: undefined,
		format: z.string().default('smartlook-relay-proxy'),
	},
	port: {
		env: 'PROXY_PORT',
		format: z.coerce.number().int().positive().max(65535).default(8000),
	},
	webSdkHost: {
		env: 'WEB_SDK_HOST',
		format: z.string().url().default('https://web-sdk.smartlook.com'),
	},
	assetsProxyHost: {
		env: 'ASSETS_PROXY_HOST',
		format: z
			.string()
			.url()
			.default('https://assets-proxy.smartlook.cloud'),
	},
	webSdkWriterHost: {
		env: 'WEB_SDK_WRITER_HOST',
		format: z
			.string()
			.url()
			.default('https://web-writer.eu.smartlook.cloud'),
	},
	mobileSdkWriterHost: {
		env: 'MOBILE_SDK_WRITER_HOST',
		format: z
			.string()
			.url()
			.default('https://sdk-writer.eu.smartlook.cloud'),
	},
	managerHost: {
		env: 'MANAGER_HOST',
		format: z.string().url().default('https://manager.eu.smartlook.cloud'),
	},
	trustProxy: {
		env: 'TRUST_PROXY',
		format: z.boolean().default(true),
	},
} satisfies EnveySchema

export let config: InferEnveyConfig<typeof configSchema>

export function initConfig(): void {
	config = createConfig(z, configSchema)
}
