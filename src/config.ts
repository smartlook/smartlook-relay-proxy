import { z } from 'zod'

import { ConfigError } from './errors/index.js'

const configSchema = z.object({
	nodeEnv: z
		.enum(['production', 'test', 'development'])
		.default('production'),
	logLevel: z
		.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
		.default('info'),
	commitSha: z.string(),
	projectName: z.string().default('smartlook-relay-proxy'),
	port: z.coerce.number().positive().default(8000),
	webSdkHost: z.string().url().default('https://web-sdk.smartlook.com'),
	assetsProxyHost: z
		.string()
		.url()
		.default('https://assets-proxy.smartlook.cloud'),
	webSdkWriterHost: z
		.string()
		.url()
		.default('https://web-writer.eu.smartlook.cloud'),
	mobileSdkWriterHost: z
		.string()
		.url()
		.default('https://sdk-writer.eu.smartlook.cloud'),
	managerHost: z.string().url().default('https://manager.eu.smartlook.cloud'),
})

export let config: z.infer<typeof configSchema>

function validateAndClone<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	values: Record<keyof z.infer<typeof schema>, unknown>
): z.infer<typeof schema> {
	const validationResult = schema.safeParse(values)

	if (!validationResult.success) {
		throw new ConfigError(validationResult.error.issues, 'Invalid config')
	}

	return validationResult.data
}

export function initConfig(): void {
	config = validateAndClone(configSchema, {
		nodeEnv: process.env['NODE_ENV'],
		logLevel: process.env['LOGGER_LEVEL'],
		commitSha: process.env['COMMIT_SHA'],
		port: process.env['PROXY_PORT'],
		projectName: undefined,
		webSdkHost: process.env['WEB_SDK_HOST'],
		assetsProxyHost: process.env['ASSETS_PROXY_HOST'],
		webSdkWriterHost: process.env['WEB_SDK_WRITER_HOST'],
		mobileSdkWriterHost: process.env['MOBILE_SDK_WRITER_HOST'],
		managerHost: process.env['MANAGER_HOST'],
	})
}
