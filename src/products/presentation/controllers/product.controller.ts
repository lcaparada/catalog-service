import { FastifyRequest, FastifyReply } from 'fastify';
import { InsertProductUseCase } from '@/products/application/useCases/insert-product.use-case';
import { GetProductUseCase } from '@/products/application/useCases/get-product.use-case';
import { UpdateProductUseCase } from '@/products/application/useCases/update-product.use-case';
import { DeleteProductUseCase } from '@/products/application/useCases/delete-product.use-case';
import { CreateProductSchemaType } from '../schemas/product.schemas';

export class ProductController {
  constructor(
    private readonly insertProductUseCase: InsertProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as CreateProductSchemaType;
    const { name, description, price, stock } = body;
    const product = await this.insertProductUseCase.execute({
      name,
      description,
      price,
      stock,
    });
    return reply.status(201).send(product);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const product = await this.getProductUseCase.execute(id);
    return reply.send(product);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as CreateProductSchemaType;
    const product = await this.updateProductUseCase.execute({
      id,
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
    });
    return reply.send(product);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.deleteProductUseCase.execute(id);
    return reply.code(204).send();
  }
}
