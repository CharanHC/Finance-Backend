import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
      errors: null
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && isProduction
        ? 'Internal server error'
        : err.message || 'Internal server error',
    errors: err.details ?? err.errors ?? null
  });
};