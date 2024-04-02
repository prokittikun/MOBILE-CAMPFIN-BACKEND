import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const hasGender = await prisma.gender.findMany();
  if (hasGender.length === 0) {
    await prisma.gender.createMany({
      data: [
        {
          name: 'ชาย',
        },
        {
          name: 'หญิง',
        },
        {
          name: 'lgbtq+',
        },
        {
          name: 'ไม่ระบุ',
        },
      ],
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
