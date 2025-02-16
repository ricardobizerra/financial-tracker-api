import { Global, Module } from '@nestjs/common';
import { RedisSubscriptionService } from '@/lib/redis/redis-subscription.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisSubscriptionService],
  exports: [RedisSubscriptionService],
})
export class RedisModule {}
