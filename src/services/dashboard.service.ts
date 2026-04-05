import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

const activeWhere = { isDeleted: false };

export const dashboardService = {
  async getSummary() {
    const [incomeAgg, expenseAgg, recentRecords, totalRecords] = await Promise.all([
      prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: { ...activeWhere, type: 'INCOME' }
      }),
      prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: { ...activeWhere, type: 'EXPENSE' }
      }),
      prisma.financialRecord.findMany({
        where: activeWhere,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.financialRecord.count({ where: activeWhere })
    ]);

    const totalIncome = incomeAgg._sum.amount ?? 0;
    const totalExpense = expenseAgg._sum.amount ?? 0;

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      totalRecords,
      recentActivity: recentRecords
    };
  },

  async getRecentActivity(limit = 10) {
    const records = await prisma.financialRecord.findMany({
      where: activeWhere,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return records;
  },

  async getCategoryTotals() {
    const grouped = await prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      where: activeWhere,
      _sum: {
        amount: true
      }
    });

    const map = new Map<
      string,
      { category: string; income: number; expense: number; total: number }
    >();

    for (const row of grouped) {
      const current = map.get(row.category) ?? {
        category: row.category,
        income: 0,
        expense: 0,
        total: 0
      };

      const amount = row._sum.amount ?? 0;

      if (row.type === 'INCOME') {
        current.income += amount;
      } else {
        current.expense += amount;
      }

      current.total = current.income + current.expense;
      map.set(row.category, current);
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  },

  async getMonthlyTrend() {
    const records = await prisma.financialRecord.findMany({
      where: activeWhere,
      select: {
        amount: true,
        type: true,
        date: true
      },
      orderBy: { date: 'asc' }
    });

    const map = new Map<
      string,
      { month: string; income: number; expense: number; net: number }
    >();

    for (const record of records) {
      const month = record.date.toISOString().slice(0, 7); // YYYY-MM

      const current = map.get(month) ?? {
        month,
        income: 0,
        expense: 0,
        net: 0
      };

      if (record.type === 'INCOME') {
        current.income += record.amount;
      } else {
        current.expense += record.amount;
      }

      current.net = current.income - current.expense;
      map.set(month, current);
    }

    return Array.from(map.values());
  }
};