import z from 'zod';

// Create Product Schema
export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().min(0),
});
export type CreateProductSchemaType = z.infer<typeof createProductSchema>;

// Product Response Schema
export const productResponseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ProductResponseSchemaType = z.infer<typeof productResponseSchema>;
