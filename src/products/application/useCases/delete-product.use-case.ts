import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { UseCase } from '@/shared/application/useCases/use-case.interface';

export class DeleteProductUseCase implements UseCase<string, void> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    await this.productRepository.findById(id);
    await this.productRepository.delete(id);
  }
}
