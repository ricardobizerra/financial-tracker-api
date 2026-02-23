import { BacenCachedValue } from '@/external/bacen/bacen.types';
import { IpeadataCachedValue } from '@/external/ipeadata/types/ipeadata-response';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

type CacheKeyMapping = {
  'external-ipeadata-cdi-daily': IpeadataCachedValue[];
  'external-ipeadata-cdi-last-date': string;
  'external-bacen-poupanca-daily': BacenCachedValue[];
  'external-bacen-poupanca-last-date': string;
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

  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

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
}
