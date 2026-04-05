import { z } from 'zod';

export const recentActivityQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional().default(10)
});