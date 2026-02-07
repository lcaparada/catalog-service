import { FastifyError } from 'fastify';
import { ConflictError } from '@/shared/domain/errors/conflict.error';
import { NotFoundError } from '@/shared/domain/errors/not-found.error';

export function getStatusCode(error: Error): number {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof Error && 'statusCode' in error) {
    return (error as FastifyError).statusCode ?? 500;
  }
  return 500;
}
