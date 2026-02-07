export const PRODUCT_EVENTS = {
  CREATED: 'catalog.product.created',
  UPDATED: 'catalog.product.updated',
  DELETED: 'catalog.product.deleted',
} as const;

export type ProductEventName =
  (typeof PRODUCT_EVENTS)[keyof typeof PRODUCT_EVENTS];

export interface ProductCreatedPayload {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string; // ISO
}

export interface ProductUpdatedPayload {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  updatedAt: string; // ISO
}

export interface ProductDeletedPayload {
  id: string;
  deletedAt: string; // ISO
}
