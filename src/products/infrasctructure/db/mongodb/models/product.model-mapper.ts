import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductModel } from './product.model';

export class ProductModelMapperMongoDB {
  static toDomain(model: ProductModel): ProductEntity {
    return new ProductEntity(
      {
        name: model.name,
        description: model.description,
        price: model.price,
        stock: model.stock,
      },
      model._id.toString()
    );
  }
}
