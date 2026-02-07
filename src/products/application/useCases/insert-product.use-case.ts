import { EventPublisher } from '@/shared/application/events/event-publisher.interface';
import { UseCase } from '@/shared/application/useCases/use-case.interface';
import { ProductInputDto } from '../dtos/product.input.dto';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { PRODUCT_EVENTS } from '@/products/domain/events/product.events';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

export class InsertProductUseCase implements UseCase<ProductInputDto, ProductOutputDto> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: ProductInputDto): Promise<ProductOutputDto> {
    const product = new ProductEntity({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
    });
    await this.productRepository.insert(product);
    const output = ProductOutputMapper.toOutput(product);
    await this.eventPublisher.publish(PRODUCT_EVENTS.CREATED, {
      id: output.id,
      name: output.name,
      description: output.description,
      price: output.price,
      stock: output.stock,
      createdAt: output.createdAt.toISOString(),
    });
    return output;
  }
}
