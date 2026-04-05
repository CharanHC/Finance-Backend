import { Prisma, RecordType } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const recordInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  }
};

export const recordService = {
  async createRecord(input: {
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    note?: string | null;
  }, createdById: string) {
    const record = await prisma.financialRecord.create({
      data: {
        amount: input.amount,
        type: input.type,
        category: input.category,
        date: input.date,
        note: input.note ?? null,
        createdById
      },
      include: recordInclude
    });

    return record;
  },

  async listRecords(query: {
    type?: RecordType;
    category?: string;
    search?: string;
    from?: Date;
    to?: Date;
    page: number;
    limit: number;
    sortBy: 'date' | 'createdAt' | 'amount';
    sortOrder: 'asc' | 'desc';
  }) {
    const where: Prisma.FinancialRecordWhereInput = {
      isDeleted: false
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.category) {
      where.category = { contains: query.category };
    }

    if (query.search) {
      where.OR = [
        { category: { contains: query.search } },
        { note: { contains: query.search } }
      ];
    }

    if (query.from || query.to) {
      where.date = {};
      if (query.from) where.date.gte = query.from;
      if (query.to) where.date.lte = query.to;
    }

    const [items, total] = await prisma.$transaction([
      prisma.financialRecord.findMany({
        where,
        include: recordInclude,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder
        } as any
      }),
      prisma.financialRecord.count({ where })
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit
    };
  },

  async getRecordById(id: string) {
    const record = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false },
      include: recordInclude
    });

    if (!record) {
      throw new AppError(404, 'Record not found');
    }

    return record;
  },

  async updateRecord(
    id: string,
    input: {
      amount?: number;
      type?: RecordType;
      category?: string;
      date?: Date;
      note?: string | null;
    }
  ) {
    const existing = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false }
    });

    if (!existing) {
      throw new AppError(404, 'Record not found');
    }

    const updated = await prisma.financialRecord.update({
      where: { id },
      data: {
        ...(input.amount !== undefined ? { amount: input.amount } : {}),
        ...(input.type ? { type: input.type } : {}),
        ...(input.category ? { category: input.category } : {}),
        ...(input.date ? { date: input.date } : {}),
        ...(input.note !== undefined ? { note: input.note } : {})
      },
      include: recordInclude
    });

    return updated;
  },

  async deleteRecord(id: string) {
    const existing = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false }
    });

    if (!existing) {
      throw new AppError(404, 'Record not found');
    }

    const deleted = await prisma.financialRecord.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    return {
      id: deleted.id,
      message: 'Record deleted successfully'
    };
  }
};