import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { InsertProductUseCase } from './insert-product.use-case';

const makeRepository = (): jest.Mocked<ProductRepository> => ({
  insert: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('InsertProductUseCase unit tests', () => {
  it('should create product, insert via repository and return output', async () => {
    const repository = makeRepository();
    const useCase = new InsertProductUseCase(repository);

    const input = {
      name: 'Product',
      description: 'Description',
      price: 100,
      stock: 10,
    };

    const output = await useCase.execute(input);

    expect(repository.insert).toHaveBeenCalledTimes(1);
    const insertedEntity = (repository.insert as jest.Mock).mock.calls[0][0];
    expect(insertedEntity).toBeInstanceOf(ProductEntity);
    expect(insertedEntity.name).toBe(input.name);
    expect(insertedEntity.description).toBe(input.description);
    expect(insertedEntity.price).toBe(input.price);
    expect(insertedEntity.stock).toBe(input.stock);

    expect(output).toMatchObject({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
    });
    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeDefined();
    expect(output.updatedAt).toBeDefined();
  });

  it('should throw when entity validation fails', async () => {
    const repository = makeRepository();
    const useCase = new InsertProductUseCase(repository);

    await expect(
      useCase.execute({
        name: '',
        description: 'Desc',
        price: 10,
        stock: 1,
      })
    ).rejects.toThrow('Name is required');

    await expect(
      useCase.execute({
        name: 'Name',
        description: '',
        price: 10,
        stock: 1,
      })
    ).rejects.toThrow('Description is required');

    await expect(
      useCase.execute({
        name: 'Name',
        description: 'Desc',
        price: 0,
        stock: 1,
      })
    ).rejects.toThrow('Price must be greater than 0');

    expect(repository.insert).not.toHaveBeenCalled();
  });
});
