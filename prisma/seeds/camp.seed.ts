import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const hasCamp = await prisma.place.findMany();
  if (hasCamp.length === 0) {
    await prisma.place.createMany({
      data: [
        {
          name: 'Camp 1',
          image:
            'https://3.bp.blogspot.com/-8z2GQvlB3oA/WOMfr179a5I/AAAAAAAAc-o/HQsm8gIbfgk38r6IaYXskaucHgZ78jh8ACLcB/s1600/khoasok.jpg',
          description: 'Camp 1 description',
          address: 'Camp 1 address',
          contact: 'Camp 1 contact',
          location: 'Camp 1 location link',
          latitude: 1.0,
          longitude: 1.0,
        },
        {
          name: 'Camp 2',
          image:
            'https://3.bp.blogspot.com/-8z2GQvlB3oA/WOMfr179a5I/AAAAAAAAc-o/HQsm8gIbfgk38r6IaYXskaucHgZ78jh8ACLcB/s1600/khoasok.jpg',
          description: 'Camp 2 description',
          address: 'Camp 2 address',
          contact: 'Camp 2 contact',
          location: 'Camp 2 location link',
          latitude: 2.0,
          longitude: 2.0,
        },
        {
          name: 'Camp 3',
          image:
            'https://3.bp.blogspot.com/-8z2GQvlB3oA/WOMfr179a5I/AAAAAAAAc-o/HQsm8gIbfgk38r6IaYXskaucHgZ78jh8ACLcB/s1600/khoasok.jpg',
          description: 'Camp 3 description',
          address: 'Camp 3 address',
          contact: 'Camp 3 contact',
          location: 'Camp 3 location link',
          latitude: 3.0,
          longitude: 3.0,
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
