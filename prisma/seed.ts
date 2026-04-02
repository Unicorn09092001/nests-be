import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || '';
const adapter = new PrismaMariaDb(dbUrl);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

async function main() {
  try {
    const permissions = [
      'user.create',
      'user.read',
      'user.update',
      'user.delete',
    ];

    for (const p of permissions) {
      await prisma.permission.upsert({
        where: { name: p },
        update: {},
        create: { name: p },
      });
    }

    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        permissions: {
          connect: permissions.map((p) => ({ name: p })),
        },
      },
    });

    console.log(adminRole);
  } finally {
    await prisma.$disconnect();
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
