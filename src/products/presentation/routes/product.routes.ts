import { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/product.controller';
import { ProductMongoDBRepository } from '@/products/infrasctructure/repositories/product.mongodb.repository';
import { InsertProductUseCase } from '@/products/application/useCases/insert-product.use-case';
import { GetProductUseCase } from '@/products/application/useCases/get-product.use-case';
import { Db } from 'mongodb';

export async function productRoutes(app: FastifyInstance, db: Db) {
  const productRepository = new ProductMongoDBRepository(db);
  const insertProductUseCase = new InsertProductUseCase(productRepository);
  const getProductUseCase = new GetProductUseCase(productRepository);
  const productController = new ProductController(insertProductUseCase, getProductUseCase);

  app.post('/products', (request, reply) => productController.create(request, reply));
  app.get('/products/:id', (request, reply) => productController.getById(request, reply));
}
