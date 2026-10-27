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
    const customerId = '78bf33d1-a3ba-4728-ab2d-67194165591b';
    const productId = '1333bb32-ddbc-4903-8ea3-e498dc50647d';

    // Pastikan customer tersedia.
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error(`Customer tidak ditemukan: ${customerId}`);
    }

    // Pastikan product tersedia.
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product tidak ditemukan: ${productId}`);
    }

    // Daftarkan relasi customer-product.
    await prisma.customerProduct.upsert({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
      update: {},
      create: {
        customerId,
        productId,
      },
    });

    console.log('Seeding customer_products berhasil');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Seeding customer_products gagal:', error);
  process.exit(1);
});
