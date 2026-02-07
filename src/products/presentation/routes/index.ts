import { EventPublisher } from '@/shared/application/events/event-publisher.interface';
import { Db } from 'mongodb';
import { FastifyInstance } from 'fastify';
import { productRoutes } from './product.routes';

export async function registerRoutes(
  app: FastifyInstance,
  db: Db,
  eventPublisher: EventPublisher
) {
  await app.register(
    async (instance) => {
      await productRoutes(instance, db, eventPublisher);
    },
    { prefix: '/api/v1' }
  );
}
