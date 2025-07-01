import { CdiValuesResponse } from '@/external/ipeadata/types/cdi-values-response';
import { InvestmentCachedAmounts } from '@/investment/investment.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

type CacheKeyMapping = {
  'external-ipeadata-cdi-daily': CdiValuesResponse['value'];
  'external-ipeadata-cdi-last-date': string;
  'investment-amounts': InvestmentCachedAmounts;
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
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async get<K extends CacheKey>(
    key: K,
    keyFunction?: () => Promise<KeyFunctionReturn<K>>,
  ): Promise<KeyFunctionReturn<K> | null> {
    const cacheValue: KeyFunctionReturn<K> | null | undefined =
      await this.cacheService.get(key);

    if (cacheValue !== null && cacheValue !== undefined) {
      return cacheValue;
    }

    if (keyFunction) {
      const value = await keyFunction();

      if (value !== null && value !== undefined) {
        await this.cacheService.set(key, value);
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
    return await this.cacheService.set(key, value, ttl);
  }

  async del(key: string) {
    return await this.cacheService.del(key);
  }
}
