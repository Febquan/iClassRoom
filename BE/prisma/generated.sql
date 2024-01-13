-- CreateEnum
CREATE TYPE "NotiType" AS ENUM ('post', 'gradeReview', 'finalizeGrade', 'gradeReviewChat');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('teacher', 'student');

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
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinCodeStudent" TEXT,
    "joinCodeTeacher" TEXT,
    "studentExtraInfo" JSONB,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "GradePart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL,
    "classID" TEXT NOT NULL,
    "sort" INTEGER,

    CONSTRAINT "GradePart_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "fileKeys" TEXT[],

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL,
    "gradePartId" TEXT NOT NULL,
    "deadLine" TIMESTAMP(3),
    "isFinalize" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT NOT NULL,
    "isOauth" BOOLEAN NOT NULL DEFAULT false,
    "isLock" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserClass" (
    "courseId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'student',
    "organizeId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserClass_pkey" PRIMARY KEY ("userId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userName_key" ON "Admin"("userName" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateTestPostContent_testId_key" ON "PrivateTestPostContent"("testId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoTest" ADD CONSTRAINT "DoTest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoTest" ADD CONSTRAINT "DoTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradePart" ADD CONSTRAINT "GradePart_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noti" ADD CONSTRAINT "Noti_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noti" ADD CONSTRAINT "Noti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateCommentTest" ADD CONSTRAINT "PrivateCommentTest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateCommentTest" ADD CONSTRAINT "PrivateCommentTest_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PrivateTestPostReceiver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostContent" ADD CONSTRAINT "PrivateTestPostContent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostContent" ADD CONSTRAINT "PrivateTestPostContent_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostReceiver" ADD CONSTRAINT "PrivateTestPostReceiver_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "PrivateTestPostContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateTestPostReceiver" ADD CONSTRAINT "PrivateTestPostReceiver_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_gradePartId_fkey" FOREIGN KEY ("gradePartId") REFERENCES "GradePart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClass" ADD CONSTRAINT "UserClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClass" ADD CONSTRAINT "UserClass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

