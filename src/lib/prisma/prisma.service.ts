import { Env } from '@/env';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  public prismaClient: PrismaClient;

  constructor(readonly configService: ConfigService<Env, true>) {
    super({
      log:
        configService.get('NODE_ENV', { infer: true }) === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
      datasources: {
        db: {
          url:
            configService.get('NODE_ENV', { infer: true }) === 'test'
              ? configService.get('DATABASE_TEST_URL', { infer: true })
              : configService.get('DATABASE_URL', { infer: true }),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established');

    // Soft-delete middleware: automatically exclude logically-deleted transactions
    // from all read operations without requiring manual `deletedAt: null` filters.
    this.$use(async (params, next) => {
      if (params.model === 'Transaction') {
        const readActions = [
          'findMany',
          'findFirst',
          'findUnique',
          'count',
          'aggregate',
          'groupBy',
        ];
        if (readActions.includes(params.action)) {
          params.args = params.args ?? {};
          params.args.where = { ...params.args.where, deletedAt: null };
        }
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    if (this.configService.get('NODE_ENV') === 'test') {
      console.log('NODE_ENV set to TEST mode');
      const tables = await this.$queryRaw<{ table_name: string }[]>(
        Prisma.sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`,
      );

      if (tables.length > 0) {
        console.log('Dropping tables');
      }
    }

    return this.$disconnect();
  }
}
