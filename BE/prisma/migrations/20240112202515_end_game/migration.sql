/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isPrivate` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Test` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotiType" AS ENUM ('post', 'gradeReview', 'finalizeGrade', 'gradeReviewChat');

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_createBy_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "GradePart" DROP CONSTRAINT "GradePart_classID_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_classId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_gradePartId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_studentId_fkey";

-- DropForeignKey
ALTER TABLE "UserClass" DROP CONSTRAINT "UserClass_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserClass" DROP CONSTRAINT "UserClass_userId_fkey";

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "joinCodeStudent" TEXT,
ADD COLUMN     "joinCodeTeacher" TEXT,
ADD COLUMN     "studentExtraInfo" JSONB;

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Comment_id_seq";

-- AlterTable
ALTER TABLE "GradePart" ADD COLUMN     "sort" INTEGER;

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "isPrivate",
DROP COLUMN "receiverId",
ADD COLUMN     "fileKeys" TEXT[],
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Post_id_seq";

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "point",
DROP COLUMN "studentId",
ADD COLUMN     "deadLine" TIMESTAMP(3),
ADD COLUMN     "isFinalize" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sort" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isLock" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Noti" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isUnRead" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "type" "NotiType" NOT NULL,

    CONSTRAINT "Noti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoTest" (
    "testId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "point" DOUBLE PRECISION,
    "fileKeys" TEXT[],
    "pendingGradeReview" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DoTest_pkey" PRIMARY KEY ("studentId","testId")
);

-- CreateTable
CREATE TABLE "PrivateTestPostContent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fileKeys" TEXT[],
    "classId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "PrivateTestPostContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateTestPostReceiver" (
    "id" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "PrivateTestPostReceiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateCommentTest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PrivateCommentTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userName_key" ON "Admin"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateTestPostContent_testId_key" ON "PrivateTestPostContent"("testId");

-- AddForeignKey
ALTER TABLE "Noti" ADD CONSTRAINT "Noti_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noti" ADD CONSTRAINT "Noti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClass" ADD CONSTRAINT "UserClass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClass" ADD CONSTRAINT "UserClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradePart" ADD CONSTRAINT "GradePart_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoTest" ADD CONSTRAINT "DoTest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoTest" ADD CONSTRAINT "DoTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_gradePartId_fkey" FOREIGN KEY ("gradePartId") REFERENCES "GradePart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostContent" ADD CONSTRAINT "PrivateTestPostContent_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostContent" ADD CONSTRAINT "PrivateTestPostContent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostReceiver" ADD CONSTRAINT "PrivateTestPostReceiver_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostReceiver" ADD CONSTRAINT "PrivateTestPostReceiver_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "PrivateTestPostContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateCommentTest" ADD CONSTRAINT "PrivateCommentTest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateCommentTest" ADD CONSTRAINT "PrivateCommentTest_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PrivateTestPostReceiver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
