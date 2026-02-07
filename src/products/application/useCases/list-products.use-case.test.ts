import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ListProductsUseCase } from './list-products.use-case';

const makeRepository = (): jest.Mocked<ProductRepository> => ({
  insert: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ListProductsUseCase unit tests', () => {
  it('should return empty array when no products', async () => {
    const repository = makeRepository();
    (repository.findAll as jest.Mock).mockResolvedValue([]);

    const useCase = new ListProductsUseCase(repository);
    const output = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(output).toEqual([]);
  });

  it('should return list of product outputs', async () => {
    const repository = makeRepository();
    const entities = [
      new ProductEntity(
        { name: 'Product 1', description: 'Desc 1', price: 10, stock: 1 },
        'id-1'
      ),
      new ProductEntity(
        { name: 'Product 2', description: 'Desc 2', price: 20, stock: 2 },
        'id-2'
      ),
    ];
    (repository.findAll as jest.Mock).mockResolvedValue(entities);

    const useCase = new ListProductsUseCase(repository);
    const output = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ id: 'id-1', name: 'Product 1', price: 10 });
    expect(output[1]).toMatchObject({ id: 'id-2', name: 'Product 2', price: 20 });
  });
});
