import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const customers = [
  { customerName: 'Customer A' },
  { customerName: 'Customer B' },
  { customerName: 'Customer C' },
];

async function main() {
  for (const customer of customers) {
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        customerName: customer.customerName,
      },
    });

    if (!existingCustomer) {
      await prisma.customer.create({
        data: customer,
      });

      console.log(`Customer created: ${customer.customerName}`);
    } else {
      console.log(`Customer already exists: ${customer.customerName}`);
    }
  }
}

main()
  .catch((error) => {
    console.error('Customer seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
