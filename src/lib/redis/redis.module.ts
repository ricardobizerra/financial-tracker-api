import { Global, Module } from '@nestjs/common';
import { RedisSubscriptionService } from '@/lib/redis/redis-subscription.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import { IpeadataModule } from '@/external/ipeadata/ipeadata.module';

@Global()
@Module({
  imports: [ConfigModule, IpeadataModule],
  providers: [RedisSubscriptionService, RedisCacheService],
  exports: [RedisSubscriptionService, RedisCacheService],
})
export class RedisModule {}
