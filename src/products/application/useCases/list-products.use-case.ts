import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<ProductOutputDto[]> {
    const products = await this.productRepository.findAll();
    return products.map(ProductOutputMapper.toOutput);
  }
}
