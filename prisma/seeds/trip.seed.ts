import { PrismaClient, TripStatus } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const hasTrip = await prisma.trip.findMany();
  if (hasTrip.length === 0) {
    await prisma.trip.create({
      data: {
        title: 'Trip 1',
        description: 'Trip 1 description',
        maxParticipant: 10,
        isPublic: true,
        status: TripStatus.OPEN,
        startDate: new Date(),
        endDate: new Date(),
        User: {
          connect: {
            id: 'af27315f-8aeb-4008-835d-ccc152ea0f2d',
          },
        },
        Place: {
          connect: {
            name: 'Camp 1',
          },
        },
      },
    });
    await prisma.trip.create({
      data: {
        title: 'Trip 2',
        description: 'Trip 2 description',
        maxParticipant: 10,
        isPublic: true,
        status: TripStatus.OPEN,
        startDate: new Date(),
        endDate: new Date(),
        User: {
          connect: {
            id: 'af27315f-8aeb-4008-835d-ccc152ea0f2d',
          },
        },
        Place: {
          connect: {
            name: 'Camp 2',
          },
        },
      },
    });
    await prisma.trip.create({
      data: {
        title: 'Trip 3',
        description: 'Trip 3 description',
        maxParticipant: 10,
        isPublic: true,
        status: TripStatus.OPEN,
        startDate: new Date(),
        endDate: new Date(),
        User: {
          connect: {
            id: 'af27315f-8aeb-4008-835d-ccc152ea0f2d',
          },
        },
        Place: {
          connect: {
            name: 'Camp 3',
          },
        },
      },
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
