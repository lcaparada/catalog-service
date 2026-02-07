import { ObjectId } from 'mongodb';

export type ProductModel = {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};
