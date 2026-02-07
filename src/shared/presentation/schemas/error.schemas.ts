import { z } from 'zod';

export const errorResponseSchema = z.object({
  statusCode: z.number().describe('Código HTTP'),
  error: z.string().describe('Nome do erro (ex: NotFoundError, ConflictError)'),
  message: z.string().describe('Mensagem legível'),
});

export type ErrorResponseSchemaType = z.infer<typeof errorResponseSchema>;

export const badRequestErrorSchema = errorResponseSchema.extend({
  statusCode: z.literal(400),
});

export const notFoundErrorSchema = errorResponseSchema.extend({
  statusCode: z.literal(404),
  error: z.literal('NotFoundError'),
});

export const conflictErrorSchema = errorResponseSchema.extend({
  statusCode: z.literal(409),
  error: z.literal('ConflictError'),
});

export const internalServerErrorSchema = errorResponseSchema.extend({
  statusCode: z.literal(500),
});
