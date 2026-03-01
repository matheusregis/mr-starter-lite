import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import pino, { Logger as PinoLogger } from 'pino';

export interface LogContext {
  requestId?: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: PinoLogger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
                singleLine: false,
              },
            }
          : undefined,
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  /**
   * Log informational message
   */
  log(message: string, context?: LogContext) {
    this.logger.info(context || {}, message);
  }

  /**
   * Log error message
   */
  error(message: string, trace?: string, context?: LogContext) {
    this.logger.error(
      {
        ...context,
        trace,
      },
      message,
    );
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext) {
    this.logger.warn(context || {}, message);
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext) {
    this.logger.debug(context || {}, message);
  }

  /**
   * Log verbose message
   */
  verbose(message: string, context?: LogContext) {
    this.logger.trace(context || {}, message);
  }

  /**
   * Get raw Pino logger instance
   */
  getRawLogger(): PinoLogger {
    return this.logger;
  }

  /**
   * Create child logger with bound context
   */
  child(bindings: LogContext): LoggerService {
    const childLogger = new LoggerService();
    childLogger.logger = this.logger.child(bindings);
    return childLogger;
  }
}
