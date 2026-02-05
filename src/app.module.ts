import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env, envSchema } from '@/env';
import { PrismaModule } from '@/lib/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { HealthModule } from '@/health/health.module';
import { UserModule } from '@/user/user.module';
import { RedisModule } from '@/lib/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { IpeadataModule } from './external/ipeadata/ipeadata.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { InvestmentModule } from './investment/investment.module';
import { BacenModule } from './external/bacen/bacen.module';
import { AccountModule } from './account/account.module';
import { InstitutionModule } from './institution/institution.module';
import { TransactionModule } from './transaction/transaction.module';
import { CardModule } from './card/card.module';
import { RecurringTransactionModule } from './recurring-transaction/recurring-transaction.module';
import { QueueModule } from '@/lib/queue/queue.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => envSchema.parse(config),
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        playground: false,
        autoSchemaFile:
          configService.get('NODE_ENV') === 'production'
            ? join('/tmp', 'schema.gql')
            : join(process.cwd(), 'src/lib/graphql/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ req, res }) => ({ req, res }),
        subscriptions: {
          'graphql-ws': true,
        },
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Env, true>) => ({
        store: await redisStore({
          url: configService.get('REDIS_URL'),
        }),
      }),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    PrismaModule,
    UserModule,
    RedisModule,
    AuthModule,
    BacenModule,
    IpeadataModule,
    InvestmentModule,
    AccountModule,
    InstitutionModule,
    TransactionModule,
    CardModule,
    RecurringTransactionModule,
    QueueModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
