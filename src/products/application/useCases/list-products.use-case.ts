import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';
import { UseCase } from '@/shared/application/useCases/use-case.interface';

export class ListProductsUseCase implements UseCase<void, ProductOutputDto[]> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<ProductOutputDto[]> {
    const products = await this.productRepository.findAll();
    return products.map(ProductOutputMapper.toOutput);
  }
}
