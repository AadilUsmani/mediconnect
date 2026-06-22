/**
 * Seed script to create the initial admin user.
 * 
 * Run after setting DATABASE_URL and running `npx prisma db push`:
 *   npx tsx prisma/seed.ts
 * 
 * Or add to package.json scripts and run: npm run seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user (admin is stored in User table with role='admin')
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mediconnect.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (existing) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrator',
        role: 'admin',
        password: hashedPassword,
      },
    });
    console.log(`✅ Created admin user: ${adminEmail}`);
  }

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
