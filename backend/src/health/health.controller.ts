import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Public()
  @Get()
  async check() {
    const dbStatus =
      this.connection.readyState === ConnectionStates.connected ? 'connected' : 'disconnected';

    const isHealthy = dbStatus === 'connected';

    return {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: {
        status: dbStatus,
        name: this.connection.name,
      },
    };
  }
}
