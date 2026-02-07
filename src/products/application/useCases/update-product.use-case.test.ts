import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found.error';
import { UpdateProductUseCase } from './update-product.use-case';

const makeRepository = (): jest.Mocked<ProductRepository> => ({
  insert: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UpdateProductUseCase unit tests', () => {
  it('should find product, update props, call repository.update and return output', async () => {
    const repository = makeRepository();
    const entity = new ProductEntity(
      { name: 'Old', description: 'Old desc', price: 10, stock: 1 },
      'product-id'
    );
    (repository.findById as jest.Mock).mockResolvedValue(entity);

    const useCase = new UpdateProductUseCase(repository);
    const input = {
      id: 'product-id',
      name: 'New Name',
      description: 'New desc',
      price: 99,
      stock: 5,
    };

    const output = await useCase.execute(input);

    expect(repository.findById).toHaveBeenCalledWith('product-id');
    expect(repository.update).toHaveBeenCalledTimes(1);
    const updatedEntity = (repository.update as jest.Mock).mock.calls[0][0];
    expect(updatedEntity.name).toBe(input.name);
    expect(updatedEntity.description).toBe(input.description);
    expect(updatedEntity.price).toBe(input.price);
    expect(updatedEntity.stock).toBe(input.stock);
    expect(output).toMatchObject({
      id: 'product-id',
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
    });
  });

  it('should throw NotFoundError when product does not exist', async () => {
    const repository = makeRepository();
    (repository.findById as jest.Mock).mockRejectedValue(
      new NotFoundError('Product not found')
    );

    const useCase = new UpdateProductUseCase(repository);

    await expect(
      useCase.execute({
        id: 'invalid',
        name: 'A',
        description: 'B',
        price: 1,
        stock: 0,
      })
    ).rejects.toThrow(NotFoundError);

    expect(repository.update).not.toHaveBeenCalled();
  });
});
