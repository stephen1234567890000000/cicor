import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    {
      name: 'Planner User',
      email: 'planner@example.com',
      password: 'PlannerPassword123!',
      role: 'Planner',
    },
    {
      name: 'Project Engineering User',
      email: 'project.engineering@example.com',
      password: 'ProjectPassword123!',
      role: 'Project Engineering',
    },
    {
      name: 'QA Engineering User',
      email: 'qa.engineering@example.com',
      password: 'QaPassword123!',
      role: 'QA Engineering',
    },
    {
      name: 'Molding User',
      email: 'molding@example.com',
      password: 'MoldingPassword123!',
      role: 'Molding',
    },
  ];

  for (const account of accounts) {
    const passwordHash = await bcrypt.hash(account.password, 12);

    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        name: account.name,
        email: account.email,
        password: passwordHash,
        role: account.role,
      },
    });

    console.log(`Akun tersedia: ${user.email} (${user.role})`);
  }
}

main()
  .catch((error) => {
    console.error('Seed gagal:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });