import { ProductEntity } from '@/products/domain/entities/product.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found.error';
import { MongoClient } from 'mongodb';
import { ProductMongoDBRepository } from './product.mongodb.repository';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017';
const TEST_DB = 'catalog_service_test';
const COLLECTION = 'products';

describe('ProductMongoDBRepository integration tests', () => {
  let client: MongoClient;
  let repository: ProductMongoDBRepository;

  beforeAll(async () => {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(TEST_DB);
    repository = new ProductMongoDBRepository(db);
  });

  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await client.db(TEST_DB).collection(COLLECTION).deleteMany({});
  });

  const makeProduct = (overrides?: Partial<{ name: string; description: string; price: number; stock: number }>) =>
    new ProductEntity({
      name: 'Product Test',
      description: 'Description test',
      price: 100,
      stock: 10,
      ...overrides,
    });

  describe('insert and findById', () => {
    it('should insert and find product by id', async () => {
      const product = makeProduct({ name: 'Notebook', price: 2500 });

      await repository.insert(product);

      const found = await repository.findById(product.id);
      expect(found.id).toBe(product.id);
      expect(found.name).toBe('Notebook');
      expect(found.description).toBe(product.description);
      expect(found.price).toBe(2500);
      expect(found.stock).toBe(product.stock);
    });

    it('should throw NotFoundError when findById with non-existent id', async () => {
      await expect(
        repository.findById('507f1f77bcf86cd799439011')
      ).rejects.toThrow(NotFoundError);

      await expect(
        repository.findById('507f1f77bcf86cd799439011')
      ).rejects.toThrow('Product not found');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no products', async () => {
      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });

    it('should return all products', async () => {
      const p1 = makeProduct({ name: 'Product 1' });
      const p2 = makeProduct({ name: 'Product 2', price: 200 });

      await repository.insert(p1);
      await repository.insert(p2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      const names = result.map((r) => r.name).sort();
      expect(names).toEqual(['Product 1', 'Product 2']);
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const product = makeProduct({ name: 'Original', stock: 5 });
      await repository.insert(product);

      product.updateName('Updated Name');
      product.updatePrice(999);
      product.updateStock(20);
      await repository.update(product);

      const found = await repository.findById(product.id);
      expect(found.name).toBe('Updated Name');
      expect(found.price).toBe(999);
      expect(found.stock).toBe(20);
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      const product = makeProduct();
      await repository.insert(product);

      await repository.delete(product.id);

      await expect(repository.findById(product.id)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should not throw when deleting non-existent id', async () => {
      await expect(
        repository.delete('507f1f77bcf86cd799439011')
      ).resolves.not.toThrow();
    });
  });
});
