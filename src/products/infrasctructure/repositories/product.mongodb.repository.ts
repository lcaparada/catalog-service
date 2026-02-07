import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found.error';
import { Db, ObjectId } from 'mongodb';
import { ProductModelMapperMongoDB } from '../db/mongodb/models/product.model-mapper';
import { ProductModel } from '../db/mongodb/models/product.model';

export class ProductMongoDBRepository implements ProductRepository {
  private readonly collectionName = 'products';

  constructor(private readonly mongodb: Db) {}
  async insert(entity: ProductEntity): Promise<void> {
    try {
      const { id, ...props } = entity.toJSON();
      const now = new Date();
      await this.mongodb.collection(this.collectionName).insertOne({
        _id: new ObjectId(id),
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      });
    } catch (error) {
      throw new Error('Error inserting product');
    }
  }

  async findById(id: string): Promise<ProductEntity> {
    try {
      const product = await this.mongodb
        .collection<ProductModel>(this.collectionName)
        .findOne({ _id: new ObjectId(id) });
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      return ProductModelMapperMongoDB.toDomain(product);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new Error('Error finding product');
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    try {
      const products = await this.mongodb
        .collection<ProductModel>(this.collectionName)
        .find()
        .toArray();
      return products.map(ProductModelMapperMongoDB.toDomain);
    } catch (error) {
      throw new Error('Error finding all products');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.mongodb.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

  async update(entity: ProductEntity): Promise<void> {
    try {
      const { createdAt: _, updatedAt: __, ...props } = entity.toJSON();
      await this.mongodb
        .collection<ProductModel>(this.collectionName)
        .updateOne({ _id: new ObjectId(entity.id) }, { $set: { ...props, updatedAt: new Date() } });
    } catch (error) {
      throw new Error('Error updating product');
    }
  }
}
