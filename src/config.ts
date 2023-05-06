import { createConfig, type EnveySchema, type InferEnveyConfig } from 'envey'
import { z } from 'zod'

function bool(defaultValue: boolean): z.ZodBoolean {
	return z
		.enum(['true', 'false'])
		.transform((value) => value === 'true')
		.default(defaultValue.toString() as never) as unknown as z.ZodBoolean
}

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
				'fatal', // 60
				'error', // 50
				'warn', // 40
				'info', // 30
				'debug', // 20
				'trace', // 10
				'silent',
			])
			.default('info'),
	},
	logRequests: {
		env: 'LOG_REQUESTS',
		format: bool(false),
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
		format: bool(true),
	},
} satisfies EnveySchema

export let config: InferEnveyConfig<typeof configSchema>

export function initConfig(): void {
	config = createConfig(z, configSchema)
}
