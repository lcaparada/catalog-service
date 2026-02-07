import { EventPublisher } from '@/shared/application/events/event-publisher.interface';
import { UseCase } from '@/shared/application/useCases/use-case.interface';
import { PRODUCT_EVENTS } from '@/products/domain/events/product.events';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

export class DeleteProductUseCase implements UseCase<string, void> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(id: string): Promise<void> {
    await this.productRepository.findById(id);
    await this.productRepository.delete(id);
    await this.eventPublisher.publish(PRODUCT_EVENTS.DELETED, {
      id,
      deletedAt: new Date().toISOString(),
    });
  }
}
