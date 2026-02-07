import { RepositoryInterface } from '@/shared/domain/repositories/repository.interface';
import { ProductEntity } from '../entities/product.entity';

export interface ProductRepository extends RepositoryInterface<ProductEntity> {}
