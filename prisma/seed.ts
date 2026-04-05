import { PrismaClient, Role, UserStatus, RecordType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const analystPassword = await bcrypt.hash('Analyst@123', 10);
  const viewerPassword = await bcrypt.hash('Viewer@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@finance.local' },
    update: {},
    create: {
      name: 'Finance Admin',
      email: 'admin@finance.local',
      password: adminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE
    }
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@finance.local' },
    update: {},
    create: {
      name: 'Finance Analyst',
      email: 'analyst@finance.local',
      password: analystPassword,
      role: Role.ANALYST,
      status: UserStatus.ACTIVE
    }
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@finance.local' },
    update: {},
    create: {
      name: 'Finance Viewer',
      email: 'viewer@finance.local',
      password: viewerPassword,
      role: Role.VIEWER,
      status: UserStatus.ACTIVE
    }
  });

  const count = await prisma.financialRecord.count();

  if (count === 0) {
    await prisma.financialRecord.createMany({
      data: [
        {
          amount: 50000,
          type: RecordType.INCOME,
          category: 'Salary',
          date: new Date('2026-04-01'),
          note: 'Monthly salary',
          createdById: admin.id
        },
        {
          amount: 12000,
          type: RecordType.EXPENSE,
          category: 'Rent',
          date: new Date('2026-04-02'),
          note: 'House rent',
          createdById: admin.id
        },
        {
          amount: 3500,
          type: RecordType.EXPENSE,
          category: 'Food',
          date: new Date('2026-04-03'),
          note: 'Groceries',
          createdById: analyst.id
        },
        {
          amount: 8000,
          type: RecordType.INCOME,
          category: 'Freelance',
          date: new Date('2026-04-04'),
          note: 'Design project',
          createdById: admin.id
        },
        {
          amount: 1500,
          type: RecordType.EXPENSE,
          category: 'Transport',
          date: new Date('2026-04-04'),
          note: 'Fuel and travel',
          createdById: viewer.id
        }
      ]
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });