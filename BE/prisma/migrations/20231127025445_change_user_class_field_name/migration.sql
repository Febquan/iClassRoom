/*
  Warnings:

  - The primary key for the `UserClass` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `UserClass` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserClass` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserClass" DROP CONSTRAINT "UserClass_studentId_fkey";

-- AlterTable
ALTER TABLE "UserClass" DROP CONSTRAINT "UserClass_pkey",
DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "UserClass_pkey" PRIMARY KEY ("userId", "courseId");

-- AddForeignKey
ALTER TABLE "UserClass" ADD CONSTRAINT "UserClass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
