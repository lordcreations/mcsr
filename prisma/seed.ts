import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  const users = [
    {
      uuid: '8667ba71b85a4004af54457a9734eed7',
      nickname: 'Steve',
      country: 'us',
    },
    {
      uuid: 'ec561538f3fd461daff5086b22154bce',
      nickname: 'Alex',
      country: 'se',
    },
  ];

  for (const user of users) {
    await prisma.userProfile.upsert({
      where: { uuid: user.uuid },
      update: {},
      create: user,
    });
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });