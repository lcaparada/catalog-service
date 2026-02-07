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
    ProductEntity.validate(props);
    super(props, id);
  }

  static validate(props: ProductProps) {
    if (props.name.length === 0) {
      throw new Error('Name is required');
    }
    if (props.description.length === 0) {
      throw new Error('Description is required');
    }
    if (props.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
  }

  updateName(value: string): void {
    this.props.name = value;
  }

  updateDescription(value: string): void {
    this.props.description = value;
  }

  updatePrice(value: number): void {
    this.props.price = value;
  }

  updateStock(value: number): void {
    this.props.stock = value;
  }

  updateUpdatedAt(value: Date): void {
    this.props.updatedAt = value;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get stock(): number {
    return this.props.stock;
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }

  set name(value: string) {
    this.props.name = value;
  }

  set description(value: string) {
    this.props.description = value;
  }

  set price(value: number) {
    this.props.price = value;
  }

  set stock(value: number) {
    this.props.stock = value;
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }
}
