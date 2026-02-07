import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';
import { ProductUpdateInputDto } from '../dtos/product-update.input.dto';
import { UseCase } from '@/shared/application/useCases/use-case.interface';

export class UpdateProductUseCase
  implements UseCase<ProductUpdateInputDto, ProductOutputDto>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: ProductUpdateInputDto): Promise<ProductOutputDto> {
    const product = await this.productRepository.findById(input.id);
    product.updateName(input.name);
    product.updateDescription(input.description);
    product.updatePrice(input.price);
    product.updateStock(input.stock);
    product.updateUpdatedAt(new Date());
    await this.productRepository.update(product);
    return ProductOutputMapper.toOutput(product);
  }
}
