import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

interface RequestWithUser extends Request {
  user?: {
    sub: string;
    email: string;
  };
  requestId?: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithUser>();
    const response = http.getResponse<Response>();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const requestId = request.requestId;
    const userId = request.user?.sub;
    const email = request.user?.email;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;

          this.logger.log(`${method} ${url} ${statusCode} - ${responseTime}ms`, {
            requestId,
            userId,
            email,
            method,
            url,
            statusCode,
            responseTime,
            ip,
            userAgent,
          });
        },
        error: (error: Error & { status?: number }) => {
          const responseTime = Date.now() - now;

          this.logger.error(
            `${method} ${url} ${error.status || 500} - ${responseTime}ms`,
            error.stack,
            {
              requestId,
              userId,
              email,
              method,
              url,
              statusCode: error.status || 500,
              responseTime,
              ip,
              userAgent,
              errorName: error.name,
              errorMessage: error.message,
            },
          );
        },
      }),
    );
  }
}
