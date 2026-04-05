import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE')
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required'
  });

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE'])
});

export const userIdParamSchema = z.object({
  id: z.string().min(1, 'User id is required')
});

export const userListQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10)
});