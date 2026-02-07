import { ObjectId } from 'mongodb';
import { ProductEntity, ProductProps } from '@/product/domain/entities/product.entity';

const makeProductProps = (overrides?: Partial<ProductProps>): ProductProps => ({
  name: 'Product Name',
  description: 'Product description',
  price: 100,
  stock: 10,
  ...overrides,
});

describe('ProductEntity unit tests', () => {
  describe('constructor', () => {
    it('should create product with valid props and generate id', () => {
      const props = makeProductProps();
      const product = new ProductEntity(props);

      expect(product.props).toStrictEqual(props);
      expect(product.id).not.toBeNull();
      expect(ObjectId.isValid(product.id)).toBeTruthy();
    });

    it('should accept a valid id when provided', () => {
      const props = makeProductProps();
      const id = new ObjectId().toString();
      const product = new ProductEntity(props, id);

      expect(ObjectId.isValid(product.id)).toBeTruthy();
      expect(product.id).toBe(id);
    });

    it('should throw when name is empty', () => {
      const props = makeProductProps({ name: '' });

      expect(() => new ProductEntity(props)).toThrow('Name is required');
    });

    it('should throw when description is empty', () => {
      const props = makeProductProps({ description: '' });

      expect(() => new ProductEntity(props)).toThrow('Description is required');
    });

    it('should throw when price is zero', () => {
      const props = makeProductProps({ price: 0 });

      expect(() => new ProductEntity(props)).toThrow(
        'Price must be greater than 0'
      );
    });

    it('should throw when price is negative', () => {
      const props = makeProductProps({ price: -1 });

      expect(() => new ProductEntity(props)).toThrow(
        'Price must be greater than 0'
      );
    });
  });

  describe('getters', () => {
    it('should return name, description, price and stock', () => {
      const props = makeProductProps({
        name: 'Test Product',
        description: 'Test desc',
        price: 50,
        stock: 5,
      });
      const product = new ProductEntity(props);

      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test desc');
      expect(product.price).toBe(50);
      expect(product.stock).toBe(5);
    });

    it('should return createdAt when provided', () => {
      const date = new Date('2025-01-01');
      const props = makeProductProps({ createdAt: date });
      const product = new ProductEntity(props);

      expect(product.createdAt).toEqual(date);
    });

    it('should return new Date for createdAt when not provided', () => {
      const props = makeProductProps();
      const product = new ProductEntity(props);

      expect(product.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt when provided', () => {
      const date = new Date('2025-02-01');
      const props = makeProductProps({ updatedAt: date });
      const product = new ProductEntity(props);

      expect(product.updatedAt).toEqual(date);
    });
  });

  describe('update methods', () => {
    it('should update name', () => {
      const product = new ProductEntity(makeProductProps());
      product.updateName('New Name');

      expect(product.name).toBe('New Name');
    });

    it('should update description', () => {
      const product = new ProductEntity(makeProductProps());
      product.updateDescription('New description');

      expect(product.description).toBe('New description');
    });

    it('should update price', () => {
      const product = new ProductEntity(makeProductProps());
      product.updatePrice(200);

      expect(product.price).toBe(200);
    });

    it('should update stock', () => {
      const product = new ProductEntity(makeProductProps());
      product.updateStock(20);

      expect(product.stock).toBe(20);
    });

    it('should update updatedAt', () => {
      const product = new ProductEntity(makeProductProps());
      const date = new Date('2025-03-01');
      product.updateUpdatedAt(date);

      expect(product.updatedAt).toEqual(date);
    });
  });

  describe('setters', () => {
    it('should set name, description, price, stock and updatedAt', () => {
      const product = new ProductEntity(makeProductProps());

      product.name = 'Set Name';
      product.description = 'Set desc';
      product.price = 75;
      product.stock = 15;
      const date = new Date();
      product.updatedAt = date;

      expect(product.name).toBe('Set Name');
      expect(product.description).toBe('Set desc');
      expect(product.price).toBe(75);
      expect(product.stock).toBe(15);
      expect(product.updatedAt).toEqual(date);
    });
  });

  describe('toJSON', () => {
    it('should convert product to json', () => {
      const props = makeProductProps({
        name: 'JSON Product',
        description: 'JSON desc',
        price: 99,
        stock: 1,
      });
      const id = new ObjectId().toString();
      const product = new ProductEntity(props, id);

      expect(product.toJSON()).toStrictEqual({
        id,
        ...props,
      });
    });
  });
});
