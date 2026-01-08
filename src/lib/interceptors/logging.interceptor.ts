import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

interface RequestInfo {
  message: string;
  details: Record<string, unknown>;
  response?: { statusCode?: number };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly sensitiveKeys = [
    'password',
    'token',
    'accessToken',
    'newPassword',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const { message, details, response } = this.extractRequestInfo(context);
    const detailsStr = this.formatDetails(details);

    return next.handle().pipe(
      tap({
        next: () => this.logSuccess(message, response, detailsStr, start),
        error: (err) => this.logError(message, err, detailsStr, start),
      }),
    );
  }

  private extractRequestInfo(context: ExecutionContext): RequestInfo {
    const isGraphQL = context.getType<string>() === 'graphql';

    if (isGraphQL) {
      const gql = GqlExecutionContext.create(context);
      const info = gql.getInfo<GraphQLResolveInfo>();
      const args = gql.getArgs();
      const req = gql.getContext().req;

      return {
        message: `GraphQL ${info.parentType.name} ${info.fieldName}`,
        details: this.buildDetails({
          operationName: info.operation?.name?.value,
          userId: req?.user?.id,
          args: Object.keys(args).length ? this.sanitize(args) : undefined,
        }),
        response: undefined,
      };
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return {
      message: `${req.method} ${req.url}`,
      details: this.buildDetails({
        userId: req.user?.id,
        query: Object.keys(req.query || {}).length ? req.query : undefined,
        body: Object.keys(req.body || {}).length
          ? this.sanitize(req.body)
          : undefined,
      }),
      response: res,
    };
  }

  private buildDetails(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined),
    );
  }

  private formatDetails(details: Record<string, unknown>): string {
    return Object.keys(details).length ? ` ${JSON.stringify(details)}` : '';
  }

  private logSuccess(
    message: string,
    response: { statusCode?: number } | undefined,
    details: string,
    start: number,
  ): void {
    const status = response?.statusCode || 200;
    const duration = Date.now() - start;
    this.logger.log(`${message} ${status}${details} +${duration}ms`);
  }

  private logError(
    message: string,
    error: Error & { status?: number; statusCode?: number },
    details: string,
    start: number,
  ): void {
    const status = error.status || error.statusCode || 500;
    const duration = Date.now() - start;
    this.logger.error(
      `${message} ${status}${details} ${error.message} +${duration}ms`,
    );
  }

  private sanitize(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (this.sensitiveKeys.includes(key)) return [key, '[REDACTED]'];
        if (typeof value === 'object' && value !== null) {
          return [key, this.sanitize(value as Record<string, unknown>)];
        }
        return [key, value];
      }),
    );
  }
}
