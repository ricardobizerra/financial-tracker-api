import { IpeadataService } from '@/external/ipeadata/ipeadata.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

type CacheKey = keyof RedisCacheService['keyFunction'];

type KeyFunctionReturn<K extends CacheKey> = Awaited<
  ReturnType<RedisCacheService['keyFunction'][K]>
>;

@Injectable()
export class RedisCacheService {
  private keyFunction = {
    'external-ipeadata-cdi-daily': () => this.ipeadataService.getCdiValues(),
    'external-ipeadata-cdi-last-date': async () =>
      (await this.ipeadataService.getCdiValues())?.[
        (await this.ipeadataService.getCdiValues())?.length - 1
      ]?.VALDATA,
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly ipeadataService: IpeadataService,
  ) {}

  async get<K extends CacheKey>(key: K): Promise<KeyFunctionReturn<K> | null> {
    const cacheValue = await this.cacheService.get<KeyFunctionReturn<K>>(key);

    if (cacheValue !== null && cacheValue !== undefined) {
      return cacheValue;
    }

    const keyFunction = this.keyFunction[key] as () => Promise<
      KeyFunctionReturn<K>
    >;

    if (keyFunction) {
      const value = await keyFunction();

      if (value !== null && value !== undefined) {
        await this.cacheService.set(key, value);
      }

      return value;
    }

    return null;
  }

  async set<K extends CacheKey>(key: K, value: KeyFunctionReturn<K>) {
    return await this.cacheService.set(key, value);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cacheCdiValues() {
    const cdiValues = await this.ipeadataService.getCdiValues();

    await Promise.all([
      this.cacheService.set('external-ipeadata-cdi-daily', cdiValues),
      this.cacheService.set(
        'external-ipeadata-cdi-last-date',
        cdiValues?.[cdiValues?.length - 1]?.VALDATA,
      ),
    ]);
  }
}
