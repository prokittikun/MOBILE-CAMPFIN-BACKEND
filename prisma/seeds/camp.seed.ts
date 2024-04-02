import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const hasCamp = await prisma.place.findMany();
  if (hasCamp.length === 0) {
    await prisma.place.createMany({
      data: [
        {
          name: 'อุทยานแห่งชาติเอราวัณ',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Erawan_Falls_National_Park.jpg/1200px-Erawan_Falls_National_Park.jpg',
          description:
            'อุทยานแห่งชาติที่มีน้ำตกเอราวัณ น้ำตก 7 ชั้นที่มีความสวยงาม น้ำใสไหลเย็น เหมาะสำหรับการเล่นน้ำตก พักผ่อนหย่อนใจ และปิคนิค',
          address:
            '53/1 หมู่ 5 ตำบลท่ากระดาน อำเภอศรีสวัสดิ์ จังหวัดกาญจนบุรี 71250',
          contact: '034 584 354, 034 584 254',
          location:
            'ตำบลท่ากระดาน, ตำบลห้วยเขย่ง อำเภอศรีสวัสดิ์ จังหวัดกาญจนบุรี',
          latitude: 14.041667,
          longitude: 99.416667,
        },
        {
          name: 'อุทยานแห่งชาติหมู่เกาะสิมิลัน',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Similan_Islands_National_Park.jpg/1200px-Similan_Islands_National_Park.jpg',
          description:
            'อุทยานแห่งชาติทางทะเลที่มีหมู่เกาะ 9 เกาะ น้ำทะเลใส หาดทรายขาวละเอียด ปะการังสวยงาม เหมาะสำหรับการดำน้ำ ชมปะการัง และพักผ่อนหย่อนใจ',
          address: '55 หมู่ 4 ตำบลทับละมุ อำเภอคุระบุรี จังหวัดพังงา 82140',
          contact: '076 421 005, 076 421 367',
          location: 'ตำบลทับละมุ, ตำบลคุระบุรี อำเภอคุระบุรี จังหวัดพังงา',
          latitude: 8.608333,
          longitude: 97.958333,
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
