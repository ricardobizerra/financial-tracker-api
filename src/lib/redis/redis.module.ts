import { Global, Module } from '@nestjs/common';
import { RedisSubscriptionService } from '@/lib/redis/redis-subscription.service';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  providers: [RedisSubscriptionService, RedisCacheService],
  exports: [RedisSubscriptionService, RedisCacheService],
})
export class RedisModule {}
