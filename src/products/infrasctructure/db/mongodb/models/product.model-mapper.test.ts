import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ObjectId } from 'mongodb';
import { ProductModelMapperMongoDB } from './product.model-mapper';
import { ProductModel } from './product.model';

const makeProductModel = (
  overrides?: Partial<ProductModel>
): ProductModel => ({
  _id: new ObjectId(),
  name: 'Product Name',
  description: 'Product description',
  price: 100,
  stock: 10,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-02'),
  ...overrides,
});

describe('ProductModelMapperMongoDB unit tests', () => {
  describe('toDomain', () => {
    it('should map ProductModel to ProductEntity', () => {
      const id = new ObjectId();
      const model = makeProductModel({
        _id: id,
        name: 'Notebook',
        description: 'High performance',
        price: 2500,
        stock: 5,
      });

      const entity = ProductModelMapperMongoDB.toDomain(model);

      expect(entity).toBeInstanceOf(ProductEntity);
      expect(entity.id).toBe(id.toString());
      expect(entity.name).toBe('Notebook');
      expect(entity.description).toBe('High performance');
      expect(entity.price).toBe(2500);
      expect(entity.stock).toBe(5);
    });

    it('should map model with minimal data', () => {
      const id = new ObjectId();
      const model = makeProductModel({
        _id: id,
        name: 'A',
        description: 'B',
        price: 1,
        stock: 0,
      });

      const entity = ProductModelMapperMongoDB.toDomain(model);

      expect(entity.id).toBe(id.toString());
      expect(entity.name).toBe('A');
      expect(entity.description).toBe('B');
      expect(entity.price).toBe(1);
      expect(entity.stock).toBe(0);
    });

    it('should not pass createdAt and updatedAt to entity props', () => {
      const model = makeProductModel({
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2020-02-01'),
      });

      const entity = ProductModelMapperMongoDB.toDomain(model);

      expect(entity.props).not.toHaveProperty('createdAt');
      expect(entity.props).not.toHaveProperty('updatedAt');
      expect(entity.name).toBe(model.name);
      expect(entity.description).toBe(model.description);
    });
  });
});
