import fastify from 'fastify';
import { NoOpEventPublisher } from '@/shared/application/events/noop-event-publisher';
import { EventPublisher } from '@/shared/application/events/event-publisher.interface';
import { MongoDB } from '@/shared/infrastructure/db/mongodb/mongodb';
import { RabbitMQ } from '@/shared/infrastructure/messaging/rabbitmq/rabbitmq';
import { RabbitMQEventPublisher } from '@/shared/infrastructure/messaging/rabbitmq/rabbitmq-event-publisher';
import { getStatusCode } from '@/shared/presentation/http/error-handler';
import { registerRoutes } from './products/presentation/routes';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
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
  }).withTypeProvider<ZodTypeProvider>();

  app.setSerializerCompiler(serializerCompiler);
  app.setValidatorCompiler(validatorCompiler);

  app.register(swagger, {
    openapi: {
      info: {
        title: 'Catalog Service API',
        description: 'Catalog Service API',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
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

  let eventPublisher: EventPublisher = new NoOpEventPublisher();
  const rabbitMqUri = process.env.RABBITMQ_URI;
  if (rabbitMqUri) {
    try {
      await RabbitMQ.connect(rabbitMqUri);
      eventPublisher = new RabbitMQEventPublisher();
      app.log.info('RabbitMQ connected');
    } catch (err) {
      app.log.warn('RabbitMQ unavailable, events will not be published: %s', err);
    }
  }

  await registerRoutes(app, db, eventPublisher);
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
