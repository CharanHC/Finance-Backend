import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type ValidateTarget = 'body' | 'query' | 'params';

export const validateRequest =
  <T>(schema: ZodSchema<T>, target: ValidateTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[target]);

    if (!result.success) {
      return next(
        new AppError(400, 'Validation failed', result.error.flatten())
      );
    }

    (req as any)[target] = result.data;
    next();
  };