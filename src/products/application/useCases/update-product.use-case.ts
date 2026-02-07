import { EventPublisher } from '@/shared/application/events/event-publisher.interface';
import { UseCase } from '@/shared/application/useCases/use-case.interface';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';
import { ProductUpdateInputDto } from '../dtos/product-update.input.dto';
import { PRODUCT_EVENTS } from '@/products/domain/events/product.events';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

export class UpdateProductUseCase
  implements UseCase<ProductUpdateInputDto, ProductOutputDto>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: ProductUpdateInputDto): Promise<ProductOutputDto> {
    const product = await this.productRepository.findById(input.id);
    product.updateName(input.name);
    product.updateDescription(input.description);
    product.updatePrice(input.price);
    product.updateStock(input.stock);
    product.updateUpdatedAt(new Date());
    await this.productRepository.update(product);
    const output = ProductOutputMapper.toOutput(product);
    await this.eventPublisher.publish(PRODUCT_EVENTS.UPDATED, {
      id: output.id,
      name: output.name,
      description: output.description,
      price: output.price,
      stock: output.stock,
      updatedAt: output.updatedAt.toISOString(),
    });
    return output;
  }
}
