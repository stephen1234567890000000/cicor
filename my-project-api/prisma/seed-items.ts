import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const materials = [
    { name: 'Steel' },
    { name: 'Aluminum' },
    { name: 'Plastic' },
  ];

  for (const material of materials) {
    await prisma.material.upsert({
      where: { name: material.name },
      update: {},
      create: material,
    });
  }

  const steel = await prisma.material.findUniqueOrThrow({
    where: { name: 'Steel' },
  });

  const aluminum = await prisma.material.findUniqueOrThrow({
    where: { name: 'Aluminum' },
  });

  const plastic = await prisma.material.findUniqueOrThrow({
    where: { name: 'Plastic' },
  });

  const items = [
    {
      sapPn: 'SAP-1001',
      starkeyPn: 'ST-1001',
      itemName: 'Bracket Assembly',
      mouldNo: 'M-001',
      equipmentNo: 'EQ-001',
      testing: true,
      sapPnAlt: 'SAP-1001A',
      rm: 'RM-01',
      materialId: steel.id,
      deletedAt: null,
    },
    {
      sapPn: 'SAP-1002',
      starkeyPn: 'ST-1002',
      itemName: 'Aluminum Housing',
      mouldNo: 'M-002',
      equipmentNo: 'EQ-002',
      testing: false,
      sapPnAlt: null,
      rm: 'RM-02',
      materialId: aluminum.id,
      deletedAt: null,
    },
    {
      sapPn: 'SAP-1003',
      starkeyPn: 'ST-1003',
      itemName: 'Plastic Cover',
      mouldNo: 'M-003',
      equipmentNo: 'EQ-003',
      testing: true,
      sapPnAlt: null,
      rm: 'RM-03',
      materialId: plastic.id,
      deletedAt: null,
    },
    {
      sapPn: 'SAP-1999',
      starkeyPn: 'ST-1999',
      itemName: 'Deleted Test Item',
      mouldNo: null,
      equipmentNo: null,
      testing: false,
      sapPnAlt: null,
      rm: null,
      materialId: steel.id,
      deletedAt: new Date(),
    },
  ];

  for (const item of items) {
    const existingItem = await prisma.item.findFirst({
      where: { sapPn: item.sapPn },
    });

    if (existingItem) {
      await prisma.item.update({
        where: { id: existingItem.id },
        data: item,
      });
    } else {
      await prisma.item.create({
        data: item,
      });
    }
  }

  console.log('Seed materials dan items berhasil.');
}

main()
  .catch((error) => {
    console.error('Seed gagal:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
