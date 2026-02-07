import { EventPublisher } from '@/shared/application/events/event-publisher.interface';
import { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/product.controller';
import { ProductMongoDBRepository } from '@/products/infrasctructure/repositories/product.mongodb.repository';
import { InsertProductUseCase } from '@/products/application/useCases/insert-product.use-case';
import { GetProductUseCase } from '@/products/application/useCases/get-product.use-case';
import { UpdateProductUseCase } from '@/products/application/useCases/update-product.use-case';
import { DeleteProductUseCase } from '@/products/application/useCases/delete-product.use-case';
import { Db } from 'mongodb';
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
} from '@/shared/presentation/schemas/error.schemas';
import { createProductSchema, productResponseSchema } from '../schemas/product.schemas';
import z from 'zod';

export async function productRoutes(
  app: FastifyInstance,
  db: Db,
  eventPublisher: EventPublisher
) {
  const productRepository = new ProductMongoDBRepository(db);
  const insertProductUseCase = new InsertProductUseCase(
    productRepository,
    eventPublisher
  );
  const getProductUseCase = new GetProductUseCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(
    productRepository,
    eventPublisher
  );
  const deleteProductUseCase = new DeleteProductUseCase(
    productRepository,
    eventPublisher
  );
  const productController = new ProductController(
    insertProductUseCase,
    getProductUseCase,
    updateProductUseCase,
    deleteProductUseCase
  );

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

  app.put(
    '/products/:id',
    {
      schema: {
        params: z.object({ id: z.string() }),
        body: createProductSchema,
        tags: ['Products'],
        description: 'Update a product',
        response: {
          200: productResponseSchema,
          404: notFoundErrorSchema,
          400: badRequestErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    (request, reply) => productController.update(request, reply)
  );

  app.delete(
    '/products/:id',
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ['Products'],
        description: 'Delete a product',
        response: {
          204: z.object({}).describe('No content'),
          404: notFoundErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    (request, reply) => productController.delete(request, reply)
  );
}
