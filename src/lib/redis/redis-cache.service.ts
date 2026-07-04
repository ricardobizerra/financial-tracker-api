import { BacenCachedValue } from '@/external/bacen/bacen.types';
import { IpeadataCachedValue } from '@/external/ipeadata/types/ipeadata-response';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import Redis, { RedisOptions } from 'ioredis';

type CacheKeyMapping = {
  'external-ipeadata-cdi-daily': IpeadataCachedValue[];
  'external-ipeadata-cdi-last-date': string;
  'external-bacen-poupanca-daily': BacenCachedValue[];
  'external-bacen-poupanca-last-date': string;
  'external-bacen-selic-daily': BacenCachedValue[];
  'external-bacen-selic-last-date': string;
  'external-bacen-ipca-monthly': BacenCachedValue[];
  'external-brapi-treasury-daily': any;
  'external-tesouro-transparente-history': any;
  'external-tesouro-transparente-history-hash': any;
  'recurring-transaction-ignored-suggestions': string[];
};

type BaseCacheKey = keyof CacheKeyMapping;
type CacheKey = `${BaseCacheKey}` | `${BaseCacheKey}:${string}`;

type InferBaseKey<K extends CacheKey> = K extends `${infer B}:${string}`
  ? B
  : K;

type KeyFunctionReturn<K extends CacheKey> =
  InferBaseKey<K> extends BaseCacheKey
    ? CacheKeyMapping[InferBaseKey<K>]
    : never;

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly redisClient: Redis;

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly configService: ConfigService,
  ) {
    const options: RedisOptions = {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
      db: configService.get('REDIS_DB'),
    };
    this.redisClient = new Redis(options);
  }

  async get<K extends CacheKey>(
    key: K,
    keyFunction?: () => Promise<KeyFunctionReturn<K>>,
  ): Promise<KeyFunctionReturn<K> | null> {
    const cacheValue: KeyFunctionReturn<K> | null | undefined =
      await this.cacheService.get(key);

    if (cacheValue !== null && cacheValue !== undefined) {
      this.logger.debug(`Cache hit for key: ${key}`);
      return cacheValue;
    }

    this.logger.debug(`Cache miss for key: ${key}`);
    if (keyFunction) {
      const value = await keyFunction();

      if (value !== null && value !== undefined) {
        await this.cacheService.set(key, value);
        this.logger.debug(`Cache populated for key: ${key}`);
      }

      return value;
    }

    return null;
  }

  async set<K extends CacheKey>(
    key: K,
    value: KeyFunctionReturn<K>,
    ttl?: number,
  ) {
    this.logger.debug(`Cache set for key: ${key}`);
    return await this.cacheService.set(key, value, ttl);
  }

  async del(key: string) {
    this.logger.debug(`Cache delete for key: ${key}`);
    return await this.cacheService.del(key);
  }

  async hset<K extends CacheKey>(key: K, field: string, value: any) {
    const val = JSON.stringify(value);
    this.logger.debug(`Cache hset for key: ${key} field: ${field}`);
    return await this.redisClient.hset(key, field, val);
  }

  async hget<K extends CacheKey>(key: K, field: string): Promise<any> {
    const res = await this.redisClient.hget(key, field);

    if (res !== null && res !== undefined) {
      this.logger.debug(`Cache hget hit for key: ${key} field: ${field}`);
      return JSON.parse(res);
    }

    this.logger.debug(`Cache hget miss for key: ${key} field: ${field}`);
    return null;
  }

  async hkeys<K extends CacheKey>(key: K): Promise<string[]> {
    return await this.redisClient.hkeys(key);
  }
}
