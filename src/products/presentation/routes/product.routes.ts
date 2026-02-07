import { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/product.controller';
import { ProductMongoDBRepository } from '@/products/infrasctructure/repositories/product.mongodb.repository';
import { InsertProductUseCase } from '@/products/application/useCases/insert-product.use-case';
import { GetProductUseCase } from '@/products/application/useCases/get-product.use-case';
import { Db } from 'mongodb';
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
} from '@/shared/presentation/schemas/error.schemas';
import { createProductSchema, productResponseSchema } from '../schemas/product.schemas';
import z from 'zod';

export async function productRoutes(app: FastifyInstance, db: Db) {
  const productRepository = new ProductMongoDBRepository(db);
  const insertProductUseCase = new InsertProductUseCase(productRepository);
  const getProductUseCase = new GetProductUseCase(productRepository);
  const productController = new ProductController(insertProductUseCase, getProductUseCase);

  app.post(
    '/products',
    {
      schema: {
        body: createProductSchema,
        tags: ['Products'],
        description: 'Create a new product',
        response: {
          201: productResponseSchema,
          400: badRequestErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    (request, reply) => productController.create(request, reply)
  );

  app.get(
    '/products/:id',
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ['Products'],
        description: 'Get a product by id',
        response: {
          200: productResponseSchema,
          404: notFoundErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    (request, reply) => productController.getById(request, reply)
  );
}
