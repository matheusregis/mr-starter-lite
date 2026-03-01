import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

interface RequestWithUser extends Request {
  user?: {
    sub: string;
    email: string;
  };
  requestId?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.message : 'Internal server error';

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
          ? (exceptionResponse as { message: string | string[] }).message
          : message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log error with context
    this.logger.error(
      `${request.method} ${request.url} - ${status} ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      {
        requestId: request.requestId,
        userId: request.user?.sub,
        email: request.user?.email,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        statusCode: status,
        path: request.url,
        method: request.method,
        errorName: exception instanceof Error ? exception.name : 'Unknown',
        errorMessage: message,
      },
    );

    response.status(status).json(errorResponse);
  }
}
