import { KeyType as RedisKeyType, ValueType as RedisValueType } from 'ioredis'

export interface IGetCacheData {
	key: RedisKeyType
}

export interface ISetCacheData extends IGetCacheData {
	value: RedisValueType
	expiry: number
}

export type TCachedResponse = Buffer | string
