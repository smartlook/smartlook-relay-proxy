import { IncomingHttpHeaders } from 'http'

import RedisClient, { ValueType } from 'ioredis'

import { config } from '../config'
import { logger } from '../logger'

import { ICachedResponse, IGetCacheData, ISetCacheData } from './types'

export let CACHE_CONFIGURED = false

const host: string | null = config.get('redis.host')
const port: number | null = config.get('redis.port')
const defaultExpiry = config.get('redis.defaultExpiry')

let redis: RedisClient.Redis

if (host && port) {
	redis = new RedisClient({
		host,
		port,
	})
	CACHE_CONFIGURED = true
	logger.info('Redis has been initialized')
}

const set = async (data: ISetCacheData[]): Promise<Array<'OK' | null>> => {
	return Promise.all(
		data.map(async ({ key, value, expiry }) => {
			return redis.set(key, value, 'EX', expiry)
		})
	)
}

const get = async (data: IGetCacheData[]): Promise<Array<string | null>> => {
	return Promise.all(
		data.map(async ({ key }) => {
			return redis.get(key)
		})
	)
}

const getBuffer = async (data: IGetCacheData[]): Promise<Buffer[]> => {
	return Promise.all(
		data.map(async ({ key }) => {
			return redis.getBuffer(key)
		})
	)
}

export const cacheResponse = async (
	url: string,
	status: number,
	headers: IncomingHttpHeaders,
	body: ValueType
): Promise<void> => {
	await set([
		{
			key: `${url}:status`,
			value: status,
			expiry: defaultExpiry,
		},
		{
			key: `${url}:headers`,
			value: JSON.stringify(headers),
			expiry: defaultExpiry,
		},
		{
			key: `${url}:body`,
			value: body,
			expiry: defaultExpiry,
		},
	])
}

export const getCachedResponse = async (
	url: string
): Promise<ICachedResponse | null> => {
	const values = await Promise.all([
		get([
			{
				key: `${url}:status`,
			},
			{
				key: `${url}:headers`,
			},
		]),
		getBuffer([
			{
				key: `${url}:body`,
			},
		]),
	])

	const data = values.flat()

	if (data.includes(null)) {
		return null
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return {
		status: data[0],
		headers: data[1],
		body: data[2],
	} as ICachedResponse
}
