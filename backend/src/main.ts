import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { validateEnv } from './config/env.validation';

async function bootstrap() {
  // Validate environment variables FIRST
  const env = validateEnv();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: false,
  });

  // Logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Global Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy:
        env.NODE_ENV === 'production'
          ? {
              directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
              },
            }
          : false, // Disable CSP in development
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // CORS
  app.enableCors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = env.PORT;
  await app.listen(port);

  logger.log('Application is running', {
    port,
    environment: env.NODE_ENV,
    url: `http://localhost:${port}`,
  });
}

void bootstrap();
