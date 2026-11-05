import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('CicorTest123!', 10);

  const users = [
    {
      name: 'Supervisor Test',
      email: 'supervisor.test@cicor.com',
      roleId: '012ff234-78f0-47fb-986d-352e795d5233',
    },
    {
      name: 'Manager Test',
      email: 'manager.test@cicor.com',
      roleId: '40a967d9-794f-4ea0-b176-4421b7048de5',
    },
    {
      name: 'Director Test',
      email: 'director.test@cicor.com',
      roleId: 'f5c5afb6-7c6d-4bd2-a242-557e76abed6f',
    },
  ];

  for (const user of users) {
    const role = await prisma.role.findUnique({
      where: { id: user.roleId },
    });

    if (!role) {
      throw new Error(`Role not found: ${user.roleId}`);
    }

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password,
        roleId: user.roleId,
      },
      create: {
        name: user.name,
        email: user.email,
        password,
        roleId: user.roleId,
      },
    });

    console.log(`Created/updated: ${user.email} (${role.roleName})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
