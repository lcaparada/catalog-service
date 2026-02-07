import fastify from 'fastify';
import { MongoDB } from '@/shared/infrastructure/db/mongodb/mongodb';
import { getStatusCode } from '@/shared/presentation/http/error-handler';
import { registerRoutes } from './products/presentation/routes';
import dotenv from 'dotenv';
dotenv.config();

export function bootstrap() {
  const isTest = process.env.NODE_ENV === 'test';
  const app = fastify({
    logger: isTest
      ? false
      : {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        },
  });

  app.setErrorHandler((error: Error, _request, reply) => {
    const err = error instanceof Error ? error : new Error(String(error));
    const statusCode = getStatusCode(err);
    app.log.error(err, err.message);
    reply.code(statusCode).send({
      statusCode,
      error: err.name || 'Error',
      message: err.message,
    });
  });
  return app;
}

const start = async () => {
  const app = bootstrap();
  const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
  const db = await MongoDB.connect(mongoUri);
  app.log.info('MongoDB connected');
  await registerRoutes(app, db);
  app.log.info('Routes registered');
  try {
    await app.listen({ port: Number(process.env.PORT) });
    app.log.info(`Server is running on ${process.env.PORT} 🔥`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  start();
}
