import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';
import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from '@/lib/interceptors/logging.interceptor';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<Env, true>>(ConfigService);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(cookieParser());

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const port = configService.get('PORT', { infer: true });

  await app.listen(port ?? 3333, '0.0.0.0');
  logger.log(`Application is running on port ${port ?? 3333}`);
}
bootstrap();
