import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@taskflow.com',
      password: hashedPassword,
      role: Role.ADMIN,
      avatar:
        'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  const hashedPassword2 = await bcrypt.hash('user123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'user@taskflow.com' },
    update: {},
    create: {
      name: 'User Example',
      email: 'user@taskflow.com',
      password: hashedPassword2,
      role: Role.MEMBER,
      avatar: 'https://ui-avatars.com/api/?name=User+Example&background=random',
    },
  });

  console.log('✅ Regular user created:', user.email);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
