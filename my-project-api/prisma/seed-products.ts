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
    const processNames = ['moulding', 'printing', 'assembly'];

    const productSeeds = [
      {
        productNo: 'PRD-001',
        productName: 'Product Moulding A',
        processName: 'moulding',
        productDrawingNumber: 'DWG-001',
        mouldNo: 'MOLD-001',
        equipmentNo: 'EQ-001',
        cavityNo: '4',
      },
      {
        productNo: 'PRD-002',
        productName: 'Product Printing A',
        processName: 'printing',
        productDrawingNumber: 'DWG-002',
        mouldNo: 'MOLD-002',
        equipmentNo: 'EQ-002',
        cavityNo: '2',
      },
      {
        productNo: 'PRD-003',
        productName: 'Product Assembly A',
        processName: 'assembly',
        productDrawingNumber: 'DWG-003',
        mouldNo: 'MOLD-003',
        equipmentNo: 'EQ-003',
        cavityNo: '1',
      },
    ];

    // Pastikan semua process tersedia.
    for (const processName of processNames) {
      await prisma.process.upsert({
        where: { processName },
        update: {},
        create: { processName },
      });
    }

    // Buat product berdasarkan process yang sesuai.
    for (const product of productSeeds) {
      const process = await prisma.process.findUnique({
        where: { processName: product.processName },
      });

      if (!process) {
        throw new Error(`Process ${product.processName} tidak ditemukan`);
      }

      await prisma.product.create({
        data: {
          productNo: product.productNo,
          productName: product.productName,
          productDrawingNumber: product.productDrawingNumber,
          mouldNo: product.mouldNo,
          equipmentNo: product.equipmentNo,
          cavityNo: product.cavityNo,
          process: {
            connect: { id: process.id },
          },
        },
      });

      console.log(`Product created: ${product.productName}`);
    }

    console.log('Seeding products berhasil');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Seeding products gagal:', error);
  process.exit(1);
});
