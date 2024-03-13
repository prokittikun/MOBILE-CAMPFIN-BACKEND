/*
  Warnings:

  - You are about to drop the column `campName` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `imageProfile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Camp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `placeName` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_campName_fkey";

-- AlterTable
ALTER TABLE "Agenda" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "AgendaDetail" ALTER COLUMN "timeStart" SET DATA TYPE TEXT,
ALTER COLUMN "timeEnd" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "campName",
ADD COLUMN     "placeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageProfile",
ADD COLUMN     "profileImage" TEXT;

-- DropTable
DROP TABLE "Camp";

-- CreateTable
CREATE TABLE "Place" (
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_name_key" ON "Place"("name");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_placeName_fkey" FOREIGN KEY ("placeName") REFERENCES "Place"("name") ON DELETE CASCADE ON UPDATE CASCADE;
