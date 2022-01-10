import { KeyType as RedisKeyType, ValueType as RedisValueType } from 'ioredis'

export interface IGetCacheData {
	key: RedisKeyType
}

export interface ISetCacheData extends IGetCacheData {
	value: RedisValueType
	expiry: number
}

type TCachedResponse = Buffer | string

export interface ICachedResponse {
	status: TCachedResponse
	headers: TCachedResponse
	body: TCachedResponse
}
