/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizeId` to the `UserClass` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "test" DROP CONSTRAINT "test_gradePartId_fkey";

-- DropForeignKey
ALTER TABLE "test" DROP CONSTRAINT "test_studentId_fkey";

-- DropIndex
DROP INDEX "User_userName_key";

-- AlterTable
ALTER TABLE "UserClass" ADD COLUMN     "organizeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL,
    "point" DOUBLE PRECISION NOT NULL,
    "gradePartId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_gradePartId_fkey" FOREIGN KEY ("gradePartId") REFERENCES "GradePart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
