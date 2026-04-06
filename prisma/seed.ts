import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { hashPasswordHelper } from '../src/helpers/util';

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

    const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: {
        name: 'user',
        permissions: {
          connect: ['user.read'].map((p) => ({ name: p })),
        },
      },
    });

    console.log('Roles created:', { admin: adminRole, user: userRole });

    // Generate 20 users
    const users = [
      { name: 'John Doe', email: 'rongdat2001@gmail.com', phone: '+12345678901', role: 'admin' },
      { name: 'Jane Smith', email: 'abc@gmail.com', phone: '+12345678902', role: 'admin' },
      { name: 'Bob Johnson', email: 'bob.johnson@example.com', phone: '+12345678903', role: 'user' },
      { name: 'Alice Brown', email: 'alice.brown@example.com', phone: '+12345678904', role: 'user' },
      { name: 'Charlie Wilson', email: 'charlie.wilson@example.com', phone: '+12345678905', role: 'user' },
      { name: 'Diana Davis', email: 'diana.davis@example.com', phone: '+12345678906', role: 'user' },
      { name: 'Edward Miller', email: 'edward.miller@example.com', phone: '+12345678907', role: 'user' },
      { name: 'Fiona Garcia', email: 'fiona.garcia@example.com', phone: '+12345678908', role: 'user' },
      { name: 'George Martinez', email: 'george.martinez@example.com', phone: '+12345678909', role: 'user' },
      { name: 'Helen Rodriguez', email: 'helen.rodriguez@example.com', phone: '+12345678910', role: 'user' },
      { name: 'Ian Lopez', email: 'ian.lopez@example.com', phone: '+12345678911', role: 'user' },
      { name: 'Julia Gonzalez', email: 'julia.gonzalez@example.com', phone: '+12345678912', role: 'user' },
      { name: 'Kevin Perez', email: 'kevin.perez@example.com', phone: '+12345678913', role: 'user' },
      { name: 'Laura Taylor', email: 'laura.taylor@example.com', phone: '+12345678914', role: 'user' },
      { name: 'Michael Anderson', email: 'michael.anderson@example.com', phone: '+12345678915', role: 'user' },
      { name: 'Nancy Thomas', email: 'nancy.thomas@example.com', phone: '+12345678916', role: 'user' },
      { name: 'Oliver Jackson', email: 'oliver.jackson@example.com', phone: '+12345678917', role: 'user' },
      { name: 'Paula White', email: 'paula.white@example.com', phone: '+12345678918', role: 'user' },
      { name: 'Quinn Harris', email: 'quinn.harris@example.com', phone: '+12345678919', role: 'user' },
      { name: 'Rachel Clark', email: 'rachel.clark@example.com', phone: '+12345678920', role: 'user' },
    ];

    const hashedPassword = await hashPasswordHelper('123456');
    if (!hashedPassword) {
      throw new Error('Failed to hash password');
    }

    for (const userData of users) {
      const roleName = userData.role;
      const role = roleName === 'admin' ? adminRole : userRole;

      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword,
          isEmailVerified: true,
          roles: {
            connect: { id: role.id },
          },
        },
      });
    }

    console.log('Successfully created 20 users');
    console.log('Admin users: john.doe@example.com, jane.smith@example.com');
    console.log('All users have password: password123');

    // Seed rooms
    const rooms = [
      { id: 1, name: 'General', lastMessage: 'Hello everyone!', createdById: 1 },
      { id: 2, name: 'Support', lastMessage: 'How can I help?', createdById: 2 },
      { id: 3, name: 'Development', lastMessage: 'Code review needed', createdById: 3 },
    ];

    for (const roomData of rooms) {
      await prisma.room.upsert({
        where: { id: roomData.id },
        update: {},
        create: {
          id: roomData.id,
          name: roomData.name,
          createdById: roomData.createdById,
        },
      });
    }

    console.log('Successfully created 3 rooms');
    console.log('Rooms: General, Support, Development');
  } finally {
    await prisma.$disconnect();
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
