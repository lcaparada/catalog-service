import { UseCase } from '@/shared/application/useCases/use-case.interface';
import { ProductInputDto } from '../dtos/product.input.dto';
import { ProductOutputDto, ProductOutputMapper } from '../dtos/product-output.dto';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ProductEntity } from '@/products/domain/entities/product.entity';

export class InsertProductUseCase implements UseCase<ProductInputDto, ProductOutputDto> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: ProductInputDto): Promise<ProductOutputDto> {
    const product = new ProductEntity({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
    });
    await this.productRepository.insert(product);
    return ProductOutputMapper.toOutput(product);
  }
}
