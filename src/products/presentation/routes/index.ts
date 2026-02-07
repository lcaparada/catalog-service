import { Db } from 'mongodb';
import { productRoutes } from './product.routes';
import { FastifyInstance } from 'fastify';

export async function registerRoutes(app: FastifyInstance, db: Db) {
  await app.register(
    async (instance) => {
      await productRoutes(instance, db);
    },
    { prefix: '/api/v1' }
  );
}
