import bcrypt from 'bcryptjs';
import { Prisma, Role, Status } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const sanitizeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const userService = {
  async createUser(input: {
    name: string;
    email: string;
    password: string;
    role: Role;
    status?: Status;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
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
        role: input.role,
        status: input.status ?? 'ACTIVE'
      }
    });

    return sanitizeUser(user);
  },

  async listUsers(query: {
    search?: string;
    role?: Role;
    status?: UserStatus;
    page: number;
    limit: number;
  }) {
    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } }
      ];
    }

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return {
      items: items.map(sanitizeUser),
      total,
      page: query.page,
      limit: query.limit
    };
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return sanitizeUser(user);
  },

  async updateUser(
    id: string,
    input: {
      name?: string;
      email?: string;
      role?: Role;
      status?: UserStatus;
    }
  ) {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError(404, 'User not found');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.email ? { email: input.email.toLowerCase() } : {}),
        ...(input.role ? { role: input.role } : {}),
        ...(input.status ? { status: input.status } : {})
      }
    });

    return sanitizeUser(updated);
  },

  async updateUserStatus(id: string, status: UserStatus) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status }
    });

    return sanitizeUser(updated);
  }
};