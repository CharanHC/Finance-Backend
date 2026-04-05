import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

type TokenPayload = {
  userId: string;
  role: 'VIEWER' | 'ANALYST' | 'ADMIN';
};

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return next(new AppError(401, 'Unauthorized: token missing'));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return next(new AppError(401, 'Unauthorized: user not found'));
    }

    if (user.status !== 'ACTIVE') {
      return next(new AppError(403, 'Account is inactive'));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch {
    next(new AppError(401, 'Unauthorized: invalid token'));
  }
};