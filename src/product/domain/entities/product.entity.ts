import { Entity } from '@/shared/domain/entities/entity';

export interface ProductProps {
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductEntity extends Entity<ProductProps> {
  constructor(props: ProductProps, id?: string) {
    super(props, id);
  }
}
