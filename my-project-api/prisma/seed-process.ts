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
    const processes = ['moulding', 'printing', 'assembly'];

    for (const processName of processes) {
      await prisma.process.upsert({
        where: { processName },
        update: {},
        create: { processName },
      });
    }

    console.log('Seeding processes berhasil');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
