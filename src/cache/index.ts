import { IncomingHttpHeaders } from 'http'
import RedisClient, { ValueType } from 'ioredis'
import config from '../config'
import { IGetCacheData, ISetCacheData, TCachedResponse } from './types'

const redis = new RedisClient({
	host: config.get('redis.host'),
	port: config.get('redis.port'),
})

const defaultExpiry = 10 * 60 // 10 min

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
): Promise<TCachedResponse[] | null> => {
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

	return data
}
