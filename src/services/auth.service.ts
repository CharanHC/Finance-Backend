import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, User } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const sanitizeUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const createToken = (userId: string, role: Role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existing) {
      throw new AppError(409, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        password: hashedPassword,
        role: 'VIEWER',
        status: 'ACTIVE'
      }
    });

    const token = createToken(user.id, user.role);

    return {
      token,
      user: sanitizeUser(user)
    };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError(403, 'Account is inactive');
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = createToken(user.id, user.role);

    return {
      token,
      user: sanitizeUser(user)
    };
  }
};