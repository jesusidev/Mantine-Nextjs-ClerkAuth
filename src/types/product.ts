import { z } from 'zod';
import { type RouterOutputs } from '~/utils/api';

export type Product = RouterOutputs['product']['get'];

export const productInput = z.object({
  name: z.string(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  isFavorite: z.boolean().optional(),
  quantity: z.number().optional(),
  projectId: z.string().optional(),
});

export const updateProductInput = z.object({
  id: z.string(),
  name: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  isFavorite: z.boolean().optional(),
  categoryName: z.string().optional(),
});
