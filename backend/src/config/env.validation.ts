import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3001),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  FRONTEND_URL: z.string().min(1),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Environment = z.infer<typeof envSchema>;

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `❌ ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    const errorMessage = `\n🚨 Environment Validation Failed!\n\n${messages}\n\n💡 Fix your .env configuration.\n`;

    if (process.env.NODE_ENV === 'test') {
      throw new Error(errorMessage);
    }

    console.error(errorMessage);
    process.exit(1);
  }

  return result.data;
}
