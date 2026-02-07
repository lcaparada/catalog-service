import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found.error';
import { DeleteProductUseCase } from './delete-product.use-case';

const makeRepository = (): jest.Mocked<ProductRepository> => ({
  insert: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeEventPublisher = () => ({
  publish: jest.fn().mockResolvedValue(undefined),
});

describe('DeleteProductUseCase unit tests', () => {
  it('should find product then delete', async () => {
    const repository = makeRepository();
    const eventPublisher = makeEventPublisher();
    const entity = new ProductEntity(
      { name: 'Product', description: 'Desc', price: 10, stock: 1 },
      'product-id'
    );
    (repository.findById as jest.Mock).mockResolvedValue(entity);
    (repository.delete as jest.Mock).mockResolvedValue(undefined);

    const useCase = new DeleteProductUseCase(repository, eventPublisher);
    await useCase.execute('product-id');

    expect(repository.findById).toHaveBeenCalledWith('product-id');
    expect(repository.delete).toHaveBeenCalledWith('product-id');
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      'catalog.product.deleted',
      expect.objectContaining({ id: 'product-id' })
    );
  });

  it('should throw NotFoundError when product does not exist', async () => {
    const repository = makeRepository();
    (repository.findById as jest.Mock).mockRejectedValue(
      new NotFoundError('Product not found')
    );

    const useCase = new DeleteProductUseCase(repository, makeEventPublisher());

    await expect(useCase.execute('invalid-id')).rejects.toThrow(NotFoundError);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
