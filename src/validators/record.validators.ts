import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().trim().min(2, 'Category is required'),
  date: z.coerce.date(),
  note: z.string().trim().max(500).optional().nullable()
});

export const updateRecordSchema = z
  .object({
    amount: z.coerce.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().trim().min(2).optional(),
    date: z.coerce.date().optional(),
    note: z.string().trim().max(500).optional().nullable()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required'
  });

export const recordIdParamSchema = z.object({
  id: z.string().min(1, 'Record id is required')
});

export const recordListQuerySchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  sortBy: z.enum(['date', 'createdAt', 'amount']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});