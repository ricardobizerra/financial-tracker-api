import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisSubscriptionService
  extends RedisPubSub
  implements OnModuleInit
{
  private readonly logger = new Logger(RedisSubscriptionService.name);

  constructor(private readonly configService: ConfigService) {
    const options: RedisOptions = {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
      db: configService.get('REDIS_DB'),
    };

    super({
      publisher: new Redis(options),
      subscriber: new Redis(options),
    });
  }

  async onModuleInit() {
    await this.getSubscriber().subscribe('EVENTS');
    this.logger.log('Redis subscription service initialized');
  }
}
