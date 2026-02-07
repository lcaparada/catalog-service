import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';
import { UseCase } from '@/shared/application/useCases/use-case.interface';

export class GetProductUseCase implements UseCase<string, ProductOutputDto> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<ProductOutputDto> {
    const product = await this.productRepository.findById(id);
    return ProductOutputMapper.toOutput(product);
  }
}
