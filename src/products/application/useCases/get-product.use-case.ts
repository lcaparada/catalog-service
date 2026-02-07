import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';

export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<ProductOutputDto> {
    const product = await this.productRepository.findById(id);
    return ProductOutputMapper.toOutput(product);
  }
}
