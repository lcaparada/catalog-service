import { ProductEntity } from '@/products/domain/entities/product.entity';

export interface ProductOutputDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductOutputMapper {
  static toOutput(entity: ProductEntity): ProductOutputDto {
    const json = entity.toJSON();
    return {
      ...json,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
