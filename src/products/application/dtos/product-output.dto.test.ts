import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductOutputMapper } from './product-output.dto';

describe('ProductOutputMapper unit tests', () => {
  describe('toOutput', () => {
    it('should map entity to output with all fields', () => {
      const entity = new ProductEntity({
        name: 'Product',
        description: 'Description',
        price: 100,
        stock: 10,
      });

      const output = ProductOutputMapper.toOutput(entity);

      expect(output.id).toBe(entity.id);
      expect(output.name).toBe('Product');
      expect(output.description).toBe('Description');
      expect(output.price).toBe(100);
      expect(output.stock).toBe(10);
      expect(output.createdAt).toBeInstanceOf(Date);
      expect(output.updatedAt).toBeInstanceOf(Date);
    });

    it('should use entity getters for createdAt and updatedAt', () => {
      const createdAt = new Date('2025-01-01');
      const updatedAt = new Date('2025-02-01');
      const entity = new ProductEntity(
        {
          name: 'Product',
          description: 'Desc',
          price: 50,
          stock: 5,
          createdAt,
          updatedAt,
        },
        'some-id'
      );

      const output = ProductOutputMapper.toOutput(entity);

      expect(output.createdAt).toEqual(createdAt);
      expect(output.updatedAt).toEqual(updatedAt);
      expect(output.id).toBe('some-id');
    });

    it('should include createdAt and updatedAt as Date when props have no dates', () => {
      const entity = new ProductEntity({
        name: 'A',
        description: 'B',
        price: 1,
        stock: 0,
      });

      const output = ProductOutputMapper.toOutput(entity);

      expect(output.createdAt).toBeInstanceOf(Date);
      expect(output.updatedAt).toBeInstanceOf(Date);
      expect(output).toMatchObject({
        id: entity.id,
        name: 'A',
        description: 'B',
        price: 1,
        stock: 0,
      });
    });
  });
});
