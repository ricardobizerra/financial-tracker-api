import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // If it's not an HTTP request (e.g. WebSocket), we might need different handling
    // For now, let's assume standard GQL/HTTP context.
    if (!req || !req.method) {
      return true;
    }

    // Allow Safe Methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return true;
    }

    // Check for Custom Header
    const csrfHeader = req.headers['x-requested-with'];

    if (!csrfHeader || csrfHeader !== 'XmlHttpRequest') {
      throw new UnauthorizedException('Invalid or Missing CSRF Header');
    }

    return true;
  }
}
