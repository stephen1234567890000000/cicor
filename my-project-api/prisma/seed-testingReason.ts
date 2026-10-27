import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL belum dikonfigurasi');
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
  });

  try {
    const reasons = [
      'New Model',
      'Trial',
      'Design Change',
      'Material Change',
      'Quality Issue',
    ];

    for (const reason of reasons) {
      await prisma.testingReason.upsert({
        where: { reason },
        update: {},
        create: { reason },
      });
    }

    console.log('Seeding testing reasons berhasil');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Seeding testing reasons gagal:', error);
  process.exit(1);
});