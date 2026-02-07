import { FastifyRequest, FastifyReply } from 'fastify';
import { InsertProductUseCase } from '@/products/application/useCases/insert-product.use-case';
import { GetProductUseCase } from '@/products/application/useCases/get-product.use-case';
import { ProductInputDto } from '@/products/application/dtos/product.input.dto';

export class ProductController {
  constructor(
    private readonly insertProductUseCase: InsertProductUseCase,
    private readonly getProductUseCase: GetProductUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as ProductInputDto;
    const { name, description, price, stock } = body;
    const product = await this.insertProductUseCase.execute({
      name,
      description,
      price,
      stock,
    });
    return reply.code(201).send(product);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const product = await this.getProductUseCase.execute(id);
    return reply.send(product);
  }
}
