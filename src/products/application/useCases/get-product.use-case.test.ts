import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found.error';
import { GetProductUseCase } from './get-product.use-case';

const makeRepository = (): jest.Mocked<ProductRepository> => ({
  insert: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('GetProductUseCase unit tests', () => {
  it('should return product output when found', async () => {
    const repository = makeRepository();
    const entity = new ProductEntity(
      { name: 'Product', description: 'Desc', price: 50, stock: 5 },
      'product-id-123'
    );
    (repository.findById as jest.Mock).mockResolvedValue(entity);

    const useCase = new GetProductUseCase(repository);
    const output = await useCase.execute('product-id-123');

    expect(repository.findById).toHaveBeenCalledWith('product-id-123');
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(output).toMatchObject({
      id: 'product-id-123',
      name: 'Product',
      description: 'Desc',
      price: 50,
      stock: 5,
    });
    expect(output.createdAt).toBeDefined();
    expect(output.updatedAt).toBeDefined();
  });

  it('should throw NotFoundError when product does not exist', async () => {
    const repository = makeRepository();
    (repository.findById as jest.Mock).mockRejectedValue(
      new NotFoundError('Product not found')
    );

    const useCase = new GetProductUseCase(repository);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(NotFoundError);
    await expect(useCase.execute('invalid-id')).rejects.toThrow('Product not found');
    expect(repository.findById).toHaveBeenCalledWith('invalid-id');
  });
});
